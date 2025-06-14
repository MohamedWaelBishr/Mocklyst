"use client"

import { motion } from "framer-motion"
import { KPICard } from "./KPICard"
import { useKPIAnalytics } from "@/hooks/useAnalytics";
import { UserEndpoint } from "@/lib/hooks/useUserEndpoints";
import {
  Database,
  Activity,
  Clock,
  TrendingUp,
  Eye,
  Server,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { TrendIndicator } from "./TrendIndicator";

interface KPIGridProps {
  endpoints: UserEndpoint[];
  isLoading?: boolean;
  className?: string;
}

export function KPIGrid({
  endpoints,
  isLoading = false,
  className,
}: KPIGridProps) {
  // Fetch real analytics data
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error,
  } = useKPIAnalytics();

  // Calculate fallback metrics from endpoints if analytics data isn't available
  const activeEndpoints = endpoints.filter(
    (e) => new Date(e.expires_at) > new Date()
  ).length;

  const totalRequestsFallback = endpoints.reduce(
    (sum, endpoint) => sum + (endpoint.hits || 0),
    0
  );

  // Calculate expired endpoints
  const expiredEndpoints = endpoints.filter(
    (e) => new Date(e.expires_at) <= new Date()
  ).length;

  // Use real data if available, otherwise use fallback values
  const displayLoading = isLoading || analyticsLoading;
  const avgResponseTime = analyticsData?.avgResponseTime || 0;
  const avgResponseTimeTrend = analyticsData?.avgResponseTimeTrend || 0;
  const successRate = analyticsData?.successRate || 100;
  const successRateTrend = analyticsData?.successRateTrend || 0;
  const peakRPM = analyticsData?.peakRpm || 0;
  const uptimePercentage = analyticsData?.uptimePercentage || 100;
  const totalRequests = analyticsData?.totalRequests || totalRequestsFallback;

  // Calculate total data served (estimated from request count)
  const totalDataServed =
    Math.round(((totalRequests * 0.5) / 1000) * 100) / 100; // Rough estimate: 0.5KB per request

  // Calculate trends for display
  const endpointsGrowth =
    endpoints.length > 0
      ? Math.min(Math.round((activeEndpoints / endpoints.length) * 100), 100)
      : 0;

  const kpiCards = [
    {
      title: "Active Endpoints",
      value: displayLoading ? "..." : activeEndpoints,
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
      value: displayLoading ? "..." : totalRequests.toLocaleString(),
      icon: Activity,
      trend: {
        value: Math.abs(avgResponseTimeTrend),
        label: "this week",
        isPositive: totalRequests > 0,
      },
      color: "green",
    },
    {
      title: "Avg Response Time",
      value: displayLoading ? "..." : `${Math.round(avgResponseTime)}ms`,
      icon: Clock,
      trend: {
        value: Math.abs(avgResponseTimeTrend),
        label: avgResponseTimeTrend > 0 ? "improvement" : "slower",
        isPositive: avgResponseTimeTrend > 0,
      },
      color: "purple",
    },
    {
      title: "Success Rate",
      value: displayLoading ? "..." : `${Math.round(successRate)}%`,
      icon: TrendingUp,
      trend: {
        value: Math.abs(successRateTrend),
        label: "vs last week",
        isPositive: successRateTrend >= 0,
      },
      color: "emerald",
    },
    {
      title: "Peak RPM",
      value: displayLoading ? "..." : peakRPM.toLocaleString(),
      icon: Zap,
      trend: {
        value: peakRPM,
        label: "requests/min",
        isPositive: peakRPM > 0,
      },
      color: "orange",
    },
    {
      title: "Data Served",
      value: displayLoading ? "..." : `${totalDataServed}MB`,
      icon: Server,
      trend: {
        value: Math.round(totalDataServed * 10) / 10,
        label: "this period",
        isPositive: totalDataServed > 0,
      },
      color: "indigo",
    },
    {
      title: "Uptime",
      value: displayLoading ? "..." : `${Math.round(uptimePercentage)}%`,
      icon: Eye,
      description: "Last 30 days",
      color:
        uptimePercentage >= 99
          ? "teal"
          : uptimePercentage >= 95
          ? "yellow"
          : "red",
    },
    {
      title: "Expired Endpoints",
      value: displayLoading ? "..." : expiredEndpoints,
      icon: AlertTriangle,
      trend:
        expiredEndpoints > 0
          ? {
              value: expiredEndpoints,
              label: "need attention",
              isPositive: false,
            }
          : undefined,
      color: expiredEndpoints > 0 ? "red" : "gray",
    },
  ];

  // Show error state if analytics fails
  if (error && !displayLoading) {
    console.warn("Analytics data unavailable, using fallback values:", error);
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
            }}
          >
            <KPICard
              title={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              trend={kpi.trend}
              description={kpi.description}
              isLoading={displayLoading}
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
        <TrendIndicator endpoints={endpoints} isLoading={displayLoading} />
      </motion.div>
    </div>
  );
}
