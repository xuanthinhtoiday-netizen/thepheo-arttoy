import React from 'react';
import { Series } from '../types';
import { formatVND } from '../services/vietqr';
import { X, Sparkles, Box, Bot } from 'lucide-react';

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
      <div className="relative w-full max-w-2xl bg-[#0b0e17] rounded-2xl overflow-hidden max-h-[90vh] flex flex-col border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#080a12]">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {series.brand} • Chi Tiết Xác Suất Drop
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              {series.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Banner & Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1 rounded-xl overflow-hidden h-36 bg-slate-900">
              <img
                src={series.image_url}
                alt={series.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="sm:col-span-2 flex flex-col justify-between">
              <div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {series.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-300">
                    Khay: {series.total_boxes} hộp
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400">
                    Còn {series.remaining_boxes} hộp chưa mở
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500">Giá lẻ 1 hộp:</div>
                  <div className="text-base font-black text-amber-400 font-display">
                    {formatVND(series.price_per_box)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">Giá nguyên khay:</div>
                  <div className="text-sm font-bold text-slate-200 font-display">
                    {formatVND(fullCasePrice)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secret Items Highlight Section */}
          {secretItems.length > 0 && (
            <div className="surface-gold p-4 rounded-xl border border-amber-500/30">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Nhân Vật Ẩn (Secret Chase 1/144)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {secretItems.map(item => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-lg bg-black/40 border border-amber-500/20 flex items-center gap-3"
                  >
                    <img
                      src={item.image_url}
                      alt={item.item_name}
                      className="w-12 h-12 rounded-lg object-cover border border-amber-400/40"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{item.item_name}</div>
                      <div className="text-[11px] text-amber-300 font-mono mt-0.5">
                        Xác suất: <strong>{item.drop_probability}%</strong> (1/144)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Items Breakdown */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Các Mẫu Cơ Bản Trong Khay (Đồng đều ~8.25%/mẫu):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {normalItems.map(item => (
                <div
                  key={item.id}
                  className="p-2 rounded-lg bg-slate-900 border border-white/[0.05] flex items-center gap-2.5"
                >
                  <img
                    src={item.image_url}
                    alt={item.item_name}
                    className="w-8 h-8 rounded-md object-cover"
                  />
                  <div className="overflow-hidden">
                    <div className="text-xs font-medium text-slate-200 truncate">
                      {item.item_name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {item.drop_probability}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#080a12] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onAskAi(series);
            }}
            className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-amber-300 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Bot className="w-3.5 h-3.5" />
            Hỏi Thầy Phẻo Soi Hộp
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-slate-400 text-xs hover:text-white"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                onClose();
                onSelectForBoxPicker(series);
              }}
              className="px-5 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Box className="w-3.5 h-3.5" />
              Chọn Hộp & Bốc (1-12)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
