import { supabase } from '@/lib/supabase';
import type { Game, OddsSnapshot } from '@/types';

export const gamesService = {
  async getUpcomingGames(sport: 'NFL' | 'NCAAF' = 'NFL', limit: number = 50) {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('sport', sport)
        .eq('status', 'scheduled')
        .order('commence_time', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return data as Game[];
    } catch (error) {
      console.error('Failed to fetch upcoming games:', error);
      // Return mock data for development
      return generateMockGames(sport, limit);
    }
  },

  async getGameById(gameId: string) {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single();

      if (error) throw error;
      return data as Game;
    } catch (error) {
      console.error('Failed to fetch game:', error);
      throw error;
    }
  },

  async getLatestOdds(gameId: string) {
    try {
      const { data, error } = await supabase
        .from('odds_snapshots')
        .select('*')
        .eq('game_id', gameId)
        .order('timestamp', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data[0] as OddsSnapshot | null;
    } catch (error) {
      console.error('Failed to fetch latest odds:', error);
      throw error;
    }
  },

  async getOddsHistory(gameId: string, sportsbookId?: string) {
    try {
      let query = supabase
        .from('odds_snapshots')
        .select('*')
        .eq('game_id', gameId)
        .order('timestamp', { ascending: true });

      if (sportsbookId) {
        query = query.eq('sportsbook_id', sportsbookId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as OddsSnapshot[];
    } catch (error) {
      console.error('Failed to fetch odds history:', error);
      throw error;
    }
  },

  async searchGames(query: string) {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .or(`home_team.ilike.%${query}%,away_team.ilike.%${query}%`)
        .eq('status', 'scheduled')
        .order('commence_time', { ascending: true });

      if (error) throw error;
      return data as Game[];
    } catch (error) {
      console.error('Failed to search games:', error);
      throw error;
    }
  }
};

// Mock data generator for development
function generateMockGames(sport: 'NFL' | 'NCAAF', limit: number): Game[] {
  const nflTeams = [
    'Chiefs', 'Bills', 'Bengals', 'Ravens', 'Dolphins', 'Steelers', 'Browns', 'Jets',
    'Cowboys', 'Eagles', 'Giants', 'Commanders', '49ers', 'Rams', 'Seahawks', 'Cardinals',
    'Packers', 'Vikings', 'Lions', 'Bears', 'Buccaneers', 'Saints', 'Falcons', 'Panthers'
  ];
  
  const collegeTeams = [
    'Alabama', 'Georgia', 'Ohio State', 'Michigan', 'Clemson', 'LSU', 'Oklahoma', 'Texas',
    'USC', 'Oregon', 'Florida', 'Auburn', 'Penn State', 'Notre Dame', 'Miami', 'Florida State'
  ];
  
  const teams = sport === 'NFL' ? nflTeams : collegeTeams;
  const games: Game[] = [];
  
  for (let i = 0; i < Math.min(limit, 12); i++) {
    const homeTeam = teams[Math.floor(Math.random() * teams.length)];
    let awayTeam = teams[Math.floor(Math.random() * teams.length)];
    while (awayTeam === homeTeam) {
      awayTeam = teams[Math.floor(Math.random() * teams.length)];
    }
    
    const gameTime = new Date();
    gameTime.setDate(gameTime.getDate() + Math.floor(Math.random() * 7) + 1);
    gameTime.setHours(12 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60), 0, 0);
    
    games.push({
      id: `game-${i + 1}`,
      external_id: `ext-${i + 1}`,
      sport,
      league: sport === 'NFL' ? 'NFL' : 'NCAA',
      season: 2024,
      week: sport === 'NFL' ? Math.floor(Math.random() * 18) + 1 : Math.floor(Math.random() * 15) + 1,
      home_team: homeTeam,
      away_team: awayTeam,
      commence_time: gameTime.toISOString(),
      status: 'scheduled' as const,
      venue: `${homeTeam} Stadium`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  
  return games.sort((a, b) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime());
}
