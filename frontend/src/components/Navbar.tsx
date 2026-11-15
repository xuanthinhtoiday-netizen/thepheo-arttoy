import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, Dice5, Trophy, Menu, X, Sparkles, Compass } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenChat: () => void;
  currentView: 'store' | 'admin' | 'gacha' | 'hall-of-fame';
  onNavigate: (view: 'store' | 'admin' | 'gacha' | 'hall-of-fame') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenChat,
  currentView,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07090e]/90 backdrop-blur-xl border-b border-white/[0.08]">
      {/* Top Announcement Bar */}
      <div className="bg-[#0b0e17] border-b border-white/[0.05] py-1.5 px-4 text-center">
        <p className="text-[11px] text-slate-400 font-medium tracking-wide flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>CHÍNH HÃNG 100% POP MART & BANDAI</span>
          <span className="text-slate-600">•</span>
          <span className="hidden sm:inline">TỶ LỆ SECRET 1/144 MINH BẠCH</span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span>THANH TOÁN VIETQR TỰ ĐỘNG 24/7</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Identity */}
        <div 
          onClick={() => onNavigate('store')} 
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-amber-300 shadow-sm group-hover:border-amber-400/50 transition-colors">
            <Compass className="w-5 h-5 text-amber-300 group-hover:rotate-45 transition-transform duration-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-white tracking-tight text-lg">
                THẦY PHẺO
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                Studio
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              Designer Art Toy & Blind Box
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => onNavigate('store')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              currentView === 'store'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Bộ Sưu Tập
          </button>

          <button
            onClick={() => onNavigate('gacha')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
              currentView === 'gacha'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Dice5 className="w-3.5 h-3.5 text-amber-400" />
            Unbox Simulator
          </button>

          <button
            onClick={() => onNavigate('hall-of-fame')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
              currentView === 'hall-of-fame'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            Hall of Fame
          </button>

          <button
            onClick={() => onNavigate('admin')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
              currentView === 'admin'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Quản Trị D1
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* AI Advisor Button */}
          <button
            onClick={onOpenChat}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 text-xs font-semibold transition-all flex items-center gap-2 shadow-sm hover:border-amber-400/40"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="hidden sm:inline">Tư Vấn Phong Thủy AI</span>
            <span className="sm:hidden">Hỏi AI</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            aria-label="Giỏ hàng"
            className="relative p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0b0e17] border-t border-white/[0.08] px-4 py-3 space-y-1.5 animate-fade-in">
          <button
            onClick={() => { onNavigate('store'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-white/5"
          >
            Bộ Sưu Tập Hộp Mù
          </button>
          <button
            onClick={() => { onNavigate('gacha'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-white/5 flex items-center gap-2"
          >
            <Dice5 className="w-3.5 h-3.5 text-amber-400" />
            Unbox Simulator
          </button>
          <button
            onClick={() => { onNavigate('hall-of-fame'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-white/5 flex items-center gap-2"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            Hall of Fame
          </button>
          <button
            onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-emerald-400 hover:bg-white/5 flex items-center gap-2"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Quản Trị D1 & Đơn Hàng
          </button>
        </div>
      )}
    </header>
  );
};
