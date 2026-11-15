import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, Dice5, Trophy, Menu, X, Sparkles, Compass, Heart, Star, WandSparkles } from 'lucide-react';

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

  const navItems = [
    { id: 'store', label: 'Bộ Sưu Tập', icon: <Heart className="w-4 h-4" /> },
    { id: 'gacha', label: 'Unbox Simulator', icon: <Dice5 className="w-4 h-4" /> },
    { id: 'hall-of-fame', label: 'Hall of Fame', icon: <Trophy className="w-4 h-4" /> },
    { id: 'admin', label: 'Quản Trị', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-2xl border-b border-pink-200/50 shadow-cute">
      {/* Top Announcement Bar - Cute Style */}
      <div className="bg-gradient-to-r from-pink-100 via-peach-100 to-lavender-100 border-b border-pink-200/50 py-2 px-4 text-center">
        <p className="text-xs text-pink-700 font-semibold tracking-wide flex items-center justify-center gap-2 animate-bounce-cute">
          <span className="heart-decoration">💖</span>
          <span>CHÍNH HÃNG 100% POP MART & BANDAI</span>
          <span className="text-pink-300">✨</span>
          <span className="hidden sm:inline">TỶ LỆ SECRET 1/144 MINH BẠCH</span>
          <span className="text-pink-300 hidden sm:inline">✨</span>
          <span>THANH TOÁN VIETQR TỰ ĐỘNG 24/7</span>
          <span className="star-decoration">⭐</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Identity - Cute Style */}
        <div
          onClick={() => onNavigate('store')}
          className="flex items-center gap-4 cursor-pointer group"
        >
          <div className="relative w-12 h-12 rounded-cute bg-cute-gradient border-2 border-pink-300/50 flex items-center justify-center shadow-cute group-hover:scale-110 transition-transform duration-300">
            <WandSparkles className="w-6 h-6 text-pink-500 group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-heartbeat" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-pink-700 tracking-tight text-xl text-gradient-cute">
                THẦY PHẺO
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-cute-full bg-pink-100 text-pink-600 border border-pink-200">
                Studio
              </span>
            </div>
            <p className="text-[11px] text-pink-500 font-medium tracking-wide">
              Art Toy & Blind Box Cute 🎀
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as any)}
              className={`relative px-4 py-2.5 rounded-cute text-xs font-semibold tracking-wide transition-all flex items-center gap-2 ${
                currentView === item.id
                  ? 'bg-cute-gradient text-pink-700 shadow-cute border border-pink-300/50'
                  : 'text-pink-500 hover:text-pink-700 hover:bg-pink-50/50'
              }`}
            >
              <span className={currentView === item.id ? 'text-pink-600' : 'text-pink-400'}>
                {item.icon}
              </span>
              {item.label}
              {currentView === item.id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-pink-500 rounded-full animate-heartbeat" />
              )}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Advisor Button - Cute Style */}
          <button
            onClick={onOpenChat}
            className="btn-cute px-4 py-2.5 text-sm flex items-center gap-2 shadow-glow-pink hidden sm:flex"
          >
            <span className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse" />
            <span>Tư Vấn Phong Thủy AI 🔮</span>
            <Sparkles className="w-4 h-4 animate-bounce-cute" />
          </button>

          <button
            onClick={onOpenChat}
            className="btn-cute p-2.5 sm:hidden"
            aria-label="Tư vấn AI"
          >
            <WandSparkles className="w-5 h-5" />
          </button>

          {/* Cart Trigger - Cute Style */}
          <button
            onClick={onOpenCart}
            aria-label="Giỏ hàng"
            className="relative p-2.5 rounded-cute bg-white/80 hover:bg-white border-2 border-pink-200/50 text-pink-500 hover:text-pink-600 transition-all shadow-cute"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-br from-pink-500 to-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-cute-full flex items-center justify-center border-2 border-white shadow-cute animate-pop-in">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-cute bg-white/80 border-2 border-pink-200/50 text-pink-500 hover:text-pink-600 hover:bg-pink-50/50 transition-all"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer - Cute Style */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-2xl border-t border-pink-200/50 px-4 py-4 space-y-2 animate-pop-in">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id as any); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-cute-lg text-sm font-medium transition-all flex items-center gap-3 ${
                currentView === item.id
                  ? 'bg-cute-gradient text-pink-700 shadow-cute border border-pink-300/50'
                  : 'text-pink-500 hover:text-pink-700 hover:bg-pink-50/50'
              }`}
            >
              <span className={currentView === item.id ? 'text-pink-600' : 'text-pink-400'}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Cute Floating Decorations */}
      <div className="hidden lg:block fixed top-20 right-10 w-6 h-6 pointer-events-none animate-float-gentle">
        <span className="text-3xl">🎀</span>
      </div>
      <div className="hidden lg:block fixed top-40 left-5 w-6 h-6 pointer-events-none animate-float-gentle" style={{ animationDelay: '1s' }}>
        <span className="text-3xl">✨</span>
      </div>
      <div className="hidden lg:block fixed bottom-40 right-5 w-6 h-6 pointer-events-none animate-float-gentle" style={{ animationDelay: '2s' }}>
        <span className="text-3xl">🌸</span>
      </div>
    </header>
  );
};