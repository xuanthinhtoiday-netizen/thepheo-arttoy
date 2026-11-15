import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { askThePheo } from '../services/gemini';
import { formatVND } from '../services/vietqr';
import { storage } from '../services/storage';
import { 
  Send, X, Sparkles, Key, 
  CheckCircle2, Copy, Check, Minimize2, Maximize2, Compass
} from 'lucide-react';

interface ChatbotWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  initialPrompt?: string;
  onCheckoutFromChat?: (comboData: any) => void;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  isOpen,
  onClose,
  onOpen,
  initialPrompt,
  onCheckoutFromChat,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'the_pheo',
      text: `🔮 **A Di Đà Phật! Thầy Phẻo xin kính chào thí chủ!**\n\nThầy là cố vấn phong thủy kiêm dân chơi Blind Box lão luyện. Thí chủ muốn Thầy soi quẻ ngũ hành chọn màu hộp, hay bói số hộp săn **Secret Chase 1/144** hôm nay?`,
      timestamp: '13:00',
      badge: 'Thầy Phẻo Khai Trí 🎴'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(storage.getGeminiApiKey());
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ sender: m.sender, text: m.text }));
      const response = await askThePheo(text, history);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'the_pheo',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        badge: response.badge,
        suggestedCombo: response.suggestedCombo,
        qrData: response.qrData
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'the_pheo',
          text: 'Đường truyền linh khí đang bị nhiễu sóng nhẹ. Đạo hữu hỏi lại một lần nữa để Thầy bấm độn lại nhé!',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveApiKey = () => {
    storage.setGeminiApiKey(apiKeyInput);
    setShowSettings(false);
    alert('Đã cập nhật Gemini API Key!');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOrderId(id);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  return (
    <>
      {/* Sleek Floating Pill Button */}
      {!isOpen && (
        <button
          onClick={onOpen}
          aria-label="Mở chat Thầy Phẻo"
          className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-full bg-[#0e121e] hover:bg-[#14192b] text-white border border-white/10 hover:border-amber-400/40 shadow-xl transition-all duration-300 flex items-center gap-3 group"
        >
          <div className="relative flex items-center justify-center">
            <Compass className="w-5 h-5 text-amber-300 group-hover:rotate-45 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <span className="text-xs font-bold tracking-wide text-slate-200 group-hover:text-white">
            Trợ Lý Phong Thủy AI
          </span>
        </button>
      )}

      {/* Main Concierge Drawer / Popup */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-[#0b0e17] border border-white/10 shadow-2xl ${
            isExpanded
              ? 'inset-4 sm:inset-10 rounded-2xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[420px] h-[640px] max-h-[85vh] rounded-2xl'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-[#080a12] rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-amber-300">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white">
                    Thầy Phẻo AI
                  </h3>
                  <span className="bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Cố vấn phong thủy & Gacha Art Toy
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setShowSettings(!showSettings)}
                title="Cài đặt API Key"
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white"
              >
                <Key className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Thu nhỏ' : 'Phóng to'}
                className="hidden sm:block p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white"
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={onClose}
                title="Đóng chat"
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="p-3.5 bg-slate-900 border-b border-white/10 space-y-2 text-xs animate-fade-in">
              <span className="font-semibold text-slate-300 block">
                Google Gemini API Key (Tùy chọn):
              </span>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={saveApiKey}
                  className="px-3 py-1.5 bg-white text-slate-950 font-bold rounded-lg text-xs"
                >
                  Lưu
                </button>
              </div>
            </div>
          )}

          {/* Chat Messages Flow */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Divination Badge */}
                {msg.badge && msg.sender === 'the_pheo' && (
                  <div className="mb-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[10px] font-semibold">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    {msg.badge}
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-white text-slate-950 font-medium rounded-br-none shadow-sm'
                      : 'bg-[#121624] text-slate-200 border border-white/[0.08] rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>

                {/* In-Chat Actionable Combo Card */}
                {msg.suggestedCombo && (
                  <div className="mt-2.5 w-full max-w-sm surface-gold p-3.5 rounded-xl border border-amber-500/30 text-left">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-white">
                        {msg.suggestedCombo.seriesName}
                      </span>
                      <span className="text-amber-400 font-bold font-display">
                        {formatVND(msg.suggestedCombo.totalAmount)}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300 mb-3">
                      Hộp đề xuất: <strong className="text-amber-300 font-mono">{msg.suggestedCombo.boxNumbers.map(b => `#${b}`).join(', ')}</strong> ({msg.suggestedCombo.boxNumbers.length} hộp)
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSend(`Thầy ơi, chốt đơn giúp mình Combo ${msg.suggestedCombo?.boxNumbers.length} hộp ${msg.suggestedCombo?.seriesName}!`)}
                        className="flex-1 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-sm"
                      >
                        Chốt Combo Này
                      </button>

                      {onCheckoutFromChat && (
                        <button
                          onClick={() => onCheckoutFromChat(msg.suggestedCombo)}
                          className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 text-xs font-medium"
                        >
                          Tự Điền Đơn
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* In-Chat VietQR Payment Card */}
                {msg.qrData && (
                  <div className="mt-2.5 w-full max-w-xs bg-[#090b12] p-4 rounded-2xl border border-emerald-500/30 text-center shadow-lg">
                    <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mã VietQR Tự Động
                    </div>

                    <div className="bg-white p-2 rounded-xl mx-auto w-44 h-44 flex items-center justify-center shadow-sm">
                      <img
                        src={msg.qrData.qrUrl}
                        alt="VietQR Payment"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="mt-3 space-y-1 text-xs">
                      <div className="text-slate-400">
                        Số tiền: <strong className="text-amber-400 font-display">{formatVND(msg.qrData.amount)}</strong>
                      </div>
                      <div className="text-slate-400 flex items-center justify-center gap-1.5 font-mono">
                        Mã đơn: <span className="text-white font-bold">{msg.qrData.orderId}</span>
                        <button
                          onClick={() => copyToClipboard(msg.qrData!.orderId, msg.qrData!.orderId)}
                          className="text-slate-500 hover:text-white"
                        >
                          {copiedOrderId === msg.qrData.orderId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSend(`Thầy ơi, mình đã hoàn tất chuyển khoản cho đơn hàng ${msg.qrData?.orderId} rồi!`)}
                      className="mt-3 w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all"
                    >
                      Xác Nhận Đã Chuyển Khoản
                    </button>
                  </div>
                )}

                <span className="text-[10px] text-slate-500 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-white/5 text-slate-400 text-xs w-max">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                Thầy Phẻo đang bấm độn...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Clean Prompt Chips */}
          <div className="px-3 py-2 bg-[#080a12] border-t border-white/[0.05] flex gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleSend('Gieo cho thầy 1 quẻ bốc Skullpanda dễ trúng Secret nhất!')}
              className="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-[11px] whitespace-nowrap"
            >
              Quẻ Skullpanda Secret
            </button>
            <button
              onClick={() => handleSend('Tư vấn cho mình combo 3 hộp Crybaby hoàng đạo')}
              className="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-[11px] whitespace-nowrap"
            >
              Combo 3 Hộp Crybaby
            </button>
            <button
              onClick={() => handleSend('Hôm nay mệnh Kim nên bốc series nào để phát tài?')}
              className="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-[11px] whitespace-nowrap"
            >
              Phong Thủy Mệnh Kim
            </button>
            <button
              onClick={() => handleSend('Cho mình xem feedback ai vừa nổ Secret để lấy vía thơm!')}
              className="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-[11px] whitespace-nowrap"
            >
              Feedback Nổ Secret
            </button>
          </div>

          {/* Clean Input Bar */}
          <div className="p-3 bg-[#080a12] rounded-b-2xl border-t border-white/[0.08]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Nhập yêu cầu tư vấn, gieo quẻ, chốt combo..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-slate-900 border border-white/10 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-white hover:bg-slate-200 disabled:opacity-40 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Gửi</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
