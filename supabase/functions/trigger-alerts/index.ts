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

    // Get recent line movements (last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const { data: recentMovements, error: movementsError } = await supabaseClient
      .from('line_movements')
      .select(`
        *,
        game:games(*)
      `)
      .gte('created_at', oneHourAgo)
      .order('created_at', { ascending: false });

    if (movementsError) {
      throw new Error(`Error fetching recent movements: ${movementsError.message}`);
    }

    if (!recentMovements || recentMovements.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No recent movements to process',
          alertsCreated: 0
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    let alertsCreated = 0;

    // Process each movement
    for (const movement of recentMovements) {
      // Get users watching this game
      const { data: watchlistUsers, error: watchlistError } = await supabaseClient
        .from('user_watchlist')
        .select(`
          user_id,
          alert_threshold,
          user:profiles(*)
        `)
        .eq('game_id', movement.game_id);

      if (watchlistError) {
        console.error('Error fetching watchlist users:', watchlistError);
        continue;
      }

      if (!watchlistUsers || watchlistUsers.length === 0) continue;

      // Create alerts for each user
      for (const watchlistItem of watchlistUsers) {
        const user = watchlistItem.user;
        if (!user) continue;

        // Check if movement meets user's threshold
        if (Math.abs(movement.change_amount) < watchlistItem.alert_threshold) {
          continue;
        }

        // Determine alert type and severity
        const alertType = getAlertType(movement);
        const severity = getSeverity(movement);
        const title = getAlertTitle(movement, alertType);
        const message = getAlertMessage(movement, alertType);

        // Create alert
        const { error: alertError } = await supabaseClient
          .from('alerts')
          .insert({
            user_id: watchlistItem.user_id,
            game_id: movement.game_id,
            alert_type: alertType,
            title,
            message,
            severity,
            is_read: false,
          });

        if (alertError) {
          console.error('Error creating alert:', alertError);
          continue;
        }

        alertsCreated++;

        // Send notification (placeholder for future implementation)
        console.log(`Alert created for user ${user.email}: ${title}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${recentMovements.length} movements`,
        alertsCreated
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in trigger-alerts:', error);
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

function getAlertType(movement: any): string {
  if (movement.movement_type === 'sharp') return 'sharp_action';
  if (movement.movement_type === 'steam') return 'steam_move';
  if (movement.movement_type === 'reverse') return 'reverse_movement';
  return 'line_movement';
}

function getSeverity(movement: any): string {
  if (movement.magnitude === 'major') return 'high';
  if (movement.magnitude === 'significant') return 'high';
  if (movement.magnitude === 'moderate') return 'medium';
  return 'low';
}

function getAlertTitle(movement: any, alertType: string): string {
  const game = movement.game;
  const team = movement.market_type === 'spreads' ? game.home_team : 'Total';
  
  switch (alertType) {
    case 'sharp_action':
      return `Sharp Action: ${team} line moved ${movement.change_amount > 0 ? '+' : ''}${movement.change_amount}`;
    case 'steam_move':
      return `Steam Move: ${team} line moved ${movement.change_amount > 0 ? '+' : ''}${movement.change_amount}`;
    case 'reverse_movement':
      return `Reverse Movement: ${team} line moved ${movement.change_amount > 0 ? '+' : ''}${movement.change_amount}`;
    default:
      return `Line Movement: ${team} line moved ${movement.change_amount > 0 ? '+' : ''}${movement.change_amount}`;
  }
}

function getAlertMessage(movement: any, alertType: string): string {
  const game = movement.game;
  const sportsbook = movement.sportsbook_id;
  
  return `${game.away_team} @ ${game.home_team} - ${movement.market_type} moved from ${movement.previous_value} to ${movement.new_value} at ${sportsbook}`;
}
