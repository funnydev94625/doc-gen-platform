'use client'

import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "Termly - Privacy Policy Generator & Cookie Consent Solution",
//   description:
//     "Generate legally compliant privacy policies, terms of service, and cookie consent banners for your website.",
//     generator: 'v0.dev'
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              {!pathname.startsWith("/admin") && !pathname.startsWith('/auth') && <header className="border-b">
                <div className="flex h-16 items-center px-4 md:px-6 justify-between">
                  <MainNav />
                  <UserNav />
                </div>
              </header>}
              <main className="flex-1">{children}</main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
