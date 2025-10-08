import { supabase } from '@/lib/supabase';
import type { Alert } from '@/types';

// Mock alerts generator
function generateMockAlerts(): Alert[] {
  const alertTypes: Alert['alert_type'][] = ['line_movement', 'sharp_action', 'reverse_movement', 'news', 'steam_move'];
  const severities: Alert['severity'][] = ['low', 'medium', 'high'];
  const games = ['Chiefs vs Bills', 'Cowboys vs Eagles', '49ers vs Rams', 'Packers vs Vikings'];
  
  const alerts: Alert[] = [];
  
  for (let i = 0; i < 8; i++) {
    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const game = games[Math.floor(Math.random() * games.length)];
    
    let title = '';
    let message = '';
    
    switch (alertType) {
      case 'line_movement':
        title = 'Line Movement Detected';
        message = `${game}: Spread moved ${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 2).toFixed(1)} points`;
        break;
      case 'sharp_action':
        title = 'Sharp Action Alert';
        message = `${game}: Unusual betting pattern detected on ${Math.random() > 0.5 ? 'home' : 'away'} team`;
        break;
      case 'reverse_movement':
        title = 'Reverse Line Movement';
        message = `${game}: Line moving against public betting`;
        break;
      case 'news':
        title = 'Breaking News';
        message = `${game}: Key player injury report affects line`;
        break;
      case 'steam_move':
        title = 'Steam Move';
        message = `${game}: Rapid line movement detected across multiple books`;
        break;
    }
    
    const createdAt = new Date();
    createdAt.setHours(createdAt.getHours() - Math.floor(Math.random() * 24));
    
    alerts.push({
      id: `alert-${i + 1}`,
      user_id: 'mock-user',
      game_id: `game-${Math.floor(Math.random() * 4) + 1}`,
      alert_type: alertType,
      title,
      message,
      severity,
      is_read: Math.random() > 0.3,
      created_at: createdAt.toISOString(),
    });
  }
  
  return alerts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export const alertsService = {
  async getAlerts(userId: string, unreadOnly: boolean = false) {
    try {
      if (!userId) throw new Error('User not authenticated');

      let query = supabase
        .from('alerts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (unreadOnly) {
        query = query.eq('is_read', false);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Alert[];
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      // Return mock data for development
      const mockAlerts = generateMockAlerts();
      return unreadOnly ? mockAlerts.filter(alert => !alert.is_read) : mockAlerts;
    }
  },

  async markAsRead(alertId: string) {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('id', alertId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to mark alert as read:', error);
      throw error;
    }
  },

  async markAllAsRead(userId: string) {
    try {
      if (!userId) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to mark all alerts as read:', error);
      throw error;
    }
  },

  async getUnreadCount(userId: string) {
    try {
      if (!userId) return 0;

      const { count, error } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }
  }
};
