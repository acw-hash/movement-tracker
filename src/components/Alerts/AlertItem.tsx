import { Bell, TrendingUp, TrendingDown, Zap } from 'lucide-react';
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
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-accent-rose bg-accent-rose/10 border-accent-rose/20';
      case 'medium':
        return 'text-accent-amber bg-accent-amber/10 border-accent-amber/20';
      case 'low':
        return 'text-accent-green bg-accent-green/10 border-accent-green/20';
      default:
        return 'text-primary-600 bg-primary-100 border-primary-200';
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
      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
        alert.is_read
          ? 'bg-white border-primary-100 hover:bg-primary-50'
          : 'bg-primary-50 border-primary-200 hover:bg-primary-100'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
          {getAlertIcon(alert.alert_type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className={`text-sm font-semibold ${
              alert.is_read ? 'text-primary-600' : 'text-primary-900'
            }`}>
              {alert.title}
            </h3>
            <span className="text-xs text-primary-500 ml-2">
              {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
            </span>
          </div>
          <p className={`text-sm mt-1 ${
            alert.is_read ? 'text-primary-500' : 'text-primary-700'
          }`}>
            {alert.message}
          </p>
          {!alert.is_read && (
            <div className="mt-2">
              <span className="inline-block w-2 h-2 bg-accent-rose rounded-full"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
