"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Lock, Building } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignUpPage() {
  const { user, register } = useAuth()
  const router = useRouter()
  const [userInfo, setUserInfo] = useState({
    "first-name": "",
    "last-name": "",
    company: "",
    email: "",
    password: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generalError, setGeneralError] = useState("")

  useEffect(() => {
    if (user) {
      if (user.isAdmin)
        router.push('/admin')
      else
        router.push('/')
    }
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserInfo({
      ...userInfo,
      [name]: value
    })
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    // First name validation
    if (!userInfo["first-name"].trim()) {
      newErrors["first-name"] = "First name is required"
    }
    
    // Last name validation
    if (!userInfo["last-name"].trim()) {
      newErrors["last-name"] = "Last name is required"
    }
    
    // Email validation
    if (!userInfo.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    
    // Password validation
    if (!userInfo.password) {
      newErrors.password = "Password is required"
    } else if (userInfo.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    
    // Terms validation
    if (!termsAccepted) {
      newErrors.terms = "You must accept the Terms of Service and Privacy Policy"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setGeneralError("")
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Prepare user data for registration
      const userData = {
        name: `${userInfo["first-name"]} ${userInfo["last-name"]}`,
        email: userInfo.email,
        password: userInfo.password,
        // company: userInfo.company
      }
      
      await register(userData)
      // If successful, the useEffect will handle redirection
    } catch (error: any) {
      setGeneralError(error.message || "Failed to create account. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Image */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 h-full w-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-500 via-blue-600 to-blue-700 overflow-hidden">
          {/* Abstract shapes */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white"></div>
            <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white"></div>
            <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-white"></div>
          </div>

          {/* Content */}
          <div className="relative flex h-full flex-col items-center justify-center p-12 text-white z-10">
            <div className="max-w-md">
              <div className="mb-8 flex items-center">
                <div className="p-3 bg-white rounded-xl mr-4">
                  <Image
                    src="/images/october-security-logo.png"
                    alt="October Security"
                    width={160}
                    height={50}
                    className="h-12 w-auto"
                  />
                </div>
              </div>

              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Build your <span className="text-blue-200">cybersecurity</span> program today
              </h2>

              <p className="text-blue-100 mb-10 text-lg">
                Join thousands of organizations using our CISO-developed policies to strengthen their security posture.
              </p>

              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 transition-all hover:bg-white/15">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                        <span className="text-lg font-bold">1</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-medium">Create your account</h3>
                      <p className="mt-2 text-blue-100">Sign up in less than 2 minutes and get started immediately</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 transition-all hover:bg-white/15">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                        <span className="text-lg font-bold">2</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-medium">Choose your policies</h3>
                      <p className="mt-2 text-blue-100">Select from our comprehensive suite of security policies</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 transition-all hover:bg-white/15">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                        <span className="text-lg font-bold">3</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-medium">Customize & implement</h3>
                      <p className="mt-2 text-blue-100">
                        Tailor policies to your organization's specific needs and maturity level
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-800 to-transparent"></div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex flex-col items-center">
            <Link href="/">
              <Image
                src="/images/october-security-logo.png"
                alt="October Security"
                width={180}
                height={50}
                className="h-12 w-auto"
              />
            </Link>
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight">Create your account</h2>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              Start building your cybersecurity program with CISO-developed policies
            </p>
          </div>

          <div className="mt-10">
            {generalError && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{generalError}</AlertDescription>
              </Alert>
            )}
            
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name" className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    First name
                  </Label>
                  <Input
                    id="first-name"
                    name="first-name"
                    type="text"
                    autoComplete="given-name"
                    required
                    className={`block w-full ${errors["first-name"] ? "border-red-500" : ""}`}
                    onChange={handleChange}
                    value={userInfo["first-name"]}
                  />
                  {errors["first-name"] && (
                    <p className="text-xs text-red-500 mt-1">{errors["first-name"]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name" className="flex items-center gap-1.5">Last name</Label>
                  <Input
                    id="last-name"
                    name="last-name"
                    type="text"
                    autoComplete="family-name"
                    required
                    className={`block w-full ${errors["last-name"] ? "border-red-500" : ""}`}
                    onChange={handleChange}
                    value={userInfo["last-name"]}
                  />
                  {errors["last-name"] && (
                    <p className="text-xs text-red-500 mt-1">{errors["last-name"]}</p>
                  )}
                </div>
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="company" className="flex items-center gap-1.5">
                  <Building className="h-4 w-4" />
                  Company
                </Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  required
                  className={`block w-full ${errors.company ? "border-red-500" : ""}`}
                  onChange={handleChange}
                  value={userInfo.company}
                />
                {errors.company && (
                  <p className="text-xs text-red-500 mt-1">{errors.company}</p>
                )}
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  required
                  className={`block w-full ${errors.email ? "border-red-500" : ""}`}
                  onChange={handleChange}
                  value={userInfo.email}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-1.5">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`block w-full ${errors.password ? "border-red-500" : ""}`}
                  onChange={handleChange}
                  value={userInfo.password}
                />
                {errors.password ? (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters with 1 uppercase, 1 number, and 1 special character
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  required 
                  checked={termsAccepted}
                  onCheckedChange={(checked) => {
                    setTermsAccepted(checked as boolean)
                    if (checked) {
                      setErrors({...errors, terms: ""})
                    }
                  }}
                />
                <Label
                  htmlFor="terms"
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                    errors.terms ? "text-red-500" : ""
                  }`}
                >
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-500 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-500 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.terms && (
                <p className="text-xs text-red-500 -mt-4">{errors.terms}</p>
              )}

              <div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating account..." : "Create account"}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-background px-6 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="w-full">
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                  Facebook
                </Button>
              </div>
            </div>

            <p className="mt-10 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
