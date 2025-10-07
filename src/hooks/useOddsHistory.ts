import useSWR from 'swr';
import { gamesService } from '@/services/games';
import type { OddsSnapshot } from '@/types';

export function useOddsHistory(gameId: string, sportsbookId?: string) {
  const { data: odds, error, isLoading } = useSWR(
    gameId ? `/odds-history/${gameId}${sportsbookId ? `/${sportsbookId}` : ''}` : null,
    () => gamesService.getOddsHistory(gameId, sportsbookId),
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    odds: odds as OddsSnapshot[] | undefined,
    loading: isLoading,
    error,
  };
}
