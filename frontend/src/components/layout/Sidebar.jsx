import { NavLink, Link } from 'react-router-dom';
import { Home, CheckSquare, BarChart2, BookOpen, Clock, LogOut, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: BarChart2, label: 'Analytics', path: '/analytics' },
  { icon: BookOpen, label: 'Notes', path: '/notes' },
  { icon: Clock, label: 'Focus Mode', path: '/focus' },
];

const Sidebar = () => {
  const { logout, user } = useAuth();
  return (
    <aside className="w-64 border-r border-white/5 bg-surface/20 backdrop-blur-xl h-screen sticky top-0 flex-col hidden md:flex">
      <div className="p-6 border-b border-white/5">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight block leading-tight">Synora</span>
            <span className="text-[10px] text-textSecondary uppercase tracking-widest">AI Study Platform</span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-textSecondary font-semibold px-3 py-2">Navigation</p>
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm ${isActive ? 'bg-primary/15 text-primary font-semibold border border-primary/20' : 'text-textSecondary hover:bg-white/5 hover:text-textPrimary'}`
            }>
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/5 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-textPrimary truncate">{user?.name}</p>
            <p className="text-[11px] text-textSecondary truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 w-full text-textSecondary hover:text-danger hover:bg-danger/10 rounded-xl transition-all text-sm">
          <LogOut className="w-4 h-4" />
          <span className="font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
