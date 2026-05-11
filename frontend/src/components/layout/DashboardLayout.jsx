import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AIChatWidget from '../AIChatWidget';

const DashboardLayout = () => (
  <div className="min-h-screen bg-background flex">
    <Sidebar />
    <main className="flex-1 min-w-0 h-screen overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8">
        <Outlet />
      </div>
    </main>
    <AIChatWidget />
  </div>
);

export default DashboardLayout;
