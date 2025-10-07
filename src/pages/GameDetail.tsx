import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, TrendingUp, Clock, MapPin, AlertCircle } from 'lucide-react';
import { useGame } from '@/hooks/useGame';
import { useOddsHistory } from '@/hooks/useOddsHistory';
import { useRealtimeLineMovements } from '@/hooks/useRealtimeLineMovements';
import { LineMovementChart } from '@/components/Charts/LineMovementChart';
import { useWatchlistStore } from '@/stores/watchlistStore';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export function GameDetail() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  
  const { game, loading: gameLoading, error: gameError } = useGame(gameId || '');
  const { odds, loading: oddsLoading } = useOddsHistory(gameId || '');
  const { movements, loading: movementsLoading } = useRealtimeLineMovements(gameId || '');
  
  const { isWatched, addToWatchlist, removeFromWatchlist } = useWatchlistStore();

  const handleWatch = async () => {
    if (!gameId) return;
    
    try {
      if (isWatched(gameId)) {
        await removeFromWatchlist(gameId);
        toast.success('Removed from watchlist');
      } else {
        await addToWatchlist(gameId);
        toast.success('Added to watchlist');
      }
    } catch (error) {
      toast.error('Failed to update watchlist');
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (gameLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-primary-200 rounded-xl w-1/4"></div>
          <div className="h-80 bg-primary-200 rounded-2xl"></div>
          <div className="h-40 bg-primary-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (gameError || !game) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-accent-rose/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-accent-rose" />
          </div>
          <h3 className="text-xl font-semibold text-primary-800 mb-3">Game not found</h3>
          <p className="text-primary-500 mb-6 max-w-md mx-auto">
            The game you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={handleBack}
            className="btn-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-10">
        <button
          onClick={handleBack}
          className="flex items-center gap-3 text-primary-600 hover:text-primary-800 transition-colors duration-200 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary-900 mb-4">
              {game.away_team} @ {game.home_team}
            </h1>
            <div className="flex items-center gap-6 text-primary-500">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-medium">{format(new Date(game.commence_time), 'MMM d, h:mm a')}</span>
              </div>
              {game.venue && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">{game.venue}</span>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={handleWatch}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              isWatched(game.id)
                ? 'bg-accent-amber text-white shadow-soft'
                : 'bg-white text-primary-600 border border-primary-200 hover:bg-primary-50 hover:border-primary-300'
            }`}
          >
            <Star className={`w-5 h-5 ${isWatched(game.id) ? 'fill-current' : ''}`} />
            {isWatched(game.id) ? 'Watching' : 'Watch'}
          </button>
        </div>
      </div>

      {/* Line Movement Chart */}
      <div className="card-premium p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-primary-800" />
          <h2 className="text-2xl font-bold text-primary-900">Line Movement</h2>
        </div>
        
        {movementsLoading ? (
          <div className="h-80 bg-primary-50 rounded-2xl animate-pulse"></div>
        ) : movements.length > 0 ? (
          <LineMovementChart data={movements} />
        ) : (
          <div className="h-80 flex items-center justify-center text-primary-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 opacity-50" />
              </div>
              <h3 className="text-lg font-semibold text-primary-800 mb-2">No line movements yet</h3>
              <p className="text-sm">Check back closer to game time for real-time updates</p>
            </div>
          </div>
        )}
      </div>

      {/* Current Odds */}
      <div className="card-premium p-8 mb-8">
        <h2 className="text-2xl font-bold text-primary-900 mb-6">Current Odds</h2>
        
        {oddsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-4 bg-primary-200 rounded-lg w-1/4 mb-3"></div>
                <div className="h-8 bg-primary-200 rounded-xl w-1/2"></div>
              </div>
            ))}
          </div>
        ) : odds && odds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-primary-600 mb-3 uppercase tracking-wide">Spread</h3>
              <div className="text-3xl font-bold text-primary-900 mb-2">
                {game.home_team} {odds[0].home_spread && odds[0].home_spread > 0 ? '+' : ''}{odds[0].home_spread}
              </div>
              <div className="text-sm text-primary-500">
                {odds[0].home_spread_odds && odds[0].home_spread_odds > 0 ? '+' : ''}{odds[0].home_spread_odds}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-primary-600 mb-3 uppercase tracking-wide">Moneyline</h3>
              <div className="space-y-3">
                <div className="text-xl font-bold text-primary-900">
                  {game.away_team}: {odds[0].away_ml_odds && odds[0].away_ml_odds > 0 ? '+' : ''}{odds[0].away_ml_odds}
                </div>
                <div className="text-xl font-bold text-primary-900">
                  {game.home_team}: {odds[0].home_ml_odds && odds[0].home_ml_odds > 0 ? '+' : ''}{odds[0].home_ml_odds}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-primary-600 mb-3 uppercase tracking-wide">Total</h3>
              <div className="text-3xl font-bold text-primary-900 mb-2">
                {odds[0].total_points}
              </div>
              <div className="text-sm text-primary-500">
                O/U: {odds[0].over_odds && odds[0].over_odds > 0 ? '+' : ''}{odds[0].over_odds} / {odds[0].under_odds && odds[0].under_odds > 0 ? '+' : ''}{odds[0].under_odds}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-primary-500">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-primary-800 mb-2">No odds available yet</h3>
            <p className="text-sm">Check back closer to game time for updated odds</p>
          </div>
        )}
      </div>

      {/* Recent Movements */}
      {movements.length > 0 && (
        <div className="card-premium p-8">
          <h2 className="text-2xl font-bold text-primary-900 mb-6">Recent Movements</h2>
          <div className="space-y-4">
            {movements.slice(0, 5).map((movement) => (
              <div key={movement.id} className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
                <div>
                  <div className="text-sm font-semibold text-primary-900">
                    {movement.market_type} - {movement.sportsbook_id}
                  </div>
                  <div className="text-xs text-primary-500">
                    {format(new Date(movement.created_at), 'MMM d, h:mm a')}
                  </div>
                </div>
                <div className={`text-sm font-bold px-3 py-1 rounded-lg ${
                  movement.change_amount > 0 
                    ? 'text-accent-green bg-accent-green/10' 
                    : 'text-accent-rose bg-accent-rose/10'
                }`}>
                  {movement.change_amount > 0 ? '+' : ''}{movement.change_amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
