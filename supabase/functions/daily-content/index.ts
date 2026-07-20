import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const today = new Date().toISOString().split('T')[0];

  try {
    const [quoteRes, reflectionRes] = await Promise.all([
      supabase
        .from('content_pieces')
        .select('id, type, title, body, author, tags, reading_time_seconds')
        .eq('type', 'quote')
        .eq('is_daily', true)
        .lte('scheduled_for', today)
        .order('scheduled_for', { ascending: false })
        .limit(1)
        .single(),
      supabase
        .from('content_pieces')
        .select('id, type, title, body, author, tags, reading_time_seconds')
        .eq('type', 'reflection')
        .eq('is_daily', true)
        .lte('scheduled_for', today)
        .order('scheduled_for', { ascending: false })
        .limit(1)
        .single(),
    ]);

    return new Response(
      JSON.stringify({
        date: today,
        quote: quoteRes.data,
        reflection: reflectionRes.data,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
