import React, { useState } from 'react';
import { Series } from '../types';
import { formatVND } from '../services/vietqr';
import { ArrowLeft, Check, ShoppingBag, Zap, Bot, Box } from 'lucide-react';

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
  const [selectedBoxes, setSelectedBoxes] = useState<number[]>([3, 7, 9]);

  const soldBoxesCount = Math.max(0, series.total_boxes - series.remaining_boxes);
  const soldBoxNumbers = [2, 4, 8, 12].slice(0, soldBoxesCount);

  const toggleBox = (boxNum: number) => {
    if (soldBoxNumbers.includes(boxNum)) return;
    if (selectedBoxes.includes(boxNum)) {
      setSelectedBoxes(selectedBoxes.filter(b => b !== boxNum));
    } else {
      setSelectedBoxes([...selectedBoxes, boxNum].sort((a, b) => a - b));
    }
  };

  const selectPreset = (type: 'combo3' | 'combo5' | 'fullbox' | 'random') => {
    const available = Array.from({ length: series.total_boxes }, (_, i) => i + 1)
      .filter(num => !soldBoxNumbers.includes(num));

    if (type === 'combo3') {
      setSelectedBoxes(available.slice(0, 3));
    } else if (type === 'combo5') {
      setSelectedBoxes(available.slice(0, 5));
    } else if (type === 'fullbox') {
      setSelectedBoxes(available);
    } else if (type === 'random') {
      const shuffled = [...available].sort(() => 0.5 - Math.random());
      setSelectedBoxes(shuffled.slice(0, 3));
    }
  };

  const totalPrice = selectedBoxes.length * series.price_per_box;

  return (
    <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại danh mục
      </button>

      <div className="surface-card rounded-3xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
              <span>{series.brand} Official</span>
              <span>•</span>
              <span className="text-amber-400">Khay {series.total_boxes} Hộp</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
              {series.name}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Chọn từng vị trí hộp trên khay hoặc áp dụng các bộ Combo được tối ưu xác suất
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 block">Đơn giá mở:</span>
            <span className="text-2xl font-black text-amber-400 font-display">
              {formatVND(series.price_per_box)}
              <span className="text-xs text-slate-500 font-normal"> / hộp</span>
            </span>
          </div>
        </div>

        {/* Combo Presets Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1">Bộ gợi ý:</span>
          
          <button
            onClick={() => selectPreset('combo3')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedBoxes.length === 3
                ? 'bg-white text-slate-950 font-bold shadow-sm'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-white/[0.08]'
            }`}
          >
            Combo 3 Hộp (Tam Hoa)
          </button>

          <button
            onClick={() => selectPreset('combo5')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedBoxes.length === 5
                ? 'bg-white text-slate-950 font-bold shadow-sm'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-white/[0.08]'
            }`}
          >
            Combo 5 Hộp (Ngũ Hành)
          </button>

          <button
            onClick={() => selectPreset('fullbox')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition-all"
          >
            Nguyên Thùng Full Box ({series.total_boxes} Hộp)
          </button>

          <button
            onClick={() => selectPreset('random')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-slate-400 hover:text-white border border-white/[0.08] transition-all"
          >
            Random 3 Hộp
          </button>

          <button
            onClick={() => onAskThePheoForLuckyBoxes(series)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] text-slate-300 hover:text-amber-300 border border-white/[0.08] transition-all flex items-center gap-1.5 ml-auto"
          >
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            Hỏi Thầy Phẻo Soi Vía Hộp
          </button>
        </div>

        {/* Visual 12-Box Acrylic Display Tray */}
        <div className="mt-8 bg-[#090b12] p-6 rounded-2xl border border-white/[0.08]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.05]">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">
              Khay Hộp Mù Niêm Phong Chuẩn Nhà Máy
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">
              Còn {series.remaining_boxes} hộp sẵn sàng
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
                  className={`relative aspect-[3/4] rounded-xl p-3 flex flex-col justify-between items-center transition-all duration-200 select-none ${
                    isSold
                      ? 'bg-slate-900/40 border border-white/[0.04] opacity-35 cursor-not-allowed'
                      : isSelected
                      ? 'bg-[#181d2e] border-2 border-amber-400 shadow-md scale-102 cursor-pointer'
                      : 'bg-slate-900 hover:bg-slate-850 border border-white/[0.08] hover:border-white/20 cursor-pointer'
                  }`}
                >
                  {/* Top Pod Header */}
                  <div className="w-full flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      #{boxNum < 10 ? `0${boxNum}` : boxNum}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  {/* Minimal Geometric Box Graphic */}
                  <div className="my-auto text-center">
                    <div className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center border transition-colors ${
                      isSelected
                        ? 'bg-amber-400/10 border-amber-400/50 text-amber-300'
                        : isSold
                        ? 'bg-slate-800 border-transparent text-slate-600'
                        : 'bg-slate-800/80 border-white/[0.06] text-slate-400'
                    }`}>
                      <Box className="w-5 h-5" />
                    </div>
                    <div className={`text-xs font-bold mt-2 font-display ${isSelected ? 'text-amber-300' : 'text-slate-300'}`}>
                      Hộp {boxNum}
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="text-[10px] font-medium text-center">
                    {isSold ? (
                      <span className="text-slate-600">Đã mở</span>
                    ) : isSelected ? (
                      <span className="text-amber-400 font-bold">Đã chọn</span>
                    ) : (
                      <span className="text-slate-400">Có sẵn</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Guide Legend */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 border-t border-white/[0.05] pt-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-slate-900 border border-white/20"></div>
              <span>Hộp có sẵn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#181d2e] border border-amber-400"></div>
              <span className="text-amber-300 font-medium">Hộp bạn chọn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-slate-900 opacity-40"></div>
              <span>Đã bán / Đã mở</span>
            </div>
          </div>
        </div>

        {/* Bottom Checkout & Action Bar */}
        <div className="mt-8 p-5 bg-[#090b12] rounded-2xl border border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xs text-slate-400">
              Đang chọn: <strong className="text-white font-mono">{selectedBoxes.length} hộp</strong> ({selectedBoxes.map(b => `#${b}`).join(', ') || 'Chưa chọn'})
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xs text-slate-500">Tổng thanh toán:</span>
              <span className="text-2xl font-black text-amber-400 font-display">
                {formatVND(totalPrice)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {selectedBoxes.length > 0 && (
              <button
                onClick={() => onOpenGachaSimulator(series, selectedBoxes[0])}
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 text-xs font-semibold transition-all"
              >
                Mở Thử Hộp #{selectedBoxes[0]}
              </button>
            )}

            <button
              disabled={selectedBoxes.length === 0}
              onClick={() => onAddToCart(series, selectedBoxes)}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-slate-200 border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Thêm Giỏ Hàng
            </button>

            <button
              disabled={selectedBoxes.length === 0}
              onClick={() => onInstantCheckout(series, selectedBoxes)}
              className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-white hover:bg-slate-200 disabled:opacity-50 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Zap className="w-4 h-4" />
              Chốt Đơn & Sinh Mã VietQR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
