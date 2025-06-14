"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { UserEndpoint } from "@/lib/hooks/useUserEndpoints"
import { 
  Database, 
  Search, 
  ArrowUpDown, 
  ExternalLink, 
  Activity,
  Clock,
  TrendingUp
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface EndpointTableProps {
  endpoints: UserEndpoint[]
  isLoading?: boolean
}

export function EndpointTable({ endpoints, isLoading = false }: EndpointTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof UserEndpoint>("updated_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Helper function to safely get endpoint name
  const getEndpointName = (endpoint: UserEndpoint) => {
    try {
      const config =
        typeof endpoint.config === "string"
          ? JSON.parse(endpoint.config)
          : endpoint.config;
      return config?.name || endpoint.endpoint || endpoint.id;
    } catch {
      return endpoint.endpoint || endpoint.id;
    }
  };

  // Filter endpoints based on search term
  const filteredEndpoints = endpoints.filter((endpoint) => {
    const name = getEndpointName(endpoint);
    const endpointUrl = endpoint.endpoint || "";
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpointUrl.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort endpoints
  const sortedEndpoints = [...filteredEndpoints].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof UserEndpoint) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getStatusBadge = (endpoint: UserEndpoint) => {
    const isExpired = new Date(endpoint.expires_at) < new Date();
    return (
      <Badge variant={isExpired ? "destructive" : "default"}>
        {isExpired ? "Expired" : "Active"}
      </Badge>
    );
  };
  const getRequestCount = (endpoint: UserEndpoint) => {
    // Static request count to avoid hydration mismatch
    return endpoint.hits;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Endpoint Monitoring</span>
              </CardTitle>
              <CardDescription>
                Monitor performance and usage of your API endpoints
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search endpoints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : sortedEndpoints.length === 0 ? (
            <div className="text-center py-8">
              <Database className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-2">
                {searchTerm
                  ? "No endpoints match your search"
                  : "No endpoints found"}
              </p>
              {searchTerm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("endpoint")}
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                      >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>{" "}
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("updated_at")}
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                      >
                        Requests/Day
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("updated_at")}
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                      >
                        Last Updated
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>{" "}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedEndpoints.map((endpoint) => (
                    <TableRow key={endpoint.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">
                            {getEndpointName(endpoint)}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {endpoint.endpoint}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(endpoint)}</TableCell>{" "}
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-muted-foreground" />
                          <span>{getRequestCount(endpoint)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {formatDistanceToNow(
                              new Date(endpoint.updated_at),
                              { addSuffix: true }
                            )}
                          </span>
                        </div>
                      </TableCell>{" "}
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <a
                            href={endpoint.endpoint}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>View</span>
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
