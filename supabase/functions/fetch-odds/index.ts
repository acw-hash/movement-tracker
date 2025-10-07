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

    // Get sport from query parameters
    const url = new URL(req.url);
    const sport = url.searchParams.get('sport') || 'NFL';

    // Fetch odds from The Odds API
    const oddsApiKey = Deno.env.get('THE_ODDS_API_KEY');
    if (!oddsApiKey) {
      throw new Error('THE_ODDS_API_KEY not configured');
    }

    const oddsResponse = await fetch(
      `https://api.the-odds-api.com/v4/sports/${sport.toLowerCase()}/odds/?apiKey=${oddsApiKey}&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso`
    );

    if (!oddsResponse.ok) {
      throw new Error(`Odds API error: ${oddsResponse.status}`);
    }

    const oddsData = await oddsResponse.json();

    // Process each game
    for (const game of oddsData) {
      // Upsert game
      const { data: gameData, error: gameError } = await supabaseClient
        .from('games')
        .upsert({
          external_id: game.id,
          sport: sport,
          league: game.sport_title,
          season: new Date().getFullYear(),
          week: game.week || null,
          home_team: game.home_team,
          away_team: game.away_team,
          commence_time: game.commence_time,
          status: game.completed ? 'completed' : 'scheduled',
          home_score: game.scores?.find((s: any) => s.name === game.home_team)?.score,
          away_score: game.scores?.find((s: any) => s.name === game.away_team)?.score,
          venue: game.venue || null,
        }, {
          onConflict: 'external_id'
        })
        .select()
        .single();

      if (gameError) {
        console.error('Error upserting game:', gameError);
        continue;
      }

      // Process odds for each sportsbook
      for (const bookmaker of game.bookmakers || []) {
        const sportsbookId = bookmaker.key;
        
        // Process spreads
        if (bookmaker.markets?.spreads) {
          for (const spread of bookmaker.markets.spreads) {
            await supabaseClient
              .from('odds_snapshots')
              .insert({
                game_id: gameData.id,
                sportsbook_id: sportsbookId,
                market_type: 'spreads',
                home_spread: spread.points?.find((p: any) => p.name === game.home_team)?.value,
                away_spread: spread.points?.find((p: any) => p.name === game.away_team)?.value,
                home_spread_odds: spread.points?.find((p: any) => p.name === game.home_team)?.price,
                away_spread_odds: spread.points?.find((p: any) => p.name === game.away_team)?.price,
                timestamp: new Date().toISOString(),
              });
          }
        }

        // Process totals
        if (bookmaker.markets?.totals) {
          for (const total of bookmaker.markets.totals) {
            await supabaseClient
              .from('odds_snapshots')
              .insert({
                game_id: gameData.id,
                sportsbook_id: sportsbookId,
                market_type: 'totals',
                total_points: total.points,
                over_odds: total.points?.find((p: any) => p.name === 'Over')?.price,
                under_odds: total.points?.find((p: any) => p.name === 'Under')?.price,
                timestamp: new Date().toISOString(),
              });
          }
        }

        // Process moneyline
        if (bookmaker.markets?.h2h) {
          for (const h2h of bookmaker.markets.h2h) {
            await supabaseClient
              .from('odds_snapshots')
              .insert({
                game_id: gameData.id,
                sportsbook_id: sportsbookId,
                market_type: 'h2h',
                home_ml_odds: h2h.outcomes?.find((o: any) => o.name === game.home_team)?.price,
                away_ml_odds: h2h.outcomes?.find((o: any) => o.name === game.away_team)?.price,
                timestamp: new Date().toISOString(),
              });
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${oddsData.length} games for ${sport}`,
        gamesProcessed: oddsData.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in fetch-odds:', error);
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
