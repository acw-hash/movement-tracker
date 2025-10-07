export interface Game {
  id: string;
  external_id: string;
  sport: 'NFL' | 'NCAAF';
  league: string;
  season: number;
  week?: number;
  home_team: string;
  away_team: string;
  commence_time: string;
  status: 'scheduled' | 'live' | 'completed' | 'postponed' | 'cancelled';
  home_score?: number;
  away_score?: number;
  venue?: string;
  created_at: string;
  updated_at: string;
}

export interface OddsSnapshot {
  id: string;
  game_id: string;
  sportsbook_id: string;
  market_type: 'h2h' | 'spreads' | 'totals';
  home_spread?: number;
  away_spread?: number;
  home_spread_odds?: number;
  away_spread_odds?: number;
  home_ml_odds?: number;
  away_ml_odds?: number;
  total_points?: number;
  over_odds?: number;
  under_odds?: number;
  timestamp: string;
}

export interface LineMovement {
  id: string;
  game_id: string;
  sportsbook_id: string;
  market_type: string;
  previous_value: number;
  new_value: number;
  change_amount: number;
  movement_type: 'normal' | 'sharp' | 'steam' | 'reverse';
  magnitude: 'minor' | 'moderate' | 'significant' | 'major';
  current_timestamp: string;
  created_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  game_id: string;
  alert_type: 'line_movement' | 'sharp_action' | 'reverse_movement' | 'news' | 'steam_move';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  is_read: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'pro' | 'elite';
  subscription_status: 'active' | 'inactive' | 'cancelled' | 'past_due';
  created_at: string;
}

export interface UserBet {
  id: string;
  user_id: string;
  game_id: string;
  sportsbook: string;
  market_type: 'h2h' | 'spreads' | 'totals';
  side: 'home' | 'away' | 'over' | 'under';
  line: number;
  odds: number;
  amount: number;
  placed_at: string;
  result?: 'won' | 'lost' | 'push' | 'pending';
  closing_line?: number;
  closing_odds?: number;
  clv_percentage?: number;
  profit_loss?: number;
  created_at: string;
  updated_at: string;
}

export interface CLVStats {
  totalBets: number;
  winRate: number;
  totalProfit: number;
  avgCLV: number;
}
