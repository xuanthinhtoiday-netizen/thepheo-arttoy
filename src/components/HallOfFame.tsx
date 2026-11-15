import React, { useState } from 'react';
import { HallOfFameItem } from '../types';
import { Trophy, Sparkles, Star, Bot } from 'lucide-react';

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
    <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.06]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-1">
            Community & Pulls
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Hall of Fame (Chiến Tích Nổ Secret)
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Các khoảnh khắc khui hàng trúng Secret Chase 1/144 của cộng đồng người sưu tầm
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0b0e17] rounded-xl border border-white/[0.08]">
          <button
            onClick={() => setFilterSecretOnly(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !filterSecretOnly
                ? 'bg-white text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tất Cả ({items.length})
          </button>
          <button
            onClick={() => setFilterSecretOnly(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterSecretOnly
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Chỉ Xem Secret ({items.filter(i => i.is_secret).length})
          </button>
        </div>
      </div>

      {/* Grid of Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedItems.map((item) => (
          <div
            key={item.id}
            className="surface-card rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-card group"
          >
            <div>
              {/* Top Row: Series & Box # */}
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[11px] font-mono text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                  Hộp #{item.box_number}
                </span>

                {item.is_secret && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    SECRET 1/144
                  </span>
                )}
              </div>

              {/* Photo & Item Name */}
              <div className="flex gap-3.5 items-center mb-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-white/10 shrink-0">
                  <img
                    src={item.image_url}
                    alt={item.item_won}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    {item.item_won}
                  </h4>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {item.series_name}
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Customer Comment Quote */}
              <blockquote className="text-slate-300 text-xs italic bg-[#080a12] p-3 rounded-xl border border-white/[0.05] leading-relaxed">
                “{item.comment}”
              </blockquote>
            </div>

            {/* Footer with customer info & "Xin Vía" button */}
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-200">
                  {item.customer_name}
                </div>
                <div className="text-[10px] text-slate-500">
                  {item.created_at || 'Gần đây'}
                </div>
              </div>

              <button
                onClick={() => onAskAiForLuckyVibe(item)}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-amber-300 text-xs font-medium transition-colors flex items-center gap-1"
              >
                <Bot className="w-3.5 h-3.5" />
                Xin vía
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
