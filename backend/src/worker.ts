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

      // 3. POST /api/series - Create new series in D1 (Admin)
      if (request.method === 'POST' && pathname === '/api/series') {
        const s = await request.json() as any;
        if (env.DB) {
          await env.DB.prepare(`
            INSERT INTO series (id, name, brand, description, price_per_box, total_boxes, remaining_boxes, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(s.id, s.name, s.brand, s.description, s.price_per_box, s.total_boxes, s.remaining_boxes, s.image_url).run();
        }
        return Response.json(s, { headers: corsHeaders });
      }

      // 4. GET /api/orders - List all orders with customer details
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
          }
        }
        return Response.json({ success: true, orderId }, { headers: corsHeaders });
      }

      // 6. PUT /api/orders/:id/status - Update order status in D1
      if (request.method === 'PUT' && pathname.includes('/api/orders/') && pathname.endsWith('/status')) {
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

      // 8. POST /api/chat - Gemini AI Gateway for Thầy Phẻo
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
