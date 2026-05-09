import React, { useState } from 'react';
import { useAppStore } from '../store/AppContext';

export const Settings: React.FC = () => {
  const { user, setUser, setView } = useAppStore();
  const [showDev, setShowDev] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setView({ type: 'landing' });
  };

  const mcpConfig = `{
  "mcpServers": {
    "kanribu-ai": {
      "command": "npx",
      "args": ["-y", "@kanribu/mcp-server"],
      "env": {
        "KANRIBU_API_KEY": "demo-token-${user?.email || 'anonymous'}"
      }
    }
  }
}`;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-8">設定</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-medium text-slate-800 mb-4">アカウント情報</h2>
          {user ? (
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-500">ログイン中のメールアドレス</p>
                <p className="font-medium text-slate-800">{user.email}</p>
              </div>
              <button onClick={handleLogout} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors border border-red-200">
                ログアウト
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-slate-500 mb-4">現在、データはブラウザにのみ保存されています。</p>
              <button onClick={() => document.dispatchEvent(new CustomEvent('open-auth'))} className="px-4 py-2 text-sm bg-slate-800 text-white rounded-md hover:bg-slate-900 transition-colors">
                保存して使う (無料登録)
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <button 
          onClick={() => setShowDev(!showDev)}
          className="w-full p-6 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
        >
          <h2 className="text-lg font-medium text-slate-800">詳細</h2>
          <span className="text-slate-400">{showDev ? '▲' : '▼'}</span>
        </button>
        
        {showDev && (
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-700 mb-2">システム情報</h3>
              <p className="text-xs text-slate-500">内部で Claude Sonnet を使用しています。</p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-2">開発者向け</h3>
              <p className="text-xs text-slate-500 mb-4">このデータを外部の AI ツールから操作する</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center bg-white p-3 rounded border border-slate-200">
                  <span className="text-sm text-slate-700">Claude Desktop で使う</span>
                  <button className="text-xs text-blue-600 hover:underline">設定をコピー</button>
                </div>
                <div className="flex justify-between items-center bg-white p-3 rounded border border-slate-200">
                  <span className="text-sm text-slate-700">Cursor で使う</span>
                  <button className="text-xs text-blue-600 hover:underline">設定をコピー</button>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-4 relative">
                <div className="text-xs text-slate-400 mb-2">接続用設定 (mcp.json)</div>
                <pre className="text-xs text-green-400 overflow-x-auto">
                  <code>{mcpConfig}</code>
                </pre>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                (これは技術者向けの機能です。通常の利用には必要ありません。)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
