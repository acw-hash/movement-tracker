import { Star, TrendingUp, TrendingDown, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import type { Game } from '@/types';

interface GameCardProps {
  game: Game;
  onWatch: (gameId: string) => void;
  isWatched: boolean;
  onGameClick: (gameId: string) => void;
}

export function GameCard({ game, onWatch, isWatched, onGameClick }: GameCardProps) {
  const handleWatchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWatch(game.id);
  };

  const handleGameClick = () => {
    onGameClick(game.id);
  };

  // Mock line movement indicator with more realistic data
  const lineMovement = Math.random() > 0.5 ? 'up' : 'down';
  const movementAmount = (Math.random() * 2).toFixed(1);
  const movementPercentage = Math.floor(Math.random() * 100);
  const isLive = Math.random() > 0.7;

  return (
    <div
      onClick={handleGameClick}
      className="group card-premium hover:shadow-glow hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full flex flex-col relative overflow-hidden p-8"
    >
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Live indicator */}
      {isLive && (
        <div className="absolute top-6 right-6 z-10">
          <div className="flex items-center gap-1 bg-accent-red text-white text-xs px-3 py-1 rounded-full font-bold animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>LIVE</span>
          </div>
        </div>
      )}

      {/* Header with teams and watch button */}
      <div className="flex items-start justify-between mb-8 relative z-10">
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-4">
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
            <div className="flex items-center gap-4">
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
          </div>
          {game.venue && (
            <div className="flex items-center gap-3 text-sm text-dark-400">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{game.venue}</span>
            </div>
          )}
        </div>
        <button
          onClick={handleWatchClick}
          className={`p-4 rounded-xl transition-all duration-300 flex-shrink-0 hover:scale-110 ${
            isWatched
              ? 'text-accent-amber bg-accent-amber/20 border border-accent-amber/30 shadow-glow'
              : 'text-dark-400 hover:text-accent-amber hover:bg-accent-amber/10 border border-dark-700 hover:border-accent-amber/30'
          }`}
        >
          <Star className={`w-5 h-5 ${isWatched ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Game time with premium styling */}
      <div className="flex items-center gap-4 text-sm text-dark-400 mb-8 relative z-10">
        <div className="w-8 h-8 bg-dark-800 rounded-lg flex items-center justify-center flex-shrink-0">
          <Clock className="w-4 h-4" />
        </div>
        <span className="font-medium">{format(new Date(game.commence_time), 'MMM d, h:mm a')}</span>
      </div>

      {/* Line movement percentage bar */}
      <div className="mb-6 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-dark-500 font-medium">Line Movement</span>
          <span className="text-sm font-mono text-dark-400 font-bold">{movementPercentage}%</span>
        </div>
        <div className="w-full bg-dark-800 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              lineMovement === 'up' 
                ? 'bg-gradient-to-r from-accent-green to-brand-primary' 
                : 'bg-gradient-to-r from-accent-red to-brand-secondary'
            }`}
            style={{ width: `${movementPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Current line and movement with premium styling */}
      <div className="flex items-center justify-between pt-6 border-t border-dark-700 mt-auto relative z-10">
        <div className="text-sm text-dark-300 min-w-0 flex-1">
          <span className="font-semibold">Spread:</span> 
          <span className="truncate ml-2 font-mono">{game.home_team} -3.5</span>
        </div>
        <div className={`flex items-center gap-2 text-sm font-bold flex-shrink-0 ml-4 ${
          lineMovement === 'up' ? 'text-accent-green' : 'text-accent-red'
        }`}>
          {lineMovement === 'up' ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className={`px-3 py-2 rounded-lg text-xs font-mono ${
            lineMovement === 'up' ? 'status-positive' : 'status-negative'
          }`}>
            {movementAmount}
          </span>
        </div>
      </div>
    </div>
  );
}
