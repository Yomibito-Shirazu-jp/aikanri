import React, { useEffect, useState, useCallback } from 'react';
import { useAppStore } from '../store/AppContext';
import { analyzeTableForQuestions, generateChartFromQuestion, detectRelations } from '../services/mockAi';
import { ChartConfig } from '../types';
import { ChartRenderer } from '../components/ChartRenderer';
import { IconSearch, IconDownload, IconCheck } from '../components/Icons';
import { exportToCsv } from '../services/fileParser';

export const TableView: React.FC<{ tableId: string }> = ({ tableId }) => {
  const { tables, addChart, setView } = useAppStore();
  const table = tables.find(t => t.id === tableId);
  
  const [questions, setQuestions] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeChart, setActiveChart] = useState<ChartConfig | null>(null);
  const [isGeneratingChart, setIsGeneratingChart] = useState(false);
  const [relationPrompt, setRelationPrompt] = useState<{ message: string, charts: ChartConfig[] } | null>(null);

  // Analyze table for questions on mount
  useEffect(() => {
    if (!table) return;
    let isMounted = true;
    
    const analyze = async () => {
      setIsAnalyzing(true);
      const qs = await analyzeTableForQuestions(table);
      if (isMounted) {
        setQuestions(qs);
        setIsAnalyzing(false);
      }
    };
    analyze();

    return () => { isMounted = false; };
  }, [table]);

  // Check for relations when a new table is viewed (simulating Step 3)
  useEffect(() => {
    if (!table || tables.length < 2) return;
    let isMounted = true;

    const checkRelations = async () => {
      const result = await detectRelations(tables);
      if (isMounted && result.detected && result.message && result.suggestedCharts) {
        setRelationPrompt({ message: result.message, charts: result.suggestedCharts });
      }
    };
    checkRelations();

    return () => { isMounted = false; };
  }, [table, tables]);

  const handleQuestionClick = useCallback(async (q: string) => {
    if (!table) return;
    setIsGeneratingChart(true);
    setActiveChart(null);
    const chart = await generateChartFromQuestion(q, table);
    setActiveChart(chart);
    setIsGeneratingChart(false);
  }, [table]);

  const handleAddChartToHome = useCallback(() => {
    if (activeChart) {
      addChart(activeChart);
      setActiveChart(null); // Hide after adding
    }
  }, [activeChart, addChart]);

  const handleAcceptRelation = useCallback(() => {
    if (relationPrompt) {
      relationPrompt.charts.forEach(chart => addChart(chart));
      setRelationPrompt(null);
      setView({ type: 'home' });
    }
  }, [relationPrompt, addChart, setView]);

  if (!table) return <div className="p-8 text-slate-500">表が見つかりません</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <span className="mr-3 text-3xl">📁</span> {table.name}
            <span className="ml-3 text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
              {table.rows.length} 件
            </span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">「{table.name}.xlsx」を読み込みました</p>
        </div>
        <button 
          onClick={() => exportToCsv(table)}
          className="flex items-center text-sm text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-md transition-colors"
        >
          <IconDownload className="w-4 h-4 mr-2" /> Excelに戻す
        </button>
      </div>

      {/* Relation Prompt (Step 3) */}
      {relationPrompt && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm">
          <div className="mb-4 sm:mb-0">
            <div className="flex items-center text-blue-800 font-medium mb-1">
              <IconCheck className="w-5 h-5 mr-2 text-blue-600" />
              つながっているようです
            </div>
            <p className="text-sm text-blue-700 whitespace-pre-line">{relationPrompt.message}</p>
          </div>
          <div className="flex space-x-3">
            <button onClick={() => setRelationPrompt(null)} className="px-4 py-2 text-sm text-blue-700 hover:bg-blue-100 rounded-md transition-colors">
              あとで
            </button>
            <button onClick={handleAcceptRelation} className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md shadow-sm transition-colors">
              合わせて分析する
            </button>
          </div>
        </div>
      )}

      {/* Data Grid Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                {table.columns.map((col, i) => (
                  <th key={i} className="px-6 py-3 font-medium">{col.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.slice(0, 5).map((row, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  {table.columns.map((col, j) => (
                    <td key={j} className="px-6 py-3 text-slate-700 truncate max-w-[200px]">
                      {row[col.name]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {table.rows.length > 5 && (
          <div className="bg-slate-50 p-3 text-center text-xs text-slate-400 border-t border-slate-100">
            他 {table.rows.length - 5} 件...
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center">
          <span className="w-1.5 h-4 bg-blue-500 rounded-full mr-2"></span>
          こんなことが分かります:
        </h3>
        
        {isAnalyzing ? (
          <div className="flex space-x-2 animate-pulse">
            <div className="h-10 bg-slate-100 rounded-lg w-1/3"></div>
            <div className="h-10 bg-slate-100 rounded-lg w-1/4"></div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {questions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleQuestionClick(q)}
                className="px-4 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-700 rounded-lg text-sm transition-all shadow-sm flex items-center"
              >
                {i === 0 ? '🏆' : i === 1 ? '📅' : '📦'} <span className="ml-2">{q}</span>
              </button>
            ))}
            <button
              onClick={() => setView({ type: 'chat' })}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm transition-all shadow-sm flex items-center"
            >
              <IconSearch className="w-4 h-4 mr-2" /> 自分で質問する →
            </button>
          </div>
        )}
      </div>

      {/* Chart Result Area */}
      {isGeneratingChart && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center">
          <div className="flex space-x-2 mb-4">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <div className="text-sm text-slate-500">調べています...</div>
        </div>
      )}

      {activeChart && !isGeneratingChart && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h4 className="font-medium text-slate-800">{activeChart.title}</h4>
          </div>
          <ChartRenderer config={activeChart} />
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <span className="text-sm text-slate-600">ホームに追加しますか？</span>
            <div className="space-x-3">
              <button onClick={() => setActiveChart(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-md transition-colors">
                いいえ
              </button>
              <button onClick={handleAddChartToHome} className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md shadow-sm transition-colors">
                はい
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
