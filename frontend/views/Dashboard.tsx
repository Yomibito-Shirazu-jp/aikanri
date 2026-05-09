import React from 'react';
import { useAppStore } from '../store/AppContext';
import { ChartRenderer } from '../components/ChartRenderer';
import { IconSearch } from '../components/Icons';

export const Dashboard: React.FC = () => {
  const { charts, tables, setView } = useAppStore();

  // Calculate some basic stats if no charts exist yet
  const totalRecords = tables.reduce((acc, t) => acc + t.rows.length, 0);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            <span className="mr-3 text-3xl">📊</span> 全体
          </h1>
          <p className="text-slate-500 mt-1">あなたの会社の今</p>
        </div>
        <button
          onClick={() => setView({ type: 'chat' })}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm transition-all shadow-sm flex items-center"
        >
          <IconSearch className="w-4 h-4 mr-2" /> 自分で質問する
        </button>
      </div>

      {charts.length === 0 && tables.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center h-48">
            <div className="text-4xl font-bold text-slate-800">{totalRecords.toLocaleString()}</div>
            <div className="text-sm text-slate-500 mt-2">取り込んだ総データ件数</div>
          </div>
          <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-6 flex flex-col items-center justify-center h-48 text-center">
            <p className="text-slate-500 text-sm mb-4">
              表の画面から「質問」を選ぶと、<br/>ここにグラフが追加されます。
            </p>
          </div>
        </div>
      ) : charts.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          まだデータがありません。左のメニューからExcelを追加してください。
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {charts.map(chart => (
            <div key={chart.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-medium text-slate-800 text-sm">{chart.title}</h3>
              </div>
              <div className="flex-grow">
                <ChartRenderer config={chart} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
