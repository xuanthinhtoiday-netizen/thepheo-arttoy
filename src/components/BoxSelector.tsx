import React, { useState } from 'react';
import { Series } from '../types';
import { formatVND } from '../services/vietqr';
import { Sparkles, Box, Check, Bot, ShoppingBag, ArrowLeft, Zap, Gift } from 'lucide-react';

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

  // Mock occupied / opened boxes: if remaining is 8 out of 12, then 4 are already opened/sold
  const soldBoxesCount = Math.max(0, series.total_boxes - series.remaining_boxes);
  // deterministic mock sold boxes (e.g. box 2, 4, 8)
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
      // shuffle
      const shuffled = [...available].sort(() => 0.5 - Math.random());
      setSelectedBoxes(shuffled.slice(0, 3));
    }
  };

  const totalPrice = selectedBoxes.length * series.price_per_box;

  return (
    <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Top Breadcrumb & Title */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-purple-300 font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại Danh Mục Hộp Mù
      </button>

      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-purple-500/30">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-purple-900/40">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Khay Hộp Mù {series.total_boxes} Hộp • {series.brand}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {series.name}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Bấm chọn từng mã số hộp trên khay hoặc dùng các bộ Combo may mắn được Thầy Phẻo ấn định
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Đơn giá mở:</span>
            <span className="text-2xl font-black text-amber-400">
              {formatVND(series.price_per_box)}
              <span className="text-xs text-slate-400 font-normal"> / hộp</span>
            </span>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <span className="text-xs text-slate-400 font-semibold mr-1">Bộ gợi ý:</span>
          <button
            onClick={() => selectPreset('combo3')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedBoxes.length === 3
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-amber-300" />
            Combo 3 Hộp (Tam Hoa)
          </button>

          <button
            onClick={() => selectPreset('combo5')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedBoxes.length === 5
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-pink-400" />
            Combo 5 Hộp (Ngũ Hành)
          </button>

          <button
            onClick={() => selectPreset('fullbox')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 transition-all flex items-center gap-1.5"
          >
            <Box className="w-3.5 h-3.5 text-amber-400" />
            Bế Nguyên Thùng Full Box ({series.total_boxes} Hộp)
          </button>

          <button
            onClick={() => selectPreset('random')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-all"
          >
            🎲 Gắp Ngẫu Nhiên
          </button>

          <button
            onClick={() => onAskThePheoForLuckyBoxes(series)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-purple-900/60 text-purple-300 hover:bg-purple-800/60 border border-purple-500/40 transition-all flex items-center gap-1.5 ml-auto"
          >
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            Hỏi Thầy Phẻo Soi Vía Hộp Đẹp
          </button>
        </div>

        {/* Visual 12-Box Case Grid */}
        <div className="mt-8 bg-slate-950/70 p-6 rounded-3xl border border-purple-900/30">
          <div className="text-center mb-4">
            <span className="text-[11px] uppercase tracking-widest text-slate-500 font-mono">
              ★ MÔ PHỎNG KHAY NGUYÊN SEAL POP MART CHÍNH HÃNG ★
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
                  className={`relative aspect-[3/4] rounded-2xl p-3 flex flex-col justify-between items-center transition-all duration-200 select-none ${
                    isSold
                      ? 'bg-slate-900/40 border border-slate-800/50 opacity-40 cursor-not-allowed'
                      : isSelected
                      ? 'bg-gradient-to-b from-purple-900/80 to-purple-950/90 border-2 border-amber-400 shadow-xl shadow-purple-900/50 scale-105 cursor-pointer ring-2 ring-amber-400/30'
                      : 'bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/60 hover:border-purple-400/50 cursor-pointer hover:scale-102'
                  }`}
                >
                  {/* Top indicators */}
                  <div className="w-full flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      #{boxNum < 10 ? `0${boxNum}` : boxNum}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                    {isSold && (
                      <span className="text-[9px] uppercase font-bold text-slate-500 bg-slate-800 px-1 rounded">
                        Đã mở
                      </span>
                    )}
                  </div>

                  {/* Box visual icon / graphic */}
                  <div className="my-auto text-center">
                    <div className="text-3xl sm:text-4xl filter drop-shadow">
                      {isSold ? '📦' : isSelected ? '✨' : '🎁'}
                    </div>
                    <div className={`text-[11px] font-black mt-1 ${isSelected ? 'text-amber-300' : 'text-slate-300'}`}>
                      Hộp {boxNum}
                    </div>
                  </div>

                  {/* Status label at bottom */}
                  <div className="text-[10px] font-medium text-center">
                    {isSold ? (
                      <span className="text-slate-500">Đã bán</span>
                    ) : isSelected ? (
                      <span className="text-amber-400 font-bold">Đã chọn</span>
                    ) : (
                      <span className="text-emerald-400">Chưa khui</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Guide Legend */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-md bg-slate-900 border border-slate-700"></div>
              <span>Hộp sẵn sàng</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-md bg-purple-700 border border-amber-400"></div>
              <span className="text-amber-300 font-medium">Hộp bạn đã chọn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-md bg-slate-900 opacity-40 border border-slate-800"></div>
              <span className="text-slate-500">Đã có người khui trước</span>
            </div>
          </div>
        </div>

        {/* Bottom Checkout & Cart Action Bar */}
        <div className="mt-8 p-6 glass-panel rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xs text-slate-400">
              Đang chọn: <strong className="text-purple-300">{selectedBoxes.length} hộp</strong> ({selectedBoxes.map(b => `Hộp #${b}`).join(', ') || 'Chưa chọn'})
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xs text-slate-400">Tổng thanh toán:</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-400 tracking-wide">
                {formatVND(totalPrice)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {selectedBoxes.length > 0 && (
              <button
                onClick={() => onOpenGachaSimulator(series, selectedBoxes[0])}
                className="flex-1 md:flex-none px-4 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2"
              >
                <span>🎲</span>
                Mở Thử Hộp #{selectedBoxes[0]}
              </button>
            )}

            <button
              disabled={selectedBoxes.length === 0}
              onClick={() => onAddToCart(series, selectedBoxes)}
              className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              Thêm Giỏ Hàng
            </button>

            <button
              disabled={selectedBoxes.length === 0}
              onClick={() => onInstantCheckout(series, selectedBoxes)}
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              Chốt Đơn & Sinh Mã VietQR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
