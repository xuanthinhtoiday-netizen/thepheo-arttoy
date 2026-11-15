import React, { useState } from 'react';
import { Sparkles, ShoppingBag, ShieldCheck, Dice5, Trophy, Menu, X, Bot } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('store')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 p-[2px] shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/50 transition-all duration-300">
              <div className="w-full h-full bg-[#0d101d] rounded-2xl flex items-center justify-center">
                <span className="text-xl">🔮</span>
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-purple-300 to-pink-300 tracking-wider text-lg sm:text-xl">
                THẦY PHẺO
              </span>
              <span className="bg-purple-900/70 border border-purple-500/40 text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Art Toy
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Mystery Box & Blind Box Phong Thủy AI
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => onNavigate('store')}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              currentView === 'store'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Bộ Sưu Tập
          </button>

          <button
            onClick={() => onNavigate('gacha')}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              currentView === 'gacha'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Dice5 className="w-4 h-4 text-pink-400" />
            Bốc Hộp Thử Vận
          </button>

          <button
            onClick={() => onNavigate('hall-of-fame')}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              currentView === 'hall-of-fame'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            Hall of Fame
          </button>

          <button
            onClick={() => onNavigate('admin')}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              currentView === 'admin'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Admin D1
          </button>
        </nav>

        {/* Action Buttons: Chat AI + Cart */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Button Chatbot Thầy Phẻo */}
          <button
            onClick={onOpenChat}
            className="relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all flex items-center gap-2 group"
          >
            <Bot className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Hỏi Thầy Phẻo AI</span>
            <span className="sm:hidden">Hỏi Thầy</span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            aria-label="Giỏ hàng"
            className="relative p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 transition-all"
          >
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel-glow border-t border-purple-800/40 px-4 py-3 space-y-2">
          <button
            onClick={() => { onNavigate('store'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-3 text-slate-200 hover:bg-purple-600/20"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Bộ Sưu Tập Hộp Mù
          </button>
          <button
            onClick={() => { onNavigate('gacha'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-3 text-slate-200 hover:bg-purple-600/20"
          >
            <Dice5 className="w-4 h-4 text-pink-400" />
            Bốc Hộp Thử Vận May (Gacha Roll)
          </button>
          <button
            onClick={() => { onNavigate('hall-of-fame'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-3 text-slate-200 hover:bg-purple-600/20"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            Hall of Fame (Khui Secret)
          </button>
          <button
            onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-3 text-emerald-300 hover:bg-emerald-600/20"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Admin Dashboard & D1 Kho Hàng
          </button>
        </div>
      )}
    </header>
  );
};
