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
      <div className="p-4 md:p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-primary-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg border border-primary-100 p-6 animate-pulse">
                <div className="space-y-4">
                  <div className="h-4 bg-primary-200 rounded w-3/4"></div>
                  <div className="h-3 bg-primary-200 rounded w-1/2"></div>
                  <div className="h-3 bg-primary-200 rounded w-1/4"></div>
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
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-primary-900 mb-2">Watchlist</h1>
          <p className="text-primary-600">Games you're tracking for line movements</p>
        </div>
        
        <div className="text-center py-12">
          <div className="text-primary-400 mb-4">
            <Star className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-primary-900 mb-2">No games in watchlist</h3>
          <p className="text-primary-600 mb-6">
            Add games to your watchlist to track line movements and get alerts.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-primary-900 text-white px-4 py-2 rounded-lg hover:bg-primary-800 transition-colors"
          >
            Browse Games
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-primary-900 mb-2">Watchlist</h1>
        <p className="text-primary-600">
          {watchlistGames.length} game{watchlistGames.length !== 1 ? 's' : ''} you're tracking
        </p>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {watchlistGames.map((game) => (
          <div
            key={game.id}
            onClick={() => handleGameClick(game.id)}
            className="bg-white rounded-lg border border-primary-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            {/* Header with teams and remove button */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-semibold text-primary-900">
                    {game.away_team}
                  </span>
                  <span className="text-primary-500">@</span>
                  <span className="text-lg font-semibold text-primary-900">
                    {game.home_team}
                  </span>
                </div>
                <div className="text-sm text-primary-600">
                  {game.venue || 'TBD'}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFromWatchlist(game.id);
                }}
                className="p-2 text-accent-rose hover:bg-accent-rose/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Game time */}
            <div className="text-sm text-primary-600 mb-4">
              {new Date(game.commence_time).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </div>

            {/* Status indicator */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-primary-600">
                Status: {game.status}
              </div>
              <div className="flex items-center gap-1 text-accent-amber">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-xs">Watching</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
