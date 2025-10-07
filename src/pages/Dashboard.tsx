import { useState, useEffect } from 'react';
import { Search, Filter, AlertCircle, RefreshCw, TrendingUp, Star, Zap, Activity } from 'lucide-react';
import { useGamesStore } from '@/stores/gamesStore';
import { useWatchlistStore } from '@/stores/watchlistStore';
import { GameList } from '@/components/Game/GameList';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showWatchlistOnly, setShowWatchlistOnly] = useState(false);
  
  const {
    selectedSport,
    loading,
    error,
    filteredGames,
    fetchGames,
    setSport,
    setSearchQuery: setStoreSearchQuery,
    clearError
  } = useGamesStore();

  const {
    addToWatchlist,
    removeFromWatchlist,
    isWatched,
    loadWatchlist
  } = useWatchlistStore();

  useEffect(() => {
    fetchGames();
    loadWatchlist();
  }, [fetchGames, loadWatchlist]);

  useEffect(() => {
    setStoreSearchQuery(searchQuery);
  }, [searchQuery, setStoreSearchQuery]);

  const handleSportChange = (sport: 'NFL' | 'NCAAF') => {
    setSport(sport);
  };

  const handleWatch = async (gameId: string) => {
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

  const handleGameClick = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleWatchlistToggle = () => {
    setShowWatchlistOnly(!showWatchlistOnly);
  };

  // Filter games based on watchlist toggle
  const displayGames = showWatchlistOnly 
    ? filteredGames.filter(game => isWatched(game.id))
    : filteredGames;

  // Mock premium metrics
  const totalGames = filteredGames.length;
  const watchedGames = filteredGames.filter(game => isWatched(game.id)).length;
  const liveGames = Math.floor(Math.random() * 5) + 1;
  const avgMovement = (Math.random() * 2 + 0.5).toFixed(1);

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-24">
          <div className="w-24 h-24 bg-accent-red/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-glow-red">
            <AlertCircle className="w-12 h-12 text-accent-red" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Error loading games</h3>
          <p className="text-dark-400 mb-8 max-w-md mx-auto leading-relaxed">{error}</p>
          <button
            onClick={() => {
              clearError();
              fetchGames();
            }}
            className="btn-primary"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Premium Hero Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-display font-bold text-gradient mb-4">
              {selectedSport} Dashboard
            </h1>
            <p className="text-xl text-dark-400 leading-relaxed">
              Track line movements and find premium betting opportunities
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <div className="metric-card">
              <div className="metric-value text-gradient-green">{totalGames}</div>
              <div className="metric-label">Total Games</div>
            </div>
            <div className="metric-card">
              <div className="metric-value text-gradient">{watchedGames}</div>
              <div className="metric-label">Watched</div>
            </div>
            <div className="metric-card">
              <div className="metric-value text-accent-red">{liveGames}</div>
              <div className="metric-label">Live</div>
            </div>
          </div>
        </div>

        {/* Premium Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Main stats card */}
          <div className="lg:col-span-2 card-premium p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Market Overview</h3>
                <p className="text-dark-400">Real-time line movements</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-3xl font-mono font-bold text-white mb-1">{avgMovement}</div>
                <div className="text-sm text-dark-400">Avg Movement</div>
              </div>
              <div>
                <div className="text-3xl font-mono font-bold text-accent-green mb-1">+12.5%</div>
                <div className="text-sm text-dark-400">Today's Gain</div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="card-premium p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-accent-amber" />
              <h4 className="font-semibold text-white">Quick Actions</h4>
            </div>
            <div className="space-y-3">
              <button className="w-full btn-ghost text-sm py-3">
                <Star className="w-4 h-4 mr-2" />
                View Watchlist
              </button>
              <button className="w-full btn-ghost text-sm py-3">
                <TrendingUp className="w-4 h-4 mr-2" />
                Live Movements
              </button>
            </div>
          </div>

          {/* Premium status */}
          <div className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-accent-green rounded-full animate-pulse"></div>
              <h4 className="font-semibold text-white">System Status</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">Data Feed</span>
                <span className="text-accent-green font-mono">Active</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">Alerts</span>
                <span className="text-accent-green font-mono">3 Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Filters */}
      <div className="mb-8">
        <div className="card-glass p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sport selector with premium styling */}
            <div className="flex gap-3">
              <button
                onClick={() => handleSportChange('NFL')}
                className={`px-8 py-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  selectedSport === 'NFL'
                    ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-glow'
                    : 'bg-dark-800 text-dark-300 border border-dark-700 hover:bg-dark-700 hover:border-dark-600 hover:shadow-glow'
                }`}
              >
                NFL
              </button>
              <button
                onClick={() => handleSportChange('NCAAF')}
                className={`px-8 py-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  selectedSport === 'NCAAF'
                    ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-glow'
                    : 'bg-dark-800 text-dark-300 border border-dark-700 hover:bg-dark-700 hover:border-dark-600 hover:shadow-glow'
                }`}
              >
                NCAAF
              </button>
            </div>

            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by team name..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="input-premium pl-12"
                />
              </div>
              <button
                onClick={handleWatchlistToggle}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  showWatchlistOnly
                    ? 'bg-gradient-to-r from-accent-amber to-brand-secondary text-white shadow-glow'
                    : 'bg-dark-800 text-dark-300 border border-dark-700 hover:bg-dark-700 hover:border-dark-600 hover:shadow-glow'
                }`}
              >
                <Filter className="w-4 h-4" />
                {showWatchlistOnly ? 'All Games' : 'Watchlist Only'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Games list */}
      <GameList
        games={displayGames}
        onWatch={handleWatch}
        isWatched={isWatched}
        onGameClick={handleGameClick}
        loading={loading}
      />
    </div>
  );
}
