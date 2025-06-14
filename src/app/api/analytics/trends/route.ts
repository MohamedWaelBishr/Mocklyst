import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/auth/supabase-auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '7d'
    const metric = searchParams.get('metric') || 'response_time'
    const userId = searchParams.get('userId')

    // Return demo data for unauthenticated users or when no userId is provided
    if (!userId) {
      return NextResponse.json({
        success: true,
        data: generateDemoTrendsData(timeframe),
        timeframe,
        metric,
        demo: true
      })
    }

    const supabase = await createServerSupabaseClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user || user.id !== userId) {
      // Return demo data if authentication fails
      return NextResponse.json({
        success: true,
        data: generateDemoTrendsData(timeframe),
        timeframe,
        metric,
        demo: true
      })
    }

    let query = supabase
      .from('analytics_aggregates')
      .select('date, hour, avg_response_time_ms, success_rate, total_requests, rpm_peak')
      .eq('user_id', user.id)
      .order('date', { ascending: true })
      .order('hour', { ascending: true })

    // Apply timeframe filter
    const now = new Date()
    switch (timeframe) {
      case '24h':
        query = query.gte('date', new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        break
      case '7d':
        query = query.gte('date', new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        break
      case '30d':
        query = query.gte('date', new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        break
    }

    const { data: trendsData, error } = await query

    if (error) {
      console.error('Trends fetch error:', error)
      // Return demo data on database error
      return NextResponse.json({
        success: true,
        data: generateDemoTrendsData(timeframe),
        timeframe,
        metric,
        demo: true
      })
    }

    // If no real data is available, return demo data
    if (!trendsData || trendsData.length === 0) {
      return NextResponse.json({
        success: true,
        data: generateDemoTrendsData(timeframe),
        timeframe,
        metric,
        demo: true
      })
    }

    // Process real data for charts
    const processedData = trendsData.map(row => ({
      timestamp: new Date(`${row.date}T${String(row.hour).padStart(2, '0')}:00:00`).toISOString(),
      responseTime: row.avg_response_time_ms,
      successRate: row.success_rate,
      requests: row.total_requests,
      peakRpm: row.rpm_peak
    }))

    return NextResponse.json({
      success: true,
      data: processedData,
      timeframe,
      metric,
      demo: false
    })
  } catch (error) {
    console.error('Trends API error:', error)
    
    // Extract params again in catch block
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '7d'
    const metric = searchParams.get('metric') || 'response_time'
    
    return NextResponse.json({
      success: true,
      data: generateDemoTrendsData(timeframe),
      timeframe,
      metric,
      demo: true
    })
  }
}

function generateDemoTrendsData(timeframe: string) {
  const now = new Date()
  const dataPoints: any[] = []
  
  let periods = 7 * 24 // 7 days in hours
  if (timeframe === '24h') periods = 24
  if (timeframe === '30d') periods = 30 * 24
  
  for (let i = periods; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
    
    // Generate realistic demo data with some variation
    const baseRequests = 450
    const requestVariation = Math.sin(i * 0.1) * 200 + Math.random() * 100
    const requests = Math.max(0, Math.floor(baseRequests + requestVariation))
    
    const baseResponseTime = 125
    const responseTimeVariation = Math.sin(i * 0.2) * 50 + (Math.random() - 0.5) * 30
    const responseTime = Math.max(50, Math.floor(baseResponseTime + responseTimeVariation))
    
    const baseSuccessRate = 97
    const successRateVariation = (Math.random() - 0.5) * 4
    const successRate = Math.min(100, Math.max(90, baseSuccessRate + successRateVariation))
    
    const peakRpm = Math.floor(requests / 60 * (1 + Math.random() * 0.3))
    
    dataPoints.push({
      timestamp: timestamp.toISOString(),
      responseTime,
      successRate,
      requests,
      peakRpm
    })
  }
  
  return dataPoints
}
