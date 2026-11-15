import React from 'react';
import { Sparkles, ShieldCheck, Zap, Database, Server, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="glass-panel border-t border-purple-900/30 mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Persona */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🔮</span>
              <span className="font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-purple-300 to-pink-300">
                THẦY PHẺO ART TOY
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              Hệ thống thương mại điện tử ngách chuyên biệt mô hình Art Toy & Blind Box (Pop Mart, Skullpanda, Crybaby, Gundam). Tích hợp trợ lý AI "Thầy Phẻo Gieo Quẻ" tự động hóa tư vấn phong thủy, chọn hộp và thanh toán VietQR tức thì.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-purple-900/40 border border-purple-500/20 text-purple-300 text-[11px] font-mono">
                ⚡ Cloudflare Workers
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-900/40 border border-amber-500/20 text-amber-300 text-[11px] font-mono">
                🗄️ Cloudflare D1 SQLite
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-pink-900/40 border border-pink-500/20 text-pink-300 text-[11px] font-mono">
                🤖 Google Gemini AI Gateway
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-900/40 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono">
                💳 VietQR Napas 24/7
              </span>
            </div>
          </div>

          {/* Col 2: Blind Box Series */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Dòng Hộp Mù Nổi Bật
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-purple-300 cursor-pointer">SKULLPANDA The Warmth</li>
              <li className="hover:text-purple-300 cursor-pointer">CRYBABY Sunset Concert</li>
              <li className="hover:text-purple-300 cursor-pointer">GUNDAM Universe Gold Armor</li>
              <li className="hover:text-purple-300 cursor-pointer">DIMOO Animal Kingdom</li>
              <li className="hover:text-purple-300 cursor-pointer">HIRONO City of Mercy</li>
            </ul>
          </div>

          {/* Col 3: Cam kết & Bảo chứng */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Cam Kết Tiệm Thầy Phẻo
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                100% Chính Hãng Pop Mart & Bandai
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                Nguyên Seal niêm phong chuẩn nhà sản xuất
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <Zap className="w-4 h-4 text-purple-400 shrink-0" />
                Tỉ lệ Secret Chase minh bạch 1/144
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <Database className="w-4 h-4 text-pink-400 shrink-0" />
                Giao hàng bọc bóng khí 3 lớp chống móp hộp
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © 2026 Thầy Phẻo Art Toy. Phát triển trên Cloudflare Serverless Architecture Stack.
          </div>
          <div className="flex items-center gap-1">
            Thiết kế dành cho Gen Z Collectors với <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
