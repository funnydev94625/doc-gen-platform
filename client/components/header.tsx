"use client"

import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="/images/october-security-logo.png"
              alt="October Security"
              width={140}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Homepage
            </Link>
            <Link href="/policies" className="text-sm font-medium hover:text-primary transition-colors">
              Included Policies
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact Us
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          
          {isAuthenticated ? (
            <>
              {/* <Link href={user?.isAdmin ? "/admin" : "/dashboard"}> */}
                <Button variant="ghost" size="sm">
                  {user?.name || "Dashboard"}
                </Button>
              {/* </Link> */}
              <Button variant="outline" size="sm" onClick={logout}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/checkout">
                <Button size="sm">Buy Now</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

