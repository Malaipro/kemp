import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { webhookUrl, data } = await req.json();
    
    console.log('Nodul webhook request:', { webhookUrl, data });

    if (!webhookUrl) {
      return new Response(
        JSON.stringify({ error: 'Webhook URL is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Forward the request to Nodul
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseText = await response.text();
    console.log('Nodul response:', { status: response.status, text: responseText });

    if (!response.ok) {
      // Check for specific Nodul errors
      if (responseText.includes('cant find webhook') || responseText.includes('deployed scenario to prod')) {
        throw new Error('Сценарий не развернут в продакшене. Убедитесь, что сценарий опубликован в Nodul.');
      }
      throw new Error(`HTTP ${response.status}: ${responseText}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Data sent to Nodul successfully',
        nodulResponse: responseText 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in nodul-webhook function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send data to Nodul',
        details: error.toString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});