import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CartItem, Order } from '../types';
import { generateVietQRUrl, formatVND, DEFAULT_VIETQR_CONFIG } from '../services/vietqr';
import { storage } from '../services/storage';
import {
  X, CheckCircle2, Copy, Check, QrCode, ArrowRight, Truck, Heart, Star, Sparkles, Gift, Crown, WandSparkles, ShieldCheck, Zap, Box
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  directOrderData?: {
    seriesId?: string;
    seriesName: string;
    boxNumbers: number[];
    totalAmount: number;
  };
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  directOrderData,
  onOrderSuccess,
}) => {
  // Tu dong ghi nho & dien lai thong tin khach hang tu don hang truoc do
  const [customerName, setCustomerName] = useState(() => storage.getLastCustomer()?.name || '');
  const [customerPhone, setCustomerPhone] = useState(() => storage.getLastCustomer()?.phone || '');
  const [customerAddress, setCustomerAddress] = useState(() => storage.getLastCustomer()?.address || '');
  const [wasRemembered] = useState(() => !!storage.getLastCustomer()?.phone);
  const [step, setStep] = useState<'INFO' | 'PAYMENT' | 'COMPLETED'>('INFO');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalAmount = directOrderData
    ? directOrderData.totalAmount
    : cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleGeneratePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) {
      alert('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng! 🥺');
      return;
    }

    const customer = storage.saveCustomer({
      id: `cust-${Date.now()}`,
      name: customerName,
      phone: customerPhone,
      address: customerAddress
    });

    let orderedBoxesList: string[] = [];
    let seriesName = '';

    if (directOrderData) {
      seriesName = directOrderData.seriesName;
      orderedBoxesList = directOrderData.boxNumbers.map(b => `${directOrderData.seriesName.slice(0, 8)}-Box#${b < 10 ? '0' + b : b}`);
      if (directOrderData.seriesId) {
        storage.recordSoldBoxes(directOrderData.seriesId, directOrderData.boxNumbers);
      }
    } else {
      seriesName = cartItems.map(c => c.series.name).join(', ');
      orderedBoxesList = cartItems.flatMap(c =>
        c.selectedBoxes.map(b => `${c.series.name.slice(0, 8)}-Box#${b < 10 ? '0' + b : b}`)
      );
      cartItems.forEach(item => {
        storage.recordSoldBoxes(item.series.id, item.selectedBoxes);
      });
    }

    const newOrder = storage.createOrder({
      customer_id: customer.id,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_address: customerAddress,
      series_name: seriesName,
      total_amount: totalAmount,
      status: 'PENDING_PAYMENT',
      ordered_items_json: JSON.stringify(orderedBoxesList)
    });

    setCreatedOrder(newOrder);
    setStep('PAYMENT');
  };

  const handleConfirmPaid = () => {
    if (!createdOrder) return;
    const updated = storage.updateOrderStatus(createdOrder.id, 'PAID');
    if (updated) {
      setCreatedOrder(updated);
      onOrderSuccess(updated);
    }
    setStep('COMPLETED');

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ec4899', '#f472b6', '#f9a8d4', '#a855f7', '#fb923c', '#fdba74']
    });
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const qrUrl = createdOrder
    ? generateVietQRUrl(createdOrder.total_amount, createdOrder.id)
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-900/40 backdrop-blur-md animate-fade-in">
      {/* Cute Floating Decorations */}
      <div className="hidden lg:block absolute top-10 -left-5 w-12 h-12 animate-float-gentle pointer-events-none">
        <span className="text-5xl">🎀</span>
      </div>
      <div className="hidden lg:block absolute top-20 -right-5 w-10 h-10 animate-float-gentle pointer-events-none" style={{ animationDelay: '1s' }}>
        <span className="text-4xl">✨</span>
      </div>

      <div className="relative w-full max-w-lg surface-cute-elevated rounded-cute-xl overflow-hidden border-2 border-pink-300/50 flex flex-col max-h-[90vh] shadow-glow-pink animate-pop-in">
        {/* Header - Cute */}
        <div className="p-4 sm:p-5 border-b border-pink-200/50 flex items-center justify-between bg-cute-gradient/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-cute bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-cute">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-pink-800 text-gradient-cute">
                {step === 'INFO' && 'Thông Tin Nhận Hàng 📝'}
                {step === 'PAYMENT' && 'Quét Mã VietQR Chuyển Khoản ⚡'}
                {step === 'COMPLETED' && 'Đặt Hàng Thành Công 🎉'}
              </h3>
              <p className="text-xs text-pink-500">
                Xử lý tự động hóa trên Cloudflare Workers 💖
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-cute-ghost p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content - Cute */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">

          {/* STEP 1: INFO FORM - Cute */}
          {step === 'INFO' && (
            <form onSubmit={handleGeneratePayment} className="space-y-4">
              <div className="surface-cute p-4 rounded-cute-lg border-2 border-pink-200/50 flex items-center justify-between">
                <div>
                  <span className="text-xs text-pink-400">Tổng thanh toán:</span>
                  <div className="text-xl font-extrabold text-gradient-peach font-display">
                    {formatVND(totalAmount)}
                  </div>
                </div>
                <span className="text-xs text-pink-600 bg-pink-100 px-3 py-1.5 rounded-cute-full font-mono border border-pink-200/50">
                  {directOrderData ? `${directOrderData.boxNumbers.length} Hộp 🎁` : `${cartItems.length} Series ✨`}
                </span>
              </div>

              {wasRemembered && (
                <div className="surface-cute p-3 rounded-cute-lg border-2 border-pink-200/60 bg-pink-50/80 text-xs text-pink-600 flex items-start gap-2 animate-pop-in">
                  <Heart className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-pink-700">Thầy Phẻo đã ghi nhớ thông tin</strong> từ đơn hàng trước của bạn rồi!
                    Kiểm tra lại cho chính xác rồi chốt đơn tiếp nhé 💖
                  </span>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-pink-600 block mb-1.5 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" />
                  Họ và tên người nhận:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn Phát 💖"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="input-cute text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-pink-600 block mb-1.5 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5" />
                  Số điện thoại nhận hàng:
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ví dụ: 0988776655 ✨"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="input-cute text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-pink-600 block mb-1.5 flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5" />
                  Địa chỉ giao hàng:
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố... 🏠"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="input-cute text-sm resize-none"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-cute-peach w-full py-3.5 text-sm flex items-center justify-center gap-3 shadow-glow-peach"
                >
                  <Zap className="w-4 h-4" />
                  Sinh Mã VietQR & Chốt Đơn ⚡
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: VIETQR PAYMENT DISPLAY - Cute */}
          {step === 'PAYMENT' && createdOrder && (
            <div className="space-y-5 text-center animate-pop-in">
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-cute-full bg-pink-100 border border-pink-300/50 text-pink-700 text-xs font-semibold shadow-cute">
                <Crown className="w-3.5 h-3.5" />
                Mã đơn: <span className="font-mono font-extrabold text-gradient-peach">{createdOrder.id}</span>
              </div>

              {/* QR Image Box - Cute */}
              <div className="surface-cute p-4 rounded-cute-xl mx-auto w-64 h-64 flex items-center justify-center shadow-cute-lg border-2 border-pink-300/50 animate-bounce-cute">
                <img
                  src={qrUrl}
                  alt="VietQR Napas 247"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Bank Details Table - Cute */}
              <div className="surface-cute p-5 rounded-cute-xl border-2 border-pink-200/50 text-left space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-pink-500 flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Ngân hàng:</span>
                  <span className="font-extrabold text-pink-700">MB Bank (Quân Đội) 🏦</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-pink-500 flex items-center gap-1"><Crown className="w-4 h-4" /> Chủ tài khoản:</span>
                  <span className="font-extrabold text-pink-700 uppercase">{DEFAULT_VIETQR_CONFIG.accountName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-pink-500 flex items-center gap-1"><Box className="w-4 h-4" /> Số tài khoản:</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-extrabold text-gradient-peach">{DEFAULT_VIETQR_CONFIG.accountNo}</span>
                    <button
                      onClick={() => copyToClipboard(DEFAULT_VIETQR_CONFIG.accountNo, 'stk')}
                      className="btn-cute-ghost p-1.5 text-pink-400 hover:text-pink-600"
                      title="Copy STK"
                    >
                      {copiedField === 'stk' ? (
                        <Check className="w-4 h-4 text-emerald-500 animate-pop-in" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-pink-500 flex items-center gap-1"><Gift className="w-4 h-4" /> Số tiền:</span>
                  <span className="font-extrabold font-display text-gradient-peach">{formatVND(createdOrder.total_amount)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-pink-200/50 pt-3">
                  <span className="text-pink-500 flex items-center gap-1"><Sparkles className="w-4 h-4" /> Nội dung CK:</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-extrabold text-rose-500">THEPHEO {createdOrder.id.replace(/[^a-zA-Z0-9]/g, '')}</span>
                    <button
                      onClick={() => copyToClipboard(`THEPHEO ${createdOrder.id.replace(/[^a-zA-Z0-9]/g, '')}`, 'memo')}
                      className="btn-cute-ghost p-1.5 text-pink-400 hover:text-pink-600"
                      title="Copy nội dung"
                    >
                      {copiedField === 'memo' ? (
                        <Check className="w-4 h-4 text-emerald-500 animate-pop-in" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Confirm Paid Button - Cute */}
              <button
                onClick={handleConfirmPaid}
                className="btn-cute-mint w-full py-3.5 text-sm flex items-center justify-center gap-3 shadow-glow-pink"
              >
                <CheckCircle2 className="w-5 h-5" />
                Xác Nhận Đã Chuyển Khoản Thành Công ✅
                <Sparkles className="w-5 h-5 animate-bounce-cute" />
              </button>

              <p className="text-xs text-pink-400 flex items-center justify-center gap-1">
                <WandSparkles className="w-3.5 h-3.5 animate-wiggle" />
                Thanh toán qua VietQR - Xác nhận tức thì 24/7
              </p>
            </div>
          )}

          {/* STEP 3: COMPLETED CONFIRMATION - Cute */}
          {step === 'COMPLETED' && createdOrder && (
            <div className="text-center space-y-4 py-3 animate-pop-in">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-500 text-white rounded-cute-full flex items-center justify-center mx-auto border-4 border-emerald-200/50 shadow-cute-lg animate-bounce-cute">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-extrabold text-pink-800 text-gradient-cute font-display">
                Đơn Hàng Đã Được Tiếp Nhận 🎉
              </h4>
              <p className="text-sm text-pink-500 max-w-sm mx-auto leading-relaxed">
                Cảm ơn bạn <strong className="text-gradient-peach">{createdOrder.customer_name}</strong>. Kiện hàng sẽ được bọc chống sốc 3 lớp nguyên seal và hỏa tốc đến:
              </p>
              <div className="surface-cute p-4 rounded-cute-lg border-2 border-pink-200/50 text-sm text-pink-600 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Truck className="w-4 h-4 text-peach-500" />
                  <span className="font-semibold">{createdOrder.customer_address}</span>
                </div>
                <div className="text-xs text-pink-400 flex items-center justify-center gap-1">
                  <WandSparkles className="w-3.5 h-3.5" />
                  Đơn hàng sẽ được xử lý trong 24h - Ship COD toàn quốc 🚚
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="btn-cute w-full py-3.5 text-sm flex items-center justify-center gap-3 shadow-glow-pink"
                >
                  <Heart className="w-5 h-5 animate-heartbeat" />
                  Hoàn Tất & Tiếp Tục Sưu Tầm 🎀
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};