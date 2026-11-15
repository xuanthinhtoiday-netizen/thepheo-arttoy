import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CartItem, Order } from '../types';
import { generateVietQRUrl, formatVND, DEFAULT_VIETQR_CONFIG } from '../services/vietqr';
import { storage } from '../services/storage';
import { 
  X, CheckCircle2, Copy, Check, QrCode, ArrowRight, Truck 
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
      particleCount: 80,
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
      <div className="relative w-full max-w-lg bg-[#0b0e17] rounded-2xl overflow-hidden border border-white/10 flex flex-col max-h-[90vh] shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#080a12]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-amber-400">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                {step === 'INFO' && 'Thông Tin Nhận Hàng'}
                {step === 'PAYMENT' && 'Quét Mã VietQR Chuyển Khoản'}
                {step === 'COMPLETED' && 'Đặt Hàng Thành Công'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Xử lý tự động hóa trên Cloudflare Workers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* STEP 1: INFO FORM */}
          {step === 'INFO' && (
            <form onSubmit={handleGeneratePayment} className="space-y-4">
              <div className="bg-[#0e121e] p-3.5 rounded-xl border border-white/[0.06] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500">Tổng thanh toán:</span>
                  <div className="text-xl font-black text-amber-400 font-display">
                    {formatVND(totalAmount)}
                  </div>
                </div>
                <span className="text-xs text-slate-300 bg-white/5 px-2.5 py-1 rounded border border-white/5 font-mono">
                  {directOrderData ? `${directOrderData.boxNumbers.length} Hộp` : `${cartItems.length} Series`}
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Họ và tên người nhận:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn Phát"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Số điện thoại nhận hàng:
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ví dụ: 0988776655"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Địa chỉ giao hàng:
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  Sinh Mã VietQR & Chốt Đơn
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: VIETQR PAYMENT DISPLAY */}
          {step === 'PAYMENT' && createdOrder && (
            <div className="space-y-5 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-medium">
                Mã đơn: <span className="text-amber-400 font-mono font-bold">{createdOrder.id}</span>
              </div>

              {/* QR Image Box */}
              <div className="bg-white p-3 rounded-2xl mx-auto w-56 h-56 flex items-center justify-center shadow-md border border-white/10">
                <img
                  src={qrUrl}
                  alt="VietQR Napas 247"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Bank Details Table */}
              <div className="bg-[#0e121e] rounded-xl p-4 border border-white/[0.06] text-left space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Ngân hàng:</span>
                  <span className="font-semibold text-white">MB Bank (Quân Đội)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Chủ tài khoản:</span>
                  <span className="font-semibold text-white uppercase">{DEFAULT_VIETQR_CONFIG.accountName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Số tài khoản:</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-white font-bold">{DEFAULT_VIETQR_CONFIG.accountNo}</span>
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
                  <span className="text-amber-400 font-bold font-display">{formatVND(createdOrder.total_amount)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.06] pt-2">
                  <span className="text-slate-400">Nội dung CK:</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-amber-300 font-bold">THEPHEO {createdOrder.id.replace(/[^a-zA-Z0-9]/g, '')}</span>
                    <button
                      onClick={() => copyToClipboard(`THEPHEO ${createdOrder.id.replace(/[^a-zA-Z0-9]/g, '')}`, 'memo')}
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
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                Xác Nhận Đã Chuyển Khoản Thành Công
              </button>
            </div>
          )}

          {/* STEP 3: COMPLETED CONFIRMATION */}
          {step === 'COMPLETED' && createdOrder && (
            <div className="text-center space-y-4 py-3">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/25">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white font-display">
                Đơn Hàng Đã Được Tiếp Nhận
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Cảm ơn bạn <strong className="text-white">{createdOrder.customer_name}</strong>. Kiện hàng sẽ được bọc chống sốc 3 lớp nguyên seal và hỏa tốc đến:
              </p>
              <div className="bg-[#0e121e] p-3 rounded-xl border border-white/[0.06] text-xs text-slate-300 max-w-md mx-auto">
                <Truck className="w-3.5 h-3.5 inline-block mr-1 text-slate-400" />
                {createdOrder.customer_address}
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs"
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
