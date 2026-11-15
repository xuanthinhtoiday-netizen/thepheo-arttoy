import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Bot } from 'lucide-react';

interface HeroBannerProps {
  onOpenChat: () => void;
  onExploreClick: () => void;
  onGachaClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenChat,
  onExploreClick,
  onGachaClick,
}) => {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.08] bg-gradient-to-b from-[#07090e] via-[#0b0e17] to-[#07090e] py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Value Props */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-300 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Bộ Sưu Tập Art Toy Mùa Thu 2024</span>
              <span className="text-slate-600">/</span>
              <span className="text-amber-300/90 font-mono">100% Pop Mart & Bandai</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.15]">
              Nghệ Thuật Sưu Tầm <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
                Blind Box & Mystery Toy
              </span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
              Nền tảng mua sắm mô hình nghệ thuật giới hạn kết hợp trợ lý AI <strong className="text-slate-200">"Thầy Phẻo Gieo Quẻ"</strong>. Phân tích xác suất, soi vía chọn hộp nổ <strong className="text-amber-300">Secret Chase 1/144</strong> và tự động hóa thanh toán VietQR trong tích tắc.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3 rounded-xl bg-white text-slate-950 hover:bg-slate-200 font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center gap-2 shadow-sm"
              >
                Khám Phá Các Khay Hộp Mù
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenChat}
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 hover:border-amber-400/40 font-semibold text-xs sm:text-sm tracking-wide transition-all flex items-center gap-2"
              >
                <Bot className="w-4 h-4 text-amber-400" />
                Nhờ Thầy Phẻo Soi Vía
              </button>

              <button
                onClick={onGachaClick}
                className="px-4 py-3 rounded-xl text-slate-400 hover:text-white font-medium text-xs sm:text-sm transition-colors"
              >
                Mở thử hộp (Simulator) →
              </button>
            </div>

            {/* Clean trust metric pills */}
            <div className="pt-6 border-t border-white/[0.06] grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <div className="text-lg sm:text-xl font-bold text-white font-display">1/144</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Tỷ Lệ Secret Chuẩn</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-white font-display">Nguyên Seal</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Niêm Phong Nhà Sản Xuất</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-white font-display">VietQR 24/7</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Xác Nhận Tức Thì</div>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Spotlight Card */}
          <div className="lg:col-span-5">
            <div className="surface-card rounded-2xl p-5 relative group overflow-hidden">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80"
                  alt="SKULLPANDA The Warmth"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
                  Featured Drop
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-amber-500/90 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  Secret 0.69%
                </div>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 font-medium">Pop Mart Official</span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    SKULLPANDA The Warmth Series
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    Thiết kế men sứ mờ, tỉ lệ nổ Secret Chase 1/144 cực hiếm. Khay nguyên 12 hộp có sẵn.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-500">Giá mở hộp</div>
                  <div className="text-base font-black text-amber-400 font-display">350.000₫</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Còn 8/12 hộp trong khay
                </div>
                <button
                  onClick={onExploreClick}
                  className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1"
                >
                  Chọn vị trí hộp →
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
