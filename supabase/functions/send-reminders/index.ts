import { createClient } from '@supabase/supabase-js'
import { serve } from 'https://deno.fresh.dev/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Fetch habits that need reminders
    const { data: habits, error: habitsError } = await supabaseClient
      .from('habits')
      .select(`
        id,
        name,
        description,
        user_id,
        created_at
      `)
      .eq('send_reminder', true)

    if (habitsError) throw habitsError

    // For each habit, send email using Supabase's built-in email
    for (const habit of habits) {
      const { data: userData, error: userError } = await supabaseClient
        .from('auth.users')
        .select('email')
        .eq('id', habit.user_id)
        .single()

      if (userError || !userData?.email) continue

      // Send email using Supabase Auth Admin API
      await supabaseClient.auth.admin.sendEmail(userData.email, {
        subject: `Reminder: ${habit.name}`,
        template_id: 'habit-reminder',
        template_data: {
          habit_name: habit.name,
          description: habit.description || '',
        }
      })

      // Update last reminder sent timestamp
      await supabaseClient
        .from('habits')
        .update({ last_reminder_sent: new Date().toISOString() })
        .eq('id', habit.id)
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

/*
[functions.send-reminders]
verify_jwt = false
schedule = "0 8 * * *"
*/