/**
 * Cloudflare Worker Backend & AI Gateway
 * Stack: Cloudflare Workers, Cloudflare D1 (SQLite), Cloudflare KV, Cloudflare Vectorize, Google Gemini API
 */

export interface Env {
  DB: any; // Cloudflare D1 Database binding
  KV: any; // Cloudflare KV Namespace binding
  VECTORIZE: any; // Cloudflare Vectorize binding
  GEMINI_API_KEY?: string;
  AI_PERSONA_NAME?: string;
  ADMIN_PASSWORD?: string; // Mat khau dang nhap khu vuc admin (dat bang: wrangler secret put ADMIN_PASSWORD)
}

// Helper: Generate embeddings using a simple hash-based approach (for demo)
// In production, use a proper embedding model like text-embedding-3-small via AI Gateway
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

async function requireAdmin(request: Request, env: Env): Promise<boolean> {
  if (!env.ADMIN_PASSWORD) return false; // Chua cau hinh mat khau -> khoa toan bo route admin
  return verifyAdminSession(env, extractAdminToken(request));
}

function adminSessionCookie(token: string, maxAge: number): string {
  return `thepheo_admin=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
}

function unauthorized(): Response {
  return Response.json({ error: 'Yeu cau dang nhap admin! 🔐' }, { status: 401, headers: { 'Content-Type': 'application/json' } });
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // CORS Headers for API
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 0a. POST /api/admin/login - Dang nhap admin, tao session luu trong KV
      if (request.method === 'POST' && pathname === '/api/admin/login') {
        if (!env.ADMIN_PASSWORD) {
          return Response.json(
            { error: 'Chua cau hinh ADMIN_PASSWORD tren Worker. Deploy: wrangler secret put ADMIN_PASSWORD' },
            { status: 503, headers: corsHeaders }
          );
        }
        let password = '';
        try {
          const body = await request.json() as any;
          password = body?.password || '';
        } catch {
          password = '';
        }
        const ok = await constantTimeEqual(password, env.ADMIN_PASSWORD);
        if (!ok) {
          return Response.json({ error: 'Mat khau admin khong dung! 🔐' }, { status: 401, headers: corsHeaders });
        }
        const token = await createAdminSession(env);
        return new Response(JSON.stringify({ success: true, token }), {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Set-Cookie': adminSessionCookie(token, ADMIN_SESSION_TTL),
          },
        });
      }

      // 0b. POST /api/admin/logout - Huy session admin
      if (request.method === 'POST' && pathname === '/api/admin/logout') {
        const token = extractAdminToken(request);
        if (token && env.KV) {
          try { await env.KV.delete(`admin:session:${token}`); } catch { /* ignore */ }
        }
        return new Response(JSON.stringify({ success: true }), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Set-Cookie': adminSessionCookie('', 0),
          },
        });
      }

      // 1. GET /api/series - List all series from Cloudflare D1 (with KV caching)
      if (request.method === 'GET' && pathname === '/api/series') {
        const cacheKey = 'series:all';
        const cached = await getFromKV(env, cacheKey);
        if (cached) {
          return Response.json(cached, { headers: corsHeaders });
        }

        if (env.DB) {
          const { results } = await env.DB.prepare('SELECT * FROM series ORDER BY created_at DESC').all();
          await setToKV(env, cacheKey, results, 300); // Cache for 5 minutes
          return Response.json(results, { headers: corsHeaders });
        }
        return Response.json({ message: 'D1 binding ready' }, { headers: corsHeaders });
      }

      // 2. GET /api/series/:id - Get series with items from D1
      if (request.method === 'GET' && pathname.startsWith('/api/series/')) {
        const id = pathname.split('/').pop();
        if (env.DB) {
          const series = await env.DB.prepare('SELECT * FROM series WHERE id = ?').bind(id).first();
          const { results: items } = await env.DB.prepare('SELECT * FROM series_items WHERE series_id = ?').bind(id).all();
          return Response.json({ ...series, items }, { headers: corsHeaders });
        }
      }

      // 3. POST /api/series - Create new series in D1 (Admin)
      if (request.method === 'POST' && pathname === '/api/series') {
        if (!(await requireAdmin(request, env))) return unauthorized();
        const s = await request.json() as any;
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
        return Response.json(s, { headers: corsHeaders });
      }

      // 4. GET /api/orders - List all orders with customer details (Admin)
      if (request.method === 'GET' && pathname === '/api/orders') {
        if (!(await requireAdmin(request, env))) return unauthorized();
        if (env.DB) {
          const { results } = await env.DB.prepare(`
            SELECT orders.*, customers.name as customer_name, customers.phone as customer_phone, customers.address as customer_address
            FROM orders
            LEFT JOIN customers ON orders.customer_id = customers.id
            ORDER BY orders.created_at DESC
          `).all();
          return Response.json(results, { headers: corsHeaders });
        }
      }

      // 5. POST /api/orders - Create order & deduct stock from D1
      if (request.method === 'POST' && pathname === '/api/orders') {
        const body: any = await request.json();
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
        return Response.json({ success: true, orderId }, { headers: corsHeaders });
      }

      // 6. PUT /api/orders/:id/status - Update order status in D1 (Admin)
      if (request.method === 'PUT' && pathname.includes('/api/orders/') && pathname.endsWith('/status')) {
        if (!(await requireAdmin(request, env))) return unauthorized();
        const parts = pathname.split('/');
        const orderId = parts[parts.length - 2];
        const { status } = await request.json() as any;
        if (env.DB) {
          await env.DB.prepare('UPDATE orders SET status = ? WHERE id = ?').bind(status, orderId).run();
        }
        return Response.json({ success: true, orderId, status }, { headers: corsHeaders });
      }

      // 7. GET /api/hall-of-fame - List hall of fame feedback
      if (request.method === 'GET' && pathname === '/api/hall-of-fame') {
        if (env.DB) {
          const { results } = await env.DB.prepare('SELECT * FROM hall_of_fame ORDER BY created_at DESC').all();
          return Response.json(results, { headers: corsHeaders });
        }
      }

      // 8. POST /api/chat - Gemini AI Gateway for Thầy Phẻo with Vectorize RAG
      if (request.method === 'POST' && pathname === '/api/chat') {
        const { message, customer_id } = (await request.json()) as any;
        const apiKey = env.GEMINI_API_KEY;

        // Use Vectorize for semantic search to find relevant series
        const searchResults = await semanticSearchSeries(env, message, 2);
        let context = '';
        if (searchResults.length > 0) {
          context = '\n\nDữ liệu series liên quan:\n' + searchResults.map((m: any) =>
            `- ${m.metadata.name} (${m.metadata.brand}): ${m.metadata.remaining_boxes} hộp còn lại, giá ${m.metadata.price_per_box.toLocaleString()}đ/hộp`
          ).join('\n');
        }

        let prompt = `Bạn là "Thầy Phẻo Gieo Quẻ Art Toy" - Bậc thầy phong thủy kiêm dân chơi Blind Box lão luyện.
Hãy tư vấn phong thủy bốc hộp cho câu hỏi: "${message}".${context}

Hãy trả lời bằng tiếng Việt, văn phong vui vẻ, cute, dùng emoji nhiều. Đưa ra gợi ý số hộp may mắn.`;

        if (apiKey) {
          const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }]
            })
          });
          const data: any = await geminiRes.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Thầy đang bấm độn...';
          return Response.json({ reply }, { headers: corsHeaders });
        }

        return Response.json({
          reply: `🔮 Thầy Phẻo phán: Vía của đạo hữu hôm nay cực sáng! Hãy chọn Hộp số 3 hoặc Hộp số 7 để tăng tỷ lệ nổ Secret 1/144!${context ? '\n\n✨ Thầy thấy series phù hợp:' + context : ''}`
        }, { headers: corsHeaders });
      }

      // 9. POST /api/vectorize/reindex - Admin endpoint to reindex all series
      if (request.method === 'POST' && pathname === '/api/vectorize/reindex') {
        if (!(await requireAdmin(request, env))) return unauthorized();
        await indexSeriesData(env);
        return Response.json({ success: true, message: 'Vectorize index updated' }, { headers: corsHeaders });
      }

      // 10. GET /api/search - Semantic search endpoint
      if (request.method === 'GET' && pathname === '/api/search') {
        const query = url.searchParams.get('q') || '';
        const results = await semanticSearchSeries(env, query, 5);
        return Response.json({ results }, { headers: corsHeaders });
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};