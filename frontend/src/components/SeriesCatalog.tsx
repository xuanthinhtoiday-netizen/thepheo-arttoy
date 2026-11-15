import React, { useState } from 'react';
import { Series } from '../types';
import { formatVND } from '../services/vietqr';
import { Sparkles, Eye, Box, Bot, Heart, Star, Crown, WandSparkles } from 'lucide-react';

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
      {/* Cute Floating Decorations */}
      <div className="hidden lg:block absolute top-10 -left-5 w-12 h-12 animate-float-gentle pointer-events-none">
        <span className="text-5xl">🎀</span>
      </div>
      <div className="hidden lg:block absolute top-20 -right-5 w-10 h-10 animate-float-gentle pointer-events-none" style={{ animationDelay: '1s' }}>
        <span className="text-4xl">✨</span>
      </div>

      {/* Section Header - Cute Style */}
      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-cute-full bg-white/80 border-2 border-pink-200/50 text-pink-700 text-xs font-semibold shadow-cute mb-4 animate-bounce-cute">
            <span className="heart-decoration">💖</span>
            <span>Catalog & Series 2024</span>
            <span className="text-pink-300">✨</span>
            <span className="text-peach-500 font-bold">100% Pop Mart & Bandai</span>
            <span className="star-decoration">⭐</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-pink-800 tracking-tight text-gradient-cute">
            Bộ Sưu Tập Blind Box Có Sẵn 🎁
          </h2>
          <p className="text-pink-500 text-sm mt-2 max-w-md">
            Chọn khay hộp mù niêm phong, kiểm tra xác suất drop hoặc nhờ Thầy Phẻo AI soi số hộp may mắn! 🔮
          </p>
        </div>

        {/* Cute Filter Pills */}
        <div className="flex flex-wrap gap-2 p-2 bg-white/80 rounded-cute-lg border-2 border-pink-200/50 shadow-cute">
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-4 py-2 rounded-cute text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedBrand === brand
                  ? 'bg-cute-gradient text-pink-700 shadow-cute border border-pink-300/50'
                  : 'text-pink-500 hover:text-pink-700 hover:bg-pink-50/50'
              }`}
            >
              {brand === 'ALL' ? (
                <>
                  <Heart className="w-3 h-3" />
                  Tất Cả
                </>
              ) : (
                <>
                  <Crown className="w-3 h-3" />
                  {brand}
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid - Cute Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSeries.map((series) => {
          const secretItem = series.items?.find(it => it.is_secret);
          const percentRemaining = Math.round((series.remaining_boxes / series.total_boxes) * 100);
          const isLowStock = series.remaining_boxes <= 3;

          return (
            <div
              key={series.id}
              className="surface-cute overflow-hidden flex flex-col transition-all duration-500 group hover:shadow-cute-lg animate-pop-in"
              style={{ animationDelay: `${Math.random() * 200}ms` }}
            >
              {/* Product Image Frame */}
              <div className="relative aspect-[4/3] overflow-hidden bg-cute-gradient img-frame-cute">
                <img
                  src={series.image_url}
                  alt={series.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />

                {/* Brand Tag - Cute */}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md border border-pink-200/50 text-pink-700 text-[10px] font-bold px-3 py-1 rounded-cute-full uppercase tracking-wider shadow-cute">
                  {series.brand}
                </span>

                {/* Secret Drop Rate Tag - Cute */}
                <div className="absolute top-3 right-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-black px-3 py-1 rounded-cute-full flex items-center gap-1 shadow-cute animate-heartbeat">
                  <Sparkles className="w-3 h-3 animate-bounce-cute" />
                  {secretItem ? `Secret ${secretItem.drop_probability}% (1/144)` : 'Secret 1/144'}
                </div>

                {/* Low Stock Badge */}
                {isLowStock && (
                  <div className="absolute bottom-3 left-3 bg-gradient-to-r from-peach-500 to-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-cute-full flex items-center gap-1 shadow-cute animate-wiggle">
                    <Star className="w-3 h-3" />
                    Sắp Hết Hàng! 😱
                  </div>
                )}

                {/* Featured Badge */}
                {series.remaining_boxes === series.total_boxes && (
                  <div className="absolute bottom-3 right-3 bg-gradient-to-r from-lavender-500 to-purple-500 text-white text-[10px] font-black px-3 py-1 rounded-cute-full flex items-center gap-1 shadow-cute">
                    <Crown className="w-3 h-3" />
                    Khay Mới 100%
                  </div>
                )}
              </div>

              {/* Body Content */}
              <div className="p-5">
                <h3 className="text-lg font-extrabold text-pink-800 group-hover:text-pink-600 transition-colors line-clamp-1">
                  {series.name}
                </h3>
                <p className="text-pink-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                  {series.description}
                </p>

                {/* Stock Progress Bar - Cute */}
                <div className="mt-4 pt-3 border-t border-pink-200/50">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-pink-400">Khay {series.total_boxes} hộp 🎁</span>
                    <span className="font-semibold text-emerald-500 flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      Còn {series.remaining_boxes} hộp chưa mở
                    </span>
                  </div>
                  <div className="w-full h-3 bg-pink-100 rounded-cute-full overflow-hidden">
                    <div
                      className="h-full rounded-cute-full transition-all duration-700 ease-out"
                      style={{
                        width: `${percentRemaining}%`,
                        background: percentRemaining > 50
                          ? 'linear-gradient(90deg, #22c55e 0%, #4ade80 100%)'
                          : percentRemaining > 20
                          ? 'linear-gradient(90deg, #fb923c 0%, #fdba74 100%)'
                          : 'linear-gradient(90deg, #f43f5e 0%, #fb7185 100%)'
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-pink-400 mt-1">
                    <span>0%</span>
                    <span>{percentRemaining}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Price & Actions Footer - Cute */}
              <div className="px-5 pb-5 pt-2 border-t border-pink-200/50 bg-white/50">
                <div className="flex items-baseline justify-between mb-3.5">
                  <span className="text-xs text-pink-400">Đơn giá mở:</span>
                  <span className="text-xl font-extrabold text-gradient-peach font-display">
                    {formatVND(series.price_per_box)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectSeries(series)}
                    className="btn-cute py-3 px-3 rounded-cute text-sm flex items-center justify-center gap-2 shadow-cute"
                  >
                    <Box className="w-4 h-4" />
                    Bốc Hộp (1-12)
                  </button>

                  <button
                    onClick={() => onOpenDetails(series)}
                    className="btn-cute-outline py-3 px-3 rounded-cute text-sm flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Xem Drop Rate
                  </button>
                </div>

                {/* Cute AI Advisor Action */}
                <button
                  onClick={() => onAskAiForSeries(series)}
                  className="w-full mt-2 btn-cute-lavender py-2.5 px-3 rounded-cute text-sm flex items-center justify-center gap-2"
                >
                  <WandSparkles className="w-4 h-4 animate-wiggle" />
                  Hỏi Thầy Phẻo soi vía khay này 🔮
                  <Sparkles className="w-4 h-4 animate-bounce-cute" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSeries.length === 0 && (
        <div className="surface-cute p-12 text-center animate-pop-in">
          <div className="text-6xl mb-4">🥺</div>
          <h3 className="text-xl font-bold text-pink-600 mb-2">Không tìm thấy series nào!</h3>
          <p className="text-pink-400">Thử chọn thương hiệu khác hoặc xem tất cả nhé! 💖</p>
        </div>
      )}
    </section>
  );
};