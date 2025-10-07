import useSWR from 'swr';
import { gamesService } from '@/services/games';
import type { Game } from '@/types';

export function useGame(gameId: string) {
  const { data: game, error, isLoading, mutate } = useSWR(
    gameId ? `/game/${gameId}` : null,
    () => gamesService.getGameById(gameId),
    {
      refreshInterval: 60000, // Refresh every 60 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    game: game as Game | undefined,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
