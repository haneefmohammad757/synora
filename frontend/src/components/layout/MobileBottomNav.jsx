import { NavLink, useLocation } from 'react-router-dom';
import { Home, CheckSquare, BarChart2, BookOpen, Clock, Sparkles } from 'lucide-react';

const pageItems = [
  { icon: Home,        label: 'Home',      path: '/dashboard' },
  { icon: CheckSquare, label: 'Tasks',     path: '/tasks' },
  { icon: BarChart2,   label: 'Analytics', path: '/analytics' },
  { icon: BookOpen,    label: 'Notes',     path: '/notes' },
  { icon: Clock,       label: 'Focus',     path: '/focus' },
];

/**
 * Sticky bottom navigation bar — visible only on mobile (md:hidden).
 * onAIToggle: callback to open/close the AIChatWidget from the parent.
 */
const MobileBottomNav = ({ onAIToggle, aiOpen }) => {
  const location = useLocation();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40
                 bg-surface/85 backdrop-blur-xl border-t border-white/10
                 flex items-stretch
                 shadow-[0_-8px_32px_rgba(0,0,0,0.5)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {pageItems.map(({ icon: Icon, label, path }) => {
        const isActive = location.pathname === path;
        return (
          <NavLink
            key={path}
            to={path}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-[56px]
                        text-[10px] font-medium tracking-wide transition-all duration-200 relative
                        ${isActive ? 'text-primary' : 'text-textSecondary'}`}
          >
            {/* Active indicator pill at top */}
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b-full bg-gradient-to-r from-primary to-secondary" />
            )}
            <Icon
              className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
              strokeWidth={isActive ? 2.2 : 1.8}
            />
            <span className={isActive ? 'font-semibold' : ''}>{label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
