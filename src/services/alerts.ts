import { supabase } from '@/lib/supabase';
import type { Alert } from '@/types';

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
      throw error;
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
