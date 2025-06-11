"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LucideIcon } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  description?: string
  isLoading?: boolean
}

export function KPICard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  description,
  isLoading = false 
}: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {isLoading ? (
              <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            ) : (
              <div className="text-2xl font-bold">{value}</div>
            )}
            
            {trend && !isLoading && (
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={trend.isPositive ? "default" : "destructive"}
                  className="text-xs"
                >
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {trend.label}
                </p>
              </div>
            )}
            
            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
