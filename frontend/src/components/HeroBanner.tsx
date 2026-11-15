import React from 'react';
import { ArrowRight, Sparkles, Heart, WandSparkles, Gift, Crown, Dice5 } from 'lucide-react';

interface HeroBannerProps {
  onOpenChat: () => void;
  onExploreClick: () => void;
  onGachaClick: () => void;
}

/**
 * Brand artwork: chuoi "Minion Mystery Box" kawaii ve bang SVG
 * Mau sac thuong hieu: pink #ec4899 -> peach #fb923c -> lavender #a855f7 tren nen trang white/hong nhat.
 */
const BrandArtwork: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 560 460" className={className} aria-hidden="true" role="img">
    <defs>
      <linearGradient id="bb-box" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f9a8d4" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
      <linearGradient id="bb-lid" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fbcfe8" />
        <stop offset="100%" stopColor="#f472b6" />
      </linearGradient>
      <linearGradient id="bb-ribbon" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fde68a" />
        <stop offset="100%" stopColor="#fb923c" />
      </linearGradient>
      <linearGradient id="bb-mini" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d8b4fe" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
      <linearGradient id="bb-mini2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fda4af" />
        <stop offset="100%" stopColor="#f43f5e" />
      </linearGradient>
      <radialGradient id="bb-glow" cx="50%" cy="45%" r="55%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="70%" stopColor="#fdf2f8" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#fce7f3" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Backdrop glow + clouds */}
    <circle cx="280" cy="235" r="215" fill="url(#bb-glow)" />
    <g fill="#ffffff" opacity="0.9">
      <ellipse cx="105" cy="80" rx="46" ry="20" />
      <ellipse cx="140" cy="66" rx="34" ry="16" />
      <ellipse cx="455" cy="105" rx="50" ry="21" />
      <ellipse cx="490" cy="90" rx="32" ry="15" />
    </g>

    {/* Floating hearts & stars */}
    <g className="animate-float-gentle">
      <path d="M70 150c-8-10-24-4-24 8 0 10 12 18 24 26 12-8 24-16 24-26 0-12-16-18-24-8z" fill="#f472b6" />
    </g>
    <g className="animate-float-gentle" style={{ animationDelay: '0.8s' }}>
      <path d="M480 190c-7-9-21-4-21 7 0 9 10 16 21 23 11-7 21-14 21-23 0-11-14-16-21-7z" fill="#fb923c" />
    </g>
    <g className="animate-bounce-cute">
      <path d="M120 300l4 12 12 4-12 4-4 12-4-12-12-4 12-4z" fill="#fbbf24" />
    </g>
    <g className="animate-bounce-cute" style={{ animationDelay: '0.4s' }}>
      <path d="M455 300l4 12 12 4-12 4-4 12-4-12-12-4 12-4z" fill="#c084fc" />
    </g>
    <g className="animate-wiggle">
      <path d="M415 60l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill="#f472b6" />
    </g>
    <g className="animate-wiggle" style={{ animationDelay: '0.6s' }}>
      <path d="M145 105l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill="#fb7185" />
    </g>

    {/* Ground shadow */}
    <ellipse cx="280" cy="418" rx="130" ry="18" fill="#fbcfe8" opacity="0.7" />
    <ellipse cx="110" cy="430" rx="46" ry="10" fill="#fbcfe8" opacity="0.6" />
    <ellipse cx="455" cy="430" rx="46" ry="10" fill="#fbcfe8" opacity="0.6" />

    {/* Main mystery box */}
    <g className="animate-float-gentle" style={{ animationDuration: '5s' }}>
      {/* Body */}
      <rect x="180" y="215" width="200" height="160" rx="26" fill="url(#bb-box)" />
      {/* Vertical ribbon */}
      <rect x="268" y="215" width="26" height="160" fill="url(#bb-ribbon)" opacity="0.95" />
      {/* Lid */}
      <rect x="168" y="180" width="224" height="46" rx="20" fill="url(#bb-lid)" />
      {/* Horizontal ribbon on lid */}
      <rect x="168" y="198" width="224" height="13" fill="url(#bb-ribbon)" opacity="0.95" />
      {/* Bow */}
      <g fill="#fde68a" stroke="#fb923c" strokeWidth="3">
        <ellipse cx="252" cy="172" rx="26" ry="15" transform="rotate(-18 252 172)" />
        <ellipse cx="308" cy="172" rx="26" ry="15" transform="rotate(18 308 172)" />
        <circle cx="280" cy="176" r="10" fill="#fb923c" stroke="none" />
      </g>
      {/* Kawaii face */}
      <g>
        <circle cx="238" cy="292" r="13" fill="#ffffff" />
        <circle cx="322" cy="292" r="13" fill="#ffffff" />
        <circle cx="240" cy="294" r="7" fill="#831843" />
        <circle cx="324" cy="294" r="7" fill="#831843" />
        <circle cx="243" cy="291" r="2.5" fill="#ffffff" />
        <circle cx="327" cy="291" r="2.5" fill="#ffffff" />
        <ellipse cx="222" cy="312" rx="9" ry="5" fill="#fb7185" opacity="0.65" />
        <ellipse cx="338" cy="312" rx="9" ry="5" fill="#fb7185" opacity="0.65" />
        <path d="M266 310q14 12 28 0" stroke="#831843" strokeWidth="5" strokeLinecap="round" fill="none" />
      </g>
      {/* Secret tag */}
      <g transform="rotate(-8 360 240)">
        <rect x="330" y="226" width="98" height="28" rx="14" fill="#ffffff" stroke="#f472b6" strokeWidth="2" />
        <text x="379" y="244" textAnchor="middle" fontSize="13" fontWeight="800" fill="#db2777" fontFamily="Quicksand, sans-serif">
          SECRET 1/144
        </text>
      </g>
    </g>

    {/* Mini lavender box */}
    <g className="animate-float-gentle" style={{ animationDelay: '1.2s', animationDuration: '6s' }}>
      <rect x="62" y="352" width="96" height="72" rx="16" fill="url(#bb-mini)" />
      <rect x="100" y="352" width="16" height="72" fill="#fde68a" opacity="0.9" />
      <rect x="54" y="336" width="112" height="26" rx="13" fill="#c084fc" />
      <circle cx="110" cy="392" r="7" fill="#ffffff" />
      <circle cx="66" cy="392" r="7" fill="#ffffff" />
      <circle cx="111" cy="393" r="3.5" fill="#581c87" />
      <circle cx="67" cy="393" r="3.5" fill="#581c87" />
    </g>

    {/* Mini rose box */}
    <g className="animate-float-gentle" style={{ animationDelay: '2s', animationDuration: '6.5s' }}>
      <rect x="402" y="352" width="96" height="72" rx="16" fill="url(#bb-mini2)" />
      <rect x="440" y="352" width="16" height="72" fill="#fde68a" opacity="0.9" />
      <rect x="394" y="336" width="112" height="26" rx="13" fill="#fb7185" />
      <circle cx="450" cy="392" r="7" fill="#ffffff" />
      <circle cx="406" cy="392" r="7" fill="#ffffff" />
      <circle cx="451" cy="393" r="3.5" fill="#881337" />
      <circle cx="407" cy="393" r="3.5" fill="#881337" />
    </g>

    {/* Tiny sparkles */}
    <g fill="#fdf2f8">
      <path d="M280 30l2.5 7 7 2.5-7 2.5-2.5 7-2.5-7-7-2.5 7-2.5z" />
      <path d="M210 140l2 5.5 5.5 2-5.5 2-2 5.5-2-5.5-5.5-2 5.5-2z" />
      <path d="M350 140l2 5.5 5.5 2-5.5 2-2 5.5-2-5.5-5.5-2 5.5-2z" />
    </g>
  </svg>
);

const MARQUEE_ITEMS = [
  'HỘP MÙ PHONG THỦY 🎀',
  'SECRET CHASE 1/144 ✨',
  'NGUYÊN SEAL POP MART 💖',
  'VIETQR TỰ ĐỘNG 24/7 ⚡',
  'THẦY PHẺO GIEO QUẺ 🔮',
  'MIỄN PHÍ SHIP TỪ 500K 🚚',
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenChat,
  onExploreClick,
  onGachaClick,
}) => {
  return (
    <section className="relative overflow-hidden bg-cute-gradient">
      {/* Soft brand blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-pink-200/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-peach-200/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-lavender-200/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* Left: brand headline + CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-cute-full bg-white/80 border-2 border-pink-200/50 text-pink-700 text-xs font-semibold shadow-cute animate-bounce-cute">
              <span className="heart-decoration">💖</span>
              <span>Bộ Sưu Tập Art Toy Mùa Thu 2024</span>
              <span className="text-pink-300">✨</span>
              <span className="text-peach-500 font-bold">100% Pop Mart & Bandai</span>
              <span className="star-decoration">⭐</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-pink-800 tracking-tight leading-[1.15]">
              Nghệ Thuật Sưu Tầm <br />
              <span className="text-gradient-cute">Blind Box & Mystery Toy 🎁</span>
            </h1>

            <p className="text-pink-600 text-base sm:text-lg leading-relaxed max-w-xl">
              Nền tảng mua sắm mô hình nghệ thuật giới hạn kết hợp trợ lý AI{' '}
              <strong className="text-pink-700">"Thầy Phẻo Gieo Quẻ"</strong> dễ thương! Phân tích xác suất,
              soi vía chọn hộp nổ <strong className="text-rose-500">Secret Chase 1/144</strong> và tự động hóa
              thanh toán VietQR trong tích tắc.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="btn-cute px-8 py-3.5 text-base flex items-center gap-3 shadow-glow-pink animate-pop-in"
              >
                <Heart className="w-5 h-5 animate-heartbeat" />
                Khám Phá Các Khay Hộp Mù
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onOpenChat}
                className="btn-cute-lavender px-8 py-3.5 text-base flex items-center gap-3 shadow-cute"
              >
                <WandSparkles className="w-5 h-5 animate-wiggle" />
                Nhờ Thầy Phẻo Soi Vía 🔮
                <Sparkles className="w-5 h-5 animate-bounce-cute" />
              </button>

              <button
                onClick={onGachaClick}
                className="btn-cute-peach px-6 py-3.5 text-base flex items-center gap-2 shadow-cute"
              >
                <Gift className="w-5 h-5 animate-bounce-cute" />
                Mở Thử Hộp (Simulator) 🎲
              </button>
            </div>

            {/* Trust metric pills */}
            <div className="pt-6 grid grid-cols-3 gap-3 max-w-lg">
              <div className="surface-cute p-4 text-center animate-pop-in" style={{ animationDelay: '100ms' }}>
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-gradient-cute">1/144</div>
                <div className="text-xs text-pink-500 mt-1 font-medium">Tỷ Lệ Secret Chuẩn</div>
                <div className="text-xs text-pink-300 mt-0.5">✨ Minh Bạch ✨</div>
              </div>
              <div className="surface-cute p-4 text-center animate-pop-in" style={{ animationDelay: '200ms' }}>
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-gradient-peach">Nguyên Seal</div>
                <div className="text-xs text-pink-500 mt-1 font-medium">Niêm Phong Nhà SX</div>
                <div className="text-xs text-pink-300 mt-0.5">🎁 Chính Hãng 🎁</div>
              </div>
              <div className="surface-cute p-4 text-center animate-pop-in" style={{ animationDelay: '300ms' }}>
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-pink-500">VietQR 24/7</div>
                <div className="text-xs text-pink-500 mt-1 font-medium">Xác Nhận Tức Thì</div>
                <div className="text-xs text-pink-300 mt-0.5">⚡ Siêu Tốc ⚡</div>
              </div>
            </div>
          </div>

          {/* Right: big brand artwork */}
          <div className="lg:col-span-5 relative">
            <div className="relative animate-pop-in" style={{ animationDelay: '400ms' }}>
              <BrandArtwork className="w-full h-auto drop-shadow-xl" />
              {/* Floating featured chip */}
              <div className="absolute top-2 right-2 sm:right-6 surface-cute px-4 py-2.5 rounded-cute-full border-2 border-pink-200/50 shadow-cute-lg flex items-center gap-2 animate-float-gentle">
                <Crown className="w-4 h-4 text-peach-500" />
                <span className="text-xs font-extrabold text-pink-700">Featured Drop: SKULLPANDA The Warmth</span>
              </div>
              <div className="absolute bottom-4 left-2 sm:left-6 badge-cute-pink px-4 py-2 rounded-cute-full text-xs font-black shadow-cute-lg animate-float-gentle" style={{ animationDelay: '0.6s' }}>
                <Dice5 className="w-3.5 h-3.5 inline-block mr-1" /> Còn 8/12 hộp trong khay!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand marquee strip */}
      <div className="relative bg-cute-pink border-y-2 border-pink-300/40 py-3 overflow-hidden shadow-cute">
        <div className="flex whitespace-nowrap animate-marquee w-max">
          {[0, 1].map(dup => (
            <div key={dup} className="flex items-center gap-8 pr-8" aria-hidden={dup === 1}>
              {MARQUEE_ITEMS.map((item, i) => (
                <span key={i} className="flex items-center gap-2 text-white text-sm font-extrabold tracking-wide drop-shadow-sm">
                  {item}
                  <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
