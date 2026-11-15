import React from 'react';
import { Series } from '../types';
import { formatVND } from '../services/vietqr';
import { X, Sparkles, Box, ShieldCheck, Flame, Bot } from 'lucide-react';

interface SeriesDetailModalProps {
  series: Series | null;
  onClose: () => void;
  onSelectForBoxPicker: (series: Series) => void;
  onAskAi: (series: Series) => void;
}

export const SeriesDetailModal: React.FC<SeriesDetailModalProps> = ({
  series,
  onClose,
  onSelectForBoxPicker,
  onAskAi,
}) => {
  if (!series) return null;

  const normalItems = series.items?.filter(it => !it.is_secret) || [];
  const secretItems = series.items?.filter(it => it.is_secret) || [];
  const fullCasePrice = series.price_per_box * series.total_boxes;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl glass-panel-glow rounded-3xl overflow-hidden max-h-[90vh] flex flex-col border border-purple-500/30">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-purple-900/40 flex items-center justify-between bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-600/20 border border-purple-500/30">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold text-purple-400 tracking-wider">
                {series.brand} • Chi Tiết Tỷ Lệ Drop
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {series.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Banner & Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1 rounded-2xl overflow-hidden h-44 bg-slate-800">
              <img
                src={series.image_url}
                alt={series.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="sm:col-span-2 flex flex-col justify-between">
              <div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {series.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-purple-900/50 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                    Quy cách: Khay {series.total_boxes} hộp
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                    Còn {series.remaining_boxes} hộp chưa mở
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Giá mở lẻ 1 hộp:</div>
                  <div className="text-lg font-black text-amber-400">
                    {formatVND(series.price_per_box)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Giá nguyên khay Full Box:</div>
                  <div className="text-base font-bold text-slate-200">
                    {formatVND(fullCasePrice)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secret Items Highlight Section */}
          {secretItems.length > 0 && (
            <div className="glass-gold-glow p-4 rounded-2xl border border-amber-500/40">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm mb-3">
                <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                NHÂN VẬT ẨN ĐỘC BẢN (SECRET CHASE - CỰC HIẾM)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {secretItems.map(item => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-black/40 border border-amber-500/30 flex items-center gap-3.5"
                  >
                    <img
                      src={item.image_url}
                      alt={item.item_name}
                      className="w-14 h-14 rounded-xl object-cover border border-amber-400/50"
                    />
                    <div>
                      <div className="text-xs font-black text-amber-300">{item.item_name}</div>
                      <div className="text-[11px] text-pink-300 font-mono mt-0.5">
                        Tỉ lệ xuất hiện: <strong>{item.drop_probability}%</strong> (1/144)
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Giá trị sưu tầm x5 đến x10 giá hộp gốc
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Items Breakdown */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Các Nhân Vật Cơ Bản Trong Series (Tỉ Lệ Đồng Đều ~8.25%/mẫu):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {normalItems.map(item => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5"
                >
                  <img
                    src={item.image_url}
                    alt={item.item_name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold text-slate-200 truncate">
                      {item.item_name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Xác suất: {item.drop_probability}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 border-t border-purple-900/40 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onAskAi(series);
            }}
            className="px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all flex items-center gap-2"
          >
            <Bot className="w-4 h-4 text-amber-400" />
            Nhờ Thầy Phẻo Soi Vía Hộp Số
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                onClose();
                onSelectForBoxPicker(series);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2"
            >
              <Box className="w-4 h-4 text-amber-300" />
              Chọn Hộp & Bốc Ngay (1-12)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
