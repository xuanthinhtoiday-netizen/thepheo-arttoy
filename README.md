# 🔮 THẦY PHẺO ART TOY - NỀN TẢNG THƯƠNG MẠI ĐIỆN TỬ BLIND BOX TÍCH HỢP AI

> **Dự án:** Website Thương Mại Điện Tử Ngách "Mystery Box & Art Toy" Tích Hợp Chatbot AI và Hạ Tầng Cloudflare Serverless  
> **AI Persona:** "Thầy Phẻo Gieo Quẻ Art Toy" (Soi vía bốc hộp, quẻ phong thủy, kích lộc Secret 1/144)  
> **Hạ tầng:** Cloudflare Serverless Stack (Pages + Workers + D1 SQLite + R2 Storage + Google Gemini API Gateway)

---

## 🌟 TÍNH NĂNG ĐÃ TRIỂN KHAI THEO ĐẶC TẢ SRS

### 1. Phân hệ Khách hàng (Storefront & AI)
- **FR-01: Duyệt danh mục & Bộ sưu tập (Catalog & Series Browsing):**
  - Danh mục các series nổi tiếng: **SKULLPANDA The Warmth**, **CRYBABY Sunset Concert**, **GUNDAM Universe Vol.2**, **DIMOO Animal Kingdom**, **HIRONO City of Mercy**.
  - Hiển thị tỷ lệ drop chuẩn (Cơ bản ~8.25% vs Secret Chase 1/144 ~0.69%).
  - Bộ lọc thương hiệu (Pop Mart, Crybaby, Bandai...) và chỉ số tồn kho thời gian thực.
- **FR-02: Khung Chatbot AI tương tác ("Thầy Phẻo Gieo Quẻ"):**
  - Bong bóng chat nổi góc màn hình 24/7 với hiệu ứng huyền thuật và trạng thái AI Online.
  - Persona "Thầy Phẻo" dí dỏm, am hiểu văn hóa Art Toy & phong thủy ngũ hành, gieo quẻ dịch số, khuyên giờ hoàng đạo, gợi ý combo 3-5 hộp hoặc Full Box.
  - Tích hợp cổng Gemini API và bộ suy luận phong thủy tương tác thông minh ngay trong giao diện chat.
- **FR-03: Cơ chế Bốc thăm tự động & Chọn Hộp (AI-assisted Gacha Roll):**
  - Giao diện mô phỏng khay 12 hộp nguyên seal Pop Mart.
  - Tùy chọn từng số hộp (Hộp 1 đến Hộp 12) hoặc chọn nhanh Combo 3 Hộp (Tam Hoa), Combo 5 Hộp (Ngũ Hành), Full Box.
  - **Gacha Unbox Simulator:** Trải nghiệm xé seal túi bạc, rung lắc hộp bí ẩn, bùng nổ pháo hoa rực rỡ khi mở trúng nhân vật Secret Chase!
- **FR-04: Thanh toán & Tạo đơn hàng (Checkout & VietQR Payment):**
  - Điền thông tin giao hàng hoặc chốt đơn 1 chạm trực tiếp từ khung chat Thầy Phẻo.
  - Hệ thống tự động sinh mã VietQR Napas 24/7 kèm mã đơn và nội dung chuyển khoản chuẩn.
  - Tự động trừ tồn kho và cập nhật trạng thái đơn sang `PAID`.

### 2. Phân hệ Quản trị (Admin Dashboard & Cloudflare D1)
- **FR-05: Quản lý Kho hàng Blind Box (Inventory Management):**
  - Thêm mới Series vào cơ sở dữ liệu Cloudflare D1.
  - Tăng/giảm số hộp tồn kho thời gian thực.
  - Thiết lập tỷ lệ drop rate và nhân vật ẩn.
- **FR-06: Quản lý Đơn hàng & Giao dịch (Order Management):**
  - Bảng tổng hợp đơn hàng từ Storefront và Chatbot AI.
  - Bộ lọc theo trạng thái: `PENDING_PAYMENT`, `PAID`, `SHIPPED`, `COMPLETED`, `CANCELLED`.
  - Tìm kiếm theo mã đơn, họ tên, số điện thoại khách hàng.
- **FR-07: Quản lý Thư viện Khui hàng (Hall of Fame & Feedback):**
  - Đại lộ danh vọng lưu giữ feedback và hình ảnh khách hàng bốc trúng Secret để làm bằng chứng xã hội (Social proof) cho AI trích dẫn.

---

## 🛠️ CẤU TRÚC BẢNG CƠ SỞ DỮ LIỆU CLOUDFLARE D1 (SQLite)

Hệ thống tuân thủ chính xác schema SQL trong tài liệu đặc tả SRS:
1. `series`: Quản lý danh mục và tồn kho từng dòng Art Toy.
2. `series_items`: Danh sách các mẫu thường và mẫu Secret kèm xác suất drop.
3. `customers`: Thông tin khách hàng đặt hàng.
4. `chat_sessions`: Lưu lịch sử hội thoại của Chatbot AI Thầy Phẻo.
5. `orders`: Quản lý đơn hàng, mã các hộp khách chọn và trạng thái thanh toán.
6. `hall_of_fame`: Thư viện feedback mở hộp trúng Secret.

*(Toàn bộ câu lệnh SQL và dữ liệu mẫu có trong file `schema.sql`)*

---

## 🚀 HƯỚNG DẪN CHẠY DỰ ÁN TẠI MÁY (LOCAL DEVELOPMENT)

### Bước 1: Mở Terminal tại thư mục dự án
```powershell
cd "D:\Website túi mù"
```

### Bước 2: Chạy ứng dụng
```powershell
npm run dev
```
👉 Mở trình duyệt truy cập: **`http://localhost:3000`**

*(Nếu muốn chạy cả máy chủ API backend song song: `npm run start`)*

---

## ☁️ HƯỚNG DẪN TRIỂN KHAI LÊN CLOUDFLARE SERVERLESS

Xem chi tiết từng bước trong file [DEPLOYMENT_GUIDE.md](file:///D:/Website%20t%C3%BAi%20m%C3%B9/DEPLOYMENT_GUIDE.md).
1. **Khởi tạo D1 Database:** `npx wrangler d1 create arttoy-db`
2. **Nạp Schema SQL:** `npx wrangler d1 execute arttoy-db --file=./schema.sql`
3. **Build Frontend:** `npm run build`
4. **Deploy Cloudflare Pages & Workers:** `npx wrangler pages deploy dist`
