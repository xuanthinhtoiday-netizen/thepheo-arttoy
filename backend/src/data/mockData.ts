import { Series, HallOfFameItem, Order } from '../types';

export const INITIAL_SERIES: Series[] = [
  {
    id: 'series-skullpanda-warmth',
    name: 'SKULLPANDA The Warmth Series',
    brand: 'Pop Mart',
    description: 'Series siêu hot tôn vinh cảm xúc ấm áp qua từng gam màu nghệ thuật. Tỉ lệ nổ Secret 1/144 cực hiếm, thiết kế sứ mờ siêu sang.',
    price_per_box: 350000,
    total_boxes: 12,
    remaining_boxes: 8,
    image_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    items: [
      { id: 'skp-1', series_id: 'series-skullpanda-warmth', item_name: 'The Lover', is_secret: false, drop_probability: 8.25, image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80' },
      { id: 'skp-2', series_id: 'series-skullpanda-warmth', item_name: 'The Daybreak', is_secret: false, drop_probability: 8.25, image_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80' },
      { id: 'skp-3', series_id: 'series-skullpanda-warmth', item_name: 'The Mind Whisper', is_secret: false, drop_probability: 8.25, image_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80' },
      { id: 'skp-4', series_id: 'series-skullpanda-warmth', item_name: 'The Warm Sun', is_secret: false, drop_probability: 8.25, image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80' },
      { id: 'skp-5', series_id: 'series-skullpanda-warmth', item_name: 'The Gaze', is_secret: false, drop_probability: 8.25, image_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80' },
      { id: 'skp-sec', series_id: 'series-skullpanda-warmth', item_name: 'The Hidden Heart (SECRET CHASE 1/144)', is_secret: true, drop_probability: 0.69, image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80' },
    ]
  },
  {
    id: 'series-crybaby-sunset',
    name: 'CRYBABY Sunset Concert Series',
    brand: 'Crybaby',
    description: 'Giai điệu hoàng hôn cùng những giọt nước mắt cảm xúc. Đỉnh cao săn lùng của giới mộ điệu Pop Mart năm 2024.',
    price_per_box: 380000,
    total_boxes: 12,
    remaining_boxes: 5,
    image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80',
    items: [
      { id: 'cry-1', series_id: 'series-crybaby-sunset', item_name: 'Sunset Guitarist', is_secret: false, drop_probability: 8.25, image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80' },
      { id: 'cry-2', series_id: 'series-crybaby-sunset', item_name: 'Tears of Melody', is_secret: false, drop_probability: 8.25, image_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80' },
      { id: 'cry-3', series_id: 'series-crybaby-sunset', item_name: 'Drummer in Tears', is_secret: false, drop_probability: 8.25, image_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80' },
      { id: 'cry-sec', series_id: 'series-crybaby-sunset', item_name: 'Golden Saxophone Crybaby (SECRET 1/144)', is_secret: true, drop_probability: 0.69, image_url: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=400&q=80' },
    ]
  },
  {
    id: 'series-gundam-universe',
    name: 'GUNDAM Universe Blind Box Vol.2',
    brand: 'Bandai',
    description: 'Mô hình chiến binh Gundam tỉ lệ chi tiết cao, các khớp cơ học chuyển động, bản mạ vàng Gold Armor Secret cực ngầu.',
    price_per_box: 420000,
    total_boxes: 12,
    remaining_boxes: 9,
    image_url: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=800&auto=format&fit=crop&q=80',
    items: [
      { id: 'gun-1', series_id: 'series-gundam-universe', item_name: 'RX-78-2 Custom', is_secret: false, drop_probability: 8.25, image_url: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=400&q=80' },
      { id: 'gun-2', series_id: 'series-gundam-universe', item_name: 'Wing Zero Strike', is_secret: false, drop_probability: 8.25, image_url: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=400&q=80' },
      { id: 'gun-sec', series_id: 'series-gundam-universe', item_name: 'Gold Armor Gundam Secret (1/72)', is_secret: true, drop_probability: 1.38, image_url: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=400&q=80' },
    ]
  },
  {
    id: 'series-dimoo-animal',
    name: 'DIMOO Animal Kingdom Series',
    brand: 'Pop Mart',
    description: 'Cậu bé Dimoo hóa thân vào muôn thú rừng xanh mộng mơ. Secret Dimoo Báo Đốm Hoàng Gia với ánh mắt lấp lánh.',
    price_per_box: 320000,
    total_boxes: 12,
    remaining_boxes: 11,
    image_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    items: [
      { id: 'dim-1', series_id: 'series-dimoo-animal', item_name: 'Baby Panda Dimoo', is_secret: false, drop_probability: 8.25, image_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80' },
      { id: 'dim-2', series_id: 'series-dimoo-animal', item_name: 'Arctic Fox Dimoo', is_secret: false, drop_probability: 8.25, image_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80' },
      { id: 'dim-sec', series_id: 'series-dimoo-animal', item_name: 'Royal Leopard Dimoo (SECRET)', is_secret: true, drop_probability: 0.69, image_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80' },
    ]
  },
  {
    id: 'series-hirono-city',
    name: 'HIRONO City of Mercy Series',
    brand: 'Pop Mart',
    description: 'Những góc khuất tâm hồn trong thành phố hoa lệ. Series nghệ thuật trầm lắng, chất liệu cao cấp và tính sưu tầm vượt thời gian.',
    price_per_box: 360000,
    total_boxes: 12,
    remaining_boxes: 6,
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    items: [
      { id: 'hir-1', series_id: 'series-hirono-city', item_name: 'The Vagrant', is_secret: false, drop_probability: 8.25, image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80' },
      { id: 'hir-2', series_id: 'series-hirono-city', item_name: 'The Guardian', is_secret: false, drop_probability: 8.25, image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80' },
      { id: 'hir-sec', series_id: 'series-hirono-city', item_name: 'Memory Keeper (SECRET 1/144)', is_secret: true, drop_probability: 0.69, image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80' },
    ]
  }
];

export const INITIAL_HALL_OF_FAME: HallOfFameItem[] = [
  {
    id: 'hof-1',
    customer_name: 'Minh Hoàng (Hà Nội)',
    series_name: 'SKULLPANDA The Warmth',
    item_won: 'The Hidden Heart (SECRET CHASE)',
    is_secret: true,
    box_number: 7,
    comment: 'Nhờ Thầy Phẻo gieo quẻ giờ Tý bốc ngay hộp số 7 nổ Secret 1/144! Quá đỉnh thầy ơi, tay vẫn còn run!',
    image_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&q=80',
    created_at: '2026-11-14 20:15'
  },
  {
    id: 'hof-2',
    customer_name: 'Linh Đan (TP.HCM)',
    series_name: 'CRYBABY Sunset Concert',
    item_won: 'Golden Saxophone Crybaby (SECRET)',
    is_secret: true,
    box_number: 3,
    comment: 'Thầy Phẻo bảo mệnh Kim hợp với số 3 hướng Tây, chốt luôn combo 3 hộp bốc được ngay con kèn vàng độc nhất!',
    image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80',
    created_at: '2026-11-13 15:42'
  },
  {
    id: 'hof-3',
    customer_name: 'Tuấn Anh (Đà Nẵng)',
    series_name: 'GUNDAM Universe Vol.2',
    item_won: 'Gold Armor Gundam Secret',
    is_secret: true,
    box_number: 11,
    comment: 'Gieo quẻ Thầy bốc hộp số 11, bóc túi ra ánh kim chói lóa. Khuyên thật anh em cứ nghe Thầy Phẻo mà gắp.',
    image_url: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=600&q=80',
    created_at: '2026-11-12 11:30'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-20261115-0891',
    customer_id: 'cust-001',
    customer_name: 'Nguyễn Văn Phát',
    customer_phone: '0988776655',
    customer_address: '120 Nguyễn Huệ, Quận 1, TP.HCM',
    series_name: 'SKULLPANDA The Warmth Series',
    total_amount: 1050000,
    status: 'PAID',
    ordered_items_json: JSON.stringify(['Box #03', 'Box #07', 'Box #09']),
    created_at: '2026-11-15 11:20'
  },
  {
    id: 'ORD-20261115-0892',
    customer_id: 'cust-002',
    customer_name: 'Trần Thị Thu Trang',
    customer_phone: '0912345678',
    customer_address: '88 Cầu Giấy, Hà Nội',
    series_name: 'CRYBABY Sunset Concert Series',
    total_amount: 760000,
    status: 'SHIPPED',
    ordered_items_json: JSON.stringify(['Box #02', 'Box #05']),
    created_at: '2026-11-15 10:05'
  }
];
