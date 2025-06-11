"use client"

import { motion } from "framer-motion"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { useAuthUser } from "@/lib/stores/auth-store"
import { useUserEndpoints } from "@/lib/hooks/useUserEndpoints"
import { EndpointCard } from "@/components/dashboard/EndpointCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Shield, Calendar, Mail, Plus, RefreshCw, Database } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

function DashboardContent() {
  const user = useAuthUser()
  const { endpoints, loading, error, refetch } = useUserEndpoints()

  const handleRefresh = async () => {
    try {
      await refetch()
      toast.success("Endpoints refreshed!")
    } catch (err) {
      console.log("🚀 ~ handleRefresh ~ err:", err)
      toast.error("Failed to refresh endpoints")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome to your Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your mock API endpoints and account settings.
          </p>
        </motion.div>        <div className="space-y-6">
          {/* Top Row - User Info and Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Account Info</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <Badge variant={user?.emailConfirmed ? "default" : "secondary"}>
                      {user?.emailConfirmed ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Endpoint
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleRefresh}
                    disabled={loading}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Endpoints
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/auth/verify">
                      <User className="w-4 h-4 mr-2" />
                      Account Settings
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>{/* Mock Endpoints Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2"
          >
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Database className="w-5 h-5" />
                      <span>Mock Endpoints</span>
                    </CardTitle>
                    <CardDescription>Your created API endpoints</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      disabled={loading}
                      className="flex items-center space-x-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/" className="flex items-center space-x-2">
                        <Plus className="w-4 h-4" />
                        <span>Create New</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Loading endpoints...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-destructive mb-2">Error loading endpoints</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2">
                      Try Again
                    </Button>
                  </div>
                ) : endpoints.length === 0 ? (
                  <div className="text-center py-8">
                    <Database className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2">No endpoints created yet</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create your first mock API endpoint to get started
                    </p>
                    <Button asChild>
                      <Link href="/" className="flex items-center space-x-2">
                        <Plus className="w-4 h-4" />
                        <span>Create Your First Endpoint</span>
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {endpoints.length} endpoint{endpoints.length !== 1 ? 's' : ''} found
                      </p>
                    </div>                    <div className="grid gap-4">
                      {endpoints.slice(0, 3).map((endpoint, index) => (
                        <EndpointCard 
                          key={endpoint.id} 
                          endpoint={endpoint} 
                          index={index} 
                          onDelete={refetch}
                        />
                      ))}
                      {endpoints.length > 3 && (
                        <div className="text-center pt-4">
                          <p className="text-sm text-muted-foreground mb-2">
                            And {endpoints.length - 3} more endpoint{endpoints.length - 3 !== 1 ? 's' : ''}...
                          </p>
                          <Button variant="outline" size="sm">
                            View All Endpoints
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>          {/* Quick Actions Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Endpoint
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh Endpoints
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/auth/verify">
                    <User className="w-4 h-4 mr-2" />
                    Account Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth={true} requireEmailVerified={true}>
      <DashboardContent />
    </AuthGuard>
  )
}
