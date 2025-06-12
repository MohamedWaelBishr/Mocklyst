"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  User, 
  LogOut, 
  Settings, 
  Mail, 
  Shield,
  ChevronDown,
  UserCircle
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { 
  useAuthStore, 
  useAuthUser, 
  useIsAuthenticated, 
  useIsEmailVerified,
  useAuthLoading
} from "@/lib/stores/auth-store"

export function UserNav() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { signOut } = useAuthStore()
  const user = useAuthUser()
  const isAuthenticated = useIsAuthenticated()
  const isEmailVerified = useIsEmailVerified()
  const loading = useAuthLoading()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Signed out successfully")
      router.push("/")
    } catch (error) {
      console.log("🚀 ~ handleSignOut ~ error:", error)
      toast.error("Failed to sign out")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/auth/signup">Sign Up</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-medium truncate max-w-32">
          {user?.email}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
          >
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <UserCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {user?.email}
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    {isEmailVerified ? (
                      <>
                        <Shield className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600 dark:text-green-400">
                          Verified
                        </span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-3 h-3 text-orange-500" />
                        <span className="text-xs text-orange-600 dark:text-orange-400">
                          Unverified
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2">
              {!isEmailVerified && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950"
                  onClick={() => {
                    router.push("/auth/verify")
                    setIsOpen(false)
                  }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Verify Email
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  router.push("/settings")
                  setIsOpen(false)
                }}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                onClick={() => {
                  handleSignOut()
                  setIsOpen(false)
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
