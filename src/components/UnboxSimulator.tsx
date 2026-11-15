import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Series, SeriesItem } from '../types';
import { Sparkles, Trophy, ArrowRight, RotateCcw, Flame } from 'lucide-react';
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

    // Simulate suspense duration: 2.2 seconds
    setTimeout(() => {
      // Roll random based on probability
      const items = selectedSeries.items || [];
      const secretItem = items.find(i => i.is_secret);

      // Random roll between 0 and 100
      const roll = Math.random() * 100;
      let wonItem: SeriesItem;

      // Give 25% chance of Secret in simulator for fun engagement (or realistic drop rate)
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
    }, 2200);
  };

  const triggerSecretFireworks = () => {
    // Grand celebration fireworks
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const triggerNormalConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const shareToHallOfFame = () => {
    if (!revealedItem) return;
    storage.addHallOfFame({
      customer_name: 'Đạo Hữu Săn Box',
      series_name: selectedSeries.name,
      item_won: revealedItem.item_name,
      is_secret: revealedItem.is_secret,
      box_number: boxNumber,
      comment: revealedItem.is_secret 
        ? `Trời ơi nổ SECRET hộp #${boxNumber} rồi! Cảm tạ vía Thầy Phẻo phù hộ!`
        : `Mở trúng em ${revealedItem.item_name} xinh xỉu! Vía cực son!`,
      image_url: revealedItem.image_url
    });
    setFeedbackShared(true);
  };

  return (
    <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 animate-fade-in">
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 border border-purple-500/30 text-center relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="relative z-10 max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-900/50 border border-purple-500/30 text-purple-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Mô Phỏng Xé Túi Mù & Bốc Hộp Thần Tốc
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Gacha Unbox Simulator
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5">
            Trải nghiệm cảm giác bóc seal niêm phong, hồi hộp xé túi bạc và chiêm ngưỡng nhân vật bên trong!
          </p>
        </div>

        {/* Series & Box Selector */}
        {state === 'IDLE' && (
          <div className="relative z-10 max-w-lg mx-auto bg-slate-900/80 p-4 rounded-2xl border border-slate-800 mb-8 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 text-left">
              <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                Chọn Series:
              </label>
              <select
                value={selectedSeries.id}
                onChange={(e) => {
                  const s = seriesList.find(x => x.id === e.target.value);
                  if (s) setSelectedSeries(s);
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                {seriesList.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.brand})</option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-32 text-left">
              <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                Số Hộp (1-{selectedSeries.total_boxes}):
              </label>
              <select
                value={boxNumber}
                onChange={(e) => setBoxNumber(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                {Array.from({ length: selectedSeries.total_boxes }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>Hộp #{n < 10 ? `0${n}` : n}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Center Stage Animation */}
        <div className="relative z-10 my-6 flex flex-col items-center justify-center min-h-[300px]">
          {state === 'IDLE' && (
            <div className="space-y-4">
              <div className="w-44 h-48 mx-auto rounded-3xl bg-gradient-to-tr from-purple-900 to-indigo-800 p-1 shadow-2xl shadow-purple-600/30 flex items-center justify-center border-2 border-amber-400/50 hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={startUnboxing}
              >
                <div className="w-full h-full bg-[#120f26] rounded-3xl flex flex-col items-center justify-center p-4">
                  <span className="text-5xl filter drop-shadow">🎁</span>
                  <span className="text-sm font-extrabold text-amber-300 mt-2">
                    Hộp #{boxNumber}
                  </span>
                  <span className="text-[10px] text-purple-300 font-mono">
                    {selectedSeries.brand}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Nhấn vào hộp hoặc nút bên dưới để khui
              </p>
            </div>
          )}

          {state === 'UNBOXING' && (
            <div className="space-y-4 animate-shake">
              <div className="w-48 h-52 mx-auto rounded-3xl bg-gradient-to-tr from-pink-600 via-purple-600 to-amber-500 p-1 shadow-2xl shadow-pink-500/50 flex items-center justify-center border-2 border-white animate-pulse">
                <div className="w-full h-full bg-[#150a26] rounded-3xl flex flex-col items-center justify-center p-4">
                  <span className="text-6xl animate-bounce">⚡</span>
                  <span className="text-sm font-black text-amber-300 mt-3 animate-pulse">
                    Đang xé seal túi bạc...
                  </span>
                  <span className="text-[11px] text-purple-300 font-semibold mt-1">
                    Thầy Phẻo đang truyền linh khí ✨
                  </span>
                </div>
              </div>
            </div>
          )}

          {state === 'REVEALED' && revealedItem && (
            <div className="space-y-4 animate-scale-in">
              <div className={`p-6 rounded-3xl max-w-sm mx-auto border-2 ${
                revealedItem.is_secret
                  ? 'glass-gold-glow border-amber-400'
                  : 'glass-panel border-purple-500/40'
              }`}>
                {/* Secret Banner */}
                {revealedItem.is_secret ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 text-white text-xs font-black mb-3 shadow-lg animate-bounce">
                    <Flame className="w-4 h-4 text-amber-200" />
                    CHÚC MỪNG! NỔ SECRET CHASE (1/144)
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/70 text-purple-200 text-xs font-bold mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    MỞ TRÚNG NHÂN VẬT CHÍNH
                  </div>
                )}

                {/* Item Picture */}
                <div className="w-48 h-48 mx-auto rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl">
                  <img
                    src={revealedItem.image_url}
                    alt={revealedItem.item_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="mt-4">
                  <h3 className={`text-lg font-black ${revealedItem.is_secret ? 'text-amber-300' : 'text-white'}`}>
                    {revealedItem.item_name}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Series: {selectedSeries.name} • Hộp số #{boxNumber}
                  </div>
                  <div className="text-[11px] text-purple-300 font-mono mt-1">
                    Tỉ lệ: {revealedItem.drop_probability}% {revealedItem.is_secret ? '(Cực hiếm)' : ''}
                  </div>
                </div>

                {/* Share to Hall of Fame */}
                <div className="mt-4 pt-3 border-t border-slate-800">
                  {feedbackShared ? (
                    <span className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1">
                      <Trophy className="w-3.5 h-3.5" />
                      Đã lưu chiến tích lên Hall of Fame!
                    </span>
                  ) : (
                    <button
                      onClick={shareToHallOfFame}
                      className="text-xs text-amber-300 hover:text-amber-200 font-bold flex items-center justify-center gap-1.5 mx-auto"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      Khoe chiến tích lên Hall of Fame
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
          {state === 'IDLE' && (
            <button
              onClick={startUnboxing}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-black text-sm sm:text-base shadow-xl shadow-purple-600/40 transition-all flex items-center gap-2 group"
            >
              <span>🔥</span>
              XÉ SEAL HỘP #{boxNumber} NGAY
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {state === 'REVEALED' && (
            <>
              <button
                onClick={() => {
                  setBoxNumber(prev => (prev % selectedSeries.total_boxes) + 1);
                  setState('IDLE');
                }}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold border border-slate-700 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Mở Thử Hộp Khác
              </button>

              <button
                onClick={() => onAddToCart(selectedSeries, [boxNumber])}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2"
              >
                <span>📦</span>
                Đặt Mua Hộp Thật Này
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
