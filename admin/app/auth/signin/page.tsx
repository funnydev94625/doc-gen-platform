"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { ErrorDisplay } from "@/components/ui/error-display"

import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  // Form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState({
    msg: "",
    email: false,
    password: false
  })
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Animation state
  const [fadeIn, setFadeIn] = useState(false)

  const { login, user } = useAuth()
  const router = useRouter()

  // Fade in animation on mount
  useEffect(() => {
    setFadeIn(true)
  }, [])

  // Check if user is already logged in
  useEffect(() => {
    if (user && user.email) {
      router.push('/')
    }
  }, [user, router])

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Form validation
  const validateForm = (): boolean => {
    let isValid = true
    setError({
      msg: "",
      email: false,
      password: false
    })

    if (!email.trim()) {
      setError({
        msg: "Email is required",
        email: true,
        password: false
      })
      isValid = false
    } else if (!validateEmail(email)) {
      setError({
        msg: "Please enter a valid email address",
        email: true,
        password: false
      })
      isValid = false
    }

    if (!password) {
      setError({
        msg: "Password is required",
        email: false,
        password: true
      })
      isValid = false
    }

    return isValid
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    setError({
      msg: "",
      email: false,
      password: false
    })

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await login(email, password)
    } catch (err: any) {
      console.log(err)
      setError({
        msg: typeof (err.message) === "string" ? err.message : "Failed to sign in",
        email: false,
        password: false
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 md:p-12">
        <div
          className={cn(
            "w-full max-w-md mx-auto transition-all duration-500 ease-in-out",
            fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6" aria-label="October Security - Home">
              <Image
                src="/images/october-security-logo.png"
                alt="October Security"
                width={180}
                height={50}
                className="h-12 w-auto"
                priority
              />
            </Link>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
              Admin Portal
            </h1>

            <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 mb-2">
              <ShieldCheck className="h-4 w-4 mr-1.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span>Enterprise-grade security platform</span>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Sign in to your account
            </h2>

            {/* Error Message */}
            <ErrorDisplay 
              message={error.msg}
              type="error"
              className="mb-4"
              onDismiss={() => setError({ msg: "", email: false, password: false })}
            />

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (formSubmitted) validateForm();
                    }}
                    className={cn(
                      "pl-10 bg-white dark:bg-gray-800 transition-all duration-200",
                      "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
                      error.email && "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
                    )}
                    placeholder="admin@example.com"
                    aria-invalid={!!error.email}
                    aria-describedby={error.email ? "email-error" : undefined}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Password
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (formSubmitted) validateForm();
                    }}
                    className={cn(
                      "pl-10 bg-white dark:bg-gray-800 transition-all duration-200",
                      "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
                      error.password && "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
                    )}
                    placeholder="••••••••"
                    aria-invalid={!!error.password}
                    aria-describedby={error.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Remember me
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Illustration/Background - Only visible on larger screens */}
      <div className="hidden lg:block relative w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-20"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
          <div className="max-w-md text-center">
            <div className="mb-8 inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <ShieldCheck className="h-12 w-12 text-white" aria-hidden="true" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Security Policy Management
            </h2>

            <p className="text-lg text-blue-100 mb-8">
              Centralized control for your organization's security policies and compliance requirements.
            </p>

            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <h3 className="font-medium text-white mb-1">Compliance Ready</h3>
                <p className="text-sm text-blue-100">NIST, ISO, and CIS aligned frameworks</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <h3 className="font-medium text-white mb-1">Customizable</h3>
                <p className="text-sm text-blue-100">Tailor to your organization's needs</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <h3 className="font-medium text-white mb-1">Centralized</h3>
                <p className="text-sm text-blue-100">Single source of truth for all policies</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <h3 className="font-medium text-white mb-1">Audit Ready</h3>
                <p className="text-sm text-blue-100">Comprehensive tracking and reporting</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-800 to-transparent"></div>
      </div>
    </div>
  )
}
