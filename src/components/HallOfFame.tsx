import React, { useState } from 'react';
import { HallOfFameItem } from '../types';
import { Trophy, Sparkles, Flame, Bot, Star, MessageSquare } from 'lucide-react';

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

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider mb-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            Social Proof & Khui Hàng Trúng Secret
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Đại Lộ Danh Vọng (Hall of Fame)
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Nơi tôn vinh các đạo hữu đã được Thầy Phẻo truyền linh lực và bốc trúng Secret 1/144 cực hiếm!
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterSecretOnly(false)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              !filterSecretOnly
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            Tất Cả Feedback ({items.length})
          </button>
          <button
            onClick={() => setFilterSecretOnly(true)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              filterSecretOnly
                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                : 'bg-slate-800 text-amber-300 hover:bg-slate-700 border border-amber-500/30'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Chỉ Xem Nổ Secret ({items.filter(i => i.is_secret).length})
          </button>
        </div>
      </div>

      {/* Grid of Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedItems.map((item) => (
          <div
            key={item.id}
            className={`rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 group ${
              item.is_secret
                ? 'glass-gold-glow border border-amber-500/40 hover:border-amber-400'
                : 'glass-panel border border-slate-800 hover:border-purple-500/40'
            }`}
          >
            <div>
              {/* Top Row: Series & Box # */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-purple-300 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-800/50">
                  Hộp số #{item.box_number}
                </span>

                {item.is_secret ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-black border border-amber-500/40">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    SECRET 1/144
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    Unboxed Pull
                  </span>
                )}
              </div>

              {/* Photo & Item Name */}
              <div className="flex gap-4 items-center mb-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shrink-0">
                  <img
                    src={item.image_url}
                    alt={item.item_won}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                    {item.item_won}
                  </h4>
                  <div className="text-xs text-purple-300 font-medium mt-0.5">
                    {item.series_name}
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Customer Comment Quote */}
              <blockquote className="text-slate-300 text-xs sm:text-sm italic bg-slate-950/50 p-3.5 rounded-2xl border border-white/5 relative">
                <span className="text-purple-400 text-base leading-none">“</span>
                {item.comment}
                <span className="text-purple-400 text-base leading-none">”</span>
              </blockquote>
            </div>

            {/* Footer with customer info & "Xin Vía" button */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-200">
                  {item.customer_name}
                </div>
                <div className="text-[10px] text-slate-400">
                  {item.created_at || 'Vừa xong'}
                </div>
              </div>

              <button
                onClick={() => onAskAiForLuckyVibe(item)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5 text-amber-400" />
                Xin Vía Hộp Này
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
