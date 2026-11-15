import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { askThePheo } from '../services/gemini';
import { formatVND } from '../services/vietqr';
import { storage } from '../services/storage';
import { 
  Bot, Send, X, Sparkles, Key, 
  Flame, CheckCircle2, Copy, Check, Minimize2, Maximize2
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
      text: `🔮 **A Di Đà Phật! Thầy Phẻo xin kính chào thí chủ!**\n\nThầy là **"Thầy Phẻo Gieo Quẻ Art Toy"**, chuyên gia phong thủy kiêm dân chơi Blind Box lão luyện. Thí chủ muốn Thầy soi vía bốc hộp nào, hay gieo quẻ tìm **Secret 1/144** hôm nay?`,
      timestamp: '13:00',
      badge: 'Thầy Phẻo Khai Trí 🔮'
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
          text: 'Ối chà, đường truyền linh khí đang bị nhiễu sóng nhẹ. Đạo hữu hỏi lại một lần nữa để Thầy bấm độn lại nhé!',
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
    alert('Đã lưu Gemini API Key thành công!');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOrderId(id);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  return (
    <>
      {/* Floating Toggle Bubble (when closed) */}
      {!isOpen && (
        <button
          onClick={onOpen}
          aria-label="Mở chat Thầy Phẻo"
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 text-white shadow-2xl shadow-purple-600/50 hover:shadow-purple-600/80 hover:scale-110 active:scale-95 transition-all duration-300 group flex items-center gap-3 border-2 border-amber-400/40"
        >
          <div className="relative">
            <Bot className="w-7 h-7 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>
          <span className="font-extrabold text-sm tracking-wide hidden sm:inline pr-1">
            Thầy Phẻo Gieo Quẻ
          </span>
        </button>
      )}

      {/* Main Chat Drawer / Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col glass-panel-glow border border-purple-500/40 shadow-2xl ${
            isExpanded
              ? 'inset-4 sm:inset-10 rounded-3xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[440px] h-[650px] max-h-[85vh] rounded-3xl'
          }`}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-purple-900/40 flex items-center justify-between bg-slate-950/80 rounded-t-3xl">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 p-[2px]">
                  <div className="w-full h-full bg-[#110d24] rounded-2xl flex items-center justify-center">
                    <span className="text-lg">🔮</span>
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm sm:text-base text-white">
                    Thầy Phẻo Gieo Quẻ
                  </h3>
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    AI Online
                  </span>
                </div>
                <p className="text-[11px] text-purple-300/80">
                  Soi vía bốc hộp • Kích lộc Secret 1/144
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <button
                onClick={() => setShowSettings(!showSettings)}
                title="Cài đặt Gemini API Key"
                className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors"
              >
                <Key className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Thu nhỏ' : 'Phóng to'}
                className="hidden sm:block p-2 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                title="Đóng chat"
                className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Settings Panel (Gemini API Key Modal) */}
          {showSettings && (
            <div className="p-4 bg-slate-900/95 border-b border-purple-800/50 space-y-3 animate-fade-in text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Key className="w-4 h-4" />
                  Cấu hình Google Gemini API Key:
                </span>
                <span className="text-[10px] text-slate-400">Tùy chọn</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Nếu không điền, hệ thống sẽ tự động dùng trí thông minh nhân tạo phong thủy tích hợp sẵn!
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={saveApiKey}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl"
                >
                  Lưu
                </button>
              </div>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* AI Badge */}
                {msg.badge && msg.sender === 'the_pheo' && (
                  <div className="mb-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-black">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    {msg.badge}
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-lg'
                  }`}
                >
                  {msg.text}
                </div>

                {/* In-Chat Actionable Combo Card */}
                {msg.suggestedCombo && (
                  <div className="mt-3 w-full max-w-sm glass-gold-glow p-3.5 rounded-2xl border border-amber-500/40 text-left">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-extrabold text-amber-300">
                        {msg.suggestedCombo.seriesName}
                      </span>
                      <span className="text-pink-300 font-bold">
                        {formatVND(msg.suggestedCombo.totalAmount)}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300 mb-3">
                      Hộp Thầy Phẻo chọn: <strong>{msg.suggestedCombo.boxNumbers.map(b => `Hộp #${b}`).join(', ')}</strong> ({msg.suggestedCombo.boxNumbers.length} hộp)
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSend(`Thầy Phẻo ơi, chốt đơn giúp mình Combo ${msg.suggestedCombo?.boxNumbers.length} hộp ${msg.suggestedCombo?.seriesName}!`)}
                        className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-pink-600 hover:from-amber-400 hover:to-pink-500 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <Flame className="w-3.5 h-3.5" />
                        Chốt Combo Này Ngay
                      </button>

                      {onCheckoutFromChat && (
                        <button
                          onClick={() => onCheckoutFromChat(msg.suggestedCombo)}
                          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
                        >
                          Tự Điền Đơn
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* In-Chat VietQR Payment Card (FR-04) */}
                {msg.qrData && (
                  <div className="mt-3 w-full max-w-xs bg-slate-950 p-4 rounded-3xl border border-emerald-500/40 text-center shadow-xl">
                    <div className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-400 uppercase tracking-wider mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mã VietQR Tự Động 24/7
                    </div>

                    <div className="bg-white p-2.5 rounded-2xl mx-auto w-48 h-48 flex items-center justify-center shadow-inner">
                      <img
                        src={msg.qrData.qrUrl}
                        alt="VietQR Payment"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="mt-3 space-y-1 text-xs">
                      <div className="text-slate-400">
                        Số tiền: <strong className="text-amber-400 text-sm">{formatVND(msg.qrData.amount)}</strong>
                      </div>
                      <div className="text-slate-400 flex items-center justify-center gap-1.5">
                        Mã đơn: <span className="font-mono text-purple-300 font-bold">{msg.qrData.orderId}</span>
                        <button
                          onClick={() => copyToClipboard(msg.qrData!.orderId, msg.qrData!.orderId)}
                          className="text-slate-500 hover:text-white"
                        >
                          {copiedOrderId === msg.qrData.orderId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Nội dung CK: <span className="text-slate-300 font-mono">THEPHEO {msg.qrData.orderId}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSend(`Thầy ơi, mình đã quét chuyển khoản thành công đơn hàng ${msg.qrData?.orderId} rồi nhé!`)}
                      className="mt-3.5 w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Tôi Đã Hoàn Tất Chuyển Khoản
                    </button>
                  </div>
                )}

                <span className="text-[10px] text-slate-500 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-purple-300 text-xs w-max">
                <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
                Thầy Phẻo đang gieo quẻ dịch số và soi vía...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-slate-950/70 border-t border-purple-900/20 flex gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleSend('Gieo cho thầy 1 quẻ bốc Skullpanda dễ trúng Secret nhất!')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-purple-300 border border-purple-500/20 text-[11px] whitespace-nowrap"
            >
              🔮 Quẻ Skullpanda Secret
            </button>
            <button
              onClick={() => handleSend('Tư vấn cho mình combo 3 hộp Crybaby hoàng đạo')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-amber-500/20 text-[11px] whitespace-nowrap"
            >
              ✨ Combo 3 hộp Crybaby
            </button>
            <button
              onClick={() => handleSend('Hôm nay mệnh Kim nên bốc series nào để phát tài?')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-pink-300 border border-pink-500/20 text-[11px] whitespace-nowrap"
            >
              🪙 Phong thủy mệnh Kim
            </button>
            <button
              onClick={() => handleSend('Cho mình xem feedback ai vừa nổ Secret để lấy vía thơm!')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-emerald-300 border border-emerald-500/20 text-[11px] whitespace-nowrap"
            >
              🏆 Lấy vía khách nổ hũ
            </button>
          </div>

          {/* Input Bar */}
          <div className="p-3 sm:p-4 bg-slate-950/90 rounded-b-3xl border-t border-purple-900/40">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Hỏi Thầy Phẻo chọn hộp, gieo quẻ, chốt combo..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Gửi</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
