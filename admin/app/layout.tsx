"use client"

import type { ReactNode } from "react"
import { AuthProvider } from "@/context/AuthContext"
import { usePathname } from "next/navigation"
import { Inter } from "next/font/google"
import './globals.css'
import AdminLayout from "@/components/admin/layout"
import "bootstrap/dist/css/bootstrap.css";
import "react-summernote/dist/react-summernote.css";

const inter = Inter({ subsets: ["latin"] })

// Metadata for the admin portal
// export const metadata = {
//   title: "Admin Portal | October Security",
//   description: "Secure policy management platform for enterprise organizations",
//   icons: {
//     icon: "/favicon.ico",
//     apple: "/apple-touch-icon.png",
//   },
// }


export default function Layout({ children }: { children: ReactNode }) {

  const pathname = usePathname()
  const hideBar = pathname.startsWith('/auth') || pathname.startsWith('/policies/')

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1E40AF" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <AuthProvider>
            {
              hideBar ? <>{children}</> :
                <AdminLayout>
                  {children}
                </AdminLayout>
            }
          </AuthProvider>
        </div>
      </body>
    </html>
  )
}
