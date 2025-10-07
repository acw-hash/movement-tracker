import { NavLink } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  Star, 
  BarChart3, 
  CreditCard,
  Crown,
  Sparkles
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Movements', href: '/movements', icon: TrendingUp },
  { name: 'Watchlist', href: '/watchlist', icon: Star },
  { name: 'CLV', href: '/clv', icon: BarChart3, premium: true },
  { name: 'Subscription', href: '/subscription', icon: CreditCard },
];

export function Navigation() {
  return (
    <nav className="hidden md:flex md:flex-col md:w-72 md:bg-dark-900/60 md:backdrop-blur-xl md:border-r md:border-white/10">
      <div className="flex flex-col h-full">
        <div className="flex-1 px-6 py-8">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-glow'
                          : 'text-dark-400 hover:text-white hover:bg-white/10 hover:shadow-glow'
                      }`
                    }
                  >
                    <Icon className={`w-5 h-5 transition-all duration-300 ${
                      'group-hover:scale-110'
                    }`} />
                    <span className="flex-1">{item.name}</span>
                    {item.premium && (
                      <div className="flex items-center gap-1 bg-gradient-to-r from-accent-amber to-brand-secondary text-white text-xs px-3 py-1 rounded-lg font-bold shadow-glow">
                        <Crown className="w-3 h-3" />
                        <span>Elite</span>
                      </div>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
        
        {/* Premium upgrade prompt with glass morphism */}
        <div className="p-6 border-t border-white/10">
          <div className="card-glass p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-accent-amber to-brand-secondary rounded-lg flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-sm font-bold text-white">Upgrade to Elite</span>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-accent-amber" />
                  <span className="text-xs text-accent-amber font-medium">Premium Features</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-dark-400 mb-4 leading-relaxed">
              Unlock advanced CLV tracking, real-time alerts, and premium analytics
            </p>
            <button className="w-full btn-primary text-sm py-3">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
