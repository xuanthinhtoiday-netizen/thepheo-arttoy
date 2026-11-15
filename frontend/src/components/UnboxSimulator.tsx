import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Series, SeriesItem } from '../types';
import { Trophy, ArrowRight, RotateCcw, Box, Sparkles, Heart, Star, WandSparkles, Gift, Crown, Sparkle } from 'lucide-react';
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
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 8,
        angle: 60,
        spread: 70,
        origin: { x: 0 },
        colors: ['#ec4899', '#f472b6', '#f9a8d4', '#a855f7', '#fb923c']
      });
      confetti({
        particleCount: 8,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
        colors: ['#ec4899', '#f472b6', '#f9a8d4', '#a855f7', '#fb923c']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const triggerNormalConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#f9a8d4', '#fbcfe8', '#a855f7', '#d8b4fe']
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
        ? `Nổ Secret hộp #${boxNumber}! Vía Thầy Phẻo chuẩn không cần chỉnh! 🎉`
        : `Mở trúng ${revealedItem.item_name} hoàn thiện rất đẹp, chuẩn Pop Mart! ✨`,
      image_url: revealedItem.image_url
    });
    setFeedbackShared(true);
  };

  return (
    <div className="py-10 max-w-3xl mx-auto px-4 sm:px-6 animate-pop-in">
      {/* Cute Floating Decorations */}
      <div className="hidden lg:block absolute top-10 -left-5 w-12 h-12 animate-float-gentle pointer-events-none">
        <span className="text-5xl">🎀</span>
      </div>
      <div className="hidden lg:block absolute top-20 -right-5 w-10 h-10 animate-float-gentle pointer-events-none" style={{ animationDelay: '1s' }}>
        <span className="text-4xl">✨</span>
      </div>

      <div className="surface-cute-elevated p-6 sm:p-10 text-center relative overflow-hidden">
        {/* Close Button - Cute */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 btn-cute-ghost p-2"
        >
          <span className="text-2xl">✕</span>
        </button>

        {/* Header - Cute */}
        <div className="max-w-md mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-cute-full bg-white/80 border-2 border-pink-200/50 text-pink-700 text-xs font-semibold shadow-cute mb-4 animate-bounce-cute">
            <span className="heart-decoration">💖</span>
            <span>Blind Box Experience</span>
            <span className="star-decoration">⭐</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-pink-800 text-gradient-cute tracking-tight">
            Unbox Simulator 🎁
          </h2>
          <p className="text-pink-500 text-sm mt-2 leading-relaxed">
            Mô phỏng trải nghiệm xé niêm phong, mở túi bạc và chiêm ngưỡng tác phẩm nghệ thuật bên trong! 💖
          </p>
        </div>

        {/* Series and Box pickers - Cute */}
        {state === 'IDLE' && (
          <div className="max-w-md mx-auto surface-cute p-4 rounded-cute-lg mb-8 flex flex-col sm:flex-row gap-3 text-left border-2 border-pink-200/50">
            <div className="flex-1">
              <label className="text-sm text-pink-500 font-semibold block mb-2 flex items-center gap-1">
                <Crown className="w-4 h-4" /> Chọn Series:
              </label>
              <select
                value={selectedSeries.id}
                onChange={(e) => {
                  const s = seriesList.find(x => x.id === e.target.value);
                  if (s) setSelectedSeries(s);
                }}
                className="input-cute w-full text-sm"
              >
                {seriesList.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.brand})</option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-32">
              <label className="text-sm text-pink-500 font-semibold block mb-2 flex items-center gap-1">
                <Gift className="w-4 h-4" /> Số Hộp:
              </label>
              <select
                value={boxNumber}
                onChange={(e) => setBoxNumber(Number(e.target.value))}
                className="input-cute w-full text-sm"
              >
                {Array.from({ length: selectedSeries.total_boxes }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>Hộp #{n < 10 ? `0${n}` : n}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Unbox Stage */}
        <div className="my-6 flex flex-col items-center justify-center min-h-[280px]">
          {state === 'IDLE' && (
            <div className="space-y-4">
              <div
                onClick={startUnboxing}
                className="w-48 h-52 mx-auto rounded-cute-lg bg-cute-gradient border-3 border-pink-300/50 p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 hover:border-pink-400 shadow-cute-lg animate-bounce-cute"
              >
                <div className="relative">
                  <Box className="w-16 h-16 text-pink-500" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-heartbeat" />
                </div>
                <span className="text-sm font-extrabold text-pink-700 font-display mt-3">
                  Hộp #{boxNumber}
                </span>
                <span className="text-xs text-pink-500 mt-1">
                  {selectedSeries.brand} ✨
                </span>
              </div>
              <p className="text-sm text-pink-400 animate-wiggle">
                Nhấn vào hộp để bắt đầu khui 🎁
              </p>
            </div>
          )}

          {state === 'UNBOXING' && (
            <div className="space-y-4 animate-pulse-cute">
              <div className="w-48 h-52 mx-auto rounded-cute-lg bg-gradient-to-br from-pink-100 to-rose-100 border-3 border-pink-400/50 p-6 flex flex-col items-center justify-center shadow-cute-lg">
                <div className="relative">
                  <Box className="w-16 h-16 text-pink-500 animate-bounce" />
                  <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-bounce-cute" />
                </div>
                <span className="text-sm font-extrabold text-pink-600 mt-3 font-display">
                  Đang mở niêm phong...
                </span>
                <div className="mt-3 flex items-center gap-1 text-pink-400">
                  <WandSparkles className="w-4 h-4 animate-wiggle" />
                  <span className="text-xs">Bấm độn...</span>
                  <WandSparkles className="w-4 h-4 animate-wiggle" />
                </div>
              </div>
            </div>
          )}

          {state === 'REVEALED' && revealedItem && (
            <div className="space-y-4 animate-pop-in">
              <div className="surface-cute p-6 rounded-cute-xl max-w-xs mx-auto border-2 border-pink-200/50">
                {revealedItem.is_secret ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-cute-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-black uppercase tracking-wider mb-4 animate-heartbeat shadow-cute">
                    <Sparkles className="w-4 h-4 animate-bounce-cute" />
                    SECRET CHASE 1/144
                    <Sparkles className="w-4 h-4 animate-bounce-cute" />
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-cute-full bg-gradient-to-r from-lavender-500 to-purple-500 text-white text-xs font-semibold mb-4">
                    <Star className="w-3 h-3" />
                    Nhân Vật Cơ Bản
                  </div>
                )}

                <div className="w-44 h-44 mx-auto rounded-cute-lg overflow-hidden bg-cute-gradient border-2 border-pink-200/50 shadow-cute">
                  <img
                    src={revealedItem.image_url}
                    alt={revealedItem.item_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="mt-4">
                  <h3 className={`text-lg font-extrabold ${revealedItem.is_secret ? 'text-gradient-peach' : 'text-pink-700'} font-display`}>
                    {revealedItem.item_name}
                  </h3>
                  <div className="text-sm text-pink-500 mt-1 flex items-center justify-center gap-1">
                    <Crown className="w-4 h-4" />
                    {selectedSeries.name} • Hộp #{boxNumber}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-pink-200/50">
                  {feedbackShared ? (
                    <span className="text-sm text-emerald-500 font-semibold flex items-center justify-center gap-1.5 animate-bounce-cute">
                      <Trophy className="w-4 h-4 animate-heartbeat" />
                      Đã lưu vào Hall of Fame 🏆
                      <Star className="w-4 h-4 animate-bounce-cute" />
                    </span>
                  ) : (
                    <button
                      onClick={shareToHallOfFame}
                      className="btn-cute-lavender px-4 py-2 text-sm flex items-center justify-center gap-2 mx-auto w-full"
                    >
                      <Trophy className="w-4 h-4" />
                      Lưu Kỷ Niệm Vào Hall of Fame 🏆
                      <Sparkles className="w-4 h-4 animate-bounce-cute" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Buttons - Cute */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {state === 'IDLE' && (
            <button
              onClick={startUnboxing}
              className="btn-cute px-8 py-3 text-base flex items-center gap-3 shadow-glow-pink animate-heartbeat"
            >
              <Gift className="w-5 h-5 animate-bounce-cute" />
              Mở Hộp #{boxNumber} Ngay 🎁
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {state === 'REVEALED' && (
            <>
              <button
                onClick={() => {
                  setBoxNumber(prev => (prev % selectedSeries.total_boxes) + 1);
                  setState('IDLE');
                }}
                className="btn-cute-outline px-5 py-3 text-base flex items-center gap-3"
              >
                <RotateCcw className="w-5 h-5" />
                Mở Hộp Khác 🔄
              </button>

              <button
                onClick={() => {
                  const sold = storage.getSoldBoxes(selectedSeries.id, selectedSeries.total_boxes - selectedSeries.remaining_boxes, selectedSeries.total_boxes);
                  if (sold.includes(boxNumber)) {
                    alert(`Hộp #${boxNumber} này đã có người mua trước đó rồi, thí chủ hãy chọn hộp khác còn sẵn nhé! 😊`);
                    return;
                  }
                  onAddToCart(selectedSeries, [boxNumber]);
                }}
                className="btn-cute-peach px-6 py-3 text-base flex items-center gap-3 shadow-glow-peach"
              >
                <Heart className="w-5 h-5 animate-heartbeat" />
                Đặt Mua Hộp Này Thật 💖
              </button>
            </>
          )}

          <button
            onClick={onClose}
            className="btn-cute-ghost px-4 py-2 text-sm"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Quay Lại Cửa Hàng 🏠
          </button>
        </div>
      </div>
    </div>
  );
};