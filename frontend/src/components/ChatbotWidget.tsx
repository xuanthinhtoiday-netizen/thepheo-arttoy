import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { askThePheo } from '../services/gemini';
import { formatVND } from '../services/vietqr';
import { storage } from '../services/storage';
import {
  Send, X, Sparkles, Key,
  CheckCircle2, Copy, Check, Minimize2, Maximize2, Compass, Heart, Star, WandSparkles, Gift, Crown, Sparkle, Zap, ShieldCheck, Box, Trophy
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
      text: `🎀 **A Di Đà Phật! Thầy Phẻo xin kính chào thí chủ!** ✨\n\nThầy là cố vấn phong thủy kiêm dân chơi Blind Box lão luyện. Thí chủ muốn Thầy soi quẻ ngũ hành chọn màu hộp, hay bói số hộp săn **Secret Chase 1/144** hôm nay? 💖\n\n🔮 **Thầy có thể giúp:**\n• Soi vía chọn hộp may mắn theo ngày/giờ\n• Tư vấn combo 3/5 hộp tối ưu xác suất\n• Phong thủy ngũ hành cho từng mệnh\n• Feedback người trúng Secret để lấy vía thơm\n• Tự động sinh mã VietQR thanh toán 24/7 ⚡`,
      timestamp: '13:00',
      badge: 'Thầy Phẻo Khai Trí 🎴💖'
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
          text: 'Đường truyền linh khí đang bị nhiễu sóng nhẹ. Đạo hữu hỏi lại một lần nữa để Thầy bấm độn lại nhé! 😊',
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
    alert('Đã cập nhật Gemini API Key! 🎉');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOrderId(id);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  return (
    <>
      {/* Cute Floating Pill Button */}
      {!isOpen && (
        <button
          onClick={onOpen}
          aria-label="Mở chat Thầy Phẻo"
          className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-cute-full bg-cute-gradient hover:from-pink-500 hover:to-rose-500 text-white border-2 border-pink-300/50 shadow-glow-pink transition-all duration-300 flex items-center gap-3 group animate-bounce-cute"
        >
          <div className="relative flex items-center justify-center">
            <WandSparkles className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
          </div>
          <span className="text-sm font-extrabold tracking-wide text-white group-hover:text-yellow-200 hidden sm:inline">
            Trợ Lý Phong Thủy AI 🔮
          </span>
        </button>
      )}

      {/* Main Concierge Drawer / Popup - Cute */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col surface-cute-elevated shadow-glow-pink ${
            isExpanded
              ? 'inset-4 sm:inset-10 rounded-cute-xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[440px] h-[680px] max-h-[85vh] rounded-cute-xl'
          }`}>
          {/* Header - Cute */}
          <div className="p-4 border-b border-pink-200/50 flex items-center justify-between bg-cute-gradient/50 rounded-t-cute-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-cute bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-cute">
                <WandSparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-pink-800 text-gradient-cute">
                    Thầy Phẻo AI
                  </h3>
                  <span className="bg-pink-100 text-pink-600 text-[10px] font-semibold px-2 py-0.5 rounded-cute-full">
                    💖 Online
                  </span>
                </div>
                <p className="text-[11px] text-pink-500 font-medium">
                  Cố vấn phong thủy & Gacha Art Toy ✨
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-pink-500">
              <button
                onClick={() => setShowSettings(!showSettings)}
                title="Cài đặt API Key"
                className="btn-cute-ghost p-2"
              >
                <Key className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Thu nhỏ' : 'Phóng to'}
                className="hidden sm:block btn-cute-ghost p-2"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                title="Đóng chat"
                className="btn-cute-ghost p-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settings Panel - Cute */}
          {showSettings && (
            <div className="p-4 surface-cute border-b border-pink-200/50 space-y-3 animate-pop-in">
              <span className="font-extrabold text-sm text-pink-700 block flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                Google Gemini API Key (Tùy chọn):
              </span>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="input-cute flex-1 text-sm"
                />
                <button
                  onClick={saveApiKey}
                  className="btn-cute-peach px-4 py-2 text-sm"
                >
                  Lưu 💾
                </button>
              </div>
            </div>
          )}

          {/* Chat Messages Flow - Cute */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Divination Badge - Cute */}
                {msg.badge && msg.sender === 'the_pheo' && (
                  <div className="mb-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-cute-full bg-gradient-to-r from-pink-100 to-rose-100 border border-pink-300/50 text-pink-700 text-xs font-semibold shadow-cute">
                    <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-bounce-cute" />
                    {msg.badge}
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-cute-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-cute-gradient text-pink-800 font-medium rounded-br-none shadow-cute border border-pink-300/30'
                      : 'surface-cute text-pink-700 border-2 border-pink-200/50 rounded-bl-none shadow-cute'
                  }`}
                >
                  {msg.text}
                </div>

                {/* In-Chat Actionable Combo Card - Cute */}
                {msg.suggestedCombo && (
                  <div className="mt-2.5 w-full max-w-sm surface-cute-elevated p-4 rounded-cute-lg border-2 border-pink-300/50 text-left animate-pop-in">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-extrabold text-pink-800 text-gradient-cute">
                        {msg.suggestedCombo.seriesName}
                      </span>
                      <span className="font-extrabold font-display text-gradient-peach">
                        {formatVND(msg.suggestedCombo.totalAmount)}
                      </span>
                    </div>

                    <div className="text-sm text-pink-500 mb-3 flex items-center gap-1">
                      <Box className="w-3.5 h-3.5" />
                      Hộp đề xuất: <strong className="text-pink-700 font-mono">{msg.suggestedCombo.boxNumbers.map(b => `#${b}`).join(', ')}</strong> ({msg.suggestedCombo.boxNumbers.length} hộp)
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSend(`Thầy ơi, chốt đơn giúp mình Combo ${msg.suggestedCombo?.boxNumbers.length} hộp ${msg.suggestedCombo?.seriesName}!`)}
                        className="btn-cute flex-1 py-2.5 px-3 text-sm rounded-cute flex items-center justify-center gap-2 shadow-glow-pink"
                      >
                        <Zap className="w-4 h-4" />
                        Chốt Combo Này
                      </button>

                      {onCheckoutFromChat && (
                        <button
                          onClick={() => onCheckoutFromChat(msg.suggestedCombo)}
                          className="btn-cute-outline py-2.5 px-3 text-sm rounded-cute flex items-center justify-center gap-2"
                        >
                          <WandSparkles className="w-4 h-4" />
                          Tự Điền Đơn
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* In-Chat VietQR Payment Card - Cute */}
                {msg.qrData && (
                  <div className="mt-2.5 w-full max-w-xs surface-cute-elevated p-4 rounded-cute-xl border-2 border-emerald-300/50 text-center shadow-cute-lg animate-pop-in">
                    <div className="text-sm font-extrabold text-emerald-600 uppercase tracking-wider mb-3 flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Mã VietQR Tự Động ⚡
                    </div>

                    <div className="bg-white p-3 rounded-cute-lg mx-auto w-48 h-48 flex items-center justify-center shadow-cute">
                      <img
                        src={msg.qrData.qrUrl}
                        alt="VietQR Payment"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="mt-3 space-y-1.5 text-sm">
                      <div className="text-pink-500">
                        Số tiền: <strong className="font-display text-gradient-peach">{formatVND(msg.qrData.amount)}</strong>
                      </div>
                      <div className="text-pink-500 flex items-center justify-center gap-2 font-mono">
                        Mã đơn: <span className="font-extrabold text-pink-700">{msg.qrData.orderId}</span>
                        <button
                          onClick={() => copyToClipboard(msg.qrData!.orderId, msg.qrData!.orderId)}
                          className="text-pink-400 hover:text-pink-600 transition-colors"
                        >
                          {copiedOrderId === msg.qrData.orderId ? (
                            <Check className="w-4 h-4 text-emerald-500 animate-pop-in" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSend(`Thầy ơi, mình đã hoàn tất chuyển khoản cho đơn hàng ${msg.qrData?.orderId} rồi!`)}
                      className="btn-cute-mint mt-3 w-full py-2.5 text-sm flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Xác Nhận Đã Chuyển Khoản ✅
                    </button>
                  </div>
                )}

                <span className="text-xs text-pink-400 mt-1.5 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 rounded-cute-xl surface-cute text-pink-500 text-sm w-max animate-pulse-cute border border-pink-200/50">
                <WandSparkles className="w-4 h-4 animate-wiggle" />
                <span className="animate-pulse">Thầy Phẻo đang bấm độn...</span>
                <Sparkles className="w-4 h-4 animate-bounce-cute" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Cute Prompt Chips */}
          <div className="px-4 py-3 bg-cute-gradient/30 border-t border-pink-200/50 flex gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleSend('Gieo cho thầy 1 quẻ bốc Skullpanda dễ trúng Secret nhất!')}
              className="btn-cute-ghost px-3 py-1.5 text-xs whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" /> Quẻ Skullpanda Secret
            </button>
            <button
              onClick={() => handleSend('Tư vấn cho mình combo 3 hộp Crybaby hoàng đạo')}
              className="btn-cute-ghost px-3 py-1.5 text-xs whitespace-nowrap"
            >
              <Heart className="w-3.5 h-3.5" /> Combo 3 Hộp Crybaby
            </button>
            <button
              onClick={() => handleSend('Hôm nay mệnh Kim nên bốc series nào để phát tài?')}
              className="btn-cute-ghost px-3 py-1.5 text-xs whitespace-nowrap"
            >
              <Crown className="w-3.5 h-3.5" /> Phong Thủy Mệnh Kim
            </button>
            <button
              onClick={() => handleSend('Cho mình xem feedback ai vừa nổ Secret để lấy vía thơm!')}
              className="btn-cute-ghost px-3 py-1.5 text-xs whitespace-nowrap"
            >
              <Trophy className="w-3.5 h-3.5" /> Feedback Nổ Secret
            </button>
          </div>

          {/* Cute Input Bar */}
          <div className="p-4 bg-cute-gradient/30 rounded-b-cute-xl border-t border-pink-200/50">
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
                className="input-cute flex-1 text-sm"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="btn-cute p-2.5 sm:px-4 sm:py-2.5 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Gửi</span>
                <Sparkles className="w-4 h-4 animate-bounce-cute" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};