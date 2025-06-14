"use client"

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

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
      // Try to get user from the Supabase client
      const { data: { user } } = await supabase.auth.getUser()
      
      // Build URL with userId if available
      const url = new URL('/api/analytics/kpis', window.location.origin)
      if (user) {
        url.searchParams.set('userId', user.id)
      }
      
      const response = await fetch(url.toString())
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
      // Try to get user from the Supabase client
      const { data: { user } } = await supabase.auth.getUser()
      
      // Build URL with userId if available
      const url = new URL('/api/analytics/trends', window.location.origin)
      url.searchParams.set('timeframe', timeframe)
      if (user) {
        url.searchParams.set('userId', user.id)
      }
      
      const response = await fetch(url.toString())
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
