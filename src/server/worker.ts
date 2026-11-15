/**
 * Cloudflare Worker Backend & AI Gateway
 * Stack: Cloudflare Workers, Cloudflare D1 (SQLite), Cloudflare R2, Google Gemini API
 */

export interface Env {
  DB: any; // Cloudflare D1 Database binding
  MEDIA_BUCKET?: any; // Cloudflare R2 Bucket binding
  GEMINI_API_KEY?: string;
  AI_PERSONA_NAME?: string;
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
      // 1. GET /api/series - List all series from Cloudflare D1
      if (request.method === 'GET' && pathname === '/api/series') {
        if (env.DB) {
          const { results } = await env.DB.prepare('SELECT * FROM series ORDER BY created_at DESC').all();
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

      // 3. GET /api/orders - List all orders
      if (request.method === 'GET' && pathname === '/api/orders') {
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

      // 4. POST /api/orders - Create order & deduct stock
      if (request.method === 'POST' && pathname === '/api/orders') {
        const body: any = await request.json();
        const orderId = `ORD-${Date.now().toString().slice(-6)}`;
        if (env.DB) {
          await env.DB.prepare(`
            INSERT INTO orders (id, customer_id, total_amount, status, ordered_items_json)
            VALUES (?, ?, ?, 'PENDING_PAYMENT', ?)
          `).bind(orderId, body.customer_id, body.total_amount, JSON.stringify(body.ordered_items)).run();
        }
        return Response.json({ success: true, orderId }, { headers: corsHeaders });
      }

      // 5. POST /api/chat - Gemini AI Gateway for Thầy Phẻo
      if (request.method === 'POST' && pathname === '/api/chat') {
        const { message, customer_id } = (await request.json()) as any;
        const apiKey = env.GEMINI_API_KEY;

        let prompt = `Bạn là "Thầy Phẻo Gieo Quẻ Art Toy" - Bậc thầy phong thủy kiêm dân chơi Blind Box lão luyện.
        Hãy tư vấn phong thủy bốc hộp cho câu hỏi: "${message}".`;

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
          reply: `🔮 Thầy Phẻo phán: Vía của đạo hữu hôm nay cực sáng! Hãy chọn Hộp số 3 hoặc Hộp số 7 để tăng tỷ lệ nổ Secret 1/144!`
        }, { headers: corsHeaders });
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
