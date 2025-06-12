"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface MetricsChartProps {
  title: string
  description?: string
  data: Array<{
    name: string
    value: number
    [key: string]: string | number
  }>
  type?: 'line' | 'area'
  color?: string
  isLoading?: boolean
}

export function MetricsChart({ 
  title, 
  description, 
  data, 
  type = 'line',
  color = '#3b82f6',
  isLoading = false 
}: MetricsChartProps) {
  const ChartComponent = type === 'area' ? AreaChart : LineChart

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[200px] w-full bg-muted animate-pulse rounded" />
          ) : (
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ChartComponent data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  {type === 'area' ? (
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={color}
                      fill={color}
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  ) : (
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={color}
                      strokeWidth={2}
                      dot={{ fill: color, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
                    />
                  )}
                </ChartComponent>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
