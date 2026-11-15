import React, { useState } from 'react';
import { Series } from '../types';
import { formatVND } from '../services/vietqr';
import { Sparkles, Eye, Box, Bot, Layers, Flame } from 'lucide-react';

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
    <section id="series-catalog" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header and Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider mb-2">
            <Layers className="w-4 h-4 text-amber-400" />
            Danh Mục Hộp Mù Hot Nhất 2024
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Bộ Sưu Tập Art Toy & Blind Box
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Chọn khay hộp mù bạn yêu thích, xem chi tiết tỷ lệ drop hoặc để Thầy Phẻo soi vía chọn hộp
          </p>
        </div>

        {/* Brand Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedBrand === brand
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50'
              }`}
            >
              {brand === 'ALL' ? 'Tất Cả Thương Hiệu' : brand}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Series Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredSeries.map((series) => {
          const secretItem = series.items?.find(it => it.is_secret);
          const percentRemaining = Math.round((series.remaining_boxes / series.total_boxes) * 100);
          const isLowStock = series.remaining_boxes <= 5;

          return (
            <div
              key={series.id}
              className="group glass-panel rounded-3xl overflow-hidden border border-slate-800/80 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-900/20 transition-all duration-300 flex flex-col"
            >
              {/* Image banner with overlay badges */}
              <div className="relative h-60 overflow-hidden bg-slate-900">
                <img
                  src={series.image_url}
                  alt={series.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d101d] via-transparent to-black/30"></div>

                {/* Brand Badge */}
                <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-white/10 text-slate-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {series.brand}
                </span>

                {/* Secret Drop Rate Badge */}
                <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-pink-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  {secretItem ? `Secret ${secretItem.drop_probability}% (1/144)` : 'Secret 1/144'}
                </div>

                {/* Remaining stock badge */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-md flex items-center gap-1.5 ${
                    isLowStock 
                      ? 'bg-rose-950/80 border border-rose-500/40 text-rose-300' 
                      : 'bg-slate-900/85 border border-white/10 text-emerald-400'
                  }`}>
                    {isLowStock && <Flame className="w-3.5 h-3.5 text-rose-400 animate-bounce" />}
                    Còn {series.remaining_boxes}/{series.total_boxes} hộp chưa mở
                  </div>

                  <span className="text-xs text-slate-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                    {percentRemaining}% sẵn sàng
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                    {series.name}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                    {series.description}
                  </p>
                </div>

                {/* Price and Action Buttons */}
                <div className="mt-5 pt-4 border-t border-slate-800/80">
                  <div className="flex items-baseline justify-between mb-3.5">
                    <span className="text-xs text-slate-400">Giá mở mỗi hộp:</span>
                    <span className="text-lg font-black text-amber-400 tracking-wide">
                      {formatVND(series.price_per_box)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectSeries(series)}
                      className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Box className="w-3.5 h-3.5 text-amber-300" />
                      Bốc Hộp Ngay
                    </button>

                    <button
                      onClick={() => onOpenDetails(series)}
                      className="px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      Xem Drop Rate
                    </button>
                  </div>

                  {/* Ask Thầy Phẻo for this series */}
                  <button
                    onClick={() => onAskAiForSeries(series)}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/25 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Bot className="w-3.5 h-3.5 text-amber-400" />
                    Thầy Phẻo Soi Vía Series Này
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
