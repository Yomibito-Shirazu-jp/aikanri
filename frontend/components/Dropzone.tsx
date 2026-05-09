import React, { useState, useCallback } from 'react';
import { IconUpload } from './Icons';
import { parseFile } from '../services/fileParser';
import { useAppStore } from '../store/AppContext';

interface DropzoneProps {
  compact?: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({ compact = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addTable, setView } = useAppStore();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    setError(null);
    setIsLoading(true);
    try {
      // In a real app, we'd handle xlsx. For this demo, we parse CSV but accept xlsx in UI text.
      if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        throw new Error('ExcelまたはCSVファイルを選択してください。');
      }
      
      const table = await parseFile(file);
      addTable(table);
      setView({ type: 'table', tableId: table.id });
    } catch (err: any) {
      setError(err.message || '読み込みに失敗しました。もう一度試してみてください。');
    } finally {
      setIsLoading(false);
      setIsDragging(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  if (compact) {
    return (
      <div 
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:bg-slate-50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload-compact')?.click()}
      >
        <input id="file-upload-compact" type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleFileInput} />
        <span className="text-sm text-slate-500">+ Excel を追加</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${isDragging ? 'border-blue-500 bg-blue-50 scale-105' : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input id="file-upload" type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleFileInput} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <IconUpload />
          <div className="text-lg font-medium text-slate-700">ここにドロップ</div>
          <div className="text-sm text-slate-500">.xlsx / .xls / .csv</div>
          {isLoading && <div className="text-blue-600 text-sm mt-2 animate-pulse">読み込んでいます...</div>}
        </div>
      </div>
      {error && <div className="mt-4 text-red-500 text-sm text-center">{error}</div>}
    </div>
  );
};
