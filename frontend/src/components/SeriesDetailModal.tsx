import React from 'react';
import { Series } from '../types';
import { formatVND } from '../services/vietqr';
import { X, Sparkles, Box, Bot, Heart, Star, Crown, WandSparkles, Gift, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-900/40 backdrop-blur-md animate-fade-in">
      {/* Cute Floating Decorations */}
      <div className="hidden lg:block absolute top-10 -left-5 w-12 h-12 animate-float-gentle pointer-events-none">
        <span className="text-5xl">🎀</span>
      </div>
      <div className="hidden lg:block absolute top-20 -right-5 w-10 h-10 animate-float-gentle pointer-events-none" style={{ animationDelay: '1s' }}>
        <span className="text-4xl">✨</span>
      </div>

      <div className="relative w-full max-w-2xl surface-cute-elevated rounded-cute-xl overflow-hidden max-h-[90vh] flex flex-col border-2 border-pink-300/50 shadow-glow-pink animate-pop-in">
        {/* Header - Cute */}
        <div className="p-4 sm:p-5 border-b border-pink-200/50 flex items-center justify-between bg-cute-gradient/50">
          <div>
            <span className="text-xs uppercase font-bold text-pink-500 tracking-wider">
              {series.brand} • Chi Tiết Xác Suất Drop 📊
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-pink-800 mt-1 text-gradient-cute">
              {series.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="btn-cute-ghost p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content - Cute */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Banner & Overview - Cute */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1 rounded-cute-lg overflow-hidden h-36 bg-cute-gradient img-frame-cute">
              <img
                src={series.image_url}
                alt={series.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="sm:col-span-2 flex flex-col justify-between">
              <div>
                <p className="text-pink-600 text-sm leading-relaxed">
                  {series.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="tag-cute">
                    <Gift className="w-3 h-3" />
                    Khay: {series.total_boxes} hộp
                  </span>
                  <span className="tag-cute" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', borderColor: 'rgba(34, 197, 94, 0.3)', color: '#16653d' }}>
                    <Heart className="w-3 h-3" />
                    Còn {series.remaining_boxes} hộp chưa mở
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-pink-200/50 flex items-center justify-between">
                <div>
                  <div className="text-xs text-pink-400">Giá lẻ 1 hộp:</div>
                  <div className="text-xl font-extrabold text-gradient-peach font-display">
                    {formatVND(series.price_per_box)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-pink-400">Giá nguyên khay:</div>
                  <div className="text-lg font-extrabold text-pink-700 font-display">
                    {formatVND(fullCasePrice)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secret Items Highlight Section - Cute */}
          {secretItems.length > 0 && (
            <div className="surface-cute-elevated p-5 rounded-cute-xl border-2 border-rose-300/50 bg-gradient-to-r from-rose-50 to-pink-50 animate-heartbeat">
              <div className="flex items-center gap-2 text-rose-600 font-extrabold text-xs uppercase tracking-wider mb-3">
                <Sparkles className="w-4 h-4 animate-bounce-cute" />
                Nhân Vật Ẩn (Secret Chase 1/144)
                <Sparkles className="w-4 h-4 animate-bounce-cute" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {secretItems.map(item => (
                  <div
                    key={item.id}
                    className="surface-cute p-3 rounded-cute-lg border-2 border-rose-300/50 flex items-center gap-3 animate-pop-in"
                    style={{ animationDelay: `${Math.random() * 200}ms` }}
                  >
                    <img
                      src={item.image_url}
                      alt={item.item_name}
                      className="w-14 h-14 rounded-cute-lg object-cover border-2 border-rose-400/50"
                    />
                    <div>
                      <div className="text-sm font-extrabold text-pink-800">{item.item_name}</div>
                      <div className="text-xs text-rose-600 font-mono mt-0.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 animate-bounce-cute" />
                        Xác suất: <strong>{item.drop_probability}%</strong> (1/144)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Items Breakdown - Cute */}
          <div>
            <h4 className="text-xs font-extrabold text-pink-500 uppercase tracking-wider mb-3 flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" />
              Các Mẫu Cơ Bản Trong Khay (Đồng đều ~8.25%/mẫu):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {normalItems.map(item => (
                <div
                  key={item.id}
                  className="surface-cute p-2.5 rounded-cute-lg border border-pink-200/50 flex items-center gap-2.5 animate-pop-in"
                  style={{ animationDelay: `${Math.random() * 150}ms` }}
                >
                  <img
                    src={item.image_url}
                    alt={item.item_name}
                    className="w-10 h-10 rounded-cute object-cover border border-pink-200/50"
                  />
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold text-pink-700 truncate">
                      {item.item_name}
                    </div>
                    <div className="text-[10px] text-pink-400 font-mono flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 text-yellow-400" />
                      {item.drop_probability}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cute Feature Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="tag-cute"><WandSparkles className="w-3 h-3" /> Vector DB Search</span>
            <span className="tag-cute"><ShieldCheck className="w-3 h-3" /> KV Cache</span>
            <span className="tag-cute"><Bot className="w-3 h-3" /> AI RAG Chat</span>
            <span className="tag-cute"><Zap className="w-3 h-3" /> VietQR Auto</span>
          </div>
        </div>

        {/* Modal Actions Footer - Cute */}
        <div className="p-4 border-t border-pink-200/50 bg-cute-gradient/50 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onAskAi(series);
            }}
            className="btn-cute-lavender px-4 py-2.5 text-sm flex items-center gap-2"
          >
            <WandSparkles className="w-4 h-4 animate-wiggle" />
            Hỏi Thầy Phẻo Soi Hộp 🔮
            <Sparkles className="w-4 h-4 animate-bounce-cute" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="btn-cute-ghost px-4 py-2.5 text-sm"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                onClose();
                onSelectForBoxPicker(series);
              }}
              className="btn-cute-peach px-5 py-2.5 text-sm flex items-center gap-2 shadow-glow-peach"
            >
              <Box className="w-4 h-4" />
              Chọn Hộp & Bốc (1-12) 🎯
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};