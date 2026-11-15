import React from 'react';
import { Sparkles, Bot, ShieldCheck, Zap, ArrowRight, Flame } from 'lucide-react';

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
    <div className="relative overflow-hidden py-12 md:py-20 border-b border-purple-900/20">
      {/* Background radial gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Top Badges */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel-glow border border-purple-500/30 mb-6 animate-float">
          <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
          <span className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" />
            AI Persona: Thầy Phẻo Gieo Quẻ Art Toy Đang Trực
          </span>
          <span className="text-purple-300/60 hidden sm:inline">|</span>
          <span className="text-[11px] text-purple-200 hidden sm:inline font-mono">
            Cloudflare D1 & Workers Serverless
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Săn Hộp Mù <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-purple-300 to-pink-400">Art Toy Đỉnh Chóp</span> <br className="hidden sm:inline" />
          Cùng Trợ Lý AI Phong Thủy
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Biến trải nghiệm mua sắm Blind Box thành cuộc phiêu lưu gieo quẻ may mắn. 
          <strong className="text-amber-300"> Thầy Phẻo AI</strong> tính quẻ, soi vía chọn hộp nổ <strong className="text-pink-300">Secret 1/144</strong>, 
          tự động hóa chốt đơn và sinh mã <strong className="text-emerald-300">VietQR</strong> trong tích tắc!
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
          <button
            onClick={onOpenChat}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-purple-600/40 hover:shadow-purple-600/60 transition-all flex items-center gap-2.5 group"
          >
            <Bot className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
            Gieo Quẻ Cùng Thầy Phẻo AI
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onExploreClick}
            className="px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-bold text-sm sm:text-base border border-slate-700/80 shadow-lg hover:border-purple-500/50 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-amber-400" />
            Chọn Hộp Mù (Blind Box)
          </button>

          <button
            onClick={onGachaClick}
            className="px-5 py-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-sm sm:text-base border border-amber-500/30 transition-all flex items-center gap-2"
          >
            <span>🎲</span>
            Mở Thử Hộp (Gacha Simulator)
          </button>
        </div>

        {/* Highlight Stats Row */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="glass-panel p-3.5 rounded-2xl border border-white/5 text-center">
            <div className="text-xl sm:text-2xl font-black text-amber-400">100%</div>
            <div className="text-xs text-slate-400 mt-0.5">Chính Hãng Pop Mart</div>
          </div>
          <div className="glass-panel p-3.5 rounded-2xl border border-white/5 text-center">
            <div className="text-xl sm:text-2xl font-black text-pink-400">1/144</div>
            <div className="text-xs text-slate-400 mt-0.5">Tỉ Lệ Secret Chuẩn</div>
          </div>
          <div className="glass-panel p-3.5 rounded-2xl border border-white/5 text-center">
            <div className="text-xl sm:text-2xl font-black text-emerald-400">VietQR 24/7</div>
            <div className="text-xs text-slate-400 mt-0.5">Tự Động Chốt Đơn</div>
          </div>
          <div className="glass-panel p-3.5 rounded-2xl border border-white/5 text-center">
            <div className="text-xl sm:text-2xl font-black text-purple-400">&lt; 200ms</div>
            <div className="text-xs text-slate-400 mt-0.5">Cloudflare Serverless</div>
          </div>
        </div>
      </div>
    </div>
  );
};
