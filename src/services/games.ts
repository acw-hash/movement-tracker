import { supabase } from '@/lib/supabase';
import type { Game, OddsSnapshot, LineMovement } from '@/types';

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
      // Return mock data for development
      return generateMockOdds(gameId);
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

// Mock odds data generator
export function generateMockOdds(gameId: string): OddsSnapshot[] {
  const sportsbooks = ['DraftKings', 'FanDuel', 'BetMGM', 'Caesars', 'PointsBet'];
  const odds: OddsSnapshot[] = [];
  
  // Generate odds for the last 24 hours
  const now = new Date();
  const startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  for (let i = 0; i < 20; i++) {
    const timestamp = new Date(startTime.getTime() + (i * 60 * 60 * 1000));
    const sportsbook = sportsbooks[Math.floor(Math.random() * sportsbooks.length)];
    
    // Generate realistic odds with some movement
    const baseSpread = -3.5 + (Math.random() - 0.5) * 2;
    const baseTotal = 45 + Math.random() * 10;
    const spreadOdds = -110 + Math.floor(Math.random() * 20) - 10;
    const totalOdds = -110 + Math.floor(Math.random() * 20) - 10;
    
    odds.push({
      id: `odds-${gameId}-${i}`,
      game_id: gameId,
      sportsbook_id: sportsbook,
      market_type: 'spreads',
      home_spread: baseSpread + (Math.random() - 0.5) * 0.5,
      home_spread_odds: spreadOdds,
      away_spread_odds: -spreadOdds,
      home_ml_odds: -150 + Math.floor(Math.random() * 100),
      away_ml_odds: 120 + Math.floor(Math.random() * 100),
      total_points: baseTotal + (Math.random() - 0.5) * 2,
      over_odds: totalOdds,
      under_odds: -totalOdds,
      timestamp: timestamp.toISOString(),
    });
  }
  
  return odds.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

// Mock line movements generator
export function generateMockLineMovements(gameId: string): LineMovement[] {
  const movements: LineMovement[] = [];
  const now = new Date();
  const startTime = new Date(now.getTime() - 6 * 60 * 60 * 1000); // Last 6 hours
  
  let currentValue = -3.5;
  const movementTypes: LineMovement['movement_type'][] = ['normal', 'sharp', 'steam', 'reverse'];
  const magnitudes: LineMovement['magnitude'][] = ['minor', 'moderate', 'significant', 'major'];
  
  for (let i = 0; i < 15; i++) {
    const timestamp = new Date(startTime.getTime() + (i * 24 * 60 * 1000)); // Every 24 minutes
    const changeAmount = (Math.random() - 0.5) * 1.5; // -0.75 to +0.75
    const newValue = currentValue + changeAmount;
    
    movements.push({
      id: `movement-${gameId}-${i}`,
      game_id: gameId,
      sportsbook_id: ['DraftKings', 'FanDuel', 'BetMGM'][Math.floor(Math.random() * 3)],
      market_type: 'spreads',
      previous_value: currentValue,
      new_value: newValue,
      change_amount: changeAmount,
      movement_type: movementTypes[Math.floor(Math.random() * movementTypes.length)],
      magnitude: magnitudes[Math.floor(Math.random() * magnitudes.length)],
      current_timestamp: timestamp.toISOString(),
      created_at: timestamp.toISOString(),
    });
    
    currentValue = newValue;
  }
  
  return movements.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}
