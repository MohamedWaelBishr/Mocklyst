"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  description?: string;
  isLoading?: boolean;
  color?: string;
  onClick?: () => void;
}

export function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  isLoading = false,
  color = "blue",
  onClick,
}: KPICardProps) {
  const getColorClasses = (color: string) => {
    const colorMap: Record<
      string,
      { ring: string; gradient: string; icon: string }
    > = {
      blue: {
        ring: "hover:ring-blue-200 dark:hover:ring-blue-800",
        gradient:
          "hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-950 dark:hover:to-blue-900",
        icon: "text-blue-600 dark:text-blue-400",
      },
      green: {
        ring: "hover:ring-green-200 dark:hover:ring-green-800",
        gradient:
          "hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 dark:hover:from-green-950 dark:hover:to-green-900",
        icon: "text-green-600 dark:text-green-400",
      },
      purple: {
        ring: "hover:ring-purple-200 dark:hover:ring-purple-800",
        gradient:
          "hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100 dark:hover:from-purple-950 dark:hover:to-purple-900",
        icon: "text-purple-600 dark:text-purple-400",
      },
      orange: {
        ring: "hover:ring-orange-200 dark:hover:ring-orange-800",
        gradient:
          "hover:bg-gradient-to-br hover:from-orange-50 hover:to-orange-100 dark:hover:from-orange-950 dark:hover:to-orange-900",
        icon: "text-orange-600 dark:text-orange-400",
      },
      red: {
        ring: "hover:ring-red-200 dark:hover:ring-red-800",
        gradient:
          "hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100 dark:hover:from-red-950 dark:hover:to-red-900",
        icon: "text-red-600 dark:text-red-400",
      },
      emerald: {
        ring: "hover:ring-emerald-200 dark:hover:ring-emerald-800",
        gradient:
          "hover:bg-gradient-to-br hover:from-emerald-50 hover:to-emerald-100 dark:hover:from-emerald-950 dark:hover:to-emerald-900",
        icon: "text-emerald-600 dark:text-emerald-400",
      },
      indigo: {
        ring: "hover:ring-indigo-200 dark:hover:ring-indigo-800",
        gradient:
          "hover:bg-gradient-to-br hover:from-indigo-50 hover:to-indigo-100 dark:hover:from-indigo-950 dark:hover:to-indigo-900",
        icon: "text-indigo-600 dark:text-indigo-400",
      },
      teal: {
        ring: "hover:ring-teal-200 dark:hover:ring-teal-800",
        gradient:
          "hover:bg-gradient-to-br hover:from-teal-50 hover:to-teal-100 dark:hover:from-teal-950 dark:hover:to-teal-900",
        icon: "text-teal-600 dark:text-teal-400",
      },
      gray: {
        ring: "hover:ring-gray-200 dark:hover:ring-gray-800",
        gradient:
          "hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-950 dark:hover:to-gray-900",
        icon: "text-gray-600 dark:text-gray-400",
      },
    };
    return colorMap[color] || colorMap.blue;
  };

  const colorClasses = getColorClasses(color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <Card
        className={cn(
          "shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm transition-all duration-300",
          "hover:shadow-xl hover:ring-2 hover:ring-offset-2 dark:hover:ring-offset-slate-900",
          colorClasses.ring,
          colorClasses.gradient,
          onClick && "cursor-pointer"
        )}
        onClick={onClick}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {title}
          </CardTitle>
          <div className="relative">
            <Icon
              className={cn(
                "h-5 w-5 transition-all duration-300 group-hover:scale-110",
                colorClasses.icon
              )}
            />
            {!isLoading && (
              <motion.div
                className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"
                style={{ backgroundColor: "currentColor" }}
                initial={false}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
        </CardHeader>{" "}
        <CardContent>
          <div className="space-y-2">
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-8 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              </div>
            ) : (
              <>
                <motion.div
                  className="text-2xl font-bold group-hover:text-3xl transition-all duration-300"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {value}
                </motion.div>

                {trend && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center space-x-2"
                  >
                    <Badge
                      variant={trend.isPositive ? "default" : "destructive"}
                      className="text-xs flex items-center space-x-1"
                    >
                      {trend.isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>
                        {trend.isPositive ? "+" : ""}
                        {trend.value}%
                      </span>
                    </Badge>
                    <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                      {trend.label}
                    </p>
                  </motion.div>
                )}

                {description && (
                  <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                    {description}
                  </p>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
