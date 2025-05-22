"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/auth/signin")
      } else if (adminOnly && !user?.isAdmin) {
        router.push("/dashboard")
      }
    }
  }, [loading, isAuthenticated, user, router, adminOnly])

  // Show loading state or nothing while checking authentication
  if (loading || !isAuthenticated || (adminOnly && !user?.isAdmin)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
      </div>
    )
  }

  return <>{children}</>
}