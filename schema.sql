-- ========================================================
-- CLOUDFLARE D1 SQL SCHEMA & SEED DATA
-- Project: Website Thương Mại Điện Tử Blind Box & Art Toy
-- AI Persona: Thầy Phẻo Gieo Quẻ Art Toy
-- ========================================================

-- 1. Bảng quản lý danh mục Series Art Toy
CREATE TABLE IF NOT EXISTS series (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL, -- Pop Mart, Crybaby, Skullpanda, Gundam, Dimoo, etc.
    description TEXT,
    price_per_box REAL NOT NULL,
    total_boxes INTEGER NOT NULL,
    remaining_boxes INTEGER NOT NULL,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng chi tiết các item trong Series (bao gồm cả nhân vật Secret)
CREATE TABLE IF NOT EXISTS series_items (
    id TEXT PRIMARY KEY,
    series_id TEXT NOT NULL,
    item_name TEXT NOT NULL,
    is_secret BOOLEAN DEFAULT 0,
    drop_probability REAL NOT NULL, -- Tỷ lệ phần trăm xuất hiện (%)
    image_url TEXT,
    FOREIGN KEY (series_id) REFERENCES series(id) ON DELETE CASCADE
);

-- 3. Bảng quản lý khách hàng
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT,
    phone TEXT UNIQUE,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bảng quản lý lịch sử hội thoại Chatbot AI
CREATE TABLE IF NOT EXISTS chat_sessions (
    session_id TEXT PRIMARY KEY,
    customer_id TEXT,
    conversation_history TEXT, -- JSON chuỗi hội thoại
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- 5. Bảng quản lý Đơn hàng
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    total_amount REAL NOT NULL,
    status TEXT CHECK(status IN ('PENDING_PAYMENT', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED')) DEFAULT 'PENDING_PAYMENT',
    ordered_items_json TEXT NOT NULL, -- JSON danh sách hộp khách mua (ví dụ: ["SKP-Box-03", "SKP-Box-07"])
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- 6. Bảng Quản lý Feedback & Khui Hàng Trúng Secret (Hall of Fame)
CREATE TABLE IF NOT EXISTS hall_of_fame (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    series_name TEXT NOT NULL,
    item_won TEXT NOT NULL,
    is_secret BOOLEAN DEFAULT 1,
    box_number INTEGER,
    comment TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- SEED DATA (Dữ liệu khởi tạo chuẩn Art Toy)
-- ========================================================

-- Series
INSERT OR REPLACE INTO series (id, name, brand, description, price_per_box, total_boxes, remaining_boxes, image_url) VALUES
('series-skullpanda-warmth', 'SKULLPANDA The Warmth Series', 'Pop Mart', 'Series siêu hot tôn vinh cảm xúc ấm áp qua từng gam màu nghệ thuật. Tỉ lệ nổ Secret 1/144 cực hiếm.', 350000, 12, 8, 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80'),
('series-crybaby-sunset', 'CRYBABY Sunset Concert Series', 'Crybaby', 'Giai điệu hoàng hôn cùng những giọt nước mắt cảm xúc. Đỉnh cao sưu tầm Pop Mart năm 2024.', 380000, 12, 5, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80'),
('series-gundam-universe', 'GUNDAM Universe Blind Box Vol.2', 'Bandai', 'Mô hình chiến binh Gundam tỉ lệ chi tiết cao, phiên bản mạ vàng Gold Armor Secret 1/72.', 420000, 12, 9, 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=800&auto=format&fit=crop&q=80'),
('series-dimoo-animal', 'DIMOO Animal Kingdom Series', 'Pop Mart', 'Cậu bé Dimoo hóa thân vào muôn thú rừng xanh mộng mơ. Secret Dimoo Báo Đốm Hoàng Gia cực đỉnh.', 320000, 12, 11, 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80'),
('series-hirono-city', 'HIRONO City of Mercy Series', 'Pop Mart', 'Những góc khuất tâm hồn trong thành phố hoa lệ. Series trầm lắng và sâu sắc nhất của Lang.', 360000, 12, 6, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80');

-- Items in SKULLPANDA The Warmth
INSERT OR REPLACE INTO series_items (id, series_id, item_name, is_secret, drop_probability, image_url) VALUES
('item-skp-01', 'series-skullpanda-warmth', 'The Lover', 0, 8.25, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80'),
('item-skp-02', 'series-skullpanda-warmth', 'The Daybreak', 0, 8.25, 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80'),
('item-skp-03', 'series-skullpanda-warmth', 'The Mind Whisper', 0, 8.25, 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80'),
('item-skp-04', 'series-skullpanda-warmth', 'The Warm Sun', 0, 8.25, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80'),
('item-skp-secret', 'series-skullpanda-warmth', 'The Hidden Heart (SECRET CHASE)', 1, 0.69, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80');

-- Items in CRYBABY Sunset Concert
INSERT OR REPLACE INTO series_items (id, series_id, item_name, is_secret, drop_probability, image_url) VALUES
('item-cry-01', 'series-crybaby-sunset', 'Sunset Solo Guitarist', 0, 8.25, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80'),
('item-cry-02', 'series-crybaby-sunset', 'Tears of Melody', 0, 8.25, 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80'),
('item-cry-secret', 'series-crybaby-sunset', 'Golden Saxophone Crybaby (SECRET)', 1, 0.69, 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=400&q=80');

-- Hall of Fame (Social Proof)
INSERT OR REPLACE INTO hall_of_fame (id, customer_name, series_name, item_won, is_secret, box_number, comment, image_url) VALUES
('hof-01', 'Minh Hoàng (Hà Nội)', 'SKULLPANDA The Warmth Series', 'The Hidden Heart (SECRET)', 7, 'Nhờ Thầy Phẻo gieo quẻ số 7 mà nổ ngay Secret 1/144! Quá đỉnh thầy ơi!', 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&q=80'),
('hof-02', 'Linh Đan (TP.HCM)', 'CRYBABY Sunset Concert Series', 'Golden Saxophone Crybaby', 3, 'Thầy Phẻo bảo mệnh Kim bốc hộp 3 là hợp vía, trúng luôn con Secret vàng chóe!', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80'),
('hof-03', 'Tuấn Anh (Đà Nẵng)', 'GUNDAM Universe Vol.2', 'Gold Armor Gundam Secret', 11, 'Combo 3 hộp bốc theo quẻ của Thầy, trúng 1 Secret và 2 con hiếm.', 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=600&q=80');

-- Sample Customer & Orders
INSERT OR REPLACE INTO customers (id, name, phone, address) VALUES
('cust-001', 'Nguyễn Văn Phát', '0988776655', '120 Nguyễn Huệ, Quận 1, TP.HCM');

INSERT OR REPLACE INTO orders (id, customer_id, total_amount, status, ordered_items_json) VALUES
('ORD-20261115-001', 'cust-001', 1050000, 'PAID', '["SKP-Box-03", "SKP-Box-07", "SKP-Box-09"]');
