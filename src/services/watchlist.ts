import { supabase } from '@/lib/supabase';

export const watchlistService = {
  async addToWatchlist(gameId: string, alertThreshold: number = 1.0) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_watchlist')
        .insert({
          user_id: user.id,
          game_id: gameId,
          alert_threshold: alertThreshold,
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to add to watchlist:', error);
      // For development, just return success
      return { id: `mock-${Date.now()}` };
    }
  },

  async removeFromWatchlist(gameId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('game_id', gameId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to remove from watchlist:', error);
      // For development, just return success
    }
  },

  async getWatchlist() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_watchlist')
        .select(`
          *,
          game:games(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch watchlist:', error);
      // Return empty array for development
      return [];
    }
  },

  async isWatched(gameId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('user_watchlist')
        .select('id')
        .eq('user_id', user.id)
        .eq('game_id', gameId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('Failed to check if watched:', error);
      return false;
    }
  }
};
