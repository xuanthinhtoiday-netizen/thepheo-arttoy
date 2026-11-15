import React from 'react';
import { CartItem } from '../types';
import { formatVND } from '../services/vietqr';
import { X, Trash2, ShoppingBag, ArrowRight, Box, Heart, Star, Sparkles, Gift, Crown, Zap, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalBoxes = cartItems.reduce((sum, item) => sum + item.selectedBoxes.length, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-pink-900/30 backdrop-blur-sm animate-fade-in">
      {/* Cute Floating Decorations */}
      <div className="hidden lg:block absolute top-10 -left-5 w-12 h-12 animate-float-gentle pointer-events-none">
        <span className="text-5xl">🎀</span>
      </div>
      <div className="hidden lg:block absolute top-30 -right-5 w-10 h-10 animate-float-gentle pointer-events-none" style={{ animationDelay: '1s' }}>
        <span className="text-4xl">✨</span>
      </div>

      <div className="w-full max-w-md surface-cute-elevated border-l-2 border-pink-300/50 h-full flex flex-col shadow-glow-pink animate-pop-in">
        {/* Header - Cute */}
        <div className="p-5 border-b border-pink-200/50 flex items-center justify-between bg-cute-gradient/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-cute bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-cute">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-pink-800 text-gradient-cute">Giỏ Hàng Art Toy 🛍️</h3>
              <p className="text-xs text-pink-500">{cartItems.length} series • {totalBoxes} hộp đã chọn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-cute-ghost p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List - Cute */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-pink-500 py-12 animate-bounce-cute">
              <Gift className="w-16 h-16 text-pink-300 mb-4 animate-bounce-cute" />
              <p className="text-sm font-semibold text-pink-600">Giỏ hàng đang trống 🥺</p>
              <p className="text-xs text-pink-400 mt-1">Chọn hộp trên khay để thêm vào giỏ nhé! 💖</p>
              <div className="mt-4 flex items-center gap-2">
                <Heart className="w-4 h-4 animate-heartbeat" />
                <Star className="w-4 h-4 animate-bounce-cute" />
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div
                key={idx}
                className="surface-cute p-4 rounded-cute-lg flex gap-3 items-center justify-between border-2 border-pink-200/50 animate-pop-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="relative w-16 h-16 rounded-cute overflow-hidden flex-shrink-0 img-frame-cute">
                  <img
                    src={item.series.image_url}
                    alt={item.series.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-cute">
                    {item.selectedBoxes.length}
                  </span>
                </div>
                <div className="flex-1 overflow-hidden min-w-0">
                  <h4 className="text-sm font-extrabold text-pink-700 truncate">{item.series.name}</h4>
                  <div className="text-xs text-pink-500 font-mono mt-1 flex items-center gap-1">
                    <Box className="w-3 h-3" />
                    Hộp: {item.selectedBoxes.map(b => `#${b}`).join(', ')} ({item.selectedBoxes.length} hộp)
                  </div>
                  <div className="text-sm font-extrabold text-gradient-peach mt-1 font-display">
                    {formatVND(item.totalPrice)}
                  </div>
                </div>
                <button
                  onClick={() => onRemoveItem(idx)}
                  className="btn-cute-ghost p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50/50"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary - Cute */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-pink-200/50 bg-cute-gradient/50 space-y-3 animate-pop-in">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-pink-500">Tổng thanh toán:</span>
              <span className="text-2xl font-extrabold text-gradient-peach font-display">
                {formatVND(totalAmount)}
              </span>
            </div>

            <div className="surface-cute p-3 rounded-cute border border-pink-200/50">
              <div className="flex items-center justify-between text-xs text-pink-500 mb-1">
                <span>Số lượng hộp</span>
                <span className="font-bold text-pink-700">{totalBoxes} hộp</span>
              </div>
              <div className="flex items-center justify-between text-xs text-pink-500">
                <span>Series khác nhau</span>
                <span className="font-bold text-pink-700">{cartItems.length} series</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="btn-cute-peach w-full py-3.5 text-sm flex items-center justify-center gap-3 shadow-glow-peach"
            >
              <Zap className="w-4 h-4" />
              Tiến Hành Thanh Toán & Quét VietQR ⚡
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-center text-xs text-pink-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Thanh toán an toàn, xác nhận tức thì 24/7
            </p>
          </div>
        )}
      </div>
    </div>
  );
};