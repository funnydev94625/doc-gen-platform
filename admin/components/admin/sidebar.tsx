"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, FileText, ShoppingCart, Settings, HelpCircle, LogOut } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  const isActive = (path: string) => {
    if (pathname !== path && path === "/admin") return false
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/users", icon: Users, label: "Users" },
    { href: "/policies", icon: FileText, label: "Policies" },
    { href: "/sales", icon: ShoppingCart, label: "Sales" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <div className="w-64 bg-white border-r min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold">Admin Portal</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive(item.href) ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t space-y-1">
        <Link
          href="/help"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <HelpCircle className="h-5 w-5" />
          <span>Help & Support</span>
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  )
}

