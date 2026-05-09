export type ColumnType = 'string' | 'number' | 'date';

export interface Column {
  name: string;
  type: ColumnType;
}

export interface TableData {
  id: string;
  name: string;
  columns: Column[];
  rows: Record<string, any>[];
  createdAt: number;
}

export type ChartType = 'bar' | 'line' | 'pie' | 'number' | 'list';

export interface ChartConfig {
  id: string;
  title: string;
  type: ChartType;
  data: any[];
  xAxisKey?: string;
  dataKey?: string;
  value?: string | number;
  subtitle?: string;
  listItems?: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'system';
  text: string;
  chart?: ChartConfig;
  timestamp: number;
}

export interface User {
  email: string;
}

export type ViewState = 
  | { type: 'landing' }
  | { type: 'home' }
  | { type: 'table'; tableId: string }
  | { type: 'chat' }
  | { type: 'settings' }
  | { type: 'history' };
