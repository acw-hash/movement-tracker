import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { LineMovement } from '@/types';

export function useRealtimeLineMovements(gameId: string) {
  const [movements, setMovements] = useState<LineMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) return;

    // Fetch initial movements
    const fetchInitialMovements = async () => {
      try {
        const { data, error } = await supabase
          .from('line_movements')
          .select('*')
          .eq('game_id', gameId)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        setMovements(data || []);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch movements');
        setLoading(false);
      }
    };

    fetchInitialMovements();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`line-movements:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'line_movements',
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          const newMovement = payload.new as LineMovement;
          setMovements(prev => [newMovement, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId]);

  return {
    movements,
    loading,
    error,
  };
}
