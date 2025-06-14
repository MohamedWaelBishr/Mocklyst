"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Activity, TrendingUp, TrendingDown, Download, Maximize2, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface RequestVolumeChartProps {
  data?: Array<{
    time: string
    requests: number
    successRate: number
    errors: number
  }>
  isLoading?: boolean
  className?: string
  onExport?: () => void
  onFullscreen?: () => void
}

export function RequestVolumeChart({ 
  data = [], 
  isLoading = false, 
  className,
  onExport,
  onFullscreen
}: RequestVolumeChartProps) {
  const [viewMode, setViewMode] = useState<'area' | 'bar'>('area');

  // Mock data for demonstration
  const mockData = [
    { time: '00:00', requests: 245, successRate: 98.5, errors: 4 },
    { time: '04:00', requests: 167, successRate: 99.1, errors: 2 },
    { time: '08:00', requests: 432, successRate: 97.8, errors: 9 },
    { time: '12:00', requests: 689, successRate: 96.2, errors: 26 },
    { time: '16:00', requests: 567, successRate: 98.8, errors: 7 },
    { time: '20:00', requests: 324, successRate: 99.3, errors: 2 },
    { time: '24:00', requests: 289, successRate: 98.9, errors: 3 },
  ];

  const chartData = data.length > 0 ? data : mockData;
  const totalRequests = chartData.reduce((sum, item) => sum + item.requests, 0);
  const currentRequests = chartData[chartData.length - 1]?.requests || 0;
  const previousRequests = chartData[chartData.length - 2]?.requests || currentRequests;
  const trend = currentRequests - previousRequests;
  const trendPercentage = previousRequests > 0 ? ((trend / previousRequests) * 100) : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3">
          <p className="font-medium">{`Time: ${label}`}</p>
          <div className="space-y-1 mt-2">
            <div className="flex items-center justify-between space-x-4">
              <span className="text-sm">Requests:</span>
              <span className="font-medium">{data?.requests.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-sm">Success Rate:</span>
              <span className="font-medium text-green-600">{data?.successRate}%</span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-sm">Errors:</span>
              <span className="font-medium text-red-600">{data?.errors}</span>
            </div>
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
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className={cn("shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span>Request Volume</span>
              </CardTitle>
              <CardDescription className="flex items-center space-x-2">
                API requests over the last 24 hours • {totalRequests.toLocaleString()} total
                <Badge 
                  variant={trend >= 0 ? "default" : "secondary"}
                  className="ml-2 text-xs"
                >
                  {trend >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(trendPercentage).toFixed(1)}%
                </Badge>
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'area' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('area')}
                  className="h-7 px-2"
                >
                  <Activity className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'bar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('bar')}
                  className="h-7 px-2"
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </div>
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
              {viewMode === 'area' ? (
                <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                    label={{ value: 'Requests', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient id="requestGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="requests"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="url(#requestGradient)"
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                  />
                </AreaChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                    label={{ value: 'Requests', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="requests" 
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4 p-3 bg-muted/20 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {totalRequests.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Total Requests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Math.round(totalRequests / chartData.length).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Avg/Hour</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Math.max(...chartData.map(d => d.requests)).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Peak/Hour</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
