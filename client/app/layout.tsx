"use client"

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { usePathname } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { AuthProvider } from "@/context/AuthContext"
import "./globals.css"
import path from "path"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const showheadefooter = !pathname.startsWith('/auth') && !pathname.startsWith('/admin') && !pathname.startsWith('/verify-email') && !pathname.startsWith('/policies/edit') && !pathname.startsWith('/policies/view')
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <AuthProvider>
              {showheadefooter && <Header />}
              <main className="flex-1 shadow-[0_0_15px_rgba(0,0,0,0.05)]">{children}</main>
              {showheadefooter && <Footer />}
            </AuthProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

