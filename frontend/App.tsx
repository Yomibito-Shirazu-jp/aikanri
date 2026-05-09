import React from 'react';
import { AppProvider, useAppStore } from './store/AppContext';
import { Landing } from './views/Landing';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './views/Dashboard';
import { TableView } from './views/TableView';
import { Chat } from './views/Chat';
import { Settings } from './views/Settings';
import { HistoryView } from './views/History';

const MainContent: React.FC = () => {
  const { view } = useAppStore();

  if (view.type === 'landing') {
    return <Landing />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <main className="flex-grow overflow-y-auto">
        {view.type === 'home' && <Dashboard />}
        {view.type === 'table' && <TableView tableId={view.tableId} />}
        {view.type === 'chat' && <Chat />}
        {view.type === 'settings' && <Settings />}
        {view.type === 'history' && <HistoryView />}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;
