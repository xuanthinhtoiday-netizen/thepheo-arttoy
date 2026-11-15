import React, { useState } from 'react';
import { Series, Order, HallOfFameItem, OrderStatus } from '../types';
import { formatVND } from '../services/vietqr';
import { storage } from '../services/storage';
import { 
  Package, ShoppingCart, Trophy, Plus, Trash2, Edit2, 
  CheckCircle, Clock, Truck, CheckCheck, XCircle, Search, 
  Database, Server, CloudLightning, RefreshCw 
} from 'lucide-react';

interface AdminDashboardProps {
  seriesList: Series[];
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  seriesList,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'SERIES' | 'ORDERS' | 'HALL_OF_FAME' | 'SYSTEM'>('ORDERS');
  const [orders, setOrders] = useState<Order[]>(storage.getOrders());
  const [hallOfFame, setHallOfFame] = useState<HallOfFameItem[]>(storage.getHallOfFame());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // New series modal state
  const [showAddSeriesModal, setShowAddSeriesModal] = useState(false);
  const [newSeriesName, setNewSeriesName] = useState('');
  const [newSeriesBrand, setNewSeriesBrand] = useState('Pop Mart');
  const [newSeriesDesc, setNewSeriesDesc] = useState('');
  const [newSeriesPrice, setNewSeriesPrice] = useState(350000);
  const [newSeriesTotal, setNewSeriesTotal] = useState(12);
  const [newSeriesImage, setNewSeriesImage] = useState('https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80');

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    storage.updateOrderStatus(orderId, newStatus);
    setOrders(storage.getOrders());
  };

  const handleStockChange = (series: Series, delta: number) => {
    const newStock = Math.max(0, Math.min(series.total_boxes, series.remaining_boxes + delta));
    const updated = { ...series, remaining_boxes: newStock };
    storage.updateSeries(updated);
    onRefreshData();
  };

  const handleDeleteSeries = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa Series này khỏi kho Cloudflare D1?')) {
      storage.deleteSeries(id);
      onRefreshData();
    }
  };

  const handleCreateSeries = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `series-${Date.now()}`;
    const newSeries: Series = {
      id,
      name: newSeriesName,
      brand: newSeriesBrand,
      description: newSeriesDesc,
      price_per_box: Number(newSeriesPrice),
      total_boxes: Number(newSeriesTotal),
      remaining_boxes: Number(newSeriesTotal),
      image_url: newSeriesImage,
      items: [
        { id: `${id}-1`, series_id: id, item_name: 'Nhân vật Thường 01', is_secret: false, drop_probability: 8.25, image_url: newSeriesImage },
        { id: `${id}-sec`, series_id: id, item_name: 'Nhân vật SECRET Ẩn', is_secret: true, drop_probability: 0.69, image_url: newSeriesImage },
      ]
    };
    storage.updateSeries(newSeries);
    setShowAddSeriesModal(false);
    onRefreshData();
    alert('Đã thêm series mới vào Cloudflare D1 Database!');
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer_name && order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customer_phone && order.customer_phone.includes(searchTerm));
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider mb-1">
            <Database className="w-4 h-4" />
            Cloudflare Serverless Admin Center
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Quản Trị Hệ Thống & Cơ Sở Dữ Liệu D1
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Quản lý kho hàng Blind Box, đơn hàng từ AI Chatbot và thư viện khui hàng
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('ORDERS')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'ORDERS'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Đơn Hàng ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('SERIES')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'SERIES'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            Kho Hộp Mù ({seriesList.length})
          </button>

          <button
            onClick={() => setActiveTab('HALL_OF_FAME')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'HALL_OF_FAME'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Hall of Fame ({hallOfFame.length})
          </button>

          <button
            onClick={() => setActiveTab('SYSTEM')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'SYSTEM'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CloudLightning className="w-4 h-4" />
            Hạ Tầng Cloudflare
          </button>
        </div>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm mã đơn, tên, số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
              {['ALL', 'PENDING_PAYMENT', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {st === 'ALL' && 'Tất Cả'}
                  {st === 'PENDING_PAYMENT' && 'Chờ TT'}
                  {st === 'PAID' && 'Đã TT'}
                  {st === 'SHIPPED' && 'Đang Giao'}
                  {st === 'COMPLETED' && 'Hoàn Tất'}
                  {st === 'CANCELLED' && 'Đã Hủy'}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-900/80 text-slate-400 font-bold border-b border-slate-800 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Mã Đơn / Thời Gian</th>
                    <th className="p-4">Khách Hàng & Địa Chỉ</th>
                    <th className="p-4">Hộp Đã Đặt</th>
                    <th className="p-4">Tổng Tiền</th>
                    <th className="p-4">Trạng Thái</th>
                    <th className="p-4 text-right">Cập Nhật Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        Không có đơn hàng nào khớp với tìm kiếm.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4">
                          <div className="font-mono font-bold text-purple-300">{order.id}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{order.created_at || 'Mới tạo'}</div>
                        </td>
                        <td className="p-4 max-w-xs">
                          <div className="font-bold text-white">{order.customer_name || 'Khách vãng lai'}</div>
                          <div className="text-[11px] text-slate-400">{order.customer_phone || 'Chưa cập nhật'}</div>
                          <div className="text-[11px] text-slate-500 truncate">{order.customer_address}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-slate-200">{order.series_name || 'Combo Hộp Mù'}</div>
                          <div className="text-[11px] text-amber-300 font-mono mt-0.5">
                            {JSON.parse(order.ordered_items_json || '[]').join(', ')}
                          </div>
                        </td>
                        <td className="p-4 font-black text-amber-400">
                          {formatVND(order.total_amount)}
                        </td>
                        <td className="p-4">
                          {order.status === 'PENDING_PAYMENT' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                              <Clock className="w-3.5 h-3.5" /> Chờ Chuyển Khoản
                            </span>
                          )}
                          {order.status === 'PAID' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                              <CheckCircle className="w-3.5 h-3.5" /> Đã Thanh Toán
                            </span>
                          )}
                          {order.status === 'SHIPPED' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                              <Truck className="w-3.5 h-3.5" /> Đang Giao Hàng
                            </span>
                          )}
                          {order.status === 'COMPLETED' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                              <CheckCheck className="w-3.5 h-3.5" /> Hoàn Tất
                            </span>
                          )}
                          {order.status === 'CANCELLED' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                              <XCircle className="w-3.5 h-3.5" /> Đã Hủy
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                          >
                            <option value="PENDING_PAYMENT">Chờ TT</option>
                            <option value="PAID">Đã TT</option>
                            <option value="SHIPPED">Đang Giao</option>
                            <option value="COMPLETED">Hoàn Tất</option>
                            <option value="CANCELLED">Hủy Đơn</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SERIES & INVENTORY MANAGEMENT */}
      {activeTab === 'SERIES' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Danh Mục & Tồn Kho Khay Blind Box (D1 Table `series`)</h3>
            <button
              onClick={() => setShowAddSeriesModal(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-purple-600/30"
            >
              <Plus className="w-4 h-4" />
              Thêm Series Mới Vào D1
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seriesList.map(series => (
              <div key={series.id} className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-4">
                <div className="flex gap-3.5 items-center">
                  <img
                    src={series.image_url}
                    alt={series.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-white/10"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded-md">
                      {series.brand}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1 line-clamp-1">{series.name}</h4>
                    <div className="text-xs font-black text-amber-400 mt-0.5">
                      {formatVND(series.price_per_box)} / hộp
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Số lượng hộp tồn kho:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStockChange(series, -1)}
                        className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="font-bold text-white font-mono">{series.remaining_boxes} / {series.total_boxes}</span>
                      <button
                        onClick={() => handleStockChange(series, 1)}
                        className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                    <span className="text-slate-400">Tỉ lệ Secret Chase:</span>
                    <span className="text-pink-300 font-mono font-bold">1/144 (0.69%)</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => handleDeleteSeries(series.id)}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HALL OF FAME */}
      {activeTab === 'HALL_OF_FAME' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Quản Lý Feedback Khách Nổ Secret (D1 Table `hall_of_fame`)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hallOfFame.map(item => (
              <div key={item.id} className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image_url}
                    alt={item.item_won}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-white">{item.customer_name}</h5>
                    <span className="text-[11px] text-amber-300 font-semibold">{item.item_won}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 italic bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  "{item.comment}"
                </p>
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>Hộp #{item.box_number} • {item.series_name}</span>
                  <span>{item.created_at}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CLOUDFLARE SERVERLESS SYSTEM STATUS */}
      {activeTab === 'SYSTEM' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-3xl border border-purple-500/30">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase mb-2">
                <CloudLightning className="w-4 h-4 text-amber-400" />
                Frontend UI
              </div>
              <h4 className="text-lg font-black text-white">Cloudflare Pages</h4>
              <p className="text-xs text-slate-400 mt-1">
                React 18 + Vite + Tailwind CSS, Global Edge CDN caching.
              </p>
              <div className="mt-3 text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Trạng thái: Hoạt động (Active)
              </div>
            </div>

            <div className="glass-panel p-5 rounded-3xl border border-purple-500/30">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase mb-2">
                <Server className="w-4 h-4 text-pink-400" />
                Backend & AI Gateway
              </div>
              <h4 className="text-lg font-black text-white">Cloudflare Workers</h4>
              <p className="text-xs text-slate-400 mt-1">
                Edge API Routing, Gemini API Integration, Randomizer Gacha.
              </p>
              <div className="mt-3 text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Trạng thái: Hoạt động (Active)
              </div>
            </div>

            <div className="glass-panel p-5 rounded-3xl border border-purple-500/30">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase mb-2">
                <Database className="w-4 h-4 text-emerald-400" />
                Serverless SQL DB
              </div>
              <h4 className="text-lg font-black text-white">Cloudflare D1 (SQLite)</h4>
              <p className="text-xs text-slate-400 mt-1">
                Tables: series, series_items, customers, orders, chat_sessions.
              </p>
              <div className="mt-3 text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Trạng thái: Đã kết nối D1
              </div>
            </div>

            <div className="glass-panel p-5 rounded-3xl border border-purple-500/30">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase mb-2">
                <Package className="w-4 h-4 text-amber-400" />
                Media Storage
              </div>
              <h4 className="text-lg font-black text-white">Cloudflare R2 Storage</h4>
              <p className="text-xs text-slate-400 mt-1">
                Lưu trữ ảnh Art Toy chính hãng & ảnh bóc hộp thực tế khách hàng.
              </p>
              <div className="mt-3 text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Bucket: arttoy-media
              </div>
            </div>
          </div>

          {/* SQL Schema Preview */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" />
              Cấu Trúc Bảng Dữ Liệu Cloudflare D1 (schema.sql)
            </h4>
            <pre className="bg-slate-950 p-4 rounded-2xl text-[11px] text-purple-200 font-mono overflow-x-auto border border-purple-900/30">
{`CREATE TABLE series (id TEXT PRIMARY KEY, name TEXT, brand TEXT, price_per_box REAL, remaining_boxes INTEGER...);
CREATE TABLE series_items (id TEXT PRIMARY KEY, series_id TEXT, item_name TEXT, is_secret BOOLEAN, drop_probability REAL...);
CREATE TABLE customers (id TEXT PRIMARY KEY, name TEXT, phone TEXT UNIQUE, address TEXT...);
CREATE TABLE chat_sessions (session_id TEXT PRIMARY KEY, customer_id TEXT, conversation_history TEXT...);
CREATE TABLE orders (id TEXT PRIMARY KEY, customer_id TEXT, total_amount REAL, status TEXT, ordered_items_json TEXT...);`}
            </pre>
          </div>
        </div>
      )}

      {/* Add Series Modal */}
      {showAddSeriesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg glass-panel-glow rounded-3xl p-6 border border-purple-500/30 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-purple-900/30">
              <h3 className="text-lg font-black text-white">Thêm Series Hộp Mù Mới</h3>
              <button onClick={() => setShowAddSeriesModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSeries} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Tên Series Art Toy:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: MOLLY Space Vol.3 Series"
                  value={newSeriesName}
                  onChange={(e) => setNewSeriesName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Thương hiệu:</label>
                  <select
                    value={newSeriesBrand}
                    onChange={(e) => setNewSeriesBrand(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Pop Mart">Pop Mart</option>
                    <option value="Crybaby">Crybaby</option>
                    <option value="Bandai">Bandai (Gundam)</option>
                    <option value="Finding Unicorn">Finding Unicorn</option>
                    <option value="52TOYS">52TOYS</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Giá 1 hộp (VNĐ):</label>
                  <input
                    type="number"
                    required
                    value={newSeriesPrice}
                    onChange={(e) => setNewSeriesPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Số lượng hộp trên 1 khay (Case size):</label>
                <input
                  type="number"
                  required
                  value={newSeriesTotal}
                  onChange={(e) => setNewSeriesTotal(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Mô tả tóm tắt:</label>
                <textarea
                  rows={2}
                  value={newSeriesDesc}
                  onChange={(e) => setNewSeriesDesc(e.target.value)}
                  placeholder="Mô tả chất liệu, chủ đề..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                ></textarea>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Link Ảnh Sản Phẩm (Cloudflare R2 / URL):</label>
                <input
                  type="url"
                  required
                  value={newSeriesImage}
                  onChange={(e) => setNewSeriesImage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSeriesModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Lưu Vào D1 Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
