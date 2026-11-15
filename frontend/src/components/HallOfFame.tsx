import React, { useState } from 'react';
import { HallOfFameItem } from '../types';
import { Trophy, Sparkles, Star, Bot, Heart, Crown, WandSparkles, Gift, ShieldCheck, Zap } from 'lucide-react';

interface HallOfFameProps {
  items: HallOfFameItem[];
  onAskAiForLuckyVibe: (item: HallOfFameItem) => void;
}

export const HallOfFame: React.FC<HallOfFameProps> = ({
  items,
  onAskAiForLuckyVibe,
}) => {
  const [filterSecretOnly, setFilterSecretOnly] = useState(false);

  const displayedItems = filterSecretOnly
    ? items.filter(it => it.is_secret)
    : items;
  const secretCount = items.filter(i => i.is_secret).length;

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Cute Floating Decorations */}
      <div className="hidden lg:block absolute top-10 -left-5 w-12 h-12 animate-float-gentle pointer-events-none">
        <span className="text-5xl">🎀</span>
      </div>
      <div className="hidden lg:block absolute top-20 -right-5 w-10 h-10 animate-float-gentle pointer-events-none" style={{ animationDelay: '1s' }}>
        <span className="text-4xl">✨</span>
      </div>

      {/* Header - Cute */}
      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-cute-full bg-white/80 border-2 border-pink-200/50 text-pink-700 text-xs font-semibold shadow-cute mb-4 animate-bounce-cute">
            <span className="heart-decoration">💖</span>
            <span>Community & Pulls</span>
            <span className="text-pink-300">✨</span>
            <span className="text-peach-500 font-bold">Hall of Fame 🏆</span>
            <span className="star-decoration">⭐</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-pink-800 tracking-tight text-gradient-cute">
            Hall of Fame (Chiến Tích Nổ Secret) 🏆
          </h2>
          <p className="text-pink-500 text-sm mt-2 max-w-md">
            Các khoảnh khắc khui hàng trúng Secret Chase 1/144 của cộng đồng người sưu tầm! 💖
          </p>
        </div>

        {/* Filter Toggle - Cute */}
        <div className="flex items-center gap-2 p-2 bg-white/80 rounded-cute-lg border-2 border-pink-200/50 shadow-cute">
          <button
            onClick={() => setFilterSecretOnly(false)}
            className={`px-4 py-2 rounded-cute text-xs font-semibold transition-all flex items-center gap-1.5 ${
              !filterSecretOnly
                ? 'bg-cute-gradient text-pink-700 shadow-cute border border-pink-300/50'
                : 'text-pink-500 hover:text-pink-700 hover:bg-pink-50/50'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            Tất Cả ({items.length})
          </button>
          <button
            onClick={() => setFilterSecretOnly(true)}
            className={`px-4 py-2 rounded-cute text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filterSecretOnly
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-cute'
                : 'text-pink-500 hover:text-pink-700 hover:bg-pink-50/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 animate-bounce-cute" />
            Chỉ Xem Secret ({secretCount})
          </button>
        </div>
      </div>

      {/* Grid of Testimonials - Cute */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedItems.map((item) => (
          <div
            key={item.id}
            className="surface-cute-elevated p-5 flex flex-col justify-between transition-all duration-500 hover:shadow-cute-lg group animate-pop-in"
            style={{ animationDelay: `${Math.random() * 200}ms` }}
          >
            <div>
              {/* Top Row: Series & Box # - Cute */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-pink-500 bg-pink-100 px-3 py-1 rounded-cute-full border border-pink-200/50">
                  Hộp #{item.box_number}
                </span>

                {item.is_secret && (
                  <span className="badge-cute-secret inline-flex items-center gap-1.5 px-3 py-1.5 rounded-cute-full text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 animate-bounce-cute" />
                    SECRET 1/144
                    <Sparkles className="w-3.5 h-3.5 animate-bounce-cute" />
                  </span>
                )}
              </div>

              {/* Photo & Item Name - Cute */}
              <div className="flex gap-4 items-center mb-4">
                <div className="w-16 h-16 rounded-cute-lg overflow-hidden bg-cute-gradient border-2 border-pink-200/50 shrink-0 img-frame-cute">
                  <img
                    src={item.image_url}
                    alt={item.item_won}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-extrabold text-pink-800 group-hover:text-pink-600 transition-colors truncate">
                    {item.item_won}
                  </h4>
                  <div className="text-xs text-pink-500 mt-1 truncate">
                    {item.series_name}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400 mt-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Customer Comment Quote - Cute */}
              <blockquote className="text-pink-600 text-sm italic surface-cute p-4 rounded-cute-lg border border-pink-200/50 leading-relaxed">
                “{item.comment}”
              </blockquote>
            </div>

            {/* Footer with customer info & "Xin Vía" button - Cute */}
            <div className="mt-4 pt-4 border-t border-pink-200/50 flex items-center justify-between">
              <div>
                <div className="text-sm font-extrabold text-pink-700 flex items-center gap-1">
                  <Crown className="w-4 h-4" />
                  {item.customer_name}
                </div>
                <div className="text-xs text-pink-400 flex items-center gap-1">
                  <WandSparkles className="w-3.5 h-3.5" />
                  {item.created_at || 'Gần đây'}
                </div>
              </div>

              <button
                onClick={() => onAskAiForLuckyVibe(item)}
                className="btn-cute-lavender px-3 py-1.5 text-xs flex items-center gap-1.5"
              >
                <WandSparkles className="w-3.5 h-3.5 animate-wiggle" />
                Xin Vía 🔮
              </button>
            </div>
          </div>
        ))}
      </div>

      {displayedItems.length === 0 && (
        <div className="surface-cute p-12 text-center animate-pop-in">
          <div className="text-6xl mb-4">🥺</div>
          <h3 className="text-xl font-bold text-pink-600 mb-2">Chưa có chiến tích nào!</h3>
          <p className="text-pink-400">Hãy là người đầu tiên nổ Secret và đăng ký Hall of Fame nhé! 💖</p>
        </div>
      )}
    </section>
  );
};