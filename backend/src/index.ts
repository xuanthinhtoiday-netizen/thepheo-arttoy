import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { INITIAL_SERIES, INITIAL_ORDERS, INITIAL_HALL_OF_FAME } from './data/mockData';

const app = express();
const PORT = process.env.PORT || 3001;

// Admin auth (mo phong nhu Worker: mat khau tu env ADMIN_PASSWORD, session luu tam trong bo nho)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'pheoarttoy2026';
if (!process.env.ADMIN_PASSWORD) {
  console.warn('[WARN] Dang dung ADMIN_PASSWORD mac dinh cho dev. Khi deploy hay dat: wrangler secret put ADMIN_PASSWORD');
}
const adminSessions = new Set<string>();

function extractAdminToken(req: any): string {
  const auth = req.headers?.authorization || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7).trim();
  return '';
}

function requireAdmin(req: any, res: any, next: any) {
  const token = extractAdminToken(req);
  if (!adminSessions.has(token)) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập admin! 🔐' });
  }
  next();
}

app.use(cors());
app.use(express.json());

// Admin login/logout (local dev simulator)
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Mật khẩu admin không đúng! 🔐' });
  }
  const token = crypto.randomUUID();
  adminSessions.add(token);
  res.setHeader('Set-Cookie', `thepheo_admin=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`);
  res.json({ success: true, token });
});

app.post('/api/admin/logout', (req, res) => {
  const token = extractAdminToken(req);
  if (token) adminSessions.delete(token);
  res.setHeader('Set-Cookie', 'thepheo_admin=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  res.json({ success: true });
});

// In-memory / mock database matching Cloudflare D1
let seriesDb = [...INITIAL_SERIES];
let ordersDb = [...INITIAL_ORDERS];
let hallOfFameDb = [...INITIAL_HALL_OF_FAME];

// 1. GET /api/series
app.get('/api/series', (req, res) => {
  res.json(seriesDb);
});

// 2. GET /api/series/:id
app.get('/api/series/:id', (req, res) => {
  const series = seriesDb.find(s => s.id === req.params.id);
  if (!series) return res.status(404).json({ error: 'Series not found' });
  res.json(series);
});

// 3. POST /api/series (Admin)
app.post('/api/series', requireAdmin, (req, res) => {
  const newSeries = req.body;
  seriesDb.push(newSeries);
  res.status(201).json(newSeries);
});

// 4. GET /api/orders (Admin)
app.get('/api/orders', requireAdmin, (req, res) => {
  res.json(ordersDb);
});

// 5. POST /api/orders (Create order and deduct stock)
app.post('/api/orders', (req, res) => {
  const { customer, items, total_amount, series_id, box_count } = req.body;
  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  const order = {
    id: orderId,
    customer_id: customer?.id || 'cust-guest',
    customer_name: customer?.name || 'Khách vãng lai',
    customer_phone: customer?.phone || '',
    customer_address: customer?.address || '',
    total_amount,
    status: 'PENDING_PAYMENT' as const,
    ordered_items_json: JSON.stringify(items || []),
    created_at: new Date().toLocaleString('vi-VN')
  };
  ordersDb.unshift(order);

  // Deduct stock in series
  if (series_id) {
    const s = seriesDb.find(it => it.id === series_id);
    if (s) {
      s.remaining_boxes = Math.max(0, s.remaining_boxes - (box_count || items?.length || 1));
    }
  }

  res.status(201).json(order);
});

// 6. PUT /api/orders/:id/status (Admin)
app.put('/api/orders/:id/status', requireAdmin, (req, res) => {
  const { status } = req.body;
  const order = ordersDb.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.status = status;
  res.json(order);
});

// 7. GET /api/hall-of-fame
app.get('/api/hall-of-fame', (req, res) => {
  res.json(hallOfFameDb);
});

// 8. POST /api/chat (Gemini AI Gateway Simulator)
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  res.json({
    reply: `🔮 Thầy Phẻo đã bấm độn: Duyên lành gõ cửa, thí chủ hãy chốt ngay hộp số may mắn để nghênh đón Secret 1/144!`,
    badge: 'Quẻ Linh Ứng ✨'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    server: 'Cloudflare Worker Local Simulator',
    d1_ready: true,
    total_series: seriesDb.length,
    total_orders: ordersDb.length
  });
});

app.listen(PORT, () => {
  console.log(`[Art Toy Server] Running on http://localhost:${PORT}`);
});
