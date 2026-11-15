import React from 'react';
import { ShieldCheck, Zap, Database, Heart, Compass, Star, Sparkles, Gift, Crown, WandSparkles, Box, Wifi, Server, Database as DatabaseIcon } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-pink-200/50 bg-cute-gradient/50 mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cute Floating Decorations */}
        <div className="hidden lg:block absolute top-10 -left-5 w-12 h-12 animate-float-gentle pointer-events-none">
          <span className="text-5xl">🎀</span>
        </div>
        <div className="hidden lg:block absolute top-20 -right-5 w-10 h-10 animate-float-gentle pointer-events-none" style={{ animationDelay: '1s' }}>
          <span className="text-4xl">✨</span>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Persona - Cute */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-cute bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-cute">
                <WandSparkles className="w-5 h-5" />
              </div>
              <span className="font-display font-extrabold text-xl text-pink-800 text-gradient-cute tracking-tight">
                THẦY PHẺO STUDIO
              </span>
            </div>
            <p className="text-sm text-pink-600 max-w-md leading-relaxed">
              Nền tảng thương mại điện tử ngách chuyên biệt mô hình Art Toy & Blind Box (Pop Mart, Skullpanda, Crybaby, Gundam). Tích hợp trợ lý AI "Thầy Phẻo Gieo Quẻ" tự động hóa tư vấn phong thủy, chọn hộp và thanh toán VietQR tức thì! 💖
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="tag-cute">
                <Wifi className="w-3 h-3" />
                Cloudflare Pages
              </span>
              <span className="tag-cute">
                <Server className="w-3 h-3" />
                Cloudflare Workers
              </span>
              <span className="tag-cute">
                <DatabaseIcon className="w-3 h-3" />
                D1 SQLite
              </span>
              <span className="tag-cute">
                <Zap className="w-3 h-3" />
                VietQR Napas 24/7
              </span>
              <span className="tag-cute">
                <Sparkles className="w-3 h-3" />
                Vectorize RAG
              </span>
              <span className="tag-cute">
                <Gift className="w-3 h-3" />
                KV Cache
              </span>
            </div>
          </div>

          {/* Col 2: Blind Box Series - Cute */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-pink-700 uppercase tracking-wider flex items-center gap-1">
              <Crown className="w-4 h-4" />
              Series Nổi Bật
            </h4>
            <ul className="space-y-2 text-sm text-pink-500">
              <li className="hover:text-pink-700 transition-colors cursor-pointer flex items-center gap-2 animate-pop-in" style={{ animationDelay: '50ms' }}>
                <Box className="w-3.5 h-3.5" /> SKULLPANDA The Warmth
              </li>
              <li className="hover:text-pink-700 transition-colors cursor-pointer flex items-center gap-2 animate-pop-in" style={{ animationDelay: '100ms' }}>
                <Box className="w-3.5 h-3.5" /> CRYBABY Sunset Concert
              </li>
              <li className="hover:text-pink-700 transition-colors cursor-pointer flex items-center gap-2 animate-pop-in" style={{ animationDelay: '150ms' }}>
                <Box className="w-3.5 h-3.5" /> GUNDAM Universe Gold Armor
              </li>
              <li className="hover:text-pink-700 transition-colors cursor-pointer flex items-center gap-2 animate-pop-in" style={{ animationDelay: '200ms' }}>
                <Box className="w-3.5 h-3.5" /> DIMOO Animal Kingdom
              </li>
              <li className="hover:text-pink-700 transition-colors cursor-pointer flex items-center gap-2 animate-pop-in" style={{ animationDelay: '250ms' }}>
                <Box className="w-3.5 h-3.5" /> HIRONO City of Mercy
              </li>
            </ul>
          </div>

          {/* Col 3: Cam kết - Cute */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-pink-700 uppercase tracking-wider flex items-center gap-1">
              <Heart className="w-4 h-4" />
              Cam Kết Tiệm
            </h4>
            <ul className="space-y-2.5 text-sm text-pink-600">
              <li className="flex items-center gap-2 text-pink-700 animate-pop-in" style={{ animationDelay: '50ms' }}>
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                100% Chính Hãng Nguyên Seal 🎁
              </li>
              <li className="flex items-center gap-2 text-pink-700 animate-pop-in" style={{ animationDelay: '100ms' }}>
                <Zap className="w-4 h-4 text-peach-500 shrink-0" />
                Tỉ lệ Secret Chase minh bạch 1/144 ✨
              </li>
              <li className="flex items-center gap-2 text-pink-700 animate-pop-in" style={{ animationDelay: '150ms' }}>
                <DatabaseIcon className="w-4 h-4 text-lavender-500 shrink-0" />
                Đóng gói 3 lớp chống móp hộp 📦
              </li>
              <li className="flex items-center gap-2 text-pink-700 animate-pop-in" style={{ animationDelay: '200ms' }}>
                <WandSparkles className="w-4 h-4 text-rose-500 shrink-0" />
                AI Phong Thủy tư vấn miễn phí 🔮
              </li>
              <li className="flex items-center gap-2 text-pink-700 animate-pop-in" style={{ animationDelay: '250ms' }}>
                <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
                Thanh toán VietQR tức thì 24/7 ⚡
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright - Cute */}
        <div className="relative pt-6 border-t border-pink-200/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-pink-500">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="heart-decoration">💖</span>
            © 2026 Thầy Phẻo Art Toy. Vận hành trên hạ tầng Cloudflare Serverless.
          </div>
          <div className="flex items-center gap-3 text-center sm:text-right">
            <span className="flex items-center gap-1">Thiết kế dành cho cộng đồng nhà sưu tầm Art Toy</span>
            <span className="star-decoration">⭐</span>
          </div>
        </div>
      </div>
    </footer>
  );
};