"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, FileText, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TermlyLogo } from "@/components/termly-logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { isAdmin, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => console.log(isAdmin), 1000)
    if (user && !isAdmin) {
      router.push("/")
    }
    return () => { }
  }, [])
  if (pathname.startsWith('/admin/templates/add'))
    return <div>{ children }</div>
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center px-4 py-2">
              <span className="ml-2 text-xl font-bold">Doc Gen Admin</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin"}>
                  <Link href="/admin">
                    <LayoutDashboard className="h-5 w-5 mr-3" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/users"}>
                  <Link href="/admin/users">
                    <Users className="h-5 w-5 mr-3" />
                    <span>User Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/templates"}>
                  <Link href="/admin/templates">
                    <FileText className="h-5 w-5 mr-3" />
                    <span>Template Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/settings"}>
                  <Link href="/admin/settings">
                    <Settings className="h-5 w-5 mr-3" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <LogOut className="h-5 w-5 mr-3" />
                    <span>Exit Admin</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col w-full">
          <header className="border-b bg-white">
            <div className="flex h-16 items-center px-6">
              <SidebarTrigger />
              <div className="ml-auto flex items-center space-x-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/">View Site</Link>
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">A</div>
                  <span className="text-sm font-medium">Admin User</span>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
