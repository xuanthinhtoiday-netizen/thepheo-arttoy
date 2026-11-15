import React from 'react';
import { ShieldCheck, Zap, Database, Heart, Compass } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#07090e] mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Persona */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-amber-300">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-display font-extrabold text-lg text-white tracking-tight">
                THẦY PHẺO STUDIO
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Nền tảng thương mại điện tử ngách chuyên biệt mô hình Art Toy & Blind Box (Pop Mart, Skullpanda, Crybaby, Gundam). Tích hợp trợ lý AI "Thầy Phẻo Gieo Quẻ" tự động hóa tư vấn phong thủy, chọn hộp và thanh toán VietQR tức thì.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-slate-400 text-[10px] font-mono">
                Cloudflare Pages
              </span>
              <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-slate-400 text-[10px] font-mono">
                Cloudflare Workers
              </span>
              <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-slate-400 text-[10px] font-mono">
                D1 SQLite
              </span>
              <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-slate-400 text-[10px] font-mono">
                VietQR Napas 24/7
              </span>
            </div>
          </div>

          {/* Col 2: Blind Box Series */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">
              Series Nổi Bật
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="hover:text-white transition-colors cursor-pointer">SKULLPANDA The Warmth</li>
              <li className="hover:text-white transition-colors cursor-pointer">CRYBABY Sunset Concert</li>
              <li className="hover:text-white transition-colors cursor-pointer">GUNDAM Universe Gold Armor</li>
              <li className="hover:text-white transition-colors cursor-pointer">DIMOO Animal Kingdom</li>
              <li className="hover:text-white transition-colors cursor-pointer">HIRONO City of Mercy</li>
            </ul>
          </div>

          {/* Col 3: Cam kết */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">
              Cam Kết Tiệm
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                100% Chính Hãng Nguyên Seal
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                Tỉ lệ Secret Chase minh bạch 1/144
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <Database className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                Đóng gói 3 lớp chống móp hộp
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © 2026 Thầy Phẻo Art Toy. Vận hành trên hạ tầng Cloudflare Serverless.
          </div>
          <div className="flex items-center gap-1">
            Thiết kế dành cho cộng đồng nhà sưu tầm Art Toy
          </div>
        </div>
      </div>
    </footer>
  );
};
