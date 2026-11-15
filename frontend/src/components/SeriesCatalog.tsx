import React, { useState } from 'react';
import { Series } from '../types';
import { formatVND } from '../services/vietqr';
import { Sparkles, Eye, Box, Bot } from 'lucide-react';

interface SeriesCatalogProps {
  seriesList: Series[];
  onSelectSeries: (series: Series) => void;
  onOpenDetails: (series: Series) => void;
  onAskAiForSeries: (series: Series) => void;
}

export const SeriesCatalog: React.FC<SeriesCatalogProps> = ({
  seriesList,
  onSelectSeries,
  onOpenDetails,
  onAskAiForSeries,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');

  const brands = ['ALL', ...Array.from(new Set(seriesList.map(s => s.brand)))];

  const filteredSeries = selectedBrand === 'ALL'
    ? seriesList
    : seriesList.filter(s => s.brand === selectedBrand);

  return (
    <section id="series-catalog" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-1">
            Catalog & Series 2024
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Bộ Sưu Tập Blind Box Có Sẵn
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Chọn khay hộp mù niêm phong, kiểm tra xác suất drop hoặc nhờ Thầy Phẻo AI soi số hộp may mắn
          </p>
        </div>

        {/* Minimalist Filter Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-[#0b0e17] rounded-xl border border-white/[0.08]">
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedBrand === brand
                  ? 'bg-white text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {brand === 'ALL' ? 'Tất Cả' : brand}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSeries.map((series) => {
          const secretItem = series.items?.find(it => it.is_secret);
          const percentRemaining = Math.round((series.remaining_boxes / series.total_boxes) * 100);

          return (
            <div
              key={series.id}
              className="surface-card rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 group hover:shadow-card"
            >
              <div>
                {/* Product Image Frame */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                  <img
                    src={series.image_url}
                    alt={series.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Brand Tag */}
                  <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {series.brand}
                  </span>

                  {/* Secret Drop Rate Tag */}
                  <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3 text-slate-950" />
                    {secretItem ? `Secret ${secretItem.drop_probability}% (1/144)` : 'Secret 1/144'}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {series.name}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                    {series.description}
                  </p>

                  {/* Stock Progress Bar */}
                  <div className="mt-4 pt-3 border-t border-white/[0.06]">
                    <div className="flex justify-between items-center text-[11px] mb-1.5">
                      <span className="text-slate-400">Khay {series.total_boxes} hộp</span>
                      <span className="font-semibold text-emerald-400">
                        Còn {series.remaining_boxes} hộp chưa mở
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentRemaining}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Actions Footer */}
              <div className="px-5 pb-5 pt-2">
                <div className="flex items-baseline justify-between mb-3.5">
                  <span className="text-xs text-slate-500">Đơn giá mở:</span>
                  <span className="text-lg font-black text-amber-400 font-display">
                    {formatVND(series.price_per_box)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectSeries(series)}
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Box className="w-3.5 h-3.5" />
                    Bốc Hộp (1-12)
                  </button>

                  <button
                    onClick={() => onOpenDetails(series)}
                    className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    Xem Drop Rate
                  </button>
                </div>

                {/* Subtle AI Advisor Action */}
                <button
                  onClick={() => onAskAiForSeries(series)}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 hover:text-amber-300 border border-white/[0.05] text-[11px] font-medium transition-all flex items-center justify-center gap-1.5"
                >
                  <Bot className="w-3.5 h-3.5 text-amber-400" />
                  Hỏi Thầy Phẻo soi vía khay này
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
