"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts'
import { PieChart as PieChartIcon, BarChart3, Download, Maximize2, CheckCircle, AlertCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface StatusDistributionChartProps {
  data?: Array<{
    status: string
    count: number
    percentage: number
    color: string
  }>
  isLoading?: boolean
  className?: string
  onExport?: () => void
  onFullscreen?: () => void
}

export function StatusDistributionChart({ 
  data = [], 
  isLoading = false, 
  className,
  onExport,
  onFullscreen
}: StatusDistributionChartProps) {
  const [viewMode, setViewMode] = useState<'pie' | 'bar'>('pie');

  // Mock data for demonstration
  const mockData = [
    { status: '200 OK', count: 8943, percentage: 89.4, color: '#10b981' },
    { status: '201 Created', count: 523, percentage: 5.2, color: '#059669' },
    { status: '400 Bad Request', count: 312, percentage: 3.1, color: '#f59e0b' },
    { status: '404 Not Found', count: 156, percentage: 1.6, color: '#ef4444' },
    { status: '500 Server Error', count: 67, percentage: 0.7, color: '#dc2626' },
  ];

  const chartData = data.length > 0 ? data : mockData;
  const totalRequests = chartData.reduce((sum, item) => sum + item.count, 0);
  const successRate = chartData
    .filter(item => item.status.startsWith('2'))
    .reduce((sum, item) => sum + item.percentage, 0);

  const getStatusIcon = (status: string) => {
    if (status.startsWith('2')) return CheckCircle;
    if (status.startsWith('4')) return AlertCircle;
    if (status.startsWith('5')) return XCircle;
    return CheckCircle;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data.color }}
            />
            <span className="font-medium">{data.status}</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between space-x-4">
              <span className="text-sm">Count:</span>
              <span className="font-medium">{data.count.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-sm">Percentage:</span>
              <span className="font-medium">{data.percentage}%</span>
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
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className={cn("shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center space-x-2">
                <PieChartIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span>Status Distribution</span>
              </CardTitle>
              <CardDescription>
                Response status codes • {successRate.toFixed(1)}% success rate
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'pie' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('pie')}
                  className="h-7 px-2"
                >
                  <PieChartIcon className="w-4 h-4" />
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
              {viewMode === 'pie' ? (
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry: any) => (
                      <span style={{ color: entry.color }}>{value}</span>
                    )}
                  />
                </PieChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="status" 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="count"
                    radius={[4, 4, 0, 0]}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
          
          {/* Status Legend */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
            {chartData.map((item, index) => {
              const StatusIcon = getStatusIcon(item.status);
              return (
                <div 
                  key={index}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                >
                  <StatusIcon 
                    className="w-4 h-4" 
                    style={{ color: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.status}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.count.toLocaleString()} ({item.percentage}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Summary */}
          <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="font-medium">Overall Health</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {successRate.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
