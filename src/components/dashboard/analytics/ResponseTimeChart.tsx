"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Clock, TrendingUp, TrendingDown, Download, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ResponseTimeChartProps {
  data?: Array<{
    time: string
    responseTime: number
    p95: number
    p99: number
  }>
  isLoading?: boolean
  className?: string
  onExport?: () => void
  onFullscreen?: () => void
}

export function ResponseTimeChart({ 
  data = [], 
  isLoading = false, 
  className,
  onExport,
  onFullscreen
}: ResponseTimeChartProps) {
  // Mock data for demonstration
  const mockData = [
    { time: '00:00', responseTime: 120, p95: 150, p99: 200 },
    { time: '04:00', responseTime: 98, p95: 120, p99: 180 },
    { time: '08:00', responseTime: 156, p95: 200, p99: 250 },
    { time: '12:00', responseTime: 189, p95: 220, p99: 280 },
    { time: '16:00', responseTime: 167, p95: 190, p99: 240 },
    { time: '20:00', responseTime: 134, p95: 160, p99: 210 },
    { time: '24:00', responseTime: 112, p95: 140, p99: 190 },
  ];

  const chartData = data.length > 0 ? data : mockData;
  const currentAvg = chartData[chartData.length - 1]?.responseTime || 0;
  const previousAvg = chartData[chartData.length - 2]?.responseTime || currentAvg;
  const trend = currentAvg - previousAvg;
  const trendPercentage = previousAvg > 0 ? ((trend / previousAvg) * 100) : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3">
          <p className="font-medium">{`Time: ${label}`}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm">
                  {entry.name}: {entry.value}ms
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className={cn("shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-5 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className={cn("shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Response Time</span>
              </CardTitle>
              <CardDescription className="flex items-center space-x-2">
                Average response time over 24 hours
                <Badge 
                  variant={trend <= 0 ? "default" : "destructive"}
                  className="ml-2 text-xs"
                >
                  {trend <= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(trendPercentage).toFixed(1)}%
                </Badge>
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {onExport && (
                <Button variant="outline" size="sm" onClick={onExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              )}
              {onFullscreen && (
                <Button variant="outline" size="sm" onClick={onFullscreen}>
                  <Maximize2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />                <ReferenceLine 
                  y={200} 
                  stroke="#f59e0b" 
                  strokeDasharray="5 5" 
                  label="SLA Target"
                />
                <Line
                  type="monotone"
                  dataKey="responseTime"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  name="Avg Response Time"
                />
                <Line
                  type="monotone"
                  dataKey="p95"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="95th Percentile"
                />
                <Line
                  type="monotone"
                  dataKey="p99"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={false}
                  name="99th Percentile"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span>Average</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-purple-500" style={{ borderStyle: 'dashed' }} />
              <span>95th Percentile</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-red-500" style={{ borderStyle: 'dotted' }} />
              <span>99th Percentile</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-amber-500" style={{ borderStyle: 'dashed' }} />
              <span>SLA Target</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
