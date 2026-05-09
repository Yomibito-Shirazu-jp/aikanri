import Papa from 'papaparse';
import { TableData, Column, ColumnType } from '../types';

const inferType = (value: string): ColumnType => {
  if (!value) return 'string';
  if (!isNaN(Number(value.replace(/,/g, '')))) return 'number';
  if (!isNaN(Date.parse(value))) return 'date';
  return 'string';
};

export const parseFile = (file: File): Promise<TableData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0 && results.data.length === 0) {
          reject(new Error('ファイルの読み込みに失敗しました。'));
          return;
        }

        const data = results.data as Record<string, any>[];
        if (data.length === 0) {
          reject(new Error('データが空です。'));
          return;
        }

        // Infer columns from first row
        const firstRow = data[0];
        const columns: Column[] = Object.keys(firstRow).map(key => ({
          name: key,
          type: inferType(firstRow[key])
        }));

        // Clean up filename for table name
        const name = file.name.replace(/\.[^/.]+$/, "");

        resolve({
          id: Math.random().toString(36).substring(7),
          name,
          columns,
          rows: data,
          createdAt: Date.now()
        });
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const exportToCsv = (table: TableData) => {
  const csv = Papa.unparse(table.rows);
  // Add BOM for Excel UTF-8 compatibility
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${table.name}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
