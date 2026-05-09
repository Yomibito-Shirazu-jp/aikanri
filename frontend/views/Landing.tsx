import React, { useState } from 'react';
import { Dropzone } from '../components/Dropzone';
import { useAppStore } from '../store/AppContext';
import { getSampleTable } from '../services/sampleData';

export const Landing: React.FC = () => {
  const { user, setView, addTable } = useAppStore();
  const [isLoadingSample, setIsLoadingSample] = useState(false);

  const handleLoadSample = () => {
    setIsLoadingSample(true);
    setTimeout(() => {
      const sampleTable = getSampleTable();
      addTable(sampleTable);
      setView({ type: 'table', tableId: sampleTable.id });
    }, 800); // Simulate loading delay
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative">
      {/* Minimal Header for Login if needed */}
      <div className="absolute top-4 right-6">
        {user ? (
          <button onClick={() => setView({ type: 'home' })} className="text-sm text-slate-500 hover:text-slate-800">
            ホームへ
          </button>
        ) : (
          <button onClick={() => setView({ type: 'settings' })} className="text-sm text-slate-500 hover:text-slate-800">
            ログイン
          </button>
        )}
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-4 tracking-tight">バラバラの Excel、まとめます。</h1>
      </div>

      <Dropzone />

      <button 
        onClick={handleLoadSample}
        disabled={isLoadingSample}
        className="mt-12 text-slate-500 hover:text-blue-600 text-sm transition-colors flex items-center justify-center"
      >
        {isLoadingSample ? (
          <span className="animate-pulse">サンプルを準備しています...</span>
        ) : (
          <span>まずはサンプルで見てみる →</span>
        )}
      </button>

      <div className="absolute bottom-6 flex space-x-6 text-xs text-slate-400">
        <a href="#" className="hover:text-slate-600">使い方</a>
        <a href="#" className="hover:text-slate-600">料金</a>
        <a href="#" className="hover:text-slate-600">お問い合わせ</a>
      </div>
    </div>
  );
};
