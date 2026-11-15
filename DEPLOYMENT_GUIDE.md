# ☁️ HƯỚNG DẪN TRIỂN KHAI CLOUDFLARE SERVERLESS CHI TIẾT

Tài liệu này hướng dẫn bạn đưa toàn bộ hệ thống Website Art Toy & Chatbot AI lên hạ tầng **Cloudflare Serverless**:

---

## 1. Yêu cầu trước khi triển khai
- Tài khoản Cloudflare (đăng ký miễn phí tại [cloudflare.com](https://dash.cloudflare.com)).
- Cài đặt Cloudflare CLI (Wrangler):
  ```bash
  npm install -g wrangler
  ```
- Đăng nhập tài khoản Cloudflare trên máy tính:
  ```bash
  wrangler login
  ```

---

## 2. Bước 1: Khởi tạo Cơ sở Dữ liệu Cloudflare D1 (SQLite)

1. Chạy lệnh tạo database mới trên Cloudflare D1:
   ```bash
   wrangler d1 create arttoy-db
   ```
2. Terminal sẽ trả về thông tin cấu hình, ví dụ:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "arttoy-db"
   database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   ```
3. Mở file `wrangler.toml` tại thư mục dự án và thay thế `database_id` bằng ID vừa tạo.

4. Nạp cấu trúc bảng và dữ liệu mẫu khởi tạo vào D1:
   ```bash
   wrangler d1 execute arttoy-db --remote --file=./schema.sql
   ```
   *(Để test offline trên máy: `wrangler d1 execute arttoy-db --local --file=./schema.sql`)*

---

## 3. Bước 2: Tạo KV Namespace Cloudflare Lưu Cache & Session Admin

1. Tạo KV Namespace:
   ```bash
   wrangler kv namespace create arttoy-kv
   ```
2. Dán `id` (và `preview_id`) trả về vào `[[kv_namespaces]]` trong file `wrangler.toml` (binding `KV`).
3. KV dùng để: cache danh sách series (`series:all`), invalidate cache khi thêm series, và lưu session đăng nhập admin (`admin:session:<token>`, TTL 7 ngày).

---

## 3b. Bước 2b: Đặt Mật Khẩu Admin (Bắt Buộc)

Khu vực quản trị được bảo vệ bằng mật khẩu, lưu bí mật trên Cloudflare:

```bash
wrangler secret put ADMIN_PASSWORD
```
*(Dán mật khẩu admin bạn chọn. Tuyệt đối không commit mật khẩu thật vào repo — `.env.example` chỉ là mẫu)*

---

## 4. Bước 3: Cấu hình Gemini API Key trên Cloudflare Worker

Thiết lập biến môi trường bí mật cho Chatbot AI Thầy Phẻo:
```bash
wrangler secret put GEMINI_API_KEY
```
*(Dán Gemini API Key của bạn lấy từ [Google AI Studio](https://aistudio.google.com/app/apikey))*

---

## 5. Bước 4: Build và Triển Khai Lên Cloudflare Pages

1. Biên dịch source code React/Vite thành thư mục tĩnh `frontend/dist/`:
   ```bash
   npm run build
   ```

2. Triển khai lên Cloudflare Pages toàn cầu:
   ```bash
   npx wrangler pages deploy frontend/dist --project-name=thepheo-arttoy
   ```
   *(Nếu deploy bằng GitHub Integration: `pages_build_output_dir` trong `wrangler.toml` gốc đã trỏ sẵn `./frontend/dist`, không cần làm gì thêm)*

---

## 5b. Bước 4b: Bật API `/api` Trên Pages Functions

Toàn bộ logic API (admin login, chat AI Thầy Phẻo, series, orders, hall-of-fame, vectorize reindex) đã được nối vào `functions/api/[[path]].ts` — chạy cùng site Pages, **không cần deploy Worker riêng**. Trước khi dùng được cần cấu hình trên Dashboard:

1. **Bindings** — Project -> Settings -> Functions -> Connectivity & Bindings:
   - D1 Database binding: Variable name `DB`, database `arttoy-db`
   - KV Namespace binding: Variable name `KV`, namespace `arttoy-kv`
   - Vectorize Index binding: Variable name `VECTORIZE`, index `arttoy-vector-index`
2. **Secrets** — Settings -> Environment variables -> Secret (để dạng Secret, không phải biến thường, vì không public code):
   - `ADMIN_PASSWORD` (mật khẩu đăng nhập admin)
   - `GEMINI_API_KEY` (khóa Google AI Studio)
3. **Redeploy** và test:
   ```bash
   curl https://thepheo-arttoy.pages.dev/api/series
   curl -X POST https://thepheo-arttoy.pages.dev/api/admin/login -H "Content-Type: application/json" -d '{"password":"<ADMIN_PASSWORD>"}'
   ```

3. Gắn Database D1 vào Cloudflare Pages:
   - Truy cập **Cloudflare Dashboard** -> **Workers & Pages** -> Chọn dự án `thepheo-arttoy`.
   - Vào tab **Settings** -> **Functions** -> **D1 database bindings**.
   - Thêm binding:
     - Variable name: `DB`
     - D1 database: `arttoy-db`
   - Bấm **Save and Redeploy**.

---

## 6. Kiểm tra nghiệm thu hệ thống (Verification)

Sau khi hoàn tất, website của bạn sẽ hoạt động tại địa chỉ: `https://thepheo-arttoy.pages.dev`
- [x] Thời gian tải trang ban đầu dưới 200ms nhờ CDN Edge toàn cầu.
- [x] Chatbot AI Thầy Phẻo phản hồi tư vấn gieo quẻ, soi vía và tính combo.
- [x] Bốc hộp ngẫu nhiên và sinh mã VietQR thanh toán tự động 24/7.
- [x] Quản trị kho D1 và đơn hàng hoạt động độc lập không cần bảo trì máy chủ vật lý.
