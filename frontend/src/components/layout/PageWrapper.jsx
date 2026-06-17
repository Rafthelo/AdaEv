import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar  from './Topbar';

const PageWrapper = ({ title, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-3 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageWrapper;