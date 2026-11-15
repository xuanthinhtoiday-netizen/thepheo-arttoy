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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#0b0e17] border-l border-white/10 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#080a12]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-300">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Giỏ Hàng Art Toy</h3>
              <p className="text-[11px] text-slate-500">{cartItems.length} mục đã chọn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12">
              <Box className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-xs font-medium text-slate-400">Giỏ hàng đang trống</p>
              <p className="text-[11px] text-slate-600 mt-1">Chọn hộp trên khay để thêm vào giỏ</p>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div
                key={idx}
                className="surface-card p-3.5 rounded-xl flex gap-3 items-center justify-between"
              >
                <img
                  src={item.series.image_url}
                  alt={item.series.name}
                  className="w-14 h-14 rounded-lg object-cover border border-white/10 shrink-0"
                />
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-xs font-bold text-white truncate">{item.series.name}</h4>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Hộp: {item.selectedBoxes.map(b => `#${b}`).join(', ')} ({item.selectedBoxes.length} hộp)
                  </div>
                  <div className="text-xs font-bold text-amber-400 mt-1 font-display">
                    {formatVND(item.totalPrice)}
                  </div>
                </div>
                <button
                  onClick={() => onRemoveItem(idx)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                  title="Xóa"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-white/[0.08] bg-[#080a12] space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500">Tổng thanh toán:</span>
              <span className="text-xl font-black text-amber-400 font-display">
                {formatVND(totalAmount)}
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              Tiến Hành Thanh Toán & Quét VietQR
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
