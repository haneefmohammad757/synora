import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AIChatWidget from '../AIChatWidget';
import MobileBottomNav from './MobileBottomNav';

const DashboardLayout = () => (
  <div className="min-h-screen bg-background flex">
    <Sidebar />
    <main className="flex-1 min-w-0 h-screen overflow-y-auto">
      {/* Mobile: p-4, Desktop: p-8; bottom padding makes room for the mobile nav bar */}
      <div className="max-w-6xl mx-auto p-4 pb-24 md:p-8 md:pb-8">
        <Outlet />
      </div>
    </main>
    <AIChatWidget />
    <MobileBottomNav />
  </div>
);

export default DashboardLayout;
