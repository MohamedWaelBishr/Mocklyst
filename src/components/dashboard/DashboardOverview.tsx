"use client"

import { motion } from "framer-motion"
import { KPICard } from "./analytics/KPICard"
import { MetricsChart } from "./analytics/MetricsChart"
import { ActivityFeed, generateMockActivities } from "./analytics/ActivityFeed"
import { EndpointTable } from "./monitoring/EndpointTable"
import { UserEndpoint } from "@/lib/hooks/useUserEndpoints"
import { 
  Database, 
  Activity, 
  Clock, 
  TrendingUp,
  Eye,
  Server
} from "lucide-react"

interface DashboardOverviewProps {
  endpoints: UserEndpoint[]
  isLoading?: boolean
}

export function DashboardOverview({ endpoints, isLoading = false }: DashboardOverviewProps) {
  // Generate mock data for demo purposes
  const mockChartData = [
    { name: 'Mon', value: 45 },
    { name: 'Tue', value: 67 },
    { name: 'Wed', value: 52 },
    { name: 'Thu', value: 89 },
    { name: 'Fri', value: 76 },
    { name: 'Sat', value: 34 },
    { name: 'Sun', value: 58 }
  ]

  const mockActivities = generateMockActivities(15)
  // Calculate KPI metrics - using static values to avoid hydration mismatches
  const activeEndpoints = endpoints.filter(e => new Date(e.expires_at) > new Date()).length
  const totalRequests = 8432 // Static value to avoid hydration mismatch
  const avgResponseTime = 127 // Static value to avoid hydration mismatch
  const uptimePercentage = 99.8

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Endpoints"
          value={isLoading ? "..." : activeEndpoints}
          icon={Database}
          trend={{
            value: 12,
            label: "from last month",
            isPositive: true
          }}
          isLoading={isLoading}
        />
        <KPICard
          title="Total Requests"
          value={isLoading ? "..." : totalRequests.toLocaleString()}
          icon={Activity}
          trend={{
            value: 8.2,
            label: "from yesterday",
            isPositive: true
          }}
          isLoading={isLoading}
        />
        <KPICard
          title="Avg Response Time"
          value={isLoading ? "..." : `${avgResponseTime}ms`}
          icon={Clock}
          trend={{
            value: 5.3,
            label: "improvement",
            isPositive: true
          }}
          isLoading={isLoading}
        />
        <KPICard
          title="Uptime"
          value={isLoading ? "..." : `${uptimePercentage}%`}
          icon={Server}
          description="Last 30 days"
          isLoading={isLoading}
        />
      </div>

 {/* Endpoint Monitoring Table */}
      <EndpointTable 
        endpoints={endpoints}
        isLoading={isLoading}
      />

      {/* Charts and Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Volume Chart */}
        <div className="lg:col-span-2">
          <MetricsChart
            title="Request Volume"
            description="API requests over the last 7 days"
            data={mockChartData}
            type="area"
            color="#3b82f6"
            isLoading={isLoading}
          />
        </div>

        {/* Activity Feed */}
        <ActivityFeed 
          activities={mockActivities}
          isLoading={isLoading}
        />
      </div>

     
    </div>
  )
}
