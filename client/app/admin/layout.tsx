"use client"

import { useEffect, type ReactNode } from "react"
import AdminSidebar from "@/components/admin/sidebar"
import AdminHeader from "@/components/admin/header"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, logout, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log(loading)
    // setTimeout(() => console.log(user?.isAdmin), 1000)

    if (loading)
      return
    if (user && !user.isAdmin) {
      router.push("/")
    }
    return () => { }
  }, [loading])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1">
          <AdminHeader />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
