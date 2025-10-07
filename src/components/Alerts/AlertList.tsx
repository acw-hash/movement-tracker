import { AlertItem } from './AlertItem';
import type { Alert } from '@/types';

interface AlertListProps {
  alerts: Alert[];
  onRead: (alertId: string) => void;
  loading?: boolean;
}

export function AlertList({ alerts, onRead, loading = false }: AlertListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-primary-100 animate-pulse"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-primary-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-primary-200 rounded w-3/4"></div>
                <div className="h-3 bg-primary-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-primary-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 0 0-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 0 0 15 0v5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-primary-900 mb-2">No alerts yet</h3>
        <p className="text-primary-600">You'll receive notifications when games you're watching have line movements.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
