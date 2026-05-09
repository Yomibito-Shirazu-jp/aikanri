import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TableData, ChartConfig, User, ViewState, Message } from '../types';

interface AppState {
  tables: TableData[];
  charts: ChartConfig[];
  user: User | null;
  view: ViewState;
  messages: Message[];
  auditLog: string[];
}

interface AppContextType extends AppState {
  addTable: (table: TableData) => void;
  addChart: (chart: ChartConfig) => void;
  setUser: (user: User | null) => void;
  setView: (view: ViewState) => void;
  addMessage: (message: Message) => void;
  logAction: (action: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tables, setTables] = useState<TableData[]>([]);
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>({ type: 'landing' });
  const [messages, setMessages] = useState<Message[]>([]);
  const [auditLog, setAuditLog] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('kanribu_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.tables) setTables(parsed.tables);
        if (parsed.charts) setCharts(parsed.charts);
        if (parsed.user) {
          setUser(parsed.user);
          setView({ type: 'home' });
        } else if (parsed.tables && parsed.tables.length > 0) {
          setView({ type: 'home' });
        }
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('kanribu_data', JSON.stringify({ tables, charts, user }));
  }, [tables, charts, user]);

  const logAction = (action: string) => {
    const time = new Date().toLocaleString('ja-JP');
    const userStr = user ? user.email : '未登録ユーザー';
    setAuditLog(prev => [`[${time}] ${userStr}: ${action}`, ...prev]);
  };

  const addTable = (table: TableData) => {
    setTables(prev => [...prev, table]);
    logAction(`「${table.name}」を取り込みました`);
  };

  const addChart = (chart: ChartConfig) => {
    setCharts(prev => {
      if (prev.find(c => c.id === chart.id)) return prev;
      return [...prev, chart];
    });
    logAction(`グラフ「${chart.title}」を全体に追加しました`);
  };

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  return (
    <AppContext.Provider value={{
      tables, charts, user, view, messages, auditLog,
      addTable, addChart, setUser, setView, addMessage, logAction
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
};
