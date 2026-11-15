import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CartItem, Order } from '../types';
import { generateVietQRUrl, formatVND, DEFAULT_VIETQR_CONFIG } from '../services/vietqr';
import { storage } from '../services/storage';
import { 
  X, CheckCircle2, Copy, Check, QrCode, ShieldCheck, 
  Sparkles, ArrowRight, Truck 
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  directOrderData?: {
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
  if (!isOpen) return null;

  const [step, setStep] = useState<'INFO' | 'PAYMENT' | 'COMPLETED'>('INFO');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const totalAmount = directOrderData
    ? directOrderData.totalAmount
    : cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleGeneratePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) {
      alert('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng!');
      return;
    }

    // Save customer
    const customer = storage.saveCustomer({
      id: `cust-${Date.now()}`,
      name: customerName,
      phone: customerPhone,
      address: customerAddress
    });

    // Collect ordered boxes
    let orderedBoxesList: string[] = [];
    let seriesName = '';

    if (directOrderData) {
      seriesName = directOrderData.seriesName;
      orderedBoxesList = directOrderData.boxNumbers.map(b => `Box #${b < 10 ? '0' + b : b}`);
    } else {
      seriesName = cartItems.map(c => c.series.name).join(', ');
      orderedBoxesList = cartItems.flatMap(c => 
        c.selectedBoxes.map(b => `${c.series.name.slice(0, 8)}-Box#${b}`)
      );
      // deduct stock
      cartItems.forEach(item => {
        storage.holdOrDeductBoxes(item.series.id, item.selectedBoxes.length);
      });
    }

    // Create Order record
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

    // Confetti celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl glass-panel-glow rounded-3xl overflow-hidden border border-purple-500/30 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-purple-900/40 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400">
              <QrCode className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">
                {step === 'INFO' && 'Thông Tin Giao Hàng & Chốt Đơn'}
                {step === 'PAYMENT' && 'Quét Mã VietQR Chuyển Khoản Tự Động'}
                {step === 'COMPLETED' && 'Đặt Hàng & Thanh Toán Thành Công!'}
              </h3>
              <p className="text-xs text-slate-400">
                Hệ thống tự động hóa xử lý đơn hàng trên Cloudflare Workers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content based on step */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* STEP 1: INFO FORM */}
          {step === 'INFO' && (
            <form onSubmit={handleGeneratePayment} className="space-y-4">
              <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Tổng thanh toán:</span>
                  <div className="text-2xl font-black text-amber-400">
                    {formatVND(totalAmount)}
                  </div>
                </div>
                <span className="text-xs text-purple-300 bg-purple-950/60 px-3 py-1 rounded-xl border border-purple-800">
                  {directOrderData ? `${directOrderData.boxNumbers.length} Hộp (Combo AI)` : `${cartItems.length} Series`}
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Họ và Tên người nhận:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn Phát"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Số điện thoại nhận hàng:
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ví dụ: 0988776655"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Địa chỉ giao hàng (Tận nhà):
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4 text-amber-300" />
                  Sinh Mã VietQR & Chốt Đơn
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: VIETQR PAYMENT DISPLAY */}
          {step === 'PAYMENT' && createdOrder && (
            <div className="space-y-6 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Đơn hàng #{createdOrder.id} đã được khởi tạo
              </div>

              {/* QR Image Box */}
              <div className="bg-white p-4 rounded-3xl mx-auto w-64 h-64 flex items-center justify-center shadow-2xl border-4 border-purple-500/30">
                <img
                  src={qrUrl}
                  alt="VietQR Napas 247"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Bank Details Table */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 text-left space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Ngân hàng thụ hưởng:</span>
                  <span className="font-bold text-white">MB Bank (Quân Đội)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Chủ tài khoản:</span>
                  <span className="font-bold text-white uppercase">{DEFAULT_VIETQR_CONFIG.accountName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Số tài khoản:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-purple-300 font-bold">{DEFAULT_VIETQR_CONFIG.accountNo}</span>
                    <button
                      onClick={() => copyToClipboard(DEFAULT_VIETQR_CONFIG.accountNo, 'stk')}
                      className="text-slate-400 hover:text-white"
                      title="Copy STK"
                    >
                      {copiedField === 'stk' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Số tiền:</span>
                  <span className="text-amber-400 font-black text-sm">{formatVND(createdOrder.total_amount)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                  <span className="text-slate-400">Nội dung chuyển khoản (bắt buộc):</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-pink-300 font-bold">THEPHEO {createdOrder.id}</span>
                    <button
                      onClick={() => copyToClipboard(`THEPHEO ${createdOrder.id}`, 'memo')}
                      className="text-slate-400 hover:text-white"
                      title="Copy nội dung"
                    >
                      {copiedField === 'memo' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Confirm Paid Button */}
              <button
                onClick={handleConfirmPaid}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Xác Nhận Đã Chuyển Khoản Thành Công
              </button>
            </div>
          )}

          {/* STEP 3: COMPLETED CONFIRMATION */}
          {step === 'COMPLETED' && createdOrder && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-white">
                Đơn Hàng Đã Được Xác Nhận!
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                Cảm ơn đạo hữu <strong className="text-amber-300">{createdOrder.customer_name}</strong> đã tin tưởng Tiệm Thầy Phẻo. Hộp mù sẽ được gói bọc chống sốc 3 lớp kèm quẻ bình an và hỏa tốc đến địa chỉ:
              </p>
              <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-xs text-slate-300 font-medium max-w-md mx-auto">
                <Truck className="w-4 h-4 inline-block mr-1 text-purple-400" />
                {createdOrder.customer_address}
              </div>

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm"
                >
                  Hoàn Tất & Tiếp Tục Sưu Tầm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
