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

## 3. Bước 2: Tạo Bucket Cloudflare R2 Lưu Hình Ảnh Art Toy

1. Tạo R2 Bucket:
   ```bash
   wrangler r2 bucket create arttoy-media
   ```
2. Cấu hình public access cho bucket trong Cloudflare Dashboard (hoặc gắn custom domain) để có link xem trực tiếp ảnh sản phẩm.

---

## 4. Bước 3: Cấu hình Gemini API Key trên Cloudflare Worker

Thiết lập biến môi trường bí mật cho Chatbot AI Thầy Phẻo:
```bash
wrangler secret put GEMINI_API_KEY
```
*(Dán Gemini API Key của bạn lấy từ [Google AI Studio](https://aistudio.google.com/app/apikey))*

---

## 5. Bước 4: Build và Triển Khai Lên Cloudflare Pages

1. Biên dịch source code React/Vite thành thư mục tĩnh `dist/`:
   ```bash
   npm run build
   ```

2. Triển khai lên Cloudflare Pages toàn cầu:
   ```bash
   npx wrangler pages deploy dist --project-name=thepheo-arttoy
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
