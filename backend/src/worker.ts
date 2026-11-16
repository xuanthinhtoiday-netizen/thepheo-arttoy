/**
 * Cloudflare Worker Backend & AI Gateway — Hono.js
 * Stack: Hono, Cloudflare D1 (SQLite), Cloudflare KV, Cloudflare Vectorize, Cloudflare Workers AI
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { basinTracking } from './middleware/basinTracking'


export interface Env {
  DB: any; // Cloudflare D1 Database binding
  KV: any; // Cloudflare KV Namespace binding
  VECTORIZE: any; // Cloudflare Vectorize binding
  AI: any; // Cloudflare Workers AI binding (khong can API key nhu Gemini truoc)
  AI_MODEL?: string; // Tu chon model Workers AI, mac dinh: @cf/meta/llama-3.1-8b-instruct
  AI_PERSONA_NAME?: string;
  STORE_NAME?: string;
  STORE_BANK_ID?: string;
  STORE_ACCOUNT_NO?: string;
  STORE_ACCOUNT_NAME?: string;
  ADMIN_PASSWORD?: string; // Mat khau dang nhap khu vuc admin (dat bang: wrangler secret put ADMIN_PASSWORD)
}

// Helper: Generate embeddings using a simple hash-based approach (for demo)
// In production, use a proper embedding model like multilingual-embedding via Workers AI
async function generateEmbedding(text: string): Promise<number[]> {
  // Simple deterministic embedding for demo purposes
  // In production, call an embedding API
  const hash = text.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);

  // Generate a 384-dimension vector (matching common embedding models)
  const vec = new Array(384).fill(0);
  let seed = Math.abs(hash);
  for (let i = 0; i < 384; i++) {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    vec[i] = (seed / 4294967296) * 2 - 1;
  }
  return vec;
}

// Helper: Index series data into Vectorize
async function indexSeriesData(env: Env) {
  try {
    const { results: series } = await env.DB.prepare('SELECT * FROM series').all();
    if (!series || series.length === 0) return;

    const vectors = [];
    for (const s of series) {
      const text = `${s.name} ${s.brand} ${s.description}`;
      const embedding = await generateEmbedding(text);
      vectors.push({
        id: s.id,
        values: embedding,
        metadata: {
          name: s.name,
          brand: s.brand,
          price_per_box: s.price_per_box,
          remaining_boxes: s.remaining_boxes,
        }
      });
    }

    if (vectors.length > 0) {
      await env.VECTORIZE.upsert(vectors);
    }
  } catch (e) {
    console.log('Vectorize indexing skipped:', e);
  }
}

// Helper: Semantic search for series
async function semanticSearchSeries(env: Env, query: string, topK = 3) {
  try {
    const embedding = await generateEmbedding(query);
    const results = await env.VECTORIZE.query(embedding, { topK, returnMetadata: true });
    return results.matches || [];
  } catch (e) {
    console.log('Vectorize search failed:', e);
    return [];
  }
}

// Helper: KV Cache functions
async function getFromKV(env: Env, key: string) {
  try {
    const value = await env.KV.get(key, 'json');
    return value;
  } catch {
    return null;
  }
}

async function setToKV(env: Env, key: string, value: any, ttl = 3600) {
  try {
    await env.KV.put(key, JSON.stringify(value), { expirationTtl: ttl });
  } catch (e) {
    console.log('KV set failed:', e);
  }
}

// --- Admin Auth (password tu env, session luu trong KV) ---
const ADMIN_SESSION_TTL = 60 * 60 * 24 * 7; // 7 ngay

function extractAdminToken(request: Request): string {
  const authHeader = request.headers.get('Authorization') || '';
  if (authHeader.startsWith('Bearer ')) return authHeader.slice(7).trim();
  const cookieHeader = request.headers.get('Cookie') || '';
  const match = cookieHeader.match(/(?:^|;\s*)thepheo_admin=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

async function constantTimeEqual(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const ba = enc.encode(a);
  const bb = enc.encode(b);
  if (ba.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ba.length; i++) diff |= ba[i] ^ bb[i];
  return diff === 0;
}

async function createAdminSession(env: Env): Promise<string> {
  const token = crypto.randomUUID();
  await env.KV.put(`admin:session:${token}`, JSON.stringify({ created: Date.now() }), { expirationTtl: ADMIN_SESSION_TTL });
  return token;
}

async function verifyAdminSession(env: Env, token: string): Promise<boolean> {
  if (!token) return false;
  try {
    const val = await env.KV.get(`admin:session:${token}`);
    return val !== null;
  } catch {
    return false;
  }
}

function adminSessionCookie(token: string, maxAge: number): string {
  return `thepheo_admin=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
}

// --- Hono App ---
const app = new Hono<{ Bindings: Env }>();

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Basin traffic stream (tuc chon): gui luot truy cap len endpoint neu da cau hinh BASIN_INGEST_URL
app.use('*', basinTracking());

// Middleware: bao ve moi route quan tri
const requireAdmin = async (c: any, next: any) => {
  if (!c.env.ADMIN_PASSWORD) {
    return c.json({ error: 'Chua cau hinh ADMIN_PASSWORD tren Worker. Deploy: wrangler secret put ADMIN_PASSWORD' }, 503);
  }
  const token = extractAdminToken(c.req.raw);
  if (!(await verifyAdminSession(c.env, token))) {
    return c.json({ error: 'Yeu cau dang nhap admin! 🔐' }, 401);
  }
  await next();
};

// 0a. POST /api/admin/login - Dang nhap admin, tao session luu trong KV
app.post('/api/admin/login', async (c) => {
  const env = c.env;
  if (!env.ADMIN_PASSWORD) {
    return c.json(
      { error: 'Chua cau hinh ADMIN_PASSWORD tren Worker. Deploy: wrangler secret put ADMIN_PASSWORD' },
      503
    );
  }
  let password = '';
  try {
    const body = await c.req.json();
    password = body?.password || '';
  } catch {
    password = '';
  }
  const ok = await constantTimeEqual(password, env.ADMIN_PASSWORD);
  if (!ok) {
    return c.json({ error: 'Mat khau admin khong dung! 🔐' }, 401);
  }
  const token = await createAdminSession(env);
  return new Response(JSON.stringify({ success: true, token }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': adminSessionCookie(token, ADMIN_SESSION_TTL),
    },
  });
});

// 0b. POST /api/admin/logout - Huy session admin
app.post('/api/admin/logout', async (c) => {
  const token = extractAdminToken(c.req.raw);
  if (token && c.env.KV) {
    try { await c.env.KV.delete(`admin:session:${token}`); } catch { /* ignore */ }
  }
  return new Response(JSON.stringify({ success: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': adminSessionCookie('', 0),
    },
  });
});

// 1. GET /api/series - List all series from Cloudflare D1 (with KV caching)
app.get('/api/series', async (c) => {
  const env = c.env;
  const cacheKey = 'series:all';
  const cached = await getFromKV(env, cacheKey);
  if (cached) {
    return c.json(cached);
  }

  if (env.DB) {
    const { results } = await env.DB.prepare('SELECT * FROM series ORDER BY created_at DESC').all();
    await setToKV(env, cacheKey, results, 300); // Cache for 5 minutes
    return c.json(results);
  }
  return c.json({ message: 'D1 binding ready' });
});

// 2. GET /api/series/:id - Get series with items from D1
app.get('/api/series/:id', async (c) => {
  const id = c.req.param('id');
  if (c.env.DB) {
    const series = await c.env.DB.prepare('SELECT * FROM series WHERE id = ?').bind(id).first();
    const { results: items } = await c.env.DB.prepare('SELECT * FROM series_items WHERE series_id = ?').bind(id).all();
    return c.json({ ...series, items });
  }
  return c.json({ error: 'Not Found' }, 404);
});

// 3. POST /api/series - Create new series in D1 (Admin)
app.post('/api/series', requireAdmin, async (c) => {
  const env = c.env;
  const s = await c.req.json();
  if (env.DB) {
    await env.DB.prepare(`
      INSERT INTO series (id, name, brand, description, price_per_box, total_boxes, remaining_boxes, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(s.id, s.name, s.brand, s.description, s.price_per_box, s.total_boxes, s.remaining_boxes, s.image_url).run();

    // Invalidate cache
    await env.KV.delete('series:all');

    // Index into Vectorize
    await indexSeriesData(env);
  }
  return c.json(s, 201);
});

// 4. GET /api/orders - List all orders with customer details (Admin)
app.get('/api/orders', requireAdmin, async (c) => {
  if (c.env.DB) {
    const { results } = await c.env.DB.prepare(`
      SELECT orders.*, customers.name as customer_name, customers.phone as customer_phone, customers.address as customer_address
      FROM orders
      LEFT JOIN customers ON orders.customer_id = customers.id
      ORDER BY orders.created_at DESC
    `).all();
    return c.json(results);
  }
  return c.json([]);
});

// 5. POST /api/orders - Create order & deduct stock from D1
app.post('/api/orders', async (c) => {
  const env = c.env;
  const body = await c.req.json();
  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  if (env.DB) {
    await env.DB.prepare(`
      INSERT INTO orders (id, customer_id, total_amount, status, ordered_items_json)
      VALUES (?, ?, ?, 'PENDING_PAYMENT', ?)
    `).bind(orderId, body.customer_id, body.total_amount, JSON.stringify(body.ordered_items || [])).run();

    // Deduct remaining boxes if series_id is provided
    if (body.series_id && body.box_count) {
      await env.DB.prepare(`
        UPDATE series SET remaining_boxes = MAX(0, remaining_boxes - ?) WHERE id = ?
      `).bind(body.box_count, body.series_id).run();

      // Invalidate cache
      await env.KV.delete('series:all');
      // Re-index for updated stock
      await indexSeriesData(env);
    }
  }
  return c.json({ success: true, orderId });
});

// 6. PUT /api/orders/:id/status - Update order status in D1 (Admin)
app.put('/api/orders/:id/status', requireAdmin, async (c) => {
  const orderId = c.req.param('id');
  const { status } = await c.req.json();
  if (c.env.DB) {
    await c.env.DB.prepare('UPDATE orders SET status = ? WHERE id = ?').bind(status, orderId).run();
  }
  return c.json({ success: true, orderId, status });
});

// 7. GET /api/hall-of-fame - List hall of fame feedback
app.get('/api/hall-of-fame', async (c) => {
  if (c.env.DB) {
    const { results } = await c.env.DB.prepare('SELECT * FROM hall_of_fame ORDER BY created_at DESC').all();
    return c.json(results);
  }
  return c.json([]);
});

// 8. POST /api/chat - Thầy Phẻo AI Gateway voi Workers AI + Vectorize RAG
app.post('/api/chat', async (c) => {
  const env = c.env;
  const { message, customer_id } = await c.req.json().catch(() => ({}));

  // Use Vectorize for semantic search to find relevant series
  const searchResults = await semanticSearchSeries(env, message || '', 2);
  let context = '';
  if (searchResults.length > 0) {
    context = '\n\nDữ liệu series liên quan:\n' + searchResults.map((m: any) =>
      `- ${m.metadata.name} (${m.metadata.brand}): ${m.metadata.remaining_boxes} hộp còn lại, giá ${m.metadata.price_per_box.toLocaleString()}đ/hộp`
    ).join('\n');
  }

  const persona = env.AI_PERSONA_NAME || 'Thầy Phẻo Gieo Quẻ Art Toy';
  const systemPrompt = `Bạn là "${persona}" - Bậc thầy phong thủy kiêm dân chơi Blind Box lão luyện.
Hãy tư vấn phong thủy bốc hộp cho câu hỏi: "${message}".${context}

Hãy trả lời bằng tiếng Việt, văn phong vui vẻ, cute, dùng emoji nhiều. Đưa ra gợi ý số hộp may mắn.`;

  let reply = '';
  if (env.AI) {
    try {
      const model = env.AI_MODEL || '@cf/meta/llama-3.1-8b-instruct';
      const aiRes: any = await env.AI.run(model, {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message || '' },
        ],
        max_tokens: 600,
      });
      reply = aiRes?.response || '';
    } catch (e) {
      console.log('Workers AI failed, dung fallback:', e);
    }
  }

  if (!reply) {
    reply = `🔮 Thầy Phẻo phán: Vía của đạo hữu hôm nay cực sáng! Hãy chọn Hộp số 3 hoặc Hộp số 7 để tăng tỷ lệ nổ Secret 1/144!${context ? '\n\n✨ Thầy thấy series phù hợp:' + context : ''}`;
  }
  return c.json({ reply });
});

// 9. POST /api/vectorize/reindex - Admin endpoint to reindex all series
app.post('/api/vectorize/reindex', requireAdmin, async (c) => {
  await indexSeriesData(c.env);
  return c.json({ success: true, message: 'Vectorize index updated' });
});

// 10. GET /api/search - Semantic search endpoint
app.get('/api/search', async (c) => {
  const query = c.req.query('q') || '';
  const results = await semanticSearchSeries(c.env, query, 5);
  return c.json({ results });
});

// 11. GET /api/track - Beacon nhe de frontend ping luot xem trang SPA
// (middleware basinTracking se tu dong ghi nhan request GET nay)
app.get('/api/track', (c) => c.body(null, 204));

export default app;
