import React from 'react';
import { CartItem } from '../types';
import { formatVND } from '../services/vietqr';
import { X, Trash2, ShoppingBag, ArrowRight, Box } from 'lucide-react';

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

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#0e1222] border-l border-purple-900/40 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-purple-900/30 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Giỏ Hàng Art Toy</h3>
              <p className="text-xs text-slate-400">{cartItems.length} mục đã chọn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12">
              <Box className="w-16 h-16 text-slate-700 mb-3" />
              <p className="text-sm font-semibold text-slate-400">Giỏ hàng của bạn đang trống</p>
              <p className="text-xs text-slate-500 mt-1">Hãy chọn series và số hộp để bắt đầu bốc quẻ!</p>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div
                key={idx}
                className="glass-panel p-4 rounded-2xl border border-slate-800 flex gap-3.5 items-start justify-between"
              >
                <img
                  src={item.series.image_url}
                  alt={item.series.name}
                  className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                />
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-sm font-bold text-white truncate">{item.series.name}</h4>
                  <div className="text-[11px] text-purple-300 font-mono mt-0.5">
                    Hộp đã chọn: {item.selectedBoxes.map(b => `#${b}`).join(', ')} ({item.selectedBoxes.length} hộp)
                  </div>
                  <div className="text-sm font-black text-amber-400 mt-1">
                    {formatVND(item.totalPrice)}
                  </div>
                </div>
                <button
                  onClick={() => onRemoveItem(idx)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Xóa khỏi giỏ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-purple-900/40 bg-slate-950/80 space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400">Tổng thanh toán:</span>
              <span className="text-2xl font-black text-amber-400">
                {formatVND(totalAmount)}
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2 group"
            >
              Tiến Hành Thanh Toán & Quét VietQR
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
