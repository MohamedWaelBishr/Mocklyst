"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Clock, 
  Radio, 
  Filter, 
  Search, 
  ExternalLink, 
  MapPin, 
  Smartphone,
  Pause,
  Play,
  Download
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"

interface LiveRequestItem {
  id: string
  endpoint: string
  method: string
  statusCode: number
  timestamp: Date
  responseTime: number
  userAgent?: string
  ip?: string
  country?: string
  city?: string
  size?: number
}

interface LiveRequestFeedProps {
  requests?: LiveRequestItem[]
  isLoading?: boolean
  className?: string
  maxItems?: number
}

export function LiveRequestFeed({ 
  requests = [], 
  isLoading = false, 
  className,
  maxItems = 20
}: LiveRequestFeedProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string>("ALL");
  const [liveRequests, setLiveRequests] = useState<LiveRequestItem[]>([]);

  // Mock real-time data generation
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const newRequest: LiveRequestItem = generateMockRequest();
      setLiveRequests(prev => [newRequest, ...prev.slice(0, maxItems - 1)]);
    }, Math.random() * 3000 + 2000); // Random interval between 2-5 seconds

    return () => clearInterval(interval);
  }, [isPaused, maxItems]);

  // Use provided requests or generated ones
  const displayRequests = requests.length > 0 ? requests : liveRequests;

  // Filter requests based on search and method
  const filteredRequests = useMemo(() => {
    return displayRequests.filter(request => {
      const matchesSearch = request.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.ip?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.country?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesMethod = selectedMethod === "ALL" || request.method === selectedMethod;
      
      return matchesSearch && matchesMethod;
    });
  }, [displayRequests, searchTerm, selectedMethod]);

  const getStatusBadgeVariant = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return "default"
    if (statusCode >= 400 && statusCode < 500) return "secondary"
    return "destructive"
  }

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'POST': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'PUT': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'DELETE': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'PATCH': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getResponseTimeColor = (responseTime: number) => {
    if (responseTime < 100) return "text-green-600 dark:text-green-400"
    if (responseTime < 300) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const methods = ["ALL", "GET", "POST", "PUT", "DELETE", "PATCH"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className={cn("shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center space-x-2">
                <Radio className={cn("w-5 h-5", isPaused ? "text-gray-400" : "text-green-500 animate-pulse")} />
                <span>Live Request Feed</span>
                {!isPaused && (
                  <Badge variant="outline" className="text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
                    LIVE
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Real-time API requests • {filteredRequests.length} requests
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center space-x-1"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                <span>{isPaused ? "Resume" : "Pause"}</span>
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search endpoints, IPs, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <div className="flex bg-muted rounded-lg p-1">
                {methods.map((method) => (
                  <Button
                    key={method}
                    variant={selectedMethod === method ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedMethod(method)}
                    className="h-7 px-2 text-xs"
                  >
                    {method}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Request List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 rounded-lg border">
                    <div className="w-12 h-6 bg-muted animate-pulse rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="w-16 h-6 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-8">
                <Radio className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {searchTerm || selectedMethod !== "ALL" ? "No requests match your filters" : "No recent requests"}
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="group flex items-center justify-between p-3 rounded-lg border bg-background/50 hover:bg-background/80 transition-all"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <Badge 
                        variant="outline" 
                        className={cn("font-mono text-xs", getMethodColor(request.method))}
                      >
                        {request.method}
                      </Badge>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                            {request.endpoint}
                          </p>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        
                        <div className="flex items-center space-x-3 text-xs text-muted-foreground mt-1">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDistanceToNow(request.timestamp, { addSuffix: true })}</span>
                          </div>
                          
                          {request.ip && (
                            <div className="flex items-center space-x-1">
                              <Smartphone className="w-3 h-3" />
                              <span>{request.ip}</span>
                            </div>
                          )}
                          
                          {request.country && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{request.country}</span>
                            </div>
                          )}
                          
                          <span className={getResponseTimeColor(request.responseTime)}>
                            {request.responseTime}ms
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusBadgeVariant(request.statusCode)} className="text-xs">
                        {request.statusCode}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
          
          {/* Live Stats */}
          {!isPaused && filteredRequests.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-medium text-green-700 dark:text-green-300">
                    Live Monitoring Active
                  </span>
                </div>
                <span className="text-green-600 dark:text-green-400">
                  {filteredRequests.length} requests captured
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Mock request generator for demo purposes
const generateMockRequest = (): LiveRequestItem => {
  const endpoints = [
    '/api/users', '/api/products', '/api/orders', '/api/auth', '/api/posts',
    '/api/comments', '/api/categories', '/api/settings', '/api/analytics', '/api/reports'
  ];
  
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  const statusCodes = [200, 201, 400, 401, 404, 500];
  const countries = ['United States', 'United Kingdom', 'Germany', 'France', 'Japan', 'Canada'];
  const cities = ['New York', 'London', 'Berlin', 'Paris', 'Tokyo', 'Toronto'];
  
  const randomEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  const randomMethod = methods[Math.floor(Math.random() * methods.length)];
  const randomStatus = statusCodes[Math.floor(Math.random() * statusCodes.length)];
  const randomCountry = countries[Math.floor(Math.random() * countries.length)];
  const randomCity = cities[Math.floor(Math.random() * cities.length)];
  
  return {
    id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    endpoint: randomEndpoint,
    method: randomMethod,
    statusCode: randomStatus,
    timestamp: new Date(),
    responseTime: Math.floor(Math.random() * 500) + 50,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    country: randomCountry,
    city: randomCity,
    size: Math.floor(Math.random() * 10000) + 500
  };
};
