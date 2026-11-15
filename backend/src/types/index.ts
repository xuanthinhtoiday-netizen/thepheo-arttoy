export interface Series {
  id: string;
  name: string;
  brand: string; // Pop Mart, Crybaby, Skullpanda, Bandai, etc.
  description: string;
  price_per_box: number;
  total_boxes: number;
  remaining_boxes: number;
  image_url: string;
  created_at?: string;
  items?: SeriesItem[];
}

export interface SeriesItem {
  id: string;
  series_id: string;
  item_name: string;
  is_secret: boolean;
  drop_probability: number; // e.g. 0.69% for 1/144
  image_url: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  created_at?: string;
}

export type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';

export interface Order {
  id: string;
  customer_id: string;
  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;
  total_amount: number;
  status: OrderStatus;
  ordered_items_json: string; // stringified JSON array of box identifiers e.g. ["SKP-Box-03", "SKP-Box-07"]
  created_at?: string;
  series_name?: string;
}

export interface HallOfFameItem {
  id: string;
  customer_name: string;
  series_name: string;
  item_won: string;
  is_secret: boolean;
  box_number: number;
  comment: string;
  image_url: string;
  created_at?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'the_pheo';
  text: string;
  timestamp: string;
  badge?: string; // e.g. "Quẻ Đại Cát 🔮", "Phong Thủy Soi Hộp 🎴"
  suggestedCombo?: {
    seriesId: string;
    seriesName: string;
    boxNumbers: number[];
    pricePerBox: number;
    totalAmount: number;
  };
  qrData?: {
    orderId: string;
    amount: number;
    accountNo: string;
    bankId: string;
    accountName: string;
    qrUrl: string;
  };
}

export interface CartItem {
  series: Series;
  selectedBoxes: number[]; // e.g. [3, 7, 9]
  totalPrice: number;
}
