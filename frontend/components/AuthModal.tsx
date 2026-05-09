import React, { useState } from 'react';
import { useAppStore } from '../store/AppContext';

export const AuthModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const { setUser, logAction } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate sending magic link
    setIsSent(true);
    
    // Simulate user clicking link after 2 seconds
    setTimeout(() => {
      setUser({ email });
      logAction('アカウントを保存しました');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 relative animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          ✕
        </button>
        
        {!isSent ? (
          <>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">保存しますか？</h2>
            <p className="text-sm text-slate-500 mb-6">
              メールアドレスを登録すると、他のPCやスマホからも同じデータが見られるようになります。
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">メールアドレス</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              
              <button type="submit" className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition-colors flex justify-center items-center">
                ✉️ メールでログインリンクを送る →
              </button>
            </form>
            
            <div className="mt-6 text-xs text-slate-500 space-y-2 bg-slate-50 p-4 rounded-lg">
              <p>・パスワードは不要です。メールに届くリンクを押すだけ。</p>
              <p>・料金: 月 ¥9,800 (初月無料)</p>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">メールを送信しました</h3>
            <p className="text-sm text-slate-500">
              {email} 宛にログインリンクをお送りしました。<br/>
              (※デモのため、2秒後に自動でログインします)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
