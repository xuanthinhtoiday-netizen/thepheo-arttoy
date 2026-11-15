import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Series, SeriesItem } from '../types';
import { Trophy, ArrowRight, RotateCcw, Box, Sparkles } from 'lucide-react';
import { storage } from '../services/storage';

interface UnboxSimulatorProps {
  seriesList: Series[];
  initialSeries?: Series;
  initialBoxNumber?: number;
  onClose: () => void;
  onAddToCart: (series: Series, boxes: number[]) => void;
}

export const UnboxSimulator: React.FC<UnboxSimulatorProps> = ({
  seriesList,
  initialSeries,
  initialBoxNumber = 7,
  onClose,
  onAddToCart,
}) => {
  const [selectedSeries, setSelectedSeries] = useState<Series>(initialSeries || seriesList[0]);
  const [boxNumber, setBoxNumber] = useState<number>(initialBoxNumber);
  const [state, setState] = useState<'IDLE' | 'UNBOXING' | 'REVEALED'>('IDLE');
  const [revealedItem, setRevealedItem] = useState<SeriesItem | null>(null);
  const [feedbackShared, setFeedbackShared] = useState(false);

  const startUnboxing = () => {
    setState('UNBOXING');
    setRevealedItem(null);
    setFeedbackShared(false);

    setTimeout(() => {
      const items = selectedSeries.items || [];
      const secretItem = items.find(i => i.is_secret);

      const roll = Math.random() * 100;
      let wonItem: SeriesItem;

      if (secretItem && roll < 20) {
        wonItem = secretItem;
        triggerSecretFireworks();
      } else {
        const normalItems = items.filter(i => !i.is_secret);
        wonItem = normalItems[Math.floor(Math.random() * normalItems.length)] || items[0];
        triggerNormalConfetti();
      }

      setRevealedItem(wonItem);
      setState('REVEALED');
    }, 2000);
  };

  const triggerSecretFireworks = () => {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#e5b869', '#ffffff', '#6366f1']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#e5b869', '#ffffff', '#6366f1']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const triggerNormalConfetti = () => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const shareToHallOfFame = () => {
    if (!revealedItem) return;
    storage.addHallOfFame({
      customer_name: 'Collector Guest',
      series_name: selectedSeries.name,
      item_won: revealedItem.item_name,
      is_secret: revealedItem.is_secret,
      box_number: boxNumber,
      comment: revealedItem.is_secret 
        ? `Nổ Secret hộp #${boxNumber}! Vía Thầy Phẻo chuẩn không cần chỉnh!`
        : `Mở trúng ${revealedItem.item_name} hoàn thiện rất đẹp, chuẩn Pop Mart!`,
      image_url: revealedItem.image_url
    });
    setFeedbackShared(true);
  };

  return (
    <div className="py-10 max-w-3xl mx-auto px-4 sm:px-6 animate-fade-in">
      <div className="surface-card rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden">
        {/* Header */}
        <div className="max-w-md mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-300 text-xs font-medium mb-3">
            <span>Blind Box Experience</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Unbox Simulator
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Mô phỏng trải nghiệm xé niêm phong, mở túi bạc và chiêm ngưỡng tác phẩm nghệ thuật bên trong
          </p>
        </div>

        {/* Series and Box pickers */}
        {state === 'IDLE' && (
          <div className="max-w-md mx-auto bg-[#090b12] p-4 rounded-xl border border-white/[0.08] mb-8 flex flex-col sm:flex-row gap-3 text-left">
            <div className="flex-1">
              <label className="text-[11px] text-slate-400 font-medium block mb-1">
                Chọn Series:
              </label>
              <select
                value={selectedSeries.id}
                onChange={(e) => {
                  const s = seriesList.find(x => x.id === e.target.value);
                  if (s) setSelectedSeries(s);
                }}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
              >
                {seriesList.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.brand})</option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-32">
              <label className="text-[11px] text-slate-400 font-medium block mb-1">
                Số Hộp:
              </label>
              <select
                value={boxNumber}
                onChange={(e) => setBoxNumber(Number(e.target.value))}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
              >
                {Array.from({ length: selectedSeries.total_boxes }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>Hộp #{n < 10 ? `0${n}` : n}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Unbox Stage */}
        <div className="my-6 flex flex-col items-center justify-center min-h-[260px]">
          {state === 'IDLE' && (
            <div className="space-y-4">
              <div 
                onClick={startUnboxing}
                className="w-40 h-44 mx-auto rounded-2xl bg-gradient-to-b from-[#181d2e] to-[#0f121d] border border-white/15 hover:border-amber-400/50 p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-103 shadow-md"
              >
                <Box className="w-12 h-12 text-amber-300 mb-2" />
                <span className="text-xs font-bold text-white font-display">
                  Hộp #{boxNumber}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {selectedSeries.brand}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Nhấn vào hộp để bắt đầu khui
              </p>
            </div>
          )}

          {state === 'UNBOXING' && (
            <div className="space-y-3">
              <div className="w-40 h-44 mx-auto rounded-2xl bg-[#141829] border border-amber-400/50 p-4 flex flex-col items-center justify-center shadow-md animate-pulse">
                <Box className="w-12 h-12 text-amber-400 animate-bounce" />
                <span className="text-xs font-bold text-amber-300 mt-3 font-display">
                  Đang mở niêm phong...
                </span>
              </div>
            </div>
          )}

          {state === 'REVEALED' && revealedItem && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-5 rounded-2xl max-w-xs mx-auto surface-elevated border border-white/15">
                {revealedItem.is_secret ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider mb-3">
                    <Sparkles className="w-3 h-3 text-slate-950" />
                    SECRET CHASE 1/144
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/[0.06] text-slate-300 text-[10px] font-semibold mb-3">
                    Nhân Vật Cơ Bản
                  </div>
                )}

                <div className="w-40 h-40 mx-auto rounded-xl overflow-hidden bg-slate-900 border border-white/10 shadow-sm">
                  <img
                    src={revealedItem.image_url}
                    alt={revealedItem.item_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="mt-3">
                  <h3 className={`text-base font-bold ${revealedItem.is_secret ? 'text-amber-300' : 'text-white'}`}>
                    {revealedItem.item_name}
                  </h3>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {selectedSeries.name} • Hộp #{boxNumber}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06]">
                  {feedbackShared ? (
                    <span className="text-xs text-emerald-400 font-medium flex items-center justify-center gap-1">
                      <Trophy className="w-3.5 h-3.5" />
                      Đã lưu vào Hall of Fame
                    </span>
                  ) : (
                    <button
                      onClick={shareToHallOfFame}
                      className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center justify-center gap-1 mx-auto"
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      Lưu kỷ niệm vào Hall of Fame
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {state === 'IDLE' && (
            <button
              onClick={startUnboxing}
              className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-sm flex items-center gap-2"
            >
              Mở Hộp #{boxNumber} Ngay
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {state === 'REVEALED' && (
            <>
              <button
                onClick={() => {
                  setBoxNumber(prev => (prev % selectedSeries.total_boxes) + 1);
                  setState('IDLE');
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 text-xs font-semibold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Mở Hộp Khác
              </button>

              <button
                onClick={() => onAddToCart(selectedSeries, [boxNumber])}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
              >
                Đặt Mua Hộp Này Thật
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
