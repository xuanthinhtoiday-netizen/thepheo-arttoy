import React, { useState } from 'react';
import { Series, Order, HallOfFameItem, OrderStatus } from '../types';
import { formatVND } from '../services/vietqr';
import { storage } from '../services/storage';
import {
  Package, ShoppingCart, Trophy, Plus, Trash2,
  CheckCircle, Clock, Truck, CheckCheck, XCircle, Search,
  Database, Server, CloudLightning, Heart, Star, Sparkles, Gift, Crown, WandSparkles, ShieldCheck, Zap, ArrowRight, Box, Settings, Wifi, HardDrive, LogOut, LockKeyhole, X
} from 'lucide-react';

interface AdminDashboardProps {
  seriesList: Series[];
  onRefreshData: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  seriesList,
  onRefreshData,
  onLogout,
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
    if (confirm('Bạn có chắc chắn muốn xóa Series này khỏi kho Cloudflare D1? 🥺')) {
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
    alert('Đã thêm series mới vào Cloudflare D1 Database! 🎉');
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
      {/* Cute Floating Decorations */}
      <div className="hidden lg:block absolute top-10 -left-5 w-12 h-12 animate-float-gentle pointer-events-none">
        <span className="text-5xl">🎀</span>
      </div>
      <div className="hidden lg:block absolute top-20 -right-5 w-10 h-10 animate-float-gentle pointer-events-none" style={{ animationDelay: '1s' }}>
        <span className="text-4xl">✨</span>
      </div>

      {/* Header - Cute */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-cute-full bg-white/80 border-2 border-pink-200/50 text-pink-700 text-xs font-semibold shadow-cute mb-4 animate-bounce-cute">
            <span className="heart-decoration">💖</span>
            <span>Console & Database</span>
            <span className="text-pink-300">✨</span>
            <span className="text-peach-500 font-bold">Cloudflare Serverless</span>
            <span className="star-decoration">⭐</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-pink-800 tracking-tight text-gradient-cute">
            Quản Trị Hệ Thống D1 ⚙️
          </h2>
          <p className="text-pink-500 text-sm mt-2 max-w-md">
            Quản lý kho hàng Blind Box, đơn hàng từ AI và hạ tầng Cloudflare Serverless! 💖
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="badge-cute inline-flex items-center gap-1">
              <LockKeyhole className="w-3 h-3" /> Đã đăng nhập với tư cách Admin
            </span>
            <button
              onClick={onLogout}
              className="btn-cute-ghost px-3 py-1.5 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50/60 flex items-center gap-1 border border-rose-200/50"
            >
              <LogOut className="w-3.5 h-3.5" /> Đăng Xuất
            </button>
          </div>
        </div>

        {/* Tab Controls - Cute */}
        <div className="flex flex-wrap gap-2 p-2 bg-white/80 rounded-cute-lg border-2 border-pink-200/50 shadow-cute">
          <button
            onClick={() => setActiveTab('ORDERS')}
            className={`px-4 py-2 rounded-cute text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'ORDERS'
                ? 'bg-cute-gradient text-pink-700 shadow-cute border border-pink-300/50'
                : 'text-pink-500 hover:text-pink-700 hover:bg-pink-50/50'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Đơn Hàng ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('SERIES')}
            className={`px-4 py-2 rounded-cute text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'SERIES'
                ? 'bg-cute-gradient text-pink-700 shadow-cute border border-pink-300/50'
                : 'text-pink-500 hover:text-pink-700 hover:bg-pink-50/50'
            }`}
          >
            <Package className="w-4 h-4" />
            Kho Hộp Mù ({seriesList.length})
          </button>

          <button
            onClick={() => setActiveTab('HALL_OF_FAME')}
            className={`px-4 py-2 rounded-cute text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'HALL_OF_FAME'
                ? 'bg-cute-gradient text-pink-700 shadow-cute border border-pink-300/50'
                : 'text-pink-500 hover:text-pink-700 hover:bg-pink-50/50'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Hall of Fame ({hallOfFame.length})
          </button>

          <button
            onClick={() => setActiveTab('SYSTEM')}
            className={`px-4 py-2 rounded-cute text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'SYSTEM'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-cute'
                : 'text-pink-500 hover:text-pink-700 hover:bg-pink-50/50'
            }`}
          >
            <CloudLightning className="w-4 h-4" />
            Hạ Tầng Cloudflare
          </button>
        </div>
      </div>

      {/* TAB 1: ORDERS - Cute */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-4 animate-pop-in">
          <div className="surface-cute p-4 rounded-cute-lg flex flex-col sm:flex-row gap-3 items-center justify-between border-2 border-pink-200/50">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-pink-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm mã đơn, tên, số điện thoại... 🔍"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-cute w-full pl-10 pr-3 py-2 text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto overflow-x-auto">
              {['ALL', 'PENDING_PAYMENT', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-cute text-xs font-semibold whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? 'bg-cute-gradient text-pink-700 shadow-cute border border-pink-300/50 animate-heartbeat'
                      : 'text-pink-500 hover:text-pink-700 hover:bg-pink-50/50'
                  }`}
                >
                  {st === 'ALL' && <><Trophy className="w-3 h-3" /> Tất Cả</>}
                  {st === 'PENDING_PAYMENT' && <><Clock className="w-3 h-3" /> Chờ TT</>}
                  {st === 'PAID' && <><CheckCircle className="w-3 h-3" /> Đã TT</>}
                  {st === 'SHIPPED' && <><Truck className="w-3 h-3" /> Đang Giao</>}
                  {st === 'COMPLETED' && <><CheckCheck className="w-3 h-3" /> Hoàn Tất</>}
                  {st === 'CANCELLED' && <><XCircle className="w-3 h-3" /> Đã Hủy</>}
                </button>
              ))}
            </div>
          </div>

          <div className="surface-cute-elevated rounded-cute-xl overflow-hidden border-2 border-pink-200/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-cute-gradient/30 text-pink-600 font-semibold border-b border-pink-200/50 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5"><Crown className="w-3.5 h-3.5 inline mr-1" /> Mã Đơn</th>
                    <th className="p-3.5"><Heart className="w-3.5 h-3.5 inline mr-1" /> Khách Hàng</th>
                    <th className="p-3.5"><Box className="w-3.5 h-3.5 inline mr-1" /> Hộp Đã Đặt</th>
                    <th className="p-3.5"><Gift className="w-3.5 h-3.5 inline mr-1" /> Tổng Tiền</th>
                    <th className="p-3.5"><ShieldCheck className="w-3.5 h-3.5 inline mr-1" /> Trạng Thái</th>
                    <th className="p-3.5 text-right"><WandSparkles className="w-3.5 h-3.5 inline mr-1" /> Cập Nhật</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-200/50">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-pink-400 animate-bounce-cute">
                        <div className="text-4xl mb-2">🥺</div>
                        Không có đơn hàng nào khớp với tìm kiếm.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-pink-50/50 transition-colors animate-pop-in" style={{ animationDelay: `${Math.random() * 100}ms` }}>
                        <td className="p-3.5 font-mono text-pink-700 font-semibold">
                          {order.id}
                          <div className="text-xs text-pink-400 font-sans mt-0.5">{order.created_at || 'Mới tạo'}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-pink-800">{order.customer_name || 'Khách vãng lai'}</div>
                          <div className="text-xs text-pink-500">{order.customer_phone || ''}</div>
                          <div className="text-[10px] text-pink-400 truncate max-w-[200px]">{order.customer_address}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="text-pink-600 font-medium">{order.series_name || 'Combo'}</div>
                          <div className="text-xs text-peach-500 font-mono mt-0.5 flex items-center gap-1">
                            <Box className="w-3 h-3" />
                            {JSON.parse(order.ordered_items_json || '[]').join(', ')}
                          </div>
                        </td>
                        <td className="p-3.5 font-bold text-gradient-peach font-display">
                          {formatVND(order.total_amount)}
                        </td>
                        <td className="p-3.5">
                          {order.status === 'PENDING_PAYMENT' && (
                            <span className="badge-cute-peach inline-flex items-center gap-1 px-2.5 py-1 rounded-cute-full text-xs font-medium">
                              <Clock className="w-3 h-3" /> Chờ Chuyển Khoản
                            </span>
                          )}
                          {order.status === 'PAID' && (
                            <span className="badge-cute-mint inline-flex items-center gap-1 px-2.5 py-1 rounded-cute-full text-xs font-medium">
                              <CheckCircle className="w-3 h-3" /> Đã Thanh Toán
                            </span>
                          )}
                          {order.status === 'SHIPPED' && (
                            <span className="badge-cute-lavender inline-flex items-center gap-1 px-2.5 py-1 rounded-cute-full text-xs font-medium">
                              <Truck className="w-3 h-3" /> Đang Giao Hàng
                            </span>
                          )}
                          {order.status === 'COMPLETED' && (
                            <span className="badge-cute inline-flex items-center gap-1 px-2.5 py-1 rounded-cute-full text-xs font-medium">
                              <CheckCheck className="w-3 h-3" /> Hoàn Tất
                            </span>
                          )}
                          {order.status === 'CANCELLED' && (
                            <span className="badge-cute inline-flex items-center gap-1 px-2.5 py-1 rounded-cute-full text-xs font-medium" style={{ background: 'linear-gradient(135deg, #fecdd3 0%, #fda4af 100%)', color: '#9f1239' }}>
                              <XCircle className="w-3 h-3" /> Đã Hủy
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="input-cute w-auto text-xs pr-8"
                          >
                            <option value="PENDING_PAYMENT">⏳ Chờ TT</option>
                            <option value="PAID">✅ Đã TT</option>
                            <option value="SHIPPED">🚚 Đang Giao</option>
                            <option value="COMPLETED">🎉 Hoàn Tất</option>
                            <option value="CANCELLED">❌ Hủy Đơn</option>
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

      {/* TAB 2: SERIES & INVENTORY - Cute */}
      {activeTab === 'SERIES' && (
        <div className="space-y-4 animate-pop-in">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-extrabold text-pink-800 text-gradient-cute flex items-center gap-2">
              <Package className="w-5 h-5" />
              Danh Mục Khay Blind Box (D1 Table <code className="bg-pink-100 text-pink-700 px-1.5 rounded text-xs font-mono">series</code>)
            </h3>
            <button
              onClick={() => setShowAddSeriesModal(true)}
              className="btn-cute-peach px-4 py-2 text-sm flex items-center gap-2 shadow-glow-peach"
            >
              <Plus className="w-4 h-4" />
              Thêm Series Mới Vào D1 ✨
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seriesList.map(series => (
              <div key={series.id} className="surface-cute-elevated p-4 space-y-3 border-2 border-pink-200/50 animate-pop-in" style={{ animationDelay: `${Math.random() * 100}ms` }}>
                <div className="flex gap-3 items-center">
                  <img
                    src={series.image_url}
                    alt={series.name}
                    className="w-16 h-16 rounded-cute-lg object-cover border-2 border-pink-200/50 img-frame-cute"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs uppercase font-bold text-pink-500 badge-cute px-2 py-0.5">
                      {series.brand}
                    </span>
                    <h4 className="text-sm font-extrabold text-pink-800 line-clamp-1 mt-1">{series.name}</h4>
                    <div className="text-sm font-extrabold text-gradient-peach mt-0.5 font-display">
                      {formatVND(series.price_per_box)}
                    </div>
                  </div>
                </div>

                <div className="surface-cute p-3 rounded-cute-lg border border-pink-200/50 flex justify-between items-center text-sm">
                  <span className="text-pink-500 flex items-center gap-1"><Box className="w-3.5 h-3.5" /> Số lượng hộp tồn:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStockChange(series, -1)}
                      className="btn-cute-ghost p-2 w-8 h-8"
                      disabled={series.remaining_boxes <= 0}
                    >
                      -
                    </button>
                    <span className="font-mono text-pink-700 font-bold w-16 text-center">{series.remaining_boxes} / {series.total_boxes}</span>
                    <button
                      onClick={() => handleStockChange(series, 1)}
                      className="btn-cute-ghost p-2 w-8 h-8"
                      disabled={series.remaining_boxes >= series.total_boxes}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleDeleteSeries(series.id)}
                    className="btn-cute-ghost px-3 py-1.5 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50/50 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Xóa series
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HALL OF FAME - Cute */}
      {activeTab === 'HALL_OF_FAME' && (
        <div className="space-y-4 animate-pop-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hallOfFame.map(item => (
              <div key={item.id} className="surface-cute-elevated p-4 rounded-cute-lg space-y-2.5 border-2 border-pink-200/50 animate-pop-in" style={{ animationDelay: `${Math.random() * 100}ms` }}>
                <div className="flex items-center gap-3">
                  <img
                    src={item.image_url}
                    alt={item.item_won}
                    className="w-12 h-12 rounded-cute-lg object-cover border-2 border-pink-200/50 img-frame-cute"
                  />
                  <div>
                    <h5 className="font-extrabold text-pink-800">{item.customer_name}</h5>
                    <span className="text-sm text-peach-500 font-medium flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      {item.item_won}
                    </span>
                  </div>
                </div>
                <p className="text-pink-600 italic surface-cute p-3 rounded-cute-lg border border-pink-200/50 text-sm">
                  “{item.comment}”
                </p>
                <div className="text-xs text-pink-400 flex justify-between">
                  <span className="flex items-center gap-1"><Box className="w-3 h-3" /> Hộp #{item.box_number} • {item.series_name}</span>
                  <span className="flex items-center gap-1"><WandSparkles className="w-3 h-3" /> {item.created_at}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SYSTEM STATUS - Cute */}
      {activeTab === 'SYSTEM' && (
        <div className="space-y-4 animate-pop-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="surface-cute-elevated p-5 rounded-cute-xl border-2 border-pink-200/50 text-center animate-bounce-cute">
              <div className="w-12 h-12 mx-auto mb-3 rounded-cute bg-cute-gradient flex items-center justify-center shadow-cute">
                <Wifi className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs uppercase font-bold text-pink-500 mb-1">Frontend CDN</div>
              <div className="text-lg font-extrabold text-pink-800">Cloudflare Pages</div>
              <div className="text-xs text-emerald-500 mt-2 font-mono flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active 💚
              </div>
            </div>

            <div className="surface-cute-elevated p-5 rounded-cute-xl border-2 border-pink-200/50 text-center animate-bounce-cute" style={{ animationDelay: '100ms' }}>
              <div className="w-12 h-12 mx-auto mb-3 rounded-cute bg-cute-peach flex items-center justify-center shadow-cute">
                <Server className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs uppercase font-bold text-pink-500 mb-1">Serverless Logic</div>
              <div className="text-lg font-extrabold text-pink-800">Cloudflare Workers</div>
              <div className="text-xs text-emerald-500 mt-2 font-mono flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active 💚
              </div>
            </div>

            <div className="surface-cute-elevated p-5 rounded-cute-xl border-2 border-pink-200/50 text-center animate-bounce-cute" style={{ animationDelay: '200ms' }}>
              <div className="w-12 h-12 mx-auto mb-3 rounded-cute bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-cute">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs uppercase font-bold text-pink-500 mb-1">Serverless DB</div>
              <div className="text-lg font-extrabold text-pink-800">Cloudflare D1 (SQLite)</div>
              <div className="text-xs text-emerald-500 mt-2 font-mono flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Connected (arttoy-db) 💚
              </div>
            </div>

            <div className="surface-cute-elevated p-5 rounded-cute-xl border-2 border-pink-200/50 text-center animate-bounce-cute" style={{ animationDelay: '300ms' }}>
              <div className="w-12 h-12 mx-auto mb-3 rounded-cute bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center shadow-cute">
                <HardDrive className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs uppercase font-bold text-pink-500 mb-1">KV Storage</div>
              <div className="text-lg font-extrabold text-pink-800">Cloudflare KV</div>
              <div className="text-xs text-emerald-500 mt-2 font-mono flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Cache & Session 💚
              </div>
            </div>

            <div className="surface-cute-elevated p-5 rounded-cute-xl border-2 border-pink-200/50 text-center animate-bounce-cute" style={{ animationDelay: '400ms' }}>
              <div className="w-12 h-12 mx-auto mb-3 rounded-cute bg-gradient-to-r from-lavender-500 to-purple-500 flex items-center justify-center shadow-cute">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs uppercase font-bold text-pink-500 mb-1">Vector Database</div>
              <div className="text-lg font-extrabold text-pink-800">Cloudflare Vectorize</div>
              <div className="text-xs text-emerald-500 mt-2 font-mono flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> RAG Search Ready 💚
              </div>
            </div>
          </div>

          {/* Cute Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="surface-cute p-5 rounded-cute-xl border-2 border-pink-200/50 text-center animate-pop-in">
              <div className="text-4xl mb-2">🔮</div>
              <h4 className="font-extrabold text-pink-700 mb-1">AI Gateway</h4>
              <p className="text-sm text-pink-500">Llama 3.1 8B Instruct via Workers AI</p>
              <span className="badge-cute-lavender inline-block mt-2">RAG Enabled</span>
            </div>
            <div className="surface-cute p-5 rounded-cute-xl border-2 border-pink-200/50 text-center animate-pop-in" style={{ animationDelay: '100ms' }}>
              <div className="text-4xl mb-2">⚡</div>
              <h4 className="font-extrabold text-pink-700 mb-1">VietQR Auto</h4>
              <p className="text-sm text-pink-500">Tự động sinh mã QR 24/7</p>
              <span className="badge-cute-peach inline-block mt-2">Napas 247</span>
            </div>
            <div className="surface-cute p-5 rounded-cute-xl border-2 border-pink-200/50 text-center animate-pop-in" style={{ animationDelay: '200ms' }}>
              <div className="text-4xl mb-2">🎯</div>
              <h4 className="font-extrabold text-pink-700 mb-1">Vector Search</h4>
              <p className="text-sm text-pink-500">Semantic similarity matching</p>
              <span className="badge-cute-mint inline-block mt-2">384-dim</span>
            </div>
          </div>
        </div>
      )}

      {/* Add Series Modal - Cute */}
      {showAddSeriesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-900/40 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md surface-cute-elevated rounded-cute-xl p-6 border-2 border-pink-300/50 space-y-4 animate-pop-in shadow-glow-pink">
            {/* Cute Floating Decorations */}
            <div className="absolute -top-3 -right-3 w-10 h-10 animate-bounce-cute pointer-events-none">
              <span className="text-3xl">🎀</span>
            </div>
            <div className="absolute -top-3 -left-3 w-8 h-8 animate-float-gentle pointer-events-none">
              <span className="text-2xl">✨</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-pink-200/50">
              <h3 className="text-lg font-extrabold text-pink-800 text-gradient-cute flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Thêm Series Hộp Mù Vào D1 ✨
              </h3>
              <button onClick={() => setShowAddSeriesModal(false)} className="btn-cute-ghost p-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSeries} className="space-y-3 text-sm">
              <div>
                <label className="text-xs font-semibold text-pink-600 block mb-1.5 flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5" />
                  Tên Series Art Toy:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: MOLLY Space Vol.3 Series 💖"
                  value={newSeriesName}
                  onChange={(e) => setNewSeriesName(e.target.value)}
                  className="input-cute"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-pink-600 block mb-1.5 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5" />
                    Thương hiệu:
                  </label>
                  <select
                    value={newSeriesBrand}
                    onChange={(e) => setNewSeriesBrand(e.target.value)}
                    className="input-cute"
                  >
                    <option value="Pop Mart">Pop Mart</option>
                    <option value="Crybaby">Crybaby</option>
                    <option value="Bandai">Bandai (Gundam)</option>
                    <option value="Finding Unicorn">Finding Unicorn</option>
                    <option value="Molly">Molly</option>
                    <option value="Dimoo">Dimoo</option>
                    <option value="Skullpanda">Skullpanda</option>
                    <option value="Hirono">Hirono</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-pink-600 block mb-1.5 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5" />
                    Giá 1 hộp (VNĐ):
                  </label>
                  <input
                    type="number"
                    required
                    value={newSeriesPrice}
                    onChange={(e) => setNewSeriesPrice(Number(e.target.value))}
                    className="input-cute"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-pink-600 block mb-1.5 flex items-center gap-1">
                  <Box className="w-3.5 h-3.5" />
                  Số lượng hộp trên 1 khay:
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={24}
                  value={newSeriesTotal}
                  onChange={(e) => setNewSeriesTotal(Number(e.target.value))}
                  className="input-cute"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-pink-600 block mb-1.5 flex items-center gap-1">
                  <WandSparkles className="w-3.5 h-3.5" />
                  Link Ảnh Sản Phẩm (URL):
                </label>
                <input
                  type="url"
                  required
                  value={newSeriesImage}
                  onChange={(e) => setNewSeriesImage(e.target.value)}
                  className="input-cute"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-pink-600 block mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Mô tả Series:
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Mô tả dễ thương về series này... 💖"
                  value={newSeriesDesc}
                  onChange={(e) => setNewSeriesDesc(e.target.value)}
                  className="input-cute resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSeriesModal(false)}
                  className="btn-cute-ghost px-4 py-2 text-sm"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-cute px-5 py-2 text-sm flex items-center gap-2 shadow-glow-pink"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Lưu Vào D1 💾
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};