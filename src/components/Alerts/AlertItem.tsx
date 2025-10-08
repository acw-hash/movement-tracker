import { Bell, TrendingUp, TrendingDown, Zap, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Alert } from '@/types';

interface AlertItemProps {
  alert: Alert;
  onRead: (alertId: string) => void;
}

export function AlertItem({ alert, onRead }: AlertItemProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'line_movement':
        return <TrendingUp className="w-5 h-5" />;
      case 'sharp_action':
        return <Zap className="w-5 h-5" />;
      case 'reverse_movement':
        return <TrendingDown className="w-5 h-5" />;
      case 'news':
        return <AlertCircle className="w-5 h-5" />;
      case 'steam_move':
        return <Zap className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-accent-rose bg-accent-rose/20 border-accent-rose/30';
      case 'medium':
        return 'text-accent-amber bg-accent-amber/20 border-accent-amber/30';
      case 'low':
        return 'text-accent-green bg-accent-green/20 border-accent-green/30';
      default:
        return 'text-dark-400 bg-dark-800 border-dark-700';
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'line_movement':
        return 'text-accent-green';
      case 'sharp_action':
        return 'text-accent-amber';
      case 'reverse_movement':
        return 'text-accent-rose';
      case 'news':
        return 'text-brand-primary';
      case 'steam_move':
        return 'text-brand-secondary';
      default:
        return 'text-dark-400';
    }
  };

  const handleClick = () => {
    if (!alert.is_read) {
      onRead(alert.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`card-premium p-6 cursor-pointer transition-all duration-300 hover:shadow-glow hover:scale-[1.02] ${
        alert.is_read
          ? 'opacity-75 hover:opacity-100'
          : 'ring-2 ring-accent-amber/30 shadow-glow'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl border ${getSeverityColor(alert.severity)} flex-shrink-0`}>
          <div className={getAlertTypeColor(alert.alert_type)}>
            {getAlertIcon(alert.alert_type)}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className={`text-lg font-bold ${
              alert.is_read ? 'text-dark-400' : 'text-white'
            }`}>
              {alert.title}
            </h3>
            <span className="text-sm text-dark-400 ml-2 flex-shrink-0">
              {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
            </span>
          </div>
          
          <p className={`text-sm leading-relaxed mb-3 ${
            alert.is_read ? 'text-dark-500' : 'text-dark-300'
          }`}>
            {alert.message}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                alert.severity === 'high' 
                  ? 'bg-accent-rose/20 text-accent-rose'
                  : alert.severity === 'medium'
                  ? 'bg-accent-amber/20 text-accent-amber'
                  : 'bg-accent-green/20 text-accent-green'
              }`}>
                {alert.severity.toUpperCase()}
              </span>
              <span className={`text-xs font-medium px-2 py-1 rounded-lg bg-dark-800 text-dark-300 ${
                getAlertTypeColor(alert.alert_type)
              }`}>
                {alert.alert_type.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            
            {!alert.is_read && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-amber rounded-full animate-pulse"></div>
                <span className="text-xs text-accent-amber font-bold">NEW</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
