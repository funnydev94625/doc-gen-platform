"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { TermlyLogo } from "@/components/termly-logo"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [newsletter, setNewsletter] = useState(false)
  const [error, setError] = useState("")
  const { signup, user, isLoading, isAdmin } = useAuth()
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      if (isAdmin) {
        router.push("/admin")
      } else {
        router.push("/")
      }
    }
  }, [user, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    signup(name, email, password)
      .then((result) => {
        if (!result.success) {
          setError(result.message)
        }
        // Redirect is handled in the signup function and useEffect
      })
      .catch((err) => {
        setError(err.message || "Failed to create account. Please try again.")
      })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create your Doc Gen account</h1>
          <p className="text-sm text-muted-foreground">Finish signing up and take the next step towards compliance</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <Button variant="outline" className="bg-white">
            <svg
              className="mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Sign up with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Sign up with email</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">Use an email with "admin" to create an admin account</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="newsletter" checked={newsletter} onCheckedChange={(checked) => setNewsletter(!!checked)} />
            <label
              htmlFor="newsletter"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Send me Doc Gem news, feature updates, discounts, and offers
            </label>
          </div>

          <Button className="w-full bg-teal-400 hover:bg-teal-500 text-white" type="submit" disabled={isLoading}>
            {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </Button>

          <p className="text-xs text-muted-foreground">
            By signing up, I agree to Doc Gen&apos;s{" "}
            <Link href="#" className="text-blue-500 hover:text-blue-600">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-blue-500 hover:text-blue-600">
              Privacy Policy
            </Link>
          </p>

          <p className="text-xs text-muted-foreground">
            This site is protected by reCAPTCHA and the Google{" "}
            <Link href="#" className="text-blue-500 hover:text-blue-600">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-blue-500 hover:text-blue-600">
              Terms of Service
            </Link>{" "}
            apply.
          </p>
        </form>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:text-blue-600">
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
