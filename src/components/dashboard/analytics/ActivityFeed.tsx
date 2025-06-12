"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ExternalLink, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ActivityItem {
  id: string
  endpoint: string
  method: string
  statusCode: number
  timestamp: Date
  userAgent?: string
  ip?: string
}

interface ActivityFeedProps {
  activities: ActivityItem[]
  isLoading?: boolean
}

export function ActivityFeed({ activities, isLoading = false }: ActivityFeedProps) {
  const getStatusBadgeVariant = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return "default"
    if (statusCode >= 400 && statusCode < 500) return "secondary"
    return "destructive"
  }

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'text-green-600 dark:text-green-400'
      case 'POST': return 'text-blue-600 dark:text-blue-400'
      case 'PUT': return 'text-orange-600 dark:text-orange-400'
      case 'DELETE': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>Recent Activity</span>
          </CardTitle>
          <CardDescription>
            Latest API requests to your endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-12 h-4 bg-muted animate-pulse rounded" />
                  <div className="flex-1 h-4 bg-muted animate-pulse rounded" />
                  <div className="w-16 h-4 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-6">
              <Eye className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.slice(0, 10).map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg border bg-background/50"
                >
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant="outline" 
                      className={`${getMethodColor(activity.method)} font-mono text-xs`}
                    >
                      {activity.method}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {activity.endpoint}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(activity.statusCode)}>
                    {activity.statusCode}
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Mock data generator for demo purposes - using static data to avoid hydration mismatches
export const generateMockActivities = (count: number = 10): ActivityItem[] => {
  const staticActivities = [
    { id: 'activity-0', endpoint: '/api/users', method: 'GET', statusCode: 200, timestamp: new Date(Date.now() - 3600000) },
    { id: 'activity-1', endpoint: '/api/products', method: 'POST', statusCode: 201, timestamp: new Date(Date.now() - 7200000) },
    { id: 'activity-2', endpoint: '/api/orders', method: 'GET', statusCode: 200, timestamp: new Date(Date.now() - 10800000) },
    { id: 'activity-3', endpoint: '/api/auth', method: 'POST', statusCode: 401, timestamp: new Date(Date.now() - 14400000) },
    { id: 'activity-4', endpoint: '/api/posts', method: 'PUT', statusCode: 200, timestamp: new Date(Date.now() - 18000000) },
    { id: 'activity-5', endpoint: '/api/users', method: 'DELETE', statusCode: 404, timestamp: new Date(Date.now() - 21600000) },
    { id: 'activity-6', endpoint: '/api/products', method: 'GET', statusCode: 500, timestamp: new Date(Date.now() - 25200000) },
    { id: 'activity-7', endpoint: '/api/orders', method: 'POST', statusCode: 201, timestamp: new Date(Date.now() - 28800000) },
    { id: 'activity-8', endpoint: '/api/auth', method: 'GET', statusCode: 200, timestamp: new Date(Date.now() - 32400000) },
    { id: 'activity-9', endpoint: '/api/posts', method: 'PUT', statusCode: 200, timestamp: new Date(Date.now() - 36000000) },
  ]
  
  return staticActivities.slice(0, count).map(activity => ({
    ...activity,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    ip: `192.168.1.${100 + (activity.id.charCodeAt(activity.id.length - 1) % 155)}`
  }))
}
