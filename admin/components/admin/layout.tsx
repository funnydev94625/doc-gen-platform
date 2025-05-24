"use client"

import React, { type ReactNode, useEffect } from "react"
import AdminSidebar from "@/components/admin/sidebar"
import AdminHeader from "@/components/admin/header"
import { useAuth } from "@/context/AuthContext"
import { usePathname, useRouter } from "next/navigation"

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { user, navshow } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!(user && user.email) && !pathname.startsWith('/auth'))
            router.push('/auth/signin')
    }, [user, pathname, router])

    if (!(user && user.email))
        return null

    return (
        <>
            {
                navshow ?
                    <div className="flex">
                        <AdminSidebar />
                        <div className="flex-1">
                            <AdminHeader />
                            <main className="p-6">{children}</main>
                        </div>
                    </div>
                    : <div>{children}</div>
            }
        </>
    )
}
