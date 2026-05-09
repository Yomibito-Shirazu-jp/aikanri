import { TableData, ChartConfig } from '../types';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const analyzeTableForQuestions = async (table: TableData): Promise<string[]> => {
  await delay(800); // Simulate thinking
  
  const colNames = table.columns.map(c => c.name);
  const questions: string[] = [];

  if (colNames.includes('顧客') || colNames.includes('顧客名') || colNames.includes('会社名')) {
    if (colNames.includes('売上') || colNames.includes('金額')) {
      questions.push('顧客別の売上順位');
    }
  }
  
  if (colNames.includes('月') || colNames.includes('日付') || colNames.includes('年月')) {
    if (colNames.includes('売上') || colNames.includes('金額')) {
      questions.push('月ごとの推移');
    }
  }

  if (colNames.includes('商品') || colNames.includes('商品名')) {
    questions.push('よく売れる商品');
  }

  if (questions.length === 0) {
    questions.push(`${table.name}の件数`);
    if (table.columns.length > 0) {
      questions.push(`${table.columns[0].name}の一覧`);
    }
  }

  return questions.slice(0, 3);
};

export const generateChartFromQuestion = async (question: string, table: TableData): Promise<ChartConfig> => {
  await delay(1500); // Simulate processing

  const id = Math.random().toString(36).substring(7);

  if (question.includes('顧客別') && question.includes('売上')) {
    // Mock aggregation
    const aggregated: Record<string, number> = {};
    table.rows.forEach(row => {
      const customer = row['顧客'] || row['顧客名'] || row['会社名'] || '不明';
      const amount = parseFloat(row['売上'] || row['金額'] || '0');
      if (!isNaN(amount)) {
        aggregated[customer] = (aggregated[customer] || 0) + amount;
      }
    });

    const data = Object.entries(aggregated)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    return {
      id,
      title: '顧客別の売上',
      type: 'bar',
      data,
      xAxisKey: 'name',
      dataKey: 'value'
    };
  }

  if (question.includes('月') && question.includes('推移')) {
    return {
      id,
      title: '月別推移',
      type: 'line',
      data: [
        { name: '4月', value: 400000 },
        { name: '5月', value: 300000 },
        { name: '6月', value: 550000 },
        { name: '7月', value: 450000 },
        { name: '8月', value: 600000 },
      ],
      xAxisKey: 'name',
      dataKey: 'value'
    };
  }

  if (question.includes('商品')) {
    return {
      id,
      title: 'よく売れる商品',
      type: 'bar',
      data: [
        { name: '商品A', value: 120 },
        { name: '商品B', value: 98 },
        { name: '商品C', value: 86 },
      ],
      xAxisKey: 'name',
      dataKey: 'value'
    };
  }

  // Fallback
  return {
    id,
    title: '集計結果',
    type: 'number',
    data: [],
    value: table.rows.length,
    subtitle: '件のデータ'
  };
};

export const detectRelations = async (tables: TableData[]): Promise<{ detected: boolean; message?: string; suggestedCharts?: ChartConfig[] }> => {
  if (tables.length < 2) return { detected: false };
  
  await delay(1000);
  
  const latestTable = tables[tables.length - 1];
  const previousTables = tables.slice(0, -1);

  for (const prev of previousTables) {
    const commonCols = latestTable.columns.filter(c1 => 
      prev.columns.some(c2 => c2.name === c1.name && (c1.name === '顧客' || c1.name === '顧客名' || c1.name === 'ID'))
    );

    if (commonCols.length > 0) {
      const colName = commonCols[0].name;
      return {
        detected: true,
        message: `「${prev.name}」と「${latestTable.name}」が繋がっているようです\n(どちらにも ${colName} という列があります)`,
        suggestedCharts: [
          {
            id: Math.random().toString(36).substring(7),
            title: '都道府県別売上 (結合データ)',
            type: 'bar',
            data: [
              { name: '東京都', value: 1500000 },
              { name: '大阪府', value: 800000 },
              { name: '愛知県', value: 600000 },
            ],
            xAxisKey: 'name',
            dataKey: 'value'
          },
          {
            id: Math.random().toString(36).substring(7),
            title: '顧客別の累計 (結合データ)',
            type: 'bar',
            data: [
              { name: 'A社', value: 500000 },
              { name: 'B社', value: 300000 },
            ],
            xAxisKey: 'name',
            dataKey: 'value'
          }
        ]
      };
    }
  }

  return { detected: false };
};

export const handleChatQuery = async (query: string, tables: TableData[]): Promise<Message> => {
  await delay(2000);
  
  const id = Math.random().toString(36).substring(7);
  
  if (query.includes('伸びた') || query.includes('先月')) {
    return {
      id,
      role: 'system',
      text: 'A社が +30% 伸びています。次に B社が +15% です。',
      timestamp: Date.now(),
      chart: {
        id: `chart_${id}`,
        title: '前月比トップ顧客',
        type: 'bar',
        data: [
          { name: 'A社', value: 30 },
          { name: 'B社', value: 15 },
          { name: 'C社', value: 5 },
        ],
        xAxisKey: 'name',
        dataKey: 'value'
      }
    };
  }

  return {
    id,
    role: 'system',
    text: '分かりました。データから以下のことが読み取れます。',
    timestamp: Date.now(),
    chart: {
      id: `chart_${id}`,
      title: '検索結果',
      type: 'number',
      data: [],
      value: tables.reduce((acc, t) => acc + t.rows.length, 0),
      subtitle: '総レコード数'
    }
  };
};
