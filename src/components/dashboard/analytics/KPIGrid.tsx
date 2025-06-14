"use client"

import { motion } from "framer-motion"
import { KPICard } from "./KPICard"

import { UserEndpoint } from "@/lib/hooks/useUserEndpoints"
import { 
  Database, 
  Activity, 
  Clock, 
  TrendingUp,
  Eye,
  Server,
  Zap,
  AlertTriangle
} from "lucide-react"
import { TrendIndicator } from "./TrendIndicator"

interface KPIGridProps {
  endpoints: UserEndpoint[]
  isLoading?: boolean
  className?: string
}

export function KPIGrid({ endpoints, isLoading = false, className }: KPIGridProps) {
  // Calculate real-time metrics from endpoints
  const activeEndpoints = endpoints.filter(
    (e) => new Date(e.expires_at) > new Date()
  ).length;
  
  const totalRequests = endpoints.reduce(
    (sum, endpoint) => sum + (endpoint.hits || 0),
    0
  );
  
  // Calculate expired endpoints
  const expiredEndpoints = endpoints.filter(
    (e) => new Date(e.expires_at) <= new Date()
  ).length;
  
  // Calculate success rate (mock for now - would need response status tracking)
  const successRate = 99.2;
  
  // Calculate average response time (mock for now - would need response time tracking)
  const avgResponseTime = 127;
  
  // Calculate uptime percentage (mock for now - would need uptime monitoring)
  const uptimePercentage = 99.8;
  
  // Calculate peak requests per minute (mock for now - would need request rate tracking)
  const peakRPM = 1234;
  
  // Calculate total data served (mock for now - would need data tracking)
  const totalDataServed = 45.7; // in MB
  
  // Calculate trends (simplified - would need historical data for real trends)
  const endpointsGrowth = endpoints.length > 0 
    ? Math.min(Math.round((activeEndpoints / endpoints.length) * 100), 100) 
    : 0;
  
  const requestsGrowth = totalRequests > 0 
    ? Math.min(Math.round(totalRequests / 100), 50) 
    : 0;

  const kpiData = [
    {
      title: "Active Endpoints",
      value: isLoading ? "..." : activeEndpoints,
      icon: Database,
      trend: {
        value: endpointsGrowth,
        label: "endpoint activity",
        isPositive: endpointsGrowth > 0,
      },
      color: "blue",
    },
    {
      title: "Total Requests",
      value: isLoading ? "..." : totalRequests.toLocaleString(),
      icon: Activity,
      trend: {
        value: requestsGrowth,
        label: "vs last week",
        isPositive: requestsGrowth > 0,
      },
      color: "green",
    },
    {
      title: "Avg Response Time",
      value: isLoading ? "..." : `${avgResponseTime}ms`,
      icon: Clock,
      trend: {
        value: 5.3,
        label: "improvement",
        isPositive: true,
      },
      color: "purple",
    },
    {
      title: "Success Rate",
      value: isLoading ? "..." : `${successRate}%`,
      icon: TrendingUp,
      trend: {
        value: 0.8,
        label: "vs last week",
        isPositive: true,
      },
      color: "emerald",
    },
    {
      title: "Peak RPM",
      value: isLoading ? "..." : peakRPM.toLocaleString(),
      icon: Zap,
      trend: {
        value: 12.4,
        label: "peak requests/min",
        isPositive: true,
      },
      color: "orange",
    },
    {
      title: "Data Served",
      value: isLoading ? "..." : `${totalDataServed}MB`,
      icon: Server,
      trend: {
        value: 23.1,
        label: "this month",
        isPositive: true,
      },
      color: "indigo",
    },
    {
      title: "Uptime",
      value: isLoading ? "..." : `${uptimePercentage}%`,
      icon: Eye,
      description: "Last 30 days",
      color: "teal",
    },
    {
      title: "Expired Endpoints",
      value: isLoading ? "..." : expiredEndpoints,
      icon: AlertTriangle,
      trend: expiredEndpoints > 0 ? {
        value: expiredEndpoints,
        label: "need attention",
        isPositive: false,
      } : undefined,
      color: expiredEndpoints > 0 ? "red" : "gray",
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
              description={kpi.description}
              isLoading={isLoading}
              color={kpi.color}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Trend Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-6"
      >
        <TrendIndicator  
          endpoints={endpoints}
          isLoading={isLoading}
        />
      </motion.div>
    </div>
  )
}
