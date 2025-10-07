import { GameCard } from './GameCard';
import { Calendar, Sparkles } from 'lucide-react';
import type { Game } from '@/types';

interface GameListProps {
  games: Game[];
  onWatch: (gameId: string) => void;
  isWatched: (gameId: string) => boolean;
  onGameClick: (gameId: string) => void;
  loading?: boolean;
}

export function GameList({ 
  games, 
  onWatch, 
  isWatched, 
  onGameClick, 
  loading = false 
}: GameListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="card-premium p-8 h-full flex flex-col relative overflow-hidden"
          >
            <div className="space-y-6 flex-1 relative z-10">
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 skeleton rounded-lg"></div>
                    <div className="h-6 skeleton rounded-lg w-3/4"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 skeleton rounded-lg"></div>
                    <div className="h-6 skeleton rounded-lg w-2/3"></div>
                  </div>
                  <div className="h-4 skeleton rounded w-1/2"></div>
                </div>
                <div className="w-12 h-12 skeleton rounded-xl ml-3"></div>
              </div>
              <div className="h-4 skeleton rounded w-1/3"></div>
              <div className="space-y-2">
                <div className="h-2 skeleton rounded-full w-full"></div>
                <div className="h-2 skeleton rounded-full w-3/4"></div>
              </div>
              <div className="h-px bg-dark-700 mt-6"></div>
              <div className="flex justify-between items-center">
                <div className="h-4 skeleton rounded w-1/2"></div>
                <div className="h-8 skeleton rounded-lg w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="w-24 h-24 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-glow">
          <Calendar className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">No games found</h3>
        <p className="text-dark-400 max-w-md mx-auto leading-relaxed">
          Try adjusting your filters or check back later for new games. 
          Games are typically posted 24-48 hours before kickoff.
        </p>
        <div className="flex items-center justify-center gap-2 mt-6">
          <Sparkles className="w-4 h-4 text-accent-amber" />
          <span className="text-sm text-accent-amber font-medium">Premium games coming soon</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          onWatch={onWatch}
          isWatched={isWatched(game.id)}
          onGameClick={onGameClick}
        />
      ))}
    </div>
  );
}
