import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, CheckSquare, BarChart2, BookOpen, Clock, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const pageItems = [
  { icon: Home,        label: 'Home',      path: '/dashboard' },
  { icon: CheckSquare, label: 'Tasks',     path: '/tasks' },
  { icon: BarChart2,   label: 'Analytics', path: '/analytics' },
  { icon: BookOpen,    label: 'Notes',     path: '/notes' },
  { icon: Clock,       label: 'Focus',     path: '/focus' },
];

/**
 * Sticky bottom navigation bar — visible only on mobile (md:hidden).
 * Shows 5 page tabs + a tappable Profile icon that reveals a logout sheet.
 */
const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Profile sheet — slides up when profileOpen */}
      {profileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
            onClick={() => setProfileOpen(false)}
          />
          {/* Sheet */}
          <div className="md:hidden fixed bottom-[64px] left-0 right-0 z-30 animate-slide-up">
            <div className="mx-3 mb-2 glass rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              {/* User info */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-textPrimary truncate">{user?.name}</p>
                  <p className="text-xs text-textSecondary truncate">{user?.email}</p>
                </div>
              </div>
              {/* Logout action */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-4 text-sm text-textSecondary
                           hover:text-danger hover:bg-danger/10 active:bg-danger/20
                           transition-all duration-150"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">Log out</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Bottom nav bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40
                   bg-surface/85 backdrop-blur-xl border-t border-white/10
                   flex items-stretch
                   shadow-[0_-8px_32px_rgba(0,0,0,0.5)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Page nav items */}
        {pageItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink
              key={path}
              to={path}
              onClick={() => setProfileOpen(false)}
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

        {/* Profile tab — toggles the slide-up sheet */}
        <button
          onClick={() => setProfileOpen(o => !o)}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-[56px]
                      text-[10px] font-medium tracking-wide transition-all duration-200 relative
                      ${profileOpen ? 'text-primary' : 'text-textSecondary'}`}
        >
          {profileOpen && (
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b-full bg-gradient-to-r from-primary to-secondary" />
          )}
          {/* Avatar circle */}
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold
                          transition-all duration-200
                          ${profileOpen
                            ? 'bg-gradient-to-tr from-primary to-secondary text-white scale-110'
                            : 'bg-white/10 text-textSecondary'
                          }`}>
            {user?.name?.charAt(0).toUpperCase() || <User className="w-3 h-3" />}
          </div>
          <span className={profileOpen ? 'font-semibold' : ''}>Profile</span>
        </button>
      </nav>
    </>
  );
};

export default MobileBottomNav;
