import { useEffect, useState } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { useWatchlistStore } from '@/stores/watchlistStore';
import { useGamesStore } from '@/stores/gamesStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function Watchlist() {
  const navigate = useNavigate();
  const [watchlistGames, setWatchlistGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { 
    watchedGameIds, 
    removeFromWatchlist, 
    loadWatchlist 
  } = useWatchlistStore();
  
  const { games } = useGamesStore();

  useEffect(() => {
    loadWatchlist();
  }, [loadWatchlist]);

  useEffect(() => {
    if (games.length > 0) {
      const watchedGames = games.filter(game => watchedGameIds.has(game.id));
      setWatchlistGames(watchedGames);
      setLoading(false);
    }
  }, [games, watchedGameIds]);

  const handleRemoveFromWatchlist = async (gameId: string) => {
    try {
      await removeFromWatchlist(gameId);
      toast.success('Removed from watchlist');
    } catch (error) {
      toast.error('Failed to remove from watchlist');
    }
  };

  const handleGameClick = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-dark-800 rounded-xl w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="card-premium p-6 animate-pulse">
                <div className="space-y-4">
                  <div className="h-5 bg-dark-800 rounded-lg w-3/4"></div>
                  <div className="h-4 bg-dark-800 rounded-lg w-1/2"></div>
                  <div className="h-4 bg-dark-800 rounded-lg w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (watchlistGames.length === 0) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mb-12">
          <h1 className="text-display font-bold text-gradient mb-4">Watchlist</h1>
          <p className="text-xl text-dark-400 leading-relaxed">Games you're tracking for line movements</p>
        </div>
        
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-glow">
            <Star className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">No games in watchlist</h3>
          <p className="text-dark-400 max-w-md mx-auto leading-relaxed mb-8">
            Add games to your watchlist to track line movements and get alerts.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Browse Games
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Premium Header */}
      <div className="mb-12">
        <h1 className="text-display font-bold text-gradient mb-4">Watchlist</h1>
        <p className="text-xl text-dark-400 leading-relaxed">
          {watchlistGames.length} game{watchlistGames.length !== 1 ? 's' : ''} you're tracking
        </p>
      </div>

      {/* Premium Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {watchlistGames.map((game) => (
          <div
            key={game.id}
            onClick={() => handleGameClick(game.id)}
            className="card-premium p-6 hover:shadow-glow hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
          >
            {/* Header with teams and remove button */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {game.away_team.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-lg font-bold text-white block truncate">
                      {game.away_team}
                    </span>
                    <span className="text-dark-400 font-medium text-sm">Away</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-brand-secondary to-accent-amber rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {game.home_team.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-lg font-bold text-white block truncate">
                      {game.home_team}
                    </span>
                    <span className="text-dark-400 font-medium text-sm">Home</span>
                  </div>
                </div>
                {game.venue && (
                  <div className="text-sm text-dark-400 mt-3">
                    {game.venue}
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFromWatchlist(game.id);
                }}
                className="p-3 text-accent-rose hover:bg-accent-rose/20 rounded-xl transition-all duration-200 hover:scale-110"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Game time */}
            <div className="text-sm text-dark-400 mb-6">
              {new Date(game.commence_time).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </div>

            {/* Status indicator */}
            <div className="flex items-center justify-between pt-4 border-t border-dark-700">
              <div className="text-sm text-dark-400">
                Status: <span className="text-white font-semibold">{game.status}</span>
              </div>
              <div className="flex items-center gap-2 text-accent-amber">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-xs font-bold">Watching</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
