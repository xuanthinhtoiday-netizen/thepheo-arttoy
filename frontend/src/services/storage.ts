import { Series, Order, HallOfFameItem, Customer, OrderStatus } from '../types';
import { INITIAL_SERIES, INITIAL_HALL_OF_FAME, INITIAL_ORDERS } from '../data/mockData';

const STORAGE_KEYS = {
  SERIES: 'thepheo_series',
  ORDERS: 'thepheo_orders',
  HALL_OF_FAME: 'thepheo_hall_of_fame',
  CUSTOMERS: 'thepheo_customers',
  LAST_CUSTOMER: 'thepheo_last_customer',
  API_KEY: 'thepheo_gemini_api_key'
};

class StorageService {
  private get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage set error:', e);
    }
  }

  // --- SERIES MANAGEMENT ---
  getSeries(): Series[] {
    const series = this.get<Series[]>(STORAGE_KEYS.SERIES, INITIAL_SERIES);
    if (!series || series.length === 0) {
      this.set(STORAGE_KEYS.SERIES, INITIAL_SERIES);
      return INITIAL_SERIES;
    }
    return series;
  }

  getSeriesById(id: string): Series | undefined {
    return this.getSeries().find(s => s.id === id);
  }

  saveSeries(series: Series[]): void {
    this.set(STORAGE_KEYS.SERIES, series);
  }

  updateSeries(updated: Series): void {
    const list = this.getSeries();
    const index = list.findIndex(s => s.id === updated.id);
    if (index !== -1) {
      list[index] = updated;
    } else {
      list.push(updated);
    }
    this.saveSeries(list);
  }

  deleteSeries(id: string): void {
    const list = this.getSeries().filter(s => s.id !== id);
    this.saveSeries(list);
  }

  // --- BOX STATE & STOCK TRACKING ---
  getSoldBoxes(seriesId: string, defaultCount: number = 4, totalBoxes: number = 12): number[] {
    const key = `thepheo_sold_${seriesId}`;
    const existing = this.get<number[] | null>(key, null);
    if (existing !== null) {
      return existing;
    }
    // Default initial sold boxes
    const defaults = [2, 4, 8, 12].filter(n => n <= totalBoxes).slice(0, defaultCount);
    this.set(key, defaults);
    return defaults;
  }

  recordSoldBoxes(seriesId: string, boxNumbers: number[]): void {
    const list = this.getSeries();
    const item = list.find(s => s.id === seriesId);
    const total = item ? item.total_boxes : 12;
    const currentSold = this.getSoldBoxes(seriesId, item ? item.total_boxes - item.remaining_boxes : 0, total);
    const updatedSold = Array.from(new Set([...currentSold, ...boxNumbers])).sort((a, b) => a - b);
    this.set(`thepheo_sold_${seriesId}`, updatedSold);

    if (item) {
      item.remaining_boxes = Math.max(0, item.total_boxes - updatedSold.length);
      this.saveSeries(list);
    }
  }

  holdOrDeductBoxes(seriesId: string, count: number): boolean {
    const list = this.getSeries();
    const item = list.find(s => s.id === seriesId);
    if (!item || item.remaining_boxes < count) {
      return false;
    }
    item.remaining_boxes -= count;
    this.saveSeries(list);
    return true;
  }

  // --- ORDERS MANAGEMENT ---
  getOrders(): Order[] {
    return this.get<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  }

  createOrder(order: Omit<Order, 'id' | 'created_at'>): Order {
    const orders = this.getOrders();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...order,
      id: `ORD-${dateStr}-${randomSuffix}`,
      created_at: new Date().toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
    };
    orders.unshift(newOrder);
    this.set(STORAGE_KEYS.ORDERS, orders);
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Order | undefined {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      this.set(STORAGE_KEYS.ORDERS, orders);
    }
    return order;
  }

  // --- HALL OF FAME MANAGEMENT ---
  getHallOfFame(): HallOfFameItem[] {
    return this.get<HallOfFameItem[]>(STORAGE_KEYS.HALL_OF_FAME, INITIAL_HALL_OF_FAME);
  }

  addHallOfFame(item: Omit<HallOfFameItem, 'id' | 'created_at'>): HallOfFameItem {
    const list = this.getHallOfFame();
    const newItem: HallOfFameItem = {
      ...item,
      id: `hof-${Date.now()}`,
      created_at: new Date().toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
    };
    list.unshift(newItem);
    this.set(STORAGE_KEYS.HALL_OF_FAME, list);
    return newItem;
  }

  // --- CUSTOMERS ---
  getCustomers(): Customer[] {
    return this.get<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
  }

  saveCustomer(customer: Customer): Customer {
    const customers = this.getCustomers();
    const existing = customers.find(c => c.phone === customer.phone);
    if (existing) {
      Object.assign(existing, customer);
    } else {
      customers.push(customer);
    }
    this.set(STORAGE_KEYS.CUSTOMERS, customers);
    // Ghi nho thong tin khach hang moi nhat de tu dong dien lai o lan dat hang sau
    this.setLastCustomer(customer);
    return customer;
  }

  /** Lay thong tin khach hang vua dat hang gan nhat (de tu dong dien o checkout) */
  getLastCustomer(): Customer | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.LAST_CUSTOMER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private setLastCustomer(customer: Customer): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_CUSTOMER, JSON.stringify(customer));
    } catch (e) {
      console.error('Save last customer error:', e);
    }
  }

  // --- GEMINI API KEY ---
  getGeminiApiKey(): string {
    return localStorage.getItem(STORAGE_KEYS.API_KEY) || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  }

  setGeminiApiKey(key: string): void {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key.trim());
  }
}

export const storage = new StorageService();
