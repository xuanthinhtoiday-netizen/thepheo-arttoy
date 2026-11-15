import React, { useState } from 'react';
import { Series } from '../types';
import { formatVND } from '../services/vietqr';
import { storage } from '../services/storage';
import { ArrowLeft, Check, ShoppingBag, Zap, Bot, Box, Heart, Star, WandSparkles, Sparkles, Gift, Crown } from 'lucide-react';

interface BoxSelectorProps {
  series: Series;
  onBack: () => void;
  onAddToCart: (series: Series, selectedBoxes: number[]) => void;
  onInstantCheckout: (series: Series, selectedBoxes: number[]) => void;
  onOpenGachaSimulator: (series: Series, boxNumber: number) => void;
  onAskThePheoForLuckyBoxes: (series: Series) => void;
}

export const BoxSelector: React.FC<BoxSelectorProps> = ({
  series,
  onBack,
  onAddToCart,
  onInstantCheckout,
  onOpenGachaSimulator,
  onAskThePheoForLuckyBoxes,
}) => {
  // Read actual persisted sold boxes for this specific series
  const soldBoxNumbers = storage.getSoldBoxes(series.id, series.total_boxes - series.remaining_boxes, series.total_boxes);

  // Available boxes that are not yet sold
  const availableBoxes = Array.from({ length: series.total_boxes }, (_, i) => i + 1)
    .filter(num => !soldBoxNumbers.includes(num));

  // Initialize with first 3 available boxes
  const [selectedBoxes, setSelectedBoxes] = useState<number[]>(() => availableBoxes.slice(0, 3));

  const toggleBox = (boxNum: number) => {
    if (soldBoxNumbers.includes(boxNum)) return;
    if (selectedBoxes.includes(boxNum)) {
      setSelectedBoxes(selectedBoxes.filter(b => b !== boxNum));
    } else {
      setSelectedBoxes([...selectedBoxes, boxNum].sort((a, b) => a - b));
    }
  };

  const selectPreset = (type: 'combo3' | 'combo5' | 'fullbox' | 'random') => {
    if (type === 'combo3') {
      setSelectedBoxes(availableBoxes.slice(0, 3));
    } else if (type === 'combo5') {
      setSelectedBoxes(availableBoxes.slice(0, 5));
    } else if (type === 'fullbox') {
      setSelectedBoxes(availableBoxes);
    } else if (type === 'random') {
      const shuffled = [...availableBoxes].sort(() => 0.5 - Math.random());
      setSelectedBoxes(shuffled.slice(0, 3).sort((a, b) => a - b));
    }
  };

  const totalPrice = selectedBoxes.length * series.price_per_box;

  return (
    <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Cute Floating Decorations */}
      <div className="hidden lg:block absolute top-10 -left-5 w-12 h-12 animate-float-gentle pointer-events-none">
        <span className="text-5xl">🎀</span>
      </div>
      <div className="hidden lg:block absolute top-20 -right-5 w-10 h-10 animate-float-gentle pointer-events-none" style={{ animationDelay: '1s' }}>
        <span className="text-4xl">✨</span>
      </div>

      {/* Back button - Cute */}
      <button
        onClick={onBack}
        className="btn-cute-ghost inline-flex items-center gap-2 text-sm font-semibold mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại danh mục
      </button>

      <div className="surface-cute-elevated p-6 sm:p-8 animate-pop-in">
        {/* Header - Cute */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-pink-200/50">
          <div>
            <div className="flex items-center gap-2 text-pink-500 text-xs font-medium uppercase tracking-wider mb-2">
              <Crown className="w-3 h-3" />
              <span>{series.brand} Official</span>
              <span className="text-pink-300">•</span>
              <span className="text-peach-500">Khay {series.total_boxes} Hộp 🎁</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-pink-800 text-gradient-cute">
              {series.name}
            </h2>
            <p className="text-pink-500 text-sm mt-2">
              Chọn từng vị trí hộp trên khay hoặc áp dụng các bộ Combo được tối ưu xác suất! 💖
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-pink-400 block">Đơn giá mở:</span>
            <span className="text-2xl font-extrabold text-gradient-peach font-display">
              {formatVND(series.price_per_box)}
              <span className="text-xs text-pink-400 font-normal"> / hộp</span>
            </span>
          </div>
        </div>

        {/* Combo Presets Bar - Cute */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs text-pink-400 font-medium mr-1">Bộ gợi ý: 💡</span>

          <button
            onClick={() => selectPreset('combo3')}
            className={`btn-cute px-4 py-2 text-sm rounded-cute transition-all ${
              selectedBoxes.length === 3 ? 'animate-heartbeat' : ''
            }`}
          >
            <Heart className="w-4 h-4" />
            Combo 3 Hộp (Tam Hoa)
          </button>

          <button
            onClick={() => selectPreset('combo5')}
            className={`btn-cute-peach px-4 py-2 text-sm rounded-cute transition-all ${
              selectedBoxes.length === 5 ? 'animate-heartbeat' : ''
            }`}
          >
            <Star className="w-4 h-4" />
            Combo 5 Hộp (Ngũ Hành)
          </button>

          <button
            onClick={() => selectPreset('fullbox')}
            className="btn-cute-lavender px-4 py-2 text-sm rounded-cute transition-all"
          >
            <Gift className="w-4 h-4" />
            Nguyên Thùng ({availableBoxes.length} Hộp Còn Lại)
          </button>

          <button
            onClick={() => selectPreset('random')}
            className="btn-cute-mint px-4 py-2 text-sm rounded-cute transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Random 3 Hộp
          </button>

          <button
            onClick={() => onAskThePheoForLuckyBoxes(series)}
            className="btn-cute px-4 py-2 text-sm rounded-cute flex items-center gap-2 ml-auto shadow-glow-pink"
          >
            <WandSparkles className="w-4 h-4 animate-wiggle" />
            Hỏi Thầy Phẻo Soi Vía 🔮
            <Sparkles className="w-4 h-4 animate-bounce-cute" />
          </button>
        </div>

        {/* Visual 12-Box Cute Acrylic Display Tray */}
        <div className="mt-8 bg-white/50 p-6 rounded-cute-lg border-2 border-pink-200/50 shadow-inner-cute">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-pink-200/50">
            <span className="text-sm uppercase tracking-wider text-pink-500 font-mono">
              <WandSparkles className="w-3 h-3 inline mr-1" />
              Khay Hộp Mù Niêm Phong Chuẩn Nhà Máy
            </span>
            <span className="text-sm text-emerald-500 font-mono flex items-center gap-1">
              <Heart className="w-3 h-3 animate-heartbeat" />
              Còn {availableBoxes.length} hộp sẵn sàng ({soldBoxNumbers.length} đã mở)
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: series.total_boxes }, (_, i) => i + 1).map((boxNum) => {
              const isSold = soldBoxNumbers.includes(boxNum);
              const isSelected = selectedBoxes.includes(boxNum);

              return (
                <div
                  key={boxNum}
                  onClick={() => toggleBox(boxNum)}
                  className={`relative aspect-[3/4] rounded-cute p-3 flex flex-col justify-between items-center transition-all duration-300 select-none animate-pop-in ${
                    isSold
                      ? 'bg-pink-50/50 border border-pink-200/50 opacity-50 cursor-not-allowed'
                      : isSelected
                      ? 'bg-white border-2 border-pink-400 shadow-cute-lg scale-102 cursor-pointer animate-heartbeat'
                      : 'bg-white/80 hover:bg-white border border-pink-200/50 hover:border-pink-400/50 hover:shadow-cute cursor-pointer'
                  }`}
                  style={{ animationDelay: `${boxNum * 30}ms` }}
                >
                  {/* Top Pod Header */}
                  <div className="w-full flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-pink-500">
                      #{boxNum < 10 ? `0${boxNum}` : boxNum}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white flex items-center justify-center text-xs font-black shadow-cute animate-pop-in">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                    {isSold && (
                      <span className="w-5 h-5 rounded-full bg-pink-200/50 text-pink-400 flex items-center justify-center text-xs">
                        <Gift className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  {/* Cute Geometric Box Graphic */}
                  <div className="my-auto text-center">
                    <div className={`w-12 h-12 mx-auto rounded-cute flex items-center justify-center border transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-br from-pink-100 to-rose-100 border-pink-400/50 text-pink-500 shadow-cute'
                        : isSold
                        ? 'bg-pink-50/50 border-transparent text-pink-300'
                        : 'bg-white/80 border-pink-200/50 text-pink-400 hover:bg-pink-50 hover:border-pink-300/50'
                    }`}>
                      <Box className="w-6 h-6" />
                    </div>
                    <div className={`text-xs font-bold mt-2 font-display ${isSelected ? 'text-pink-600' : 'text-pink-500'}`}>
                      Hộp {boxNum}
                    </div>
                  </div>

                  {/* Status Indicator - Cute */}
                  <div className="text-xs font-medium text-center">
                    {isSold ? (
                      <span className="text-pink-300">Đã mở 🎁</span>
                    ) : isSelected ? (
                      <span className="text-pink-600 font-bold animate-heartbeat">Đã chọn 💖</span>
                    ) : (
                      <span className="text-pink-400">Có sẵn ✨</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Guide Legend - Cute */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-pink-500 border-t border-pink-200/50 pt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-white border border-pink-200/50"></div>
              <span>Hộp có sẵn ✨</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-pink-100 to-rose-100 border border-pink-400/50"></div>
              <span className="text-pink-600 font-medium">Hộp bạn chọn 💖</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-pink-50/50 opacity-50"></div>
              <span>Đã bán / Đã mở 🎁</span>
            </div>
          </div>
        </div>

        {/* Bottom Checkout & Action Bar - Cute */}
        <div className="mt-8 p-5 bg-white/50 rounded-cute-lg border-2 border-pink-200/50 shadow-inner-cute flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-sm text-pink-500">
              Đang chọn: <strong className="text-pink-700 font-mono">{selectedBoxes.length} hộp</strong> ({selectedBoxes.map(b => `#${b}`).join(', ') || 'Chưa chọn'})
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-sm text-pink-400">Tổng thanh toán:</span>
              <span className="text-2xl font-extrabold text-gradient-peach font-display">
                {formatVND(totalPrice)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {selectedBoxes.length > 0 && (
              <button
                onClick={() => onOpenGachaSimulator(series, selectedBoxes[0])}
                className="btn-cute-outline flex-1 md:flex-none px-4 py-3 text-sm flex items-center justify-center gap-2"
              >
                <Gift className="w-4 h-4" />
                Mở Thử Hộp #{selectedBoxes[0]} 🎲
              </button>
            )}

            <button
              disabled={selectedBoxes.length === 0}
              onClick={() => onAddToCart(series, selectedBoxes)}
              className="btn-cute flex-1 md:flex-none px-5 py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              Thêm Giỏ Hàng 🛍️
            </button>

            <button
              disabled={selectedBoxes.length === 0}
              onClick={() => onInstantCheckout(series, selectedBoxes)}
              className="btn-cute-peach w-full md:w-auto px-6 py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-glow-peach"
            >
              <Zap className="w-4 h-4" />
              Chốt Đơn & Sinh Mã VietQR ⚡
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};