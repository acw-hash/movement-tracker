import { create } from 'zustand';
import { gamesService } from '@/services/games';
import type { Game } from '@/types';

interface GamesState {
  games: Game[];
  selectedSport: 'NFL' | 'NCAAF';
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filteredGames: Game[];
}

interface GamesActions {
  fetchGames: () => Promise<void>;
  setSport: (sport: 'NFL' | 'NCAAF') => void;
  setSearchQuery: (query: string) => void;
  clearError: () => void;
}

export const useGamesStore = create<GamesState & GamesActions>((set, get) => ({
  games: [],
  selectedSport: 'NFL',
  loading: false,
  error: null,
  searchQuery: '',
  filteredGames: [],

  fetchGames: async () => {
    set({ loading: true, error: null });
    try {
      const games = await gamesService.getUpcomingGames(get().selectedSport);
      set({ games, loading: false });
      
      // Apply search filter if there's a query
      const { searchQuery } = get();
      if (searchQuery) {
        const filtered = games.filter(game => 
          game.home_team.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.away_team.toLowerCase().includes(searchQuery.toLowerCase())
        );
        set({ filteredGames: filtered });
      } else {
        set({ filteredGames: games });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch games',
        loading: false 
      });
    }
  },

  setSport: (sport) => {
    set({ selectedSport: sport });
    get().fetchGames();
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    const { games } = get();
    if (query) {
      const filtered = games.filter(game => 
        game.home_team.toLowerCase().includes(query.toLowerCase()) ||
        game.away_team.toLowerCase().includes(query.toLowerCase())
      );
      set({ filteredGames: filtered });
    } else {
      set({ filteredGames: games });
    }
  },

  clearError: () => set({ error: null }),
}));
