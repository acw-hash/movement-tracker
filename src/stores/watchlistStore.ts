import { create } from 'zustand';
import { watchlistService } from '@/services/watchlist';

interface WatchlistState {
  watchedGameIds: Set<string>;
  loading: boolean;
  error: string | null;
}

interface WatchlistActions {
  loadWatchlist: () => Promise<void>;
  addToWatchlist: (gameId: string, alertThreshold?: number) => Promise<void>;
  removeFromWatchlist: (gameId: string) => Promise<void>;
  isWatched: (gameId: string) => boolean;
  clearError: () => void;
}

export const useWatchlistStore = create<WatchlistState & WatchlistActions>((set, get) => ({
  watchedGameIds: new Set(),
  loading: false,
  error: null,

  loadWatchlist: async () => {
    set({ loading: true, error: null });
    try {
      const watchlist = await watchlistService.getWatchlist();
      const gameIds = new Set(watchlist.map(item => item.game_id));
      set({ watchedGameIds: gameIds, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load watchlist',
        loading: false 
      });
    }
  },

  addToWatchlist: async (gameId: string, alertThreshold = 1.0) => {
    try {
      await watchlistService.addToWatchlist(gameId, alertThreshold);
      const { watchedGameIds } = get();
      const newSet = new Set(watchedGameIds);
      newSet.add(gameId);
      set({ watchedGameIds: newSet });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add to watchlist'
      });
      throw error;
    }
  },

  removeFromWatchlist: async (gameId: string) => {
    try {
      await watchlistService.removeFromWatchlist(gameId);
      const { watchedGameIds } = get();
      const newSet = new Set(watchedGameIds);
      newSet.delete(gameId);
      set({ watchedGameIds: newSet });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to remove from watchlist'
      });
      throw error;
    }
  },

  isWatched: (gameId: string) => {
    return get().watchedGameIds.has(gameId);
  },

  clearError: () => set({ error: null }),
}));
