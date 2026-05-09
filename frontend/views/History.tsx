import React from 'react';
import { useAppStore } from '../store/AppContext';

export const HistoryView: React.FC = () => {
  const { auditLog } = useAppStore();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-8">操作履歴</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {auditLog.length === 0 ? (
          <div className="p-8 text-center text-slate-400">履歴はありません</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {auditLog.map((log, i) => {
              const match = log.match(/^\[(.*?)\] (.*?): (.*)$/);
              if (!match) return <li key={i} className="p-4 text-sm text-slate-600">{log}</li>;
              
              const [_, time, user, action] = match;
              return (
                <li key={i} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center">
                  <span className="text-xs text-slate-400 w-40 shrink-0">{time}</span>
                  <span className="text-sm font-medium text-slate-700 w-48 shrink-0 truncate px-2">{user}</span>
                  <span className="text-sm text-slate-600">{action}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
