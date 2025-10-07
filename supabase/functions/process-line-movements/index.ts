import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get recent odds snapshots (last 2 hours)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    
    const { data: recentOdds, error: oddsError } = await supabaseClient
      .from('odds_snapshots')
      .select('*')
      .gte('timestamp', twoHoursAgo)
      .order('timestamp', { ascending: true });

    if (oddsError) {
      throw new Error(`Error fetching recent odds: ${oddsError.message}`);
    }

    if (!recentOdds || recentOdds.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No recent odds to process',
          movementsDetected: 0
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Group odds by game and sportsbook
    const oddsByGameAndBook = new Map();
    
    for (const odds of recentOdds) {
      const key = `${odds.game_id}-${odds.sportsbook_id}-${odds.market_type}`;
      if (!oddsByGameAndBook.has(key)) {
        oddsByGameAndBook.set(key, []);
      }
      oddsByGameAndBook.get(key).push(odds);
    }

    let movementsDetected = 0;

    // Process each group to detect movements
    for (const [key, oddsList] of oddsByGameAndBook) {
      if (oddsList.length < 2) continue;

      // Sort by timestamp
      oddsList.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      // Compare consecutive snapshots
      for (let i = 1; i < oddsList.length; i++) {
        const current = oddsList[i];
        const previous = oddsList[i - 1];

        // Check for spread movements
        if (current.market_type === 'spreads' && current.home_spread && previous.home_spread) {
          const spreadChange = current.home_spread - previous.home_spread;
          if (Math.abs(spreadChange) >= 0.5) {
            await createLineMovement(supabaseClient, {
              game_id: current.game_id,
              sportsbook_id: current.sportsbook_id,
              market_type: 'spreads',
              previous_value: previous.home_spread,
              new_value: current.home_spread,
              change_amount: spreadChange,
              movement_type: classifyMovement(spreadChange),
              magnitude: classifyMagnitude(Math.abs(spreadChange)),
              current_timestamp: current.timestamp,
            });
            movementsDetected++;
          }
        }

        // Check for total movements
        if (current.market_type === 'totals' && current.total_points && previous.total_points) {
          const totalChange = current.total_points - previous.total_points;
          if (Math.abs(totalChange) >= 0.5) {
            await createLineMovement(supabaseClient, {
              game_id: current.game_id,
              sportsbook_id: current.sportsbook_id,
              market_type: 'totals',
              previous_value: previous.total_points,
              new_value: current.total_points,
              change_amount: totalChange,
              movement_type: classifyMovement(totalChange),
              magnitude: classifyMagnitude(Math.abs(totalChange)),
              current_timestamp: current.timestamp,
            });
            movementsDetected++;
          }
        }

        // Check for moneyline movements
        if (current.market_type === 'h2h' && current.home_ml_odds && previous.home_ml_odds) {
          const oddsChange = current.home_ml_odds - previous.home_ml_odds;
          if (Math.abs(oddsChange) >= 10) {
            await createLineMovement(supabaseClient, {
              game_id: current.game_id,
              sportsbook_id: current.sportsbook_id,
              market_type: 'h2h',
              previous_value: previous.home_ml_odds,
              new_value: current.home_ml_odds,
              change_amount: oddsChange,
              movement_type: classifyMovement(oddsChange),
              magnitude: classifyMagnitude(Math.abs(oddsChange)),
              current_timestamp: current.timestamp,
            });
            movementsDetected++;
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${recentOdds.length} odds snapshots`,
        movementsDetected
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in process-line-movements:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

async function createLineMovement(supabaseClient: any, movementData: any) {
  const { error } = await supabaseClient
    .from('line_movements')
    .insert(movementData);

  if (error) {
    console.error('Error creating line movement:', error);
  }
}

function classifyMovement(change: number): string {
  if (Math.abs(change) >= 2) return 'sharp';
  if (Math.abs(change) >= 1) return 'steam';
  return 'normal';
}

function classifyMagnitude(change: number): string {
  if (change >= 3) return 'major';
  if (change >= 2) return 'significant';
  if (change >= 1) return 'moderate';
  return 'minor';
}
