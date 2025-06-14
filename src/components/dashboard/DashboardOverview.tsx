"use client"

import { motion } from "framer-motion"
import { KPIGrid } from "./analytics/KPIGrid";
import { ResponseTimeChart } from "./analytics/ResponseTimeChart";
import { RequestVolumeChart } from "./analytics/RequestVolumeChart";
import { StatusDistributionChart } from "./analytics/StatusDistributionChart";
import { LiveRequestFeed } from "./analytics/LiveRequestFeed";
import { EndpointTable } from "./monitoring/EndpointTable";
import { UserEndpoint } from "@/lib/hooks/useUserEndpoints";
import { useState } from "react";

interface DashboardOverviewProps {
  endpoints: UserEndpoint[];
  isLoading?: boolean;
}

export function DashboardOverview({
  endpoints,
  isLoading = false,
}: DashboardOverviewProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "monitoring" | "analytics"
  >("overview");

  return (
    <div className="space-y-6">
      {/* Enhanced KPI Cards */}
      <KPIGrid endpoints={endpoints} isLoading={isLoading} className="mb-8" />

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "overview"
              ? "bg-background shadow-sm"
              : "hover:bg-background/50"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("monitoring")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "monitoring"
              ? "bg-background shadow-sm"
              : "hover:bg-background/50"
          }`}
        >
          Monitoring
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "analytics"
              ? "bg-background shadow-sm"
              : "hover:bg-background/50"
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Endpoint Monitoring Table */}
          <EndpointTable endpoints={endpoints} isLoading={isLoading} />

          {/* Charts and Activity Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Request Volume Chart */}
            <div className="lg:col-span-2">
              <RequestVolumeChart isLoading={isLoading} />
            </div>

            {/* Live Activity Feed */}
            <LiveRequestFeed isLoading={isLoading} />
          </div>
        </motion.div>
      )}

      {activeTab === "monitoring" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Performance Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ResponseTimeChart isLoading={isLoading} />
            <StatusDistributionChart isLoading={isLoading} />
          </div>{" "}
          {/* Detailed Endpoint Table */}
          <EndpointTable endpoints={endpoints} isLoading={isLoading} />
        </motion.div>
      )}

      {activeTab === "analytics" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Analytics Grid */}
          <div className="grid grid-cols-1 gap-6">
            <RequestVolumeChart
              isLoading={isLoading}
              className="col-span-full"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResponseTimeChart isLoading={isLoading} />
              <StatusDistributionChart isLoading={isLoading} />
            </div>
          </div>

          {/* Live Feed */}
          <LiveRequestFeed isLoading={isLoading} maxItems={50} />
        </motion.div>
      )}
    </div>
  );
}
