import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, Sparkles, Heart, ArrowRight, Loader2, ArrowLeft, WandSparkles } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
  onBack: () => void;
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBack }) => {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Nhập mật khẩu admin trước nhé 🔐');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('thepheo_admin_token', data.token);
        onSuccess();
        return;
      }
      const err = await res.json().catch(() => ({}));
      setError(err.error || 'Mật khẩu không đúng. Thử lại nhé! 🥺');
    } catch {
      // Local dev fallback: backend chưa chạy -> so sánh với VITE_ADMIN_PASSWORD (nếu có đặt)
      const devPw = (import.meta as any).env?.VITE_ADMIN_PASSWORD;
      if (devPw && (await sha256(password)) === (await sha256(devPw))) {
        localStorage.setItem('thepheo_admin_token', 'dev-local-admin');
        onSuccess();
      } else {
        setError('Không kết nối được server quản trị! Chạy `npm run start` để bật backend, hoặc đặt VITE_ADMIN_PASSWORD trong file .env 🔌');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      {/* Cute Floating Decorations */}
      <div className="hidden lg:block fixed top-24 left-8 w-12 h-12 animate-float-gentle pointer-events-none opacity-60">
        <span className="text-5xl">🎀</span>
      </div>
      <div className="hidden lg:block fixed bottom-32 right-8 w-10 h-10 animate-float-gentle pointer-events-none opacity-60" style={{ animationDelay: '1s' }}>
        <span className="text-4xl">✨</span>
      </div>

      <div className="relative w-full max-w-md surface-cute-elevated rounded-cute-xl p-8 border-2 border-pink-300/50 shadow-glow-pink animate-pop-in">
        {/* Back button */}
        <button
          onClick={onBack}
          className="btn-cute-ghost absolute top-4 left-4 p-2 flex items-center gap-1 text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Về trang chủ
        </button>

        {/* Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-16 h-16 mx-auto rounded-cute-full bg-cute-gradient flex items-center justify-center shadow-cute-lg border-2 border-white/60">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-display font-extrabold text-pink-800 text-gradient-cute">
            Khu Vực Quản Trị 🔐
          </h2>
          <p className="text-sm text-pink-500 leading-relaxed">
            Chỉ đạo hữu giữ chìa khóa mới được vào quản lý kho hộp mù nhé!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-pink-600 block mb-1.5 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              Mật khẩu admin:
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                required
                placeholder="Nhập mật khẩu bí mật... 🗝️"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-cute text-sm pr-11"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600 transition-colors"
                aria-label={showPw ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="surface-cute p-3 rounded-cute-lg border-2 border-rose-200/60 bg-rose-50 text-rose-600 text-xs font-medium animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-cute w-full py-3.5 text-sm flex items-center justify-center gap-2 shadow-glow-pink disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang kiểm tra mật khẩu...
              </>
            ) : (
              <>
                <WandSparkles className="w-4 h-4" />
                Mở Cửa Quản Trị
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-pink-200/50 flex items-center justify-center gap-1.5 text-[11px] text-pink-400">
          <Sparkles className="w-3 h-3" />
          <span>Mật khẩu được lưu bí mật trên Cloudflare Worker, không có trong code</span>
          <Heart className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};
