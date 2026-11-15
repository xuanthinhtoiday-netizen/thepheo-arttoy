import React, { useState } from 'react';
import { Series, Order, HallOfFameItem, OrderStatus } from '../types';
import { formatVND } from '../services/vietqr';
import { storage } from '../services/storage';
import { 
  Package, ShoppingCart, Trophy, Plus, Trash2, 
  CheckCircle, Clock, Truck, CheckCheck, XCircle, Search, 
  Database, Server, CloudLightning 
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
          <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-1">
            Console & Database
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Quản Trị Hệ Thống D1
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Quản lý kho hàng Blind Box, đơn hàng từ AI và hạ tầng Cloudflare Serverless
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-1 bg-[#0b0e17] p-1 rounded-xl border border-white/[0.08]">
          <button
            onClick={() => setActiveTab('ORDERS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'ORDERS'
                ? 'bg-white text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Đơn Hàng ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('SERIES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'SERIES'
                ? 'bg-white text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Kho Hộp Mù ({seriesList.length})
          </button>

          <button
            onClick={() => setActiveTab('HALL_OF_FAME')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'HALL_OF_FAME'
                ? 'bg-white text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            Hall of Fame ({hallOfFame.length})
          </button>

          <button
            onClick={() => setActiveTab('SYSTEM')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'SYSTEM'
                ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CloudLightning className="w-3.5 h-3.5 text-emerald-400" />
            Hạ Tầng Cloudflare
          </button>
        </div>
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-4">
          <div className="surface-card p-3 rounded-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm mã đơn, tên, số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-white/25"
              />
            </div>

            <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto">
              {['ALL', 'PENDING_PAYMENT', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? 'bg-white text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
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

          <div className="surface-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#090b12] text-slate-400 font-semibold border-b border-white/[0.06] text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Mã Đơn</th>
                    <th className="p-3.5">Khách Hàng</th>
                    <th className="p-3.5">Hộp Đã Đặt</th>
                    <th className="p-3.5">Tổng Tiền</th>
                    <th className="p-3.5">Trạng Thái</th>
                    <th className="p-3.5 text-right">Cập Nhật</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        Không có đơn hàng nào khớp với tìm kiếm.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-3.5 font-mono text-white font-semibold">
                          {order.id}
                          <div className="text-[10px] text-slate-500 font-sans mt-0.5">{order.created_at || 'Mới tạo'}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-white">{order.customer_name || 'Khách vãng lai'}</div>
                          <div className="text-[11px] text-slate-400">{order.customer_phone || ''}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[200px]">{order.customer_address}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="text-slate-300 font-medium">{order.series_name || 'Combo'}</div>
                          <div className="text-[11px] text-amber-400 font-mono mt-0.5">
                            {JSON.parse(order.ordered_items_json || '[]').join(', ')}
                          </div>
                        </td>
                        <td className="p-3.5 font-bold text-amber-400 font-display">
                          {formatVND(order.total_amount)}
                        </td>
                        <td className="p-3.5">
                          {order.status === 'PENDING_PAYMENT' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-300">
                              Chờ Chuyển Khoản
                            </span>
                          )}
                          {order.status === 'PAID' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-300">
                              Đã Thanh Toán
                            </span>
                          )}
                          {order.status === 'SHIPPED' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-500/10 text-blue-300">
                              Đang Giao Hàng
                            </span>
                          )}
                          {order.status === 'COMPLETED' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300">
                              Hoàn Tất
                            </span>
                          )}
                          {order.status === 'CANCELLED' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-500/10 text-rose-300">
                              Đã Hủy
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
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

      {/* TAB 2: SERIES & INVENTORY */}
      {activeTab === 'SERIES' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Danh Mục Khay Blind Box (D1 Table `series`)</h3>
            <button
              onClick={() => setShowAddSeriesModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Thêm Series Mới Vào D1
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seriesList.map(series => (
              <div key={series.id} className="surface-card rounded-2xl p-4 space-y-3">
                <div className="flex gap-3 items-center">
                  <img
                    src={series.image_url}
                    alt={series.name}
                    className="w-14 h-14 rounded-xl object-cover border border-white/10"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {series.brand}
                    </span>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{series.name}</h4>
                    <div className="text-xs font-bold text-amber-400 mt-0.5 font-display">
                      {formatVND(series.price_per_box)}
                    </div>
                  </div>
                </div>

                <div className="bg-[#090b12] p-2.5 rounded-xl border border-white/[0.05] flex justify-between items-center text-xs">
                  <span className="text-slate-400">Số lượng hộp tồn:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStockChange(series, -1)}
                      className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <span className="font-mono text-white font-bold">{series.remaining_boxes} / {series.total_boxes}</span>
                    <button
                      onClick={() => handleStockChange(series, 1)}
                      className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleDeleteSeries(series.id)}
                    className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Xóa series
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HALL OF FAME */}
      {activeTab === 'HALL_OF_FAME' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hallOfFame.map(item => (
              <div key={item.id} className="surface-card p-4 rounded-xl space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.image_url}
                    alt={item.item_won}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <h5 className="font-semibold text-white">{item.customer_name}</h5>
                    <span className="text-[11px] text-amber-300">{item.item_won}</span>
                  </div>
                </div>
                <p className="text-slate-400 italic bg-[#090b12] p-2 rounded-lg text-[11px]">
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

      {/* TAB 4: SYSTEM STATUS */}
      {activeTab === 'SYSTEM' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="surface-card p-4 rounded-xl">
              <div className="text-[11px] uppercase font-bold text-slate-400 mb-1">Frontend CDN</div>
              <div className="text-sm font-bold text-white">Cloudflare Pages</div>
              <div className="text-xs text-emerald-400 mt-2 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active
              </div>
            </div>

            <div className="surface-card p-4 rounded-xl">
              <div className="text-[11px] uppercase font-bold text-slate-400 mb-1">Serverless Logic</div>
              <div className="text-sm font-bold text-white">Cloudflare Workers</div>
              <div className="text-xs text-emerald-400 mt-2 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active
              </div>
            </div>

            <div className="surface-card p-4 rounded-xl">
              <div className="text-[11px] uppercase font-bold text-slate-400 mb-1">Serverless DB</div>
              <div className="text-sm font-bold text-white">Cloudflare D1 (SQLite)</div>
              <div className="text-xs text-emerald-400 mt-2 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Connected (arttoy-db)
              </div>
            </div>

            <div className="surface-card p-4 rounded-xl">
              <div className="text-[11px] uppercase font-bold text-slate-400 mb-1">Media Storage</div>
              <div className="text-sm font-bold text-white">Cloudflare R2</div>
              <div className="text-xs text-emerald-400 mt-2 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> arttoy-media
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Series Modal */}
      {showAddSeriesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#0b0e17] rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white">Thêm Series Hộp Mù Vào D1</h3>
              <button onClick={() => setShowAddSeriesModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSeries} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Tên Series Art Toy:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: MOLLY Space Vol.3 Series"
                  value={newSeriesName}
                  onChange={(e) => setNewSeriesName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Thương hiệu:</label>
                  <select
                    value={newSeriesBrand}
                    onChange={(e) => setNewSeriesBrand(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                  >
                    <option value="Pop Mart">Pop Mart</option>
                    <option value="Crybaby">Crybaby</option>
                    <option value="Bandai">Bandai (Gundam)</option>
                    <option value="Finding Unicorn">Finding Unicorn</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Giá 1 hộp (VNĐ):</label>
                  <input
                    type="number"
                    required
                    value={newSeriesPrice}
                    onChange={(e) => setNewSeriesPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Số lượng hộp trên 1 khay:</label>
                <input
                  type="number"
                  required
                  value={newSeriesTotal}
                  onChange={(e) => setNewSeriesTotal(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Link Ảnh Sản Phẩm (R2 / URL):</label>
                <input
                  type="url"
                  required
                  value={newSeriesImage}
                  onChange={(e) => setNewSeriesImage(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSeriesModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-950 font-bold"
                >
                  Lưu Vào D1
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
