import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/AppContext';
import { handleChatQuery } from '../services/mockAi';
import { ChartRenderer } from '../components/ChartRenderer';

export const Chat: React.FC = () => {
  const { messages, addMessage, tables, addChart, setView } = useAppStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    addMessage({ id: Date.now().toString(), role: 'user', text: userMsg, timestamp: Date.now() });
    
    setIsTyping(true);
    const response = await handleChatQuery(userMsg, tables);
    setIsTyping(false);
    addMessage(response);
  };

  const handleAddChart = (chart: any) => {
    addChart(chart);
    setView({ type: 'home' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden my-4">
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <h2 className="font-bold text-slate-800">自由に質問できます</h2>
        <p className="text-xs text-slate-500">取り込んだデータについて聞いてみてください</p>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 mt-10 text-sm">
            例: 「先月、売上が伸びた顧客は誰？」
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-100 text-slate-800 rounded-tl-sm'}`}>
              <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
            </div>
            
            {msg.chart && (
              <div className="mt-3 w-full max-w-md bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-3 border-b border-slate-100 bg-slate-50 text-xs font-medium text-slate-600">
                  {msg.chart.title}
                </div>
                <div className="h-48">
                  <ChartRenderer config={msg.chart} />
                </div>
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs text-slate-500">ホームに追加しますか？</span>
                  <div className="space-x-2">
                    <button className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded transition-colors">いいえ</button>
                    <button onClick={() => handleAddChart(msg.chart)} className="px-3 py-1 text-xs bg-blue-600 text-white hover:bg-blue-700 rounded transition-colors">はい</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start">
            <div className="bg-slate-100 rounded-2xl rounded-tl-sm p-4 flex space-x-2">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-100 bg-white">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="質問を入力..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
          >
            <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </button>
        </form>
      </div>
    </div>
  );
};
