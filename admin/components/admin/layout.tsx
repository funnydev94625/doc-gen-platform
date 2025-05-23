"use client"

import React, { type ReactNode, useEffect } from "react"
import AdminSidebar from "@/components/admin/sidebar"
import AdminHeader from "@/components/admin/header"
import { useAuth } from "@/context/AuthContext"
import { usePathname, useRouter } from "next/navigation"

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    // Check if the current page is an error page
    // Check both the pathname and component type
    const isErrorPage = pathname === '/error' ||
                      pathname === '/not-found' ||
                      pathname === '/_error' ||
                      // Also check component type for dynamically rendered error pages
                      React.Children.toArray(children).some(child => {
                          if (React.isValidElement(child)) {
                              const childType = child.type as any
                              return childType.name === 'Error' || childType.name === 'NotFound'
                          }
                          return false
                      })

    useEffect(() => {
        if (!(user && user.email) && !pathname.startsWith('/auth'))
            router.push('/auth/signin')
    }, [user, pathname, router])

    if (!(user && user.email))
        return null

    // If this is an error page, don't show the layout
    if (isErrorPage) {
        return <>{children}</>
    }

    // Normal layout for regular pages
    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex-1">
                <AdminHeader />
                <main className="p-6">{children}</main>
            </div>
        </div>
    )

    // return (
    //     <>
    //         {
    //             navshow ?
    //                 <div className="flex">
    //                     <AdminSidebar />
    //                     <div className="flex-1">
    //                         <AdminHeader />
    //                         <main className="p-6">{children}</main>
    //                     </div>
    //                 </div>
    //                 : <div>{children}</div>
    //         }
    //     </>
    // )
}
