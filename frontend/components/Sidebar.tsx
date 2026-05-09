import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/AppContext';
import { IconChart, IconChat, IconHistory, IconSettings, IconFile } from './Icons';
import { Dropzone } from './Dropzone';
import { AuthModal } from './AuthModal';

export const Sidebar: React.FC = () => {
  const { tables, user, view, setView } = useAppStore();
  const [showAuth, setShowAuth] = useState(false);

  // Listen for custom event to open auth modal from settings
  useEffect(() => {
    const handleOpenAuth = () => setShowAuth(true);
    document.addEventListener('open-auth', handleOpenAuth);
    return () => document.removeEventListener('open-auth', handleOpenAuth);
  }, []);

  const navItemClass = (isActive: boolean) => 
    `flex items-center w-full px-3 py-2 text-sm rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`;

  return (
    <>
      <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col flex-shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-slate-100">
          <h1 className="font-bold text-lg text-slate-800 tracking-tight">kanribu-ai</h1>
          {user && <div className="text-xs text-slate-500 truncate mt-1">{user.email}</div>}
        </div>

        {/* Main Nav */}
        <div className="p-3 space-y-1">
          <button onClick={() => setView({ type: 'home' })} className={navItemClass(view.type === 'home')}>
            <IconChart className="w-4 h-4 mr-3" /> 全体
          </button>
          <button onClick={() => setView({ type: 'chat' })} className={navItemClass(view.type === 'chat')}>
            <IconChat className="w-4 h-4 mr-3" /> 質問する
          </button>
          <button onClick={() => setView({ type: 'history' })} className={navItemClass(view.type === 'history')}>
            <IconHistory className="w-4 h-4 mr-3" /> 操作履歴
          </button>
        </div>

        {/* Tables List */}
        <div className="flex-grow overflow-y-auto p-3">
          <div className="mb-4">
            <Dropzone compact />
          </div>
          
          {tables.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 flex items-center">
                <span className="flex-grow border-t border-slate-200 mr-2"></span>
                一覧
                <span className="flex-grow border-t border-slate-200 ml-2"></span>
              </div>
              <div className="space-y-1">
                {tables.map(table => (
                  <button 
                    key={table.id}
                    onClick={() => setView({ type: 'table', tableId: table.id })}
                    className={navItemClass(view.type === 'table' && view.tableId === table.id)}
                  >
                    <IconFile className="w-4 h-4 mr-3 text-slate-400" />
                    <span className="truncate flex-grow text-left">{table.name}</span>
                    <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{table.rows.length}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Nav */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          {!user && tables.length > 0 && (
            <button 
              onClick={() => setShowAuth(true)}
              className="w-full flex items-center justify-center px-3 py-2 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors mb-2 shadow-sm"
            >
              💾 保存して使う
            </button>
          )}
          <button onClick={() => setView({ type: 'settings' })} className={navItemClass(view.type === 'settings')}>
            <IconSettings className="w-4 h-4 mr-3" /> 設定
          </button>
        </div>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
};
