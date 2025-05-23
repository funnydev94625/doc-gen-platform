"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Home, RefreshCw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // This is a global error component that completely replaces the page
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
          <div className="w-full max-w-md mx-auto text-center">
            {/* Logo */}
            <div className="inline-block mb-8">
              <Image
                src="/images/october-security-logo.png"
                alt="October Security"
                width={180}
                height={50}
                className="h-12 w-auto"
                priority
              />
            </div>

            {/* Error Code */}
            <h1 className="text-9xl font-bold text-red-600 dark:text-red-400 mb-4">Oops!</h1>

            {/* Error Message */}
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Critical Error
            </h2>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              A critical error has occurred. We've been notified and are working to fix the issue.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => reset()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>

              <Button
                asChild
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <a href="/">
                  <Home className="h-4 w-4" />
                  Return Home
                </a>
              </Button>
            </div>

            {/* Support Link */}
            <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              Need help? <a href="/contact" className="text-blue-600 hover:underline dark:text-blue-400">Contact support</a>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} October Security. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}
