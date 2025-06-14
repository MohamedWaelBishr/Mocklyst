"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { UserEndpoint } from "@/lib/hooks/useUserEndpoints"
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Target,
  Activity,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TrendIndicatorProps {
  endpoints: UserEndpoint[]
  isLoading?: boolean
  className?: string
}

export function TrendIndicator({ endpoints, isLoading = false, className }: TrendIndicatorProps) {
  // Calculate performance metrics
  const totalRequests = endpoints.reduce((sum, endpoint) => sum + (endpoint.hits || 0), 0);
  const activeEndpoints = endpoints.filter(e => new Date(e.expires_at) > new Date()).length;
  
  // Mock trend data (would be calculated from historical data in real implementation)
  const trends = [
    {
      label: "Request Volume",
      current: totalRequests,
      previous: Math.max(0, totalRequests - Math.floor(totalRequests * 0.15)),
      target: Math.floor(totalRequests * 1.2),
      icon: Activity,
      color: "blue"
    },
    {
      label: "Active Endpoints",
      current: activeEndpoints,
      previous: Math.max(0, activeEndpoints - 2),
      target: activeEndpoints + 5,
      icon: Target,
      color: "green"
    },
    {
      label: "Response Time",
      current: 127,
      previous: 145,
      target: 100,
      icon: Clock,
      color: "purple",
      unit: "ms",
      isReverse: true // Lower is better
    }
  ];

  const calculateTrend = (current: number, previous: number, isReverse = false) => {
    if (previous === 0) return { value: 0, type: 'neutral' as const };
    
    const change = ((current - previous) / previous) * 100;
    const isPositive = isReverse ? change < 0 : change > 0;
    
    return {
      value: Math.abs(change),
      type: Math.abs(change) < 1 ? 'neutral' as const : (isPositive ? 'positive' as const : 'negative' as const)
    };
  };

  const getTrendIcon = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return TrendingUp;
      case 'negative':
        return TrendingDown;
      default:
        return Minus;
    }
  };

  const getTrendColor = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return "text-green-600 dark:text-green-400";
      case 'negative':
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <Card className={cn("shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm", className)}>
        <CardHeader>
          <CardTitle className="text-lg">Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={cn("shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm", className)}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Performance Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trends.map((trend, index) => {
              const trendData = calculateTrend(trend.current, trend.previous, trend.isReverse);
              const TrendIcon = getTrendIcon(trendData.type);
              const progress = Math.min((trend.current / trend.target) * 100, 100);
              
              return (
                <motion.div
                  key={trend.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <trend.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{trend.label}</span>
                      <Badge 
                        variant={trendData.type === 'positive' ? 'default' : trendData.type === 'negative' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        <TrendIcon className="w-3 h-3 mr-1" />
                        {trendData.value.toFixed(1)}%
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Current: {trend.current.toLocaleString()}{trend.unit}
                        </span>
                        <span className="text-muted-foreground">
                          Target: {trend.target.toLocaleString()}{trend.unit}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Live Monitoring Active
              </span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Real-time updates every 30 seconds
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
