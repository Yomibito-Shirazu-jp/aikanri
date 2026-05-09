import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartConfig } from '../types';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const ChartRenderer: React.FC<{ config: ChartConfig }> = ({ config }) => {
  if (config.type === 'number') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="text-4xl font-bold text-slate-800">{config.value?.toLocaleString()}</div>
        {config.subtitle && <div className="text-sm text-slate-500 mt-2">{config.subtitle}</div>}
      </div>
    );
  }

  if (config.type === 'list') {
    return (
      <div className="p-4 h-full overflow-y-auto">
        <ul className="space-y-2">
          {config.listItems?.map((item, i) => (
            <li key={i} className="text-sm text-slate-700 flex items-start">
              <span className="mr-2 text-slate-400">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="w-full h-64 p-4">
      <ResponsiveContainer width="100%" height="100%">
        {config.type === 'bar' ? (
          <BarChart data={config.data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey={config.xAxisKey} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} angle={-45} textAnchor="end" />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={60} />
            <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Bar dataKey={config.dataKey!} fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : config.type === 'line' ? (
          <LineChart data={config.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey={config.xAxisKey} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={60} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Line type="monotone" dataKey={config.dataKey!} stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} />
          </LineChart>
        ) : (
          <PieChart>
            <Pie data={config.data} dataKey={config.dataKey!} nameKey={config.xAxisKey} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
              {config.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
