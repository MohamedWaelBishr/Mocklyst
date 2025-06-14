# 📊 Real-Time KPI Analytics Implementation PRD
## Product Requirements Document - Mocklyst Analytics v2.0

---

## 1. Executive Summary

### Vision Statement
Transform the Mocklyst dashboard from static mock data to a real-time analytics powerhouse that provides accurate, actionable insights about endpoint performance, usage patterns, and system health through comprehensive KPI tracking.

### Problem Statement
The current dashboard displays static/mock data for key performance indicators, providing no real value to users trying to understand their API usage patterns. Users need:
- **Real response time tracking** with actual measurements
- **Accurate success rate monitoring** based on HTTP status codes
- **Peak usage analytics** to understand traffic patterns
- **Reliable uptime monitoring** for service reliability insights

### Solution Overview
Implement a comprehensive analytics system that captures, processes, and displays real KPI data:
- **Response Time Tracking**: Measure actual endpoint response times with trend analysis
- **Success Rate Monitoring**: Track HTTP status codes and calculate success percentages
- **Peak RPM Analytics**: Monitor and display peak requests per minute
- **Uptime Monitoring**: Calculate and display 30-day uptime percentages

---

## 2. Product Objectives

### Primary Goals
1. **Replace Mock Data**: Eliminate all static/fake KPI values with real-time analytics
2. **Enable Data-Driven Decisions**: Provide actionable insights for API optimization
3. **Improve User Experience**: Real-time dashboard updates and performance monitoring
4. **Establish Analytics Foundation**: Create scalable system for future analytics features

### Success Metrics
- **Accuracy**: 100% real data replacing mock values
- **Performance**: Dashboard loads in <2 seconds with real analytics
- **Adoption**: 80% of active users regularly check analytics
- **Reliability**: 99.9% uptime for analytics collection system

---

## 3. Core KPI Requirements

### 3.1 Average Response Time KPI
**Metric**: Average response time in milliseconds with improvement percentage

**Requirements**:
- Display current average response time across all user endpoints
- Show percentage improvement/degradation vs previous week
- Color-coded trend indicator (green=improvement, red=degradation)
- Drill-down capability to individual endpoint performance

**Data Sources**:
- Real-time measurement of mock API response times
- Historical data for trend calculations
- Endpoint-specific performance metrics

### 3.2 Success Rate KPI  
**Metric**: Success rate percentage with week-over-week comparison

**Requirements**:
- Calculate success rate based on HTTP status codes (2xx = success)
- Show percentage comparison vs last week
- Display confidence indicator based on request volume
- Alert system for success rate drops below 95%

**Data Sources**:
- HTTP status codes from all mock requests
- Historical success rate data
- Request volume context

### 3.3 Peak RPM (Requests Per Minute)
**Metric**: Peak requests per minute across all endpoints

**Requirements**:
- Track highest RPM in last 24 hours
- Show timestamp of peak usage
- Display average RPM for context
- Capacity planning insights

**Data Sources**:
- Real-time request timestamps
- Aggregated minute-by-minute request counts
- Historical peak usage patterns

### 3.4 Uptime Percentage
**Metric**: System uptime percentage over last 30 days

**Requirements**:
- Monitor endpoint availability every 5 minutes
- Calculate uptime percentage over 30-day rolling window
- Show downtime incidents with duration
- SLA compliance tracking

**Data Sources**:
- Automated uptime monitoring system
- Health check results from all endpoints
- Historical availability data

---

## 4. Technical Implementation Plan

### Phase 1: Database Foundation (Week 1)

#### 4.1 Database Schema Design

**New Tables Required**:

```sql
-- Analytics requests table - stores every mock API request
CREATE TABLE analytics_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id UUID NOT NULL REFERENCES mock_endpoints(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  response_time_ms INTEGER NOT NULL,
  status_code INTEGER NOT NULL,
  request_method VARCHAR(10) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  referer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics uptime monitoring
CREATE TABLE analytics_uptime (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id UUID NOT NULL REFERENCES mock_endpoints(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_up BOOLEAN NOT NULL,
  response_time_ms INTEGER,
  status_code INTEGER,
  error_message TEXT,
  check_type VARCHAR(20) DEFAULT 'automated',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pre-calculated analytics aggregates for performance
CREATE TABLE analytics_aggregates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id UUID NOT NULL REFERENCES mock_endpoints(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  date DATE NOT NULL,
  hour INTEGER NOT NULL CHECK (hour >= 0 AND hour <= 23),
  total_requests INTEGER NOT NULL DEFAULT 0,
  successful_requests INTEGER NOT NULL DEFAULT 0,
  avg_response_time_ms FLOAT NOT NULL DEFAULT 0,
  max_response_time_ms INTEGER NOT NULL DEFAULT 0,
  min_response_time_ms INTEGER NOT NULL DEFAULT 0,
  success_rate FLOAT NOT NULL DEFAULT 0,
  rpm_peak INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(endpoint_id, date, hour)
);

-- Indexes for performance
CREATE INDEX idx_analytics_requests_endpoint_timestamp ON analytics_requests(endpoint_id, timestamp DESC);
CREATE INDEX idx_analytics_requests_user_timestamp ON analytics_requests(user_id, timestamp DESC);
CREATE INDEX idx_analytics_uptime_endpoint_timestamp ON analytics_uptime(endpoint_id, timestamp DESC);
CREATE INDEX idx_analytics_aggregates_endpoint_date ON analytics_aggregates(endpoint_id, date DESC);
CREATE INDEX idx_analytics_aggregates_user_date ON analytics_aggregates(user_id, date DESC);
```

#### 4.2 Row Level Security (RLS) Policies

```sql
-- Enable RLS on all analytics tables
ALTER TABLE analytics_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_uptime ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_aggregates ENABLE ROW LEVEL SECURITY;

-- Users can only see their own analytics data
CREATE POLICY "Users can view own analytics requests" ON analytics_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own uptime data" ON analytics_uptime
  FOR SELECT USING (endpoint_id IN (
    SELECT id FROM mock_endpoints WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view own aggregates" ON analytics_aggregates
  FOR SELECT USING (user_id = auth.uid());

-- System can insert analytics data
CREATE POLICY "System can insert analytics" ON analytics_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can insert uptime" ON analytics_uptime
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can manage aggregates" ON analytics_aggregates
  FOR ALL WITH CHECK (true);
```

#### 4.3 Database Functions

```sql
-- Function to calculate KPI metrics for a user
CREATE OR REPLACE FUNCTION get_user_kpi_metrics(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
  avg_response_time FLOAT;
  success_rate FLOAT;
  peak_rpm INTEGER;
  uptime_percentage FLOAT;
  previous_week_avg FLOAT;
  previous_week_success FLOAT;
BEGIN
  -- Calculate average response time (last 7 days)
  SELECT AVG(response_time_ms) INTO avg_response_time
  FROM analytics_requests 
  WHERE user_id = user_uuid 
    AND timestamp >= NOW() - INTERVAL '7 days';

  -- Calculate previous week average for comparison
  SELECT AVG(response_time_ms) INTO previous_week_avg
  FROM analytics_requests 
  WHERE user_id = user_uuid 
    AND timestamp >= NOW() - INTERVAL '14 days'
    AND timestamp < NOW() - INTERVAL '7 days';

  -- Calculate success rate (last 7 days)
  SELECT 
    (COUNT(CASE WHEN status_code >= 200 AND status_code < 300 THEN 1 END)::FLOAT / 
     COUNT(*)::FLOAT * 100) INTO success_rate
  FROM analytics_requests 
  WHERE user_id = user_uuid 
    AND timestamp >= NOW() - INTERVAL '7 days';

  -- Calculate previous week success rate
  SELECT 
    (COUNT(CASE WHEN status_code >= 200 AND status_code < 300 THEN 1 END)::FLOAT / 
     COUNT(*)::FLOAT * 100) INTO previous_week_success
  FROM analytics_requests 
  WHERE user_id = user_uuid 
    AND timestamp >= NOW() - INTERVAL '14 days'
    AND timestamp < NOW() - INTERVAL '7 days';

  -- Calculate peak RPM (last 24 hours)
  SELECT MAX(rpm_peak) INTO peak_rpm
  FROM analytics_aggregates 
  WHERE user_id = user_uuid 
    AND date >= CURRENT_DATE - INTERVAL '1 day';

  -- Calculate uptime percentage (last 30 days)
  SELECT 
    (COUNT(CASE WHEN is_up THEN 1 END)::FLOAT / 
     COUNT(*)::FLOAT * 100) INTO uptime_percentage
  FROM analytics_uptime au
  JOIN mock_endpoints me ON au.endpoint_id = me.id
  WHERE me.user_id = user_uuid 
    AND au.timestamp >= NOW() - INTERVAL '30 days';

  -- Build result JSON
  result := json_build_object(
    'avgResponseTime', COALESCE(avg_response_time, 0),
    'avgResponseTimeTrend', 
      CASE 
        WHEN previous_week_avg > 0 THEN 
          ROUND(((previous_week_avg - avg_response_time) / previous_week_avg * 100)::NUMERIC, 2)
        ELSE 0 
      END,
    'successRate', COALESCE(success_rate, 100),
    'successRateTrend',
      CASE 
        WHEN previous_week_success > 0 THEN 
          ROUND((success_rate - previous_week_success)::NUMERIC, 2)
        ELSE 0 
      END,
    'peakRpm', COALESCE(peak_rpm, 0),
    'uptimePercentage', COALESCE(uptime_percentage, 100)
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Phase 2: Data Collection System (Week 2)

#### 4.4 Mock API Request Tracking

**Modify existing mock endpoint handler** to capture analytics:

```typescript
// src/app/api/mock/[id]/route.ts - Enhanced with analytics
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();
  
  try {
    // Existing endpoint logic...
    const endpoint = await getEndpoint(params.id);
    
    if (!endpoint) {
      await recordAnalytics(params.id, request, 404, Date.now() - startTime);
      return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
    }

    // Check if endpoint is expired
    if (new Date(endpoint.expires_at) <= new Date()) {
      await recordAnalytics(endpoint.id, request, 410, Date.now() - startTime);
      return NextResponse.json({ error: 'Endpoint expired' }, { status: 410 });
    }

    // Generate mock response
    const response = generateMockResponse(endpoint);
    const responseTime = Date.now() - startTime;
    
    // Record successful request
    await recordAnalytics(endpoint.id, request, 200, responseTime);
    
    return NextResponse.json(response, {
      status: 200,
      headers: {
        'X-Response-Time': `${responseTime}ms`,
        'X-Mocklyst-ID': endpoint.id
      }
    });

  } catch (error) {
    const responseTime = Date.now() - startTime;
    await recordAnalytics(params.id, request, 500, responseTime);
    
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

async function recordAnalytics(
  endpointId: string, 
  request: NextRequest, 
  statusCode: number, 
  responseTime: number
) {
  try {
    const supabase = createServiceRoleClient();
    
    // Get endpoint details for user_id
    const { data: endpoint } = await supabase
      .from('mock_endpoints')
      .select('user_id')
      .eq('id', endpointId)
      .single();

    if (!endpoint) return;

    // Record the request
    await supabase
      .from('analytics_requests')
      .insert({
        endpoint_id: endpointId,
        user_id: endpoint.user_id,
        timestamp: new Date().toISOString(),
        response_time_ms: responseTime,
        status_code: statusCode,
        request_method: request.method,
        ip_address: request.ip || request.headers.get('x-forwarded-for'),
        user_agent: request.headers.get('user-agent'),
        referer: request.headers.get('referer')
      });

    // Update endpoint hit counter
    await supabase
      .from('mock_endpoints')
      .update({ 
        hits: endpoint.hits + 1,
        last_accessed_at: new Date().toISOString()
      })
      .eq('id', endpointId);

  } catch (error) {
    console.error('Failed to record analytics:', error);
    // Don't throw - analytics failure shouldn't break the API
  }
}
```

#### 4.5 Uptime Monitoring System

**Create Supabase Edge Function for uptime monitoring**:

```typescript
// supabase/functions/uptime-monitor/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all active endpoints
    const { data: endpoints, error } = await supabase
      .from('mock_endpoints')
      .select('id, name, user_id')
      .gte('expires_at', new Date().toISOString())
      .eq('is_active', true)

    if (error) throw error

    const results = []

    // Check each endpoint
    for (const endpoint of endpoints) {
      const startTime = Date.now()
      let isUp = false
      let statusCode = 0
      let errorMessage = null

      try {
        const response = await fetch(
          `${Deno.env.get('BASE_URL')}/api/mock/${endpoint.id}`,
          { 
            method: 'GET',
            headers: { 'User-Agent': 'Mocklyst-Uptime-Monitor/1.0' }
          }
        )
        
        statusCode = response.status
        isUp = response.status >= 200 && response.status < 400
        
      } catch (error) {
        errorMessage = error.message
        isUp = false
      }

      const responseTime = Date.now() - startTime

      // Record uptime check result
      await supabase
        .from('analytics_uptime')
        .insert({
          endpoint_id: endpoint.id,
          timestamp: new Date().toISOString(),
          is_up: isUp,
          response_time_ms: responseTime,
          status_code: statusCode,
          error_message: errorMessage,
          check_type: 'automated'
        })

      results.push({
        endpoint_id: endpoint.id,
        name: endpoint.name,
        is_up: isUp,
        response_time: responseTime,
        status_code: statusCode
      })
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        checked: results.length,
        results 
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
```

#### 4.6 Aggregation System

**Create database trigger for real-time aggregation**:

```sql
-- Function to update hourly aggregates
CREATE OR REPLACE FUNCTION update_analytics_aggregates()
RETURNS TRIGGER AS $$
DECLARE
  agg_date DATE;
  agg_hour INTEGER;
  endpoint_user_id UUID;
BEGIN
  -- Get the date and hour for aggregation
  agg_date := DATE(NEW.timestamp);
  agg_hour := EXTRACT(HOUR FROM NEW.timestamp);
  
  -- Get endpoint user_id
  SELECT user_id INTO endpoint_user_id 
  FROM mock_endpoints 
  WHERE id = NEW.endpoint_id;

  -- Insert or update aggregate record
  INSERT INTO analytics_aggregates (
    endpoint_id, user_id, date, hour, 
    total_requests, successful_requests, 
    avg_response_time_ms, max_response_time_ms, min_response_time_ms,
    success_rate
  )
  VALUES (
    NEW.endpoint_id, endpoint_user_id, agg_date, agg_hour,
    1,
    CASE WHEN NEW.status_code >= 200 AND NEW.status_code < 300 THEN 1 ELSE 0 END,
    NEW.response_time_ms,
    NEW.response_time_ms,
    NEW.response_time_ms,
    CASE WHEN NEW.status_code >= 200 AND NEW.status_code < 300 THEN 100.0 ELSE 0.0 END
  )
  ON CONFLICT (endpoint_id, date, hour)
  DO UPDATE SET
    total_requests = analytics_aggregates.total_requests + 1,
    successful_requests = analytics_aggregates.successful_requests + 
      CASE WHEN NEW.status_code >= 200 AND NEW.status_code < 300 THEN 1 ELSE 0 END,
    avg_response_time_ms = (
      (analytics_aggregates.avg_response_time_ms * analytics_aggregates.total_requests + NEW.response_time_ms) /
      (analytics_aggregates.total_requests + 1)
    ),
    max_response_time_ms = GREATEST(analytics_aggregates.max_response_time_ms, NEW.response_time_ms),
    min_response_time_ms = LEAST(analytics_aggregates.min_response_time_ms, NEW.response_time_ms),
    success_rate = (
      analytics_aggregates.successful_requests + 
      CASE WHEN NEW.status_code >= 200 AND NEW.status_code < 300 THEN 1 ELSE 0 END
    )::FLOAT / (analytics_aggregates.total_requests + 1) * 100,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_aggregates_trigger
  AFTER INSERT ON analytics_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_analytics_aggregates();
```

### Phase 3: API Layer (Week 3)

#### 4.7 Analytics API Endpoints

**Create KPI data endpoint**:

```typescript
// src/app/api/analytics/kpis/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/auth/supabase-auth'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get KPI metrics using database function
    const { data: kpiData, error } = await supabase
      .rpc('get_user_kpi_metrics', { user_uuid: user.id })

    if (error) {
      console.error('KPI fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch KPI data' }, { status: 500 })
    }

    // Get additional context data
    const { data: endpointCount } = await supabase
      .from('mock_endpoints')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
      .gte('expires_at', new Date().toISOString())

    const { data: totalRequests } = await supabase
      .from('analytics_requests')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
      .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    return NextResponse.json({
      success: true,
      data: {
        ...kpiData,
        activeEndpoints: endpointCount?.count || 0,
        totalRequests: totalRequests?.count || 0,
        lastUpdated: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Create trends API endpoint**:

```typescript
// src/app/api/analytics/trends/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/auth/supabase-auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '7d'
    const metric = searchParams.get('metric') || 'response_time'

    const supabase = await createServerSupabaseClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
      return NextResponse.json({ error: 'Failed to fetch trends data' }, { status: 500 })
    }

    // Process data for charts
    const processedData = trendsData?.map(row => ({
      timestamp: new Date(`${row.date}T${String(row.hour).padStart(2, '0')}:00:00`).toISOString(),
      responseTime: row.avg_response_time_ms,
      successRate: row.success_rate,
      requests: row.total_requests,
      peakRpm: row.rpm_peak
    })) || []

    return NextResponse.json({
      success: true,
      data: processedData,
      timeframe,
      metric
    })

  } catch (error) {
    console.error('Trends API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Phase 4: Frontend Implementation (Week 4)

#### 4.8 Data Fetching Hooks

**Create analytics hooks**:

```typescript
// src/hooks/useAnalytics.ts
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createClientSupabaseClient } from '@/lib/auth/supabase-auth'

interface KPIData {
  avgResponseTime: number
  avgResponseTimeTrend: number
  successRate: number
  successRateTrend: number
  peakRpm: number
  uptimePercentage: number
  activeEndpoints: number
  totalRequests: number
  lastUpdated: string
}

interface TrendData {
  timestamp: string
  responseTime: number
  successRate: number
  requests: number
  peakRpm: number
}

export function useKPIAnalytics(refreshInterval = 30000) {
  return useQuery<KPIData>({
    queryKey: ['analytics', 'kpis'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/kpis')
      if (!response.ok) {
        throw new Error('Failed to fetch KPI data')
      }
      const result = await response.json()
      return result.data
    },
    refetchInterval: refreshInterval,
    staleTime: 25000, // Consider data stale after 25 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

export function useAnalyticsTrends(timeframe: '24h' | '7d' | '30d' = '7d') {
  return useQuery<TrendData[]>({
    queryKey: ['analytics', 'trends', timeframe],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/trends?timeframe=${timeframe}`)
      if (!response.ok) {
        throw new Error('Failed to fetch trends data')
      }
      const result = await response.json()
      return result.data
    },
    staleTime: 60000, // Trends change less frequently
    retry: 2,
  })
}

export function useRealtimeAnalytics() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const supabase = createClientSupabaseClient()
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('analytics-updates')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'analytics_requests' 
        }, 
        () => {
          // Invalidate KPI queries to trigger refresh
          queryClient.invalidateQueries({ queryKey: ['analytics', 'kpis'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])
}
```

#### 4.9 Enhanced KPI Components

**Update KPIGrid component**:

```typescript
// src/components/dashboard/analytics/KPIGrid.tsx
"use client"

import { KPICard } from './KPICard'
import { useKPIAnalytics, useRealtimeAnalytics } from '@/hooks/useAnalytics'
import { Activity, Clock, TrendingUp, Zap, Server, BarChart3, CheckCircle, AlertTriangle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface KPIGridProps {
  className?: string
}

export function KPIGrid({ className }: KPIGridProps) {
  const { data: kpiData, isLoading, error, isRefetching } = useKPIAnalytics()
  
  // Enable real-time updates
  useRealtimeAnalytics()

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load analytics data. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="p-6 border rounded-lg">
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      {/* Average Response Time */}
      <KPICard
        title="Avg Response Time"
        value={`${Math.round(kpiData?.avgResponseTime || 0)}ms`}
        icon={Clock}
        trend={{
          value: kpiData?.avgResponseTimeTrend || 0,
          label: "vs last week",
          isPositive: (kpiData?.avgResponseTimeTrend || 0) > 0
        }}
        description="Average response time across all endpoints"
        color="blue"
        isLoading={isRefetching}
      />

      {/* Success Rate */}
      <KPICard
        title="Success Rate"
        value={`${(kpiData?.successRate || 0).toFixed(1)}%`}
        icon={CheckCircle}
        trend={{
          value: Math.abs(kpiData?.successRateTrend || 0),
          label: "vs last week",
          isPositive: (kpiData?.successRateTrend || 0) >= 0
        }}
        description="Percentage of successful requests (2xx status)"
        color="green"
        isLoading={isRefetching}
      />

      {/* Peak RPM */}
      <KPICard
        title="Peak RPM"
        value={kpiData?.peakRpm || 0}
        icon={TrendingUp}
        description="Highest requests per minute in last 24h"
        color="purple"
        isLoading={isRefetching}
      />

      {/* Uptime */}
      <KPICard
        title="Uptime (30d)"
        value={`${(kpiData?.uptimePercentage || 0).toFixed(2)}%`}
        icon={Server}
        description="System availability over last 30 days"
        color={kpiData?.uptimePercentage && kpiData.uptimePercentage > 99 ? "green" : "orange"}
        isLoading={isRefetching}
      />

      {/* Active Endpoints */}
      <KPICard
        title="Active Endpoints"
        value={kpiData?.activeEndpoints || 0}
        icon={Activity}
        description="Currently active mock endpoints"
        color="indigo"
        isLoading={isRefetching}
      />

      {/* Total Requests */}
      <KPICard
        title="Total Requests"
        value={(kpiData?.totalRequests || 0).toLocaleString()}
        icon={BarChart3}
        description="Requests in last 7 days"
        color="teal"
        isLoading={isRefetching}
      />

      {/* Data Served */}
      <KPICard
        title="Data Served"
        value="45.7 MB"
        icon={Zap}
        description="Total data served this month"
        color="orange"
        isLoading={isRefetching}
      />

      {/* Response Quality */}
      <KPICard
        title="Response Quality"
        value="A+"
        icon={CheckCircle}
        description="Based on speed and reliability"
        color="green"
        isLoading={isRefetching}
      />
    </div>
  )
}
```

#### 4.10 Analytics Store

**Create Zustand store for analytics state**:

```typescript
// src/lib/stores/analyticsStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AnalyticsState {
  // KPI Data
  kpiData: KPIData | null
  trendsData: TrendData[]
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
  
  // Settings
  refreshInterval: number
  autoRefresh: boolean
  selectedTimeframe: '24h' | '7d' | '30d'
  
  // Actions
  setKPIData: (data: KPIData) => void
  setTrendsData: (data: TrendData[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setRefreshInterval: (interval: number) => void
  setAutoRefresh: (enabled: boolean) => void
  setTimeframe: (timeframe: '24h' | '7d' | '30d') => void
  clearData: () => void
}

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set, get) => ({
      // Initial state
      kpiData: null,
      trendsData: [],
      isLoading: false,
      error: null,
      lastUpdated: null,
      refreshInterval: 30000,
      autoRefresh: true,
      selectedTimeframe: '7d',

      // Actions
      setKPIData: (data) => set({ 
        kpiData: data, 
        lastUpdated: new Date(),
        error: null 
      }),
      
      setTrendsData: (data) => set({ 
        trendsData: data,
        error: null 
      }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error, isLoading: false }),
      
      setRefreshInterval: (interval) => set({ refreshInterval: interval }),
      
      setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),
      
      setTimeframe: (timeframe) => set({ selectedTimeframe: timeframe }),
      
      clearData: () => set({ 
        kpiData: null, 
        trendsData: [], 
        error: null, 
        lastUpdated: null 
      })
    }),
    {
      name: 'analytics-storage',
      partialize: (state) => ({
        refreshInterval: state.refreshInterval,
        autoRefresh: state.autoRefresh,
        selectedTimeframe: state.selectedTimeframe
      })
    }
  )
)
```

### Phase 5: Deployment and Monitoring (Week 5)

#### 4.11 Supabase Migration Deployment

**Create migration files**:

```bash
# Create new migration
supabase migration new analytics_system_implementation

# Apply migration to production
supabase db push
```

#### 4.12 Edge Function Deployment

**Deploy uptime monitoring**:

```bash
# Deploy edge function
supabase functions deploy uptime-monitor

# Set up cron job to run every 5 minutes
# Add to Supabase dashboard -> Database -> Cron Jobs
SELECT cron.schedule(
  'uptime-monitor',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    'https://your-project.supabase.co/functions/v1/uptime-monitor',
    '{}',
    'application/json',
    '{"Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'
  );
  $$
);
```

#### 4.13 Performance Optimization

**Database optimization**:

```sql
-- Create additional indexes for performance
CREATE INDEX CONCURRENTLY idx_analytics_requests_timestamp_status 
ON analytics_requests(timestamp DESC, status_code) 
WHERE timestamp >= NOW() - INTERVAL '30 days';

CREATE INDEX CONCURRENTLY idx_analytics_uptime_endpoint_recent 
ON analytics_uptime(endpoint_id, timestamp DESC) 
WHERE timestamp >= NOW() - INTERVAL '30 days';

-- Create materialized view for dashboard queries
CREATE MATERIALIZED VIEW analytics_dashboard_summary AS
SELECT 
  user_id,
  COUNT(DISTINCT endpoint_id) as active_endpoints,
  COUNT(*) as total_requests,
  AVG(response_time_ms) as avg_response_time,
  (COUNT(CASE WHEN status_code >= 200 AND status_code < 300 THEN 1 END)::FLOAT / COUNT(*) * 100) as success_rate,
  MAX(created_at) as last_updated
FROM analytics_requests 
WHERE timestamp >= NOW() - INTERVAL '7 days'
GROUP BY user_id;

-- Refresh materialized view every hour
SELECT cron.schedule(
  'refresh-analytics-summary',
  '0 * * * *',
  'REFRESH MATERIALIZED VIEW analytics_dashboard_summary;'
);
```

#### 4.14 Monitoring and Alerts

**Set up monitoring**:

```sql
-- Create alerting function
CREATE OR REPLACE FUNCTION check_endpoint_health()
RETURNS void AS $$
DECLARE
  endpoint_record RECORD;
  recent_uptime FLOAT;
BEGIN
  -- Check each endpoint's uptime in last hour
  FOR endpoint_record IN 
    SELECT me.id, me.name, me.user_id, u.email
    FROM mock_endpoints me
    JOIN auth.users u ON me.user_id = u.id
    WHERE me.expires_at > NOW()
  LOOP
    -- Calculate uptime percentage for last hour
    SELECT 
      (COUNT(CASE WHEN is_up THEN 1 END)::FLOAT / COUNT(*) * 100)
    INTO recent_uptime
    FROM analytics_uptime 
    WHERE endpoint_id = endpoint_record.id 
      AND timestamp >= NOW() - INTERVAL '1 hour';

    -- Alert if uptime drops below 90%
    IF recent_uptime < 90 THEN
      -- Insert alert record or send notification
      INSERT INTO system_alerts (
        user_id, 
        type, 
        message, 
        severity,
        endpoint_id
      ) VALUES (
        endpoint_record.user_id,
        'uptime_degraded',
        'Endpoint "' || endpoint_record.name || '" uptime dropped to ' || ROUND(recent_uptime, 2) || '% in the last hour',
        'warning',
        endpoint_record.id
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Schedule health check every 15 minutes
SELECT cron.schedule(
  'endpoint-health-check',
  '*/15 * * * *',
  'SELECT check_endpoint_health();'
);
```

---

## 5. Success Metrics and Validation

### 5.1 Technical Metrics
- **Data Accuracy**: 100% of KPIs show real data (no mock values)
- **Performance**: Dashboard loads with analytics in <2 seconds
- **Reliability**: 99.9% uptime for analytics collection system
- **Scalability**: System handles 1000+ requests/minute efficiently

### 5.2 User Experience Metrics
- **Adoption Rate**: 80% of active users check analytics weekly
- **Engagement**: Average 3+ minutes spent on analytics dashboard
- **Satisfaction**: 4.5+ star rating for analytics features
- **Support Tickets**: <5% increase in analytics-related support requests

### 5.3 Business Impact Metrics
- **User Retention**: 15% improvement in monthly active users
- **Feature Usage**: Analytics becomes top 3 most used feature
- **Premium Conversion**: 20% of analytics users upgrade to premium
- **API Optimization**: 25% improvement in average API response times

---

## 6. Risk Mitigation

### 6.1 Technical Risks
- **Database Performance**: Implement partitioning and cleanup policies
- **Storage Costs**: Data retention policies and compression
- **Privacy Compliance**: Anonymization and GDPR compliance
- **System Overload**: Rate limiting and graceful degradation

### 6.2 User Experience Risks
- **Analytics Complexity**: Progressive disclosure and tooltips
- **Performance Impact**: Efficient caching and pagination
- **Mobile Experience**: Responsive design and touch optimization
- **Accessibility**: WCAG 2.1 AA compliance

### 6.3 Business Risks
- **Development Timeline**: Phased rollout with MVP first
- **Resource Allocation**: Clear scope and priority definitions
- **User Adoption**: In-app onboarding and feature education
- **Competitive Advantage**: Focus on unique insights and ease of use

---

## 7. Timeline and Milestones

### Week 1: Database Foundation
- ✅ Create analytics tables and indexes
- ✅ Implement RLS policies  
- ✅ Create aggregation functions
- ✅ Set up database triggers

### Week 2: Data Collection
- ✅ Modify mock API to capture analytics
- ✅ Create uptime monitoring system
- ✅ Implement real-time aggregation
- ✅ Test data collection pipeline

### Week 3: API Development
- ✅ Create KPI analytics endpoints
- ✅ Build trends and comparison APIs
- ✅ Implement caching layer
- ✅ Add error handling and validation

### Week 4: Frontend Implementation
- ✅ Create analytics hooks and store
- ✅ Update KPI components with real data
- ✅ Add loading states and error handling
- ✅ Implement real-time updates

### Week 5: Testing and Deployment
- ✅ Performance testing and optimization
- ✅ Deploy to production environment
- ✅ Set up monitoring and alerts
- ✅ User acceptance testing

---

## 8. Future Enhancements

### Phase 2 Features (Next Quarter)
- **Advanced Visualizations**: Interactive charts with drill-down
- **Custom Dashboards**: User-configurable KPI layouts
- **Alerting System**: Email/SMS notifications for issues
- **API Analytics Export**: CSV/JSON export functionality

### Phase 3 Features (Following Quarter)
- **Predictive Analytics**: ML-powered usage forecasting
- **Geographic Analytics**: Request origin mapping
- **Performance Optimization**: AI-suggested endpoint improvements
- **Collaborative Features**: Team analytics and sharing

---

This comprehensive PRD provides the complete roadmap for implementing real-time KPI analytics in the Mocklyst dashboard, transforming it from a static interface to a dynamic, data-driven analytics platform that provides genuine value to users managing their mock APIs.
- **Replace Mock Data**: Eliminate all static KPI values with real-time calculations
- **Enable Data-Driven Decisions**: Provide accurate metrics for performance optimization
- **Improve User Confidence**: Show reliable, trustworthy analytics data
- **Establish Performance Baseline**: Create foundation for advanced analytics features

### Success Metrics
- **Data Accuracy**: 100% real data vs 0% mock data
- **Response Time**: < 500ms for KPI calculations
- **Real-time Updates**: < 30 seconds for metric refresh
- **User Engagement**: 40% increase in dashboard session time

---

## 3. Technical Requirements

### 3.1 Core KPI Specifications

#### KPI 1: Average Response Time
```typescript
interface ResponseTimeKPI {
  currentAvg: number;        // Current 24h average in ms
  previousAvg: number;       // Previous 24h average in ms
  improvementPercentage: number;  // Positive = improvement, Negative = degradation
  trend: 'improving' | 'degrading' | 'stable';
  timeRange: '24h' | '7d' | '30d';
}
```

**Requirements**:
- Measure actual response time from request start to completion
- Calculate rolling 24-hour averages
- Compare with previous 24-hour period
- Display percentage improvement/degradation
- Support multiple time ranges (24h, 7d, 30d)

#### KPI 2: Success Rate
```typescript
interface SuccessRateKPI {
  currentSuccessRate: number;     // Current week success rate (%)
  previousSuccessRate: number;    // Previous week success rate (%)
  comparisonPercentage: number;   // Difference vs last week
  totalRequests: number;          // Total requests in period
  successfulRequests: number;     // 2xx status code requests
  failedRequests: number;         // 4xx/5xx status code requests
}
```

**Requirements**:
- Track all HTTP status codes
- Define success as 2xx status codes
- Calculate weekly success rate percentages
- Compare current week vs previous week
- Provide breakdown of successful vs failed requests

#### KPI 3: Peak RPM (Requests Per Minute)
```typescript
interface PeakRPMKPI {
  currentPeakRPM: number;        // Highest RPM in last 24h
  averageRPM: number;            // Average RPM in last 24h
  peakTime: Date;                // When peak occurred
  historicalPeak: number;        // All-time peak RPM
  timeRange: '1h' | '24h' | '7d';
}
```

**Requirements**:
- Monitor requests per minute in real-time
- Track peak RPM for various time periods
- Store historical peak values
- Display when peak occurred
- Show comparison with historical peaks

#### KPI 4: Uptime Percentage
```typescript
interface UptimeKPI {
  uptimePercentage: number;      // 30-day uptime percentage
  totalChecks: number;           // Total uptime checks performed
  successfulChecks: number;      // Successful availability checks
  lastDowntime: Date | null;     // Most recent downtime event
  downtimeMinutes: number;       // Total downtime in last 30 days
}
```

**Requirements**:
- Perform regular availability checks on endpoints
- Calculate 30-day uptime percentage
- Track downtime events and duration
- Consider both technical failures and endpoint expiration
- Provide historical downtime analysis

### 3.2 Database Schema Design

#### Core Tables

```sql
-- Track individual endpoint requests
CREATE TABLE endpoint_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id UUID NOT NULL REFERENCES endpoints(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  response_time_ms INTEGER NOT NULL CHECK (response_time_ms >= 0),
  status_code INTEGER NOT NULL CHECK (status_code >= 100 AND status_code < 600),
  request_method VARCHAR(10) NOT NULL DEFAULT 'GET',
  user_agent TEXT,
  ip_address INET,
  request_size_bytes INTEGER DEFAULT 0,
  response_size_bytes INTEGER DEFAULT 0,
  
  -- Indexes for performance
  INDEX idx_endpoint_requests_endpoint_timestamp (endpoint_id, request_timestamp DESC),
  INDEX idx_endpoint_requests_user_timestamp (user_id, request_timestamp DESC),
  INDEX idx_endpoint_requests_timestamp (request_timestamp DESC),
  INDEX idx_endpoint_requests_status (status_code)
);

-- Track endpoint uptime checks
CREATE TABLE endpoint_uptime_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id UUID NOT NULL REFERENCES endpoints(id) ON DELETE CASCADE,
  check_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_available BOOLEAN NOT NULL,
  response_time_ms INTEGER,
  status_code INTEGER,
  error_message TEXT,
  check_type VARCHAR(20) NOT NULL DEFAULT 'automatic',
  
  -- Indexes for performance
  INDEX idx_uptime_checks_endpoint_timestamp (endpoint_id, check_timestamp DESC),
  INDEX idx_uptime_checks_timestamp (check_timestamp DESC),
  INDEX idx_uptime_checks_availability (is_available, check_timestamp DESC)
);

-- Pre-aggregated metrics for performance
CREATE TABLE kpi_aggregates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id UUID REFERENCES endpoints(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date_hour TIMESTAMPTZ NOT NULL, -- Truncated to hour
  total_requests INTEGER NOT NULL DEFAULT 0,
  successful_requests INTEGER NOT NULL DEFAULT 0,
  failed_requests INTEGER NOT NULL DEFAULT 0,
  avg_response_time_ms NUMERIC(8,2) NOT NULL DEFAULT 0,
  min_response_time_ms INTEGER NOT NULL DEFAULT 0,
  max_response_time_ms INTEGER NOT NULL DEFAULT 0,
  peak_rpm_in_hour INTEGER NOT NULL DEFAULT 0,
  total_uptime_checks INTEGER NOT NULL DEFAULT 0,
  successful_uptime_checks INTEGER NOT NULL DEFAULT 0,
  
  -- Unique constraint to prevent duplicates
  UNIQUE(endpoint_id, user_id, date_hour),
  
  -- Indexes
  INDEX idx_kpi_aggregates_endpoint_hour (endpoint_id, date_hour DESC),
  INDEX idx_kpi_aggregates_user_hour (user_id, date_hour DESC),
  INDEX idx_kpi_aggregates_hour (date_hour DESC)
);
```

#### Database Views for Efficient Querying

```sql
-- View for current response time metrics
CREATE VIEW current_response_time_metrics AS
SELECT 
  endpoint_id,
  user_id,
  AVG(response_time_ms) as avg_response_time_24h,
  PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY response_time_ms) as p50_response_time,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms) as p95_response_time,
  PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY response_time_ms) as p99_response_time,
  COUNT(*) as total_requests_24h
FROM endpoint_requests 
WHERE request_timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY endpoint_id, user_id;

-- View for success rate metrics
CREATE VIEW current_success_rate_metrics AS
SELECT 
  endpoint_id,
  user_id,
  COUNT(*) as total_requests,
  COUNT(*) FILTER (WHERE status_code >= 200 AND status_code < 300) as successful_requests,
  COUNT(*) FILTER (WHERE status_code >= 400) as failed_requests,
  ROUND(
    (COUNT(*) FILTER (WHERE status_code >= 200 AND status_code < 300)::NUMERIC / COUNT(*) * 100), 2
  ) as success_rate_percentage
FROM endpoint_requests 
WHERE request_timestamp >= NOW() - INTERVAL '7 days'
GROUP BY endpoint_id, user_id;

-- View for uptime metrics
CREATE VIEW current_uptime_metrics AS
SELECT 
  endpoint_id,
  COUNT(*) as total_checks,
  COUNT(*) FILTER (WHERE is_available = true) as successful_checks,
  ROUND(
    (COUNT(*) FILTER (WHERE is_available = true)::NUMERIC / COUNT(*) * 100), 2
  ) as uptime_percentage_30d,
  MAX(check_timestamp) FILTER (WHERE is_available = false) as last_downtime
FROM endpoint_uptime_checks 
WHERE check_timestamp >= NOW() - INTERVAL '30 days'
GROUP BY endpoint_id;
```

### 3.3 API Endpoints

```typescript
// Analytics API endpoints
interface AnalyticsAPI {
  // Individual KPI endpoints
  'GET /api/analytics/response-time': {
    params: { timeRange?: '24h' | '7d' | '30d' };
    response: ResponseTimeKPI;
  };
  
  'GET /api/analytics/success-rate': {
    params: { timeRange?: '7d' | '30d' };
    response: SuccessRateKPI;
  };
  
  'GET /api/analytics/peak-rpm': {
    params: { timeRange?: '1h' | '24h' | '7d' };
    response: PeakRPMKPI;
  };
  
  'GET /api/analytics/uptime': {
    params: { timeRange?: '7d' | '30d' };
    response: UptimeKPI;
  };
  
  // Combined dashboard endpoint
  'GET /api/analytics/overview': {
    response: {
      responseTime: ResponseTimeKPI;
      successRate: SuccessRateKPI;
      peakRPM: PeakRPMKPI;
      uptime: UptimeKPI;
      lastUpdated: Date;
    };
  };
  
  // Historical data endpoints
  'GET /api/analytics/trends': {
    params: { 
      metric: 'response-time' | 'success-rate' | 'rpm' | 'uptime';
      timeRange: '24h' | '7d' | '30d';
      interval: '5m' | '1h' | '1d';
    };
    response: TrendData[];
  };
}
```

---

## 4. Implementation Strategy with Supabase MCP

### 4.1 Database Migration Plan

#### Migration 1: Create Request Tracking Table
```sql
-- Migration: 001_create_endpoint_requests.sql
CREATE TABLE endpoint_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id UUID NOT NULL REFERENCES endpoints(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  response_time_ms INTEGER NOT NULL CHECK (response_time_ms >= 0),
  status_code INTEGER NOT NULL CHECK (status_code >= 100 AND status_code < 600),
  request_method VARCHAR(10) NOT NULL DEFAULT 'GET',
  user_agent TEXT,
  ip_address INET
);

-- Create indexes
CREATE INDEX idx_endpoint_requests_endpoint_timestamp ON endpoint_requests(endpoint_id, request_timestamp DESC);
CREATE INDEX idx_endpoint_requests_user_timestamp ON endpoint_requests(user_id, request_timestamp DESC);
CREATE INDEX idx_endpoint_requests_timestamp ON endpoint_requests(request_timestamp DESC);
CREATE INDEX idx_endpoint_requests_status ON endpoint_requests(status_code);

-- Enable RLS
ALTER TABLE endpoint_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own endpoint requests" ON endpoint_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert endpoint requests" ON endpoint_requests
  FOR INSERT WITH CHECK (true);
```

#### Migration 2: Create Uptime Monitoring Table
```sql
-- Migration: 002_create_uptime_checks.sql
CREATE TABLE endpoint_uptime_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id UUID NOT NULL REFERENCES endpoints(id) ON DELETE CASCADE,
  check_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_available BOOLEAN NOT NULL,
  response_time_ms INTEGER,
  status_code INTEGER,
  error_message TEXT,
  check_type VARCHAR(20) NOT NULL DEFAULT 'automatic'
);

-- Create indexes
CREATE INDEX idx_uptime_checks_endpoint_timestamp ON endpoint_uptime_checks(endpoint_id, check_timestamp DESC);
CREATE INDEX idx_uptime_checks_timestamp ON endpoint_uptime_checks(check_timestamp DESC);

-- Enable RLS
ALTER TABLE endpoint_uptime_checks ENABLE ROW LEVEL SECURITY;

-- RLS policy
CREATE POLICY "Users can view uptime for own endpoints" ON endpoint_uptime_checks
  FOR SELECT USING (
    endpoint_id IN (
      SELECT id FROM endpoints WHERE user_id = auth.uid()
    )
  );
```

#### Migration 3: Create Performance Views
```sql
-- Migration: 003_create_analytics_views.sql
CREATE VIEW current_response_time_metrics AS
SELECT 
  endpoint_id,
  user_id,
  AVG(response_time_ms) as avg_response_time_24h,
  PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY response_time_ms) as p50_response_time,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms) as p95_response_time,
  COUNT(*) as total_requests_24h
FROM endpoint_requests 
WHERE request_timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY endpoint_id, user_id;

CREATE VIEW current_success_rate_metrics AS
SELECT 
  endpoint_id,
  user_id,
  COUNT(*) as total_requests,
  COUNT(*) FILTER (WHERE status_code >= 200 AND status_code < 300) as successful_requests,
  ROUND(
    (COUNT(*) FILTER (WHERE status_code >= 200 AND status_code < 300)::NUMERIC / COUNT(*) * 100), 2
  ) as success_rate_percentage
FROM endpoint_requests 
WHERE request_timestamp >= NOW() - INTERVAL '7 days'
GROUP BY endpoint_id, user_id;
```

### 4.2 Supabase MCP Implementation Steps

#### Step 1: Apply Database Migrations
```typescript
// Use Supabase MCP to apply migrations
await mcp_supabase_apply_migration({
  project_id: "your-project-id",
  name: "create_endpoint_requests_table",
  query: `-- Migration SQL here`
});
```

#### Step 2: Create Analytics Functions
```sql
-- Migration: 004_create_analytics_functions.sql
CREATE OR REPLACE FUNCTION get_user_kpi_overview(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'responseTime', (
      SELECT json_build_object(
        'currentAvg', COALESCE(AVG(response_time_ms), 0),
        'totalRequests', COUNT(*),
        'timeRange', '24h'
      )
      FROM endpoint_requests er
      JOIN endpoints e ON er.endpoint_id = e.id
      WHERE e.user_id = user_uuid
        AND er.request_timestamp >= NOW() - INTERVAL '24 hours'
    ),
    'successRate', (
      SELECT json_build_object(
        'currentSuccessRate', COALESCE(
          ROUND((COUNT(*) FILTER (WHERE status_code >= 200 AND status_code < 300)::NUMERIC / COUNT(*) * 100), 2),
          0
        ),
        'totalRequests', COUNT(*),
        'successfulRequests', COUNT(*) FILTER (WHERE status_code >= 200 AND status_code < 300)
      )
      FROM endpoint_requests er
      JOIN endpoints e ON er.endpoint_id = e.id
      WHERE e.user_id = user_uuid
        AND er.request_timestamp >= NOW() - INTERVAL '7 days'
    ),
    'uptime', (
      SELECT json_build_object(
        'uptimePercentage', COALESCE(
          ROUND((COUNT(*) FILTER (WHERE is_available = true)::NUMERIC / COUNT(*) * 100), 2),
          100
        ),
        'totalChecks', COUNT(*),
        'timeRange', '30d'
      )
      FROM endpoint_uptime_checks euc
      JOIN endpoints e ON euc.endpoint_id = e.id
      WHERE e.user_id = user_uuid
        AND euc.check_timestamp >= NOW() - INTERVAL '30 days'
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 4.3 Middleware Integration

#### Update Request Tracking Middleware
```typescript
// src/middleware.ts - Add request tracking
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Track mock endpoint requests
  if (request.nextUrl.pathname.startsWith('/api/mock/')) {
    const startTime = Date.now();
    
    // Let the request continue
    const response = NextResponse.next();
    
    // Track the request after response
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Extract endpoint ID from URL
    const endpointId = request.nextUrl.pathname.split('/').pop();
    
    if (endpointId) {
      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Record the request metrics
        await supabase.from('endpoint_requests').insert({
          endpoint_id: endpointId,
          user_id: session.user.id,
          response_time_ms: responseTime,
          status_code: response.status,
          request_method: request.method,
          user_agent: request.headers.get('user-agent'),
          ip_address: request.ip || request.headers.get('x-forwarded-for')
        });
      }
    }
    
    return response;
  }

  return res;
}
```

---

## 5. Frontend Implementation

### 5.1 Data Fetching Hooks

#### Response Time Hook
```typescript
// src/lib/hooks/useResponseTimeKPI.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface ResponseTimeKPI {
  currentAvg: number;
  previousAvg: number;
  improvementPercentage: number;
  trend: 'improving' | 'degrading' | 'stable';
  timeRange: string;
}

export function useResponseTimeKPI(timeRange: '24h' | '7d' | '30d' = '24h') {
  return useQuery({
    queryKey: ['kpi', 'response-time', timeRange],
    queryFn: async (): Promise<ResponseTimeKPI> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Current period metrics
      const currentInterval = timeRange === '24h' ? '24 hours' : 
                            timeRange === '7d' ? '7 days' : '30 days';
      
      const { data: currentData, error: currentError } = await supabase
        .from('endpoint_requests')
        .select(`
          response_time_ms,
          endpoints!inner(user_id)
        `)
        .eq('endpoints.user_id', user.id)
        .gte('request_timestamp', `now() - interval '${currentInterval}'`);

      if (currentError) throw currentError;

      // Previous period metrics
      const { data: previousData, error: previousError } = await supabase
        .from('endpoint_requests')
        .select(`
          response_time_ms,
          endpoints!inner(user_id)
        `)
        .eq('endpoints.user_id', user.id)
        .gte('request_timestamp', `now() - interval '${currentInterval}' - interval '${currentInterval}'`)
        .lt('request_timestamp', `now() - interval '${currentInterval}'`);

      if (previousError) throw previousError;

      // Calculate averages
      const currentAvg = currentData.length > 0 
        ? currentData.reduce((sum, r) => sum + r.response_time_ms, 0) / currentData.length 
        : 0;
      
      const previousAvg = previousData.length > 0 
        ? previousData.reduce((sum, r) => sum + r.response_time_ms, 0) / previousData.length 
        : 0;

      // Calculate improvement percentage
      const improvementPercentage = previousAvg > 0 
        ? ((previousAvg - currentAvg) / previousAvg) * 100 
        : 0;

      // Determine trend
      let trend: 'improving' | 'degrading' | 'stable' = 'stable';
      if (Math.abs(improvementPercentage) > 5) {
        trend = improvementPercentage > 0 ? 'improving' : 'degrading';
      }

      return {
        currentAvg: Math.round(currentAvg),
        previousAvg: Math.round(previousAvg),
        improvementPercentage: Math.round(improvementPercentage * 100) / 100,
        trend,
        timeRange
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
  });
}
```

#### Success Rate Hook
```typescript
// src/lib/hooks/useSuccessRateKPI.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface SuccessRateKPI {
  currentSuccessRate: number;
  previousSuccessRate: number;
  comparisonPercentage: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
}

export function useSuccessRateKPI() {
  return useQuery({
    queryKey: ['kpi', 'success-rate'],
    queryFn: async (): Promise<SuccessRateKPI> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Current week data
      const { data: currentWeekData, error: currentError } = await supabase
        .from('endpoint_requests')
        .select(`
          status_code,
          endpoints!inner(user_id)
        `)
        .eq('endpoints.user_id', user.id)
        .gte('request_timestamp', 'now() - interval \'7 days\'');

      if (currentError) throw currentError;

      // Previous week data
      const { data: previousWeekData, error: previousError } = await supabase
        .from('endpoint_requests')
        .select(`
          status_code,
          endpoints!inner(user_id)
        `)
        .eq('endpoints.user_id', user.id)
        .gte('request_timestamp', 'now() - interval \'14 days\'')
        .lt('request_timestamp', 'now() - interval \'7 days\'');

      if (previousError) throw previousError;

      // Calculate current week metrics
      const totalRequests = currentWeekData.length;
      const successfulRequests = currentWeekData.filter(r => 
        r.status_code >= 200 && r.status_code < 300
      ).length;
      const failedRequests = totalRequests - successfulRequests;
      const currentSuccessRate = totalRequests > 0 
        ? (successfulRequests / totalRequests) * 100 
        : 0;

      // Calculate previous week metrics
      const previousTotalRequests = previousWeekData.length;
      const previousSuccessfulRequests = previousWeekData.filter(r => 
        r.status_code >= 200 && r.status_code < 300
      ).length;
      const previousSuccessRate = previousTotalRequests > 0 
        ? (previousSuccessfulRequests / previousTotalRequests) * 100 
        : 0;

      // Calculate comparison percentage
      const comparisonPercentage = previousSuccessRate > 0 
        ? currentSuccessRate - previousSuccessRate 
        : 0;

      return {
        currentSuccessRate: Math.round(currentSuccessRate * 100) / 100,
        previousSuccessRate: Math.round(previousSuccessRate * 100) / 100,
        comparisonPercentage: Math.round(comparisonPercentage * 100) / 100,
        totalRequests,
        successfulRequests,
        failedRequests
      };
    },
    refetchInterval: 30000,
    staleTime: 25000,
  });
}
```

#### Peak RPM Hook
```typescript
// src/lib/hooks/usePeakRPMKPI.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface PeakRPMKPI {
  currentPeakRPM: number;
  averageRPM: number;
  peakTime: Date | null;
  historicalPeak: number;
  timeRange: string;
}

export function usePeakRPMKPI(timeRange: '1h' | '24h' | '7d' = '24h') {
  return useQuery({
    queryKey: ['kpi', 'peak-rpm', timeRange],
    queryFn: async (): Promise<PeakRPMKPI> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const interval = timeRange === '1h' ? '1 hour' : 
                     timeRange === '24h' ? '24 hours' : '7 days';

      // Get requests grouped by minute
      const { data, error } = await supabase.rpc('get_rpm_metrics', {
        user_uuid: user.id,
        time_interval: interval
      });

      if (error) throw error;

      // Calculate metrics from the returned data
      const currentPeakRPM = Math.max(...(data?.rpm_per_minute || [0]));
      const averageRPM = data?.rpm_per_minute?.length > 0 
        ? data.rpm_per_minute.reduce((a: number, b: number) => a + b, 0) / data.rpm_per_minute.length 
        : 0;

      return {
        currentPeakRPM: Math.round(currentPeakRPM),
        averageRPM: Math.round(averageRPM),
        peakTime: data?.peak_time ? new Date(data.peak_time) : null,
        historicalPeak: data?.historical_peak || 0,
        timeRange
      };
    },
    refetchInterval: 30000,
    staleTime: 25000,
  });
}
```

#### Uptime Hook
```typescript
// src/lib/hooks/useUptimeKPI.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface UptimeKPI {
  uptimePercentage: number;
  totalChecks: number;
  successfulChecks: number;
  lastDowntime: Date | null;
  downtimeMinutes: number;
}

export function useUptimeKPI() {
  return useQuery({
    queryKey: ['kpi', 'uptime'],
    queryFn: async (): Promise<UptimeKPI> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('endpoint_uptime_checks')
        .select(`
          is_available,
          check_timestamp,
          endpoints!inner(user_id)
        `)
        .eq('endpoints.user_id', user.id)
        .gte('check_timestamp', 'now() - interval \'30 days\'')
        .order('check_timestamp', { ascending: false });

      if (error) throw error;

      const totalChecks = data.length;
      const successfulChecks = data.filter(check => check.is_available).length;
      const uptimePercentage = totalChecks > 0 ? (successfulChecks / totalChecks) * 100 : 100;

      // Find last downtime
      const lastDowntimeRecord = data.find(check => !check.is_available);
      const lastDowntime = lastDowntimeRecord ? new Date(lastDowntimeRecord.check_timestamp) : null;

      // Calculate total downtime (simplified - would need more complex logic for actual downtime duration)
      const downtimeChecks = data.filter(check => !check.is_available).length;
      const downtimeMinutes = downtimeChecks * 5; // Assuming 5-minute check intervals

      return {
        uptimePercentage: Math.round(uptimePercentage * 100) / 100,
        totalChecks,
        successfulChecks,
        lastDowntime,
        downtimeMinutes
      };
    },
    refetchInterval: 30000,
    staleTime: 25000,
  });
}
```

### 5.2 Updated KPI Components

#### Enhanced KPIGrid Component
```typescript
// src/components/dashboard/analytics/KPIGrid.tsx - Updated
"use client"

import { motion } from "framer-motion"
import { KPICard } from "./KPICard"
import { useResponseTimeKPI } from "@/lib/hooks/useResponseTimeKPI"
import { useSuccessRateKPI } from "@/lib/hooks/useSuccessRateKPI"
import { usePeakRPMKPI } from "@/lib/hooks/usePeakRPMKPI"
import { useUptimeKPI } from "@/lib/hooks/useUptimeKPI"

import { 
  Clock, 
  TrendingUp,
  Zap,
  Eye,
  AlertTriangle
} from "lucide-react"

interface KPIGridProps {
  className?: string
}

export function KPIGrid({ className }: KPIGridProps) {
  const { data: responseTimeData, isLoading: responseTimeLoading } = useResponseTimeKPI();
  const { data: successRateData, isLoading: successRateLoading } = useSuccessRateKPI();
  const { data: peakRPMData, isLoading: peakRPMLoading } = usePeakRPMKPI();
  const { data: uptimeData, isLoading: uptimeLoading } = useUptimeKPI();

  const isLoading = responseTimeLoading || successRateLoading || peakRPMLoading || uptimeLoading;

  const kpiData = [
    {
      title: "Avg Response Time",
      value: isLoading ? "..." : `${responseTimeData?.currentAvg || 0}ms`,
      icon: Clock,
      trend: responseTimeData ? {
        value: Math.abs(responseTimeData.improvementPercentage),
        label: `${responseTimeData.improvementPercentage > 0 ? 'improvement' : 'degradation'}`,
        isPositive: responseTimeData.improvementPercentage > 0,
      } : undefined,
      color: responseTimeData?.trend === 'improving' ? 'green' : 
             responseTimeData?.trend === 'degrading' ? 'red' : 'blue',
    },
    {
      title: "Success Rate",
      value: isLoading ? "..." : `${successRateData?.currentSuccessRate || 0}%`,
      icon: TrendingUp,
      trend: successRateData ? {
        value: Math.abs(successRateData.comparisonPercentage),
        label: "vs last week",
        isPositive: successRateData.comparisonPercentage >= 0,
      } : undefined,
      color: (successRateData?.currentSuccessRate || 0) >= 95 ? 'green' : 
             (successRateData?.currentSuccessRate || 0) >= 90 ? 'orange' : 'red',
    },
    {
      title: "Peak RPM",
      value: isLoading ? "..." : peakRPMData?.currentPeakRPM?.toLocaleString() || "0",
      icon: Zap,
      trend: peakRPMData ? {
        value: peakRPMData.averageRPM,
        label: "average RPM",
        isPositive: true,
      } : undefined,
      color: "orange",
    },
    {
      title: "Uptime (30d)",
      value: isLoading ? "..." : `${uptimeData?.uptimePercentage || 100}%`,
      icon: Eye,
      trend: uptimeData?.lastDowntime ? {
        value: uptimeData.downtimeMinutes,
        label: "downtime minutes",
        isPositive: false,
      } : undefined,
      color: (uptimeData?.uptimePercentage || 100) >= 99.5 ? 'green' : 
             (uptimeData?.uptimePercentage || 100) >= 99 ? 'orange' : 'red',
    },
  ];

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5,
              delay: index * 0.1 
            }}
          >
            <KPICard
              title={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              trend={kpi.trend}
              isLoading={isLoading}
              color={kpi.color}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Data freshness indicator */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-4 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
            <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          </p>
        </motion.div>
      )}
    </div>
  )
}
```

---

## 6. Implementation Timeline

### Phase 1: Database Foundation (Week 1)
**Days 1-2: Schema Setup**
- [ ] Apply database migrations using Supabase MCP
- [ ] Create `endpoint_requests` table with proper indexing
- [ ] Create `endpoint_uptime_checks` table
- [ ] Set up Row Level Security policies
- [ ] Test basic data insertion

**Days 3-4: Middleware Integration**
- [ ] Update middleware.ts to capture request metrics
- [ ] Implement response time measurement
- [ ] Add status code tracking
- [ ] Test request data collection
- [ ] Verify data accuracy

**Days 5-7: Basic Analytics Functions**
- [ ] Create database views for KPI calculations
- [ ] Implement basic aggregation functions
- [ ] Create API endpoints for data retrieval
- [ ] Test data queries and performance
- [ ] Set up automated uptime checks

### Phase 2: Real-Time KPI Implementation (Week 2)
**Days 8-10: Core KPI Hooks**
- [ ] Implement `useResponseTimeKPI` hook
- [ ] Implement `useSuccessRateKPI` hook
- [ ] Implement `usePeakRPMKPI` hook
- [ ] Implement `useUptimeKPI` hook
- [ ] Add proper error handling and loading states

**Days 11-12: Data Processing**
- [ ] Create background functions for RPM calculation
- [ ] Implement trend calculation logic
- [ ] Set up automated uptime monitoring
- [ ] Create data aggregation cron jobs
- [ ] Test calculation accuracy

**Days 13-14: Integration Testing**
- [ ] Test all KPI calculations with real data
- [ ] Verify performance under load
- [ ] Test real-time updates
- [ ] Fix any data inconsistencies
- [ ] Performance optimization

### Phase 3: Frontend Integration (Week 3)
**Days 15-17: Component Updates**
- [ ] Update KPIGrid to use real data hooks
- [ ] Enhance KPICard with trend indicators
- [ ] Add loading states and error handling
- [ ] Implement data refresh mechanisms
- [ ] Add time range selectors

**Days 18-19: User Experience Enhancements**
- [ ] Add data freshness indicators
- [ ] Implement smooth transitions
- [ ] Add tooltip explanations
- [ ] Create mobile-responsive layouts
- [ ] Add accessibility features

**Days 20-21: Testing & Polish**
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Performance testing
- [ ] User acceptance testing
- [ ] Bug fixes and refinements

### Phase 4: Advanced Features (Week 4)
**Days 22-24: Enhanced Analytics**
- [ ] Add historical trend charts
- [ ] Implement data export functionality
- [ ] Create drill-down capabilities
- [ ] Add comparison features
- [ ] Implement alerting system

**Days 25-26: Performance Optimization**
- [ ] Optimize database queries
- [ ] Implement query caching
- [ ] Add data pagination
- [ ] Optimize real-time updates
- [ ] Performance monitoring

**Days 27-28: Launch Preparation**
- [ ] Final testing and validation
- [ ] Documentation updates
- [ ] Deploy to production
- [ ] Monitor system performance
- [ ] User feedback collection

---

## 7. Success Metrics & Validation

### 7.1 Technical Performance Metrics

#### Data Accuracy Validation
```typescript
// Test suite for KPI accuracy
describe('KPI Data Accuracy', () => {
  test('Response time measurements are within 5ms tolerance', async () => {
    const actualResponseTime = await measureActualResponseTime();
    const recordedResponseTime = await getRecordedResponseTime();
    expect(Math.abs(actualResponseTime - recordedResponseTime)).toBeLessThan(5);
  });

  test('Success rate calculations are 100% accurate', async () => {
    const { total, successful } = await getRequestCounts();
    const calculatedRate = (successful / total) * 100;
    const kpiRate = await getSuccessRateKPI();
    expect(calculatedRate).toEqual(kpiRate.currentSuccessRate);
  });

  test('RPM calculations match actual request frequency', async () => {
    const actualRPM = await measureActualRPM();
    const calculatedRPM = await getPeakRPMKPI();
    expect(Math.abs(actualRPM - calculatedRPM.currentPeakRPM)).toBeLessThan(2);
  });
});
```

#### Performance Benchmarks
- **KPI Load Time**: < 500ms for all metrics
- **Database Query Performance**: < 100ms for aggregation queries
- **Real-time Update Latency**: < 30 seconds
- **Memory Usage**: < 10MB additional memory for analytics
- **Network Overhead**: < 50KB additional data transfer per page load

### 7.2 User Experience Metrics

#### Usability Testing Criteria
- [ ] Users can understand each KPI within 10 seconds
- [ ] Trend indicators are clear and actionable
- [ ] Loading states don't block interaction
- [ ] Error states provide helpful guidance
- [ ] Mobile experience is fully functional

#### Engagement Metrics
- **Dashboard Session Time**: Target 50% increase
- **KPI Interaction Rate**: Target 70% of users click KPI cards
- **Data Export Usage**: Target 20% of users export data
- **Return Rate**: Target 80% of users return within 7 days

### 7.3 Business Impact Metrics

#### User Satisfaction
- **Perceived Data Quality**: 95% of users trust the metrics
- **Feature Usefulness**: 90% find KPIs valuable for optimization
- **Dashboard Rating**: Target 4.5+ out of 5 stars
- **Support Ticket Reduction**: 30% fewer analytics-related tickets

#### System Reliability
- **Uptime**: 99.9% analytics system availability
- **Data Freshness**: 95% of data updated within 60 seconds
- **Error Rate**: < 0.1% failed KPI calculations
- **Scalability**: Support 100x current request volume

---

## 8. Risk Assessment & Mitigation

### 8.1 Technical Risks

#### High Priority Risks
| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|-------------------|
| Database performance degradation | High | Medium | Implement proper indexing, query optimization, and connection pooling |
| Real-time updates causing server overload | High | Medium | Rate limiting, efficient WebSocket management, and data throttling |
| Data accuracy issues with high-frequency requests | High | Medium | Middleware optimization, atomic operations, and validation checks |

#### Medium Priority Risks
| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|-------------------|
| Middleware latency affecting endpoint performance | Medium | High | Asynchronous data collection, background processing |
| Storage costs with detailed request tracking | Medium | Medium | Data retention policies, efficient data structure design |
| Complexity in trend calculations | Medium | Low | Thorough testing, clear documentation, staged rollout |

### 8.2 Business Risks

#### User Adoption Risks
- **Data Overwhelm**: Too many metrics confusing users
  - *Mitigation*: Progressive disclosure, customizable dashboard, user education
- **Performance Impact**: Analytics slowing down core functionality
  - *Mitigation*: Performance monitoring, optimization, user communication

#### Operational Risks
- **Data Privacy Concerns**: Storing detailed request information
  - *Mitigation*: Clear privacy policy, data anonymization, retention limits
- **Compliance Requirements**: Meeting data protection regulations
  - *Mitigation*: Legal review, compliance-first design, user consent

---

## 9. Future Enhancements

### 9.1 Advanced Analytics (3-6 months)
- **Predictive Analytics**: ML-powered usage predictions
- **Anomaly Detection**: Automatic identification of unusual patterns
- **Custom Metrics**: User-defined KPIs and alerts
- **Geographic Analytics**: Location-based usage insights

### 9.2 Integration Ecosystem (6-12 months)
- **Third-party Integrations**: Slack, Discord, email alerts
- **API Analytics Platform**: Comprehensive API management suite
- **Team Collaboration**: Shared dashboards and insights
- **Enterprise Features**: Advanced reporting and compliance tools

---

## 10. Conclusion

This PRD provides a comprehensive roadmap for implementing real-time KPI analytics in Mocklyst, transforming static mock data into actionable insights. The implementation leverages Supabase MCP for robust database management while maintaining high performance and user experience standards.

**Key Deliverables:**
- ✅ Real-time response time tracking with trend analysis
- ✅ Accurate success rate monitoring with weekly comparisons
- ✅ Peak RPM analytics with historical tracking
- ✅ 30-day uptime monitoring with downtime analysis
- ✅ Scalable architecture supporting future enhancements
- ✅ Comprehensive testing and validation framework

**Success Criteria:**
- 100% elimination of mock KPI data
- Sub-500ms KPI calculation performance
- 99.9% data accuracy and system reliability
- 50% increase in user engagement with analytics

The implementation timeline spans 4 weeks with clear milestones and deliverables, ensuring a systematic approach to delivering high-quality, real-time analytics capabilities that will significantly enhance the user experience and establish Mocklyst as a professional-grade API mocking platform.
