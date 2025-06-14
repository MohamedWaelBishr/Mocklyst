import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/auth/supabase-auth'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current user (admin check could be added here)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { task } = await request.json()

    if (!task) {
      return NextResponse.json({ error: 'Task parameter required' }, { status: 400 })
    }

    // Get Supabase project URL for Edge Function calls
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    // Call the scheduled-tasks Edge Function
    const response = await fetch(`${supabaseUrl}/functions/v1/scheduled-tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ task })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Edge function call failed: ${errorText}`)
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      message: `Task '${task}' executed successfully`,
      result
    })

  } catch (error) {
    console.error('Analytics trigger error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get analytics health information
    const { data: recentRequests, error: requestsError } = await supabase
      .from('analytics_requests')
      .select('*')
      .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(5)
      .order('timestamp', { ascending: false })

    if (requestsError) {
      throw requestsError
    }

    const { data: recentUptime, error: uptimeError } = await supabase
      .from('analytics_uptime')
      .select('*')
      .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(5)
      .order('timestamp', { ascending: false })

    if (uptimeError) {
      throw uptimeError
    }

    return NextResponse.json({
      success: true,
      analytics: {
        recentRequests: recentRequests?.length || 0,
        recentUptime: recentUptime?.length || 0,
        lastRequestTime: recentRequests?.[0]?.timestamp || null,
        lastUptimeCheck: recentUptime?.[0]?.timestamp || null
      },
      availableTasks: ['uptime-check', 'cleanup', 'health-check']
    })

  } catch (error) {
    console.error('Analytics status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
