import { Bell, Settings, User, LogOut, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Mock sign out - just navigate to login
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 nav-glass">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with premium styling */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-3 text-2xl font-bold text-gradient tracking-tight hover:scale-105 transition-all duration-300"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span>LineTracker</span>
            </button>
          </div>

          {/* Right side with premium interactions */}
          <div className="flex items-center gap-2">
            {/* Notifications with glow effect */}
            <button className="relative p-3 text-dark-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:shadow-glow">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-accent-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-glow-red">
                3
              </span>
            </button>

            {/* Settings */}
            <button className="p-3 text-dark-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:shadow-glow">
              <Settings className="w-5 h-5" />
            </button>

            {/* User menu with glass morphism */}
            <div className="flex items-center gap-3 pl-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-glow">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-semibold text-white">
                    {user?.email?.split('@')[0] || 'Demo User'}
                  </div>
                  <div className="text-xs text-dark-500">
                    {user?.email || 'demo@example.com'}
                  </div>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm text-dark-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:shadow-glow"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
