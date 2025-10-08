import { AlertItem } from './AlertItem';
import { Bell, Sparkles } from 'lucide-react';
import type { Alert } from '@/types';

interface AlertListProps {
  alerts: Alert[];
  onRead: (alertId: string) => void;
  loading?: boolean;
}

export function AlertList({ alerts, onRead, loading = false }: AlertListProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="card-premium p-6 animate-pulse"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-dark-800 rounded-xl"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-dark-800 rounded-lg w-3/4"></div>
                <div className="h-4 bg-dark-800 rounded-lg w-1/2"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-dark-800 rounded-lg w-16"></div>
                  <div className="h-6 bg-dark-800 rounded-lg w-20"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-glow">
          <Bell className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">No alerts yet</h3>
        <p className="text-dark-400 max-w-md mx-auto leading-relaxed mb-6">
          You'll receive notifications when games you're watching have line movements, 
          sharp action, or other important betting signals.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-amber" />
          <span className="text-sm text-accent-amber font-medium">Premium alerts coming soon</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {alerts.map((alert) => (
        <AlertItem
          key={alert.id}
          alert={alert}
          onRead={onRead}
        />
      ))}
    </div>
  );
}
