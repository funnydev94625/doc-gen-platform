"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { LoadingPage } from "@/components/ui/loading-page"

// Utility function to check if a JWT token is expired
// This is a simple implementation and doesn't validate the token's signature
const isTokenExpired = (token: string): boolean => {
  try {
    // JWT tokens are in format: header.payload.signature
    const payload = token.split('.')[1]
    if (!payload) return true

    // Decode the base64 payload
    const decodedPayload = JSON.parse(atob(payload))

    // Check if the token has an expiration claim
    if (!decodedPayload.exp) return false

    // Compare expiration timestamp with current time
    const expirationTime = decodedPayload.exp * 1000 // Convert to milliseconds
    return Date.now() >= expirationTime
  } catch (error) {
    console.error("Error checking token expiration:", error)
    return true // If we can't verify, assume it's expired for security
  }
}

// Create a typed API instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to all requests if available
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        // Check if token is expired
        if (isTokenExpired(token)) {
          // Token is expired, but we'll still send the request
          // The response interceptor will handle the 401 error
          console.warn("Token is expired, request may fail")
        }
        config.headers['x-auth-token'] = token
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // If the error is due to an expired token (401) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Clear the token and user data
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      // Redirect to login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/signin')) {
        window.location.href = '/auth/signin'
      }
    }

    return Promise.reject(error)
  }
)

// Define types for better type safety
export type User = {
  name: string
  email: string
  isAdmin: boolean
}

export type UserData = {
  name: string
  email: string
  password: string
  company?: string
}

export type AuthResponse = {
  token: string
  name: string
  email: string
  isAdmin: boolean
  msg?: string
}

export type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  refreshToken: () => Promise<void>
  setLoading: (val: any) => void
  navshow: boolean
  setNavshow: (val: any) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Constants
const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes
const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true) // Start with loading true
  const [initialized, setInitialized] = useState(false)
  const [lastActivity, setLastActivity] = useState<number>(Date.now())
  const router = useRouter()
  const pathname = usePathname()
  const [navshow, setNavshow] = useState(false)

  // Check if user is logged in on initial load
  useEffect(() => {
    setLoading(true)
    const checkLoggedIn = async () => {
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem("token")
        if (token) {
          // Check if token is expired
          if (isTokenExpired(token)) {
            console.log("Token is expired, logging out")
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            if (!window.location.pathname.includes('/auth/signin')) {
              router.push('/auth/signin')
            }
            return
          }

          // Token is valid, get user data
          const userData = JSON.parse(localStorage.getItem("user") || "{}")

          if (userData && userData.email) {
            // Set user data in state
            setUser(userData)

            // Validate token with the server if not on auth pages
            if (!window.location.pathname.includes('/auth/')) {
              try {
                // This would be a good addition to the API
                // For now, we'll just continue with the stored user data
                // await refreshToken();
              } catch (tokenError) {
                // If token validation fails, we'll handle it in the refreshToken function
                console.error("Token validation failed:", tokenError)
              }
            }

            // Only redirect if we're on the sign-in page
            if (window.location.pathname.includes('/auth/signin')) {
              router.push('/')
            }
          } else {
            // If user data is incomplete, clear token
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            if (!window.location.pathname.includes('/auth/signin')) {
              router.push('/auth/signin')
            }
          }
        } else if (!window.location.pathname.includes('/auth/signin')) {
          router.push('/auth/signin')
        }
      } catch (error) {
        console.error("Authentication error:", error)
        // Clear potentially corrupted data
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        if (!window.location.pathname.includes('/auth/signin')) {
          router.push('/auth/signin')
        }
      } finally {
        setLoading(false)
        setInitialized(true)
      }
    }

    checkLoggedIn()
  }, [])

  // useEffect(() => {
  //   setLoading(true)
  //   if(user && user.email)
  //   {
  //     setLoading(false)
  //     return
  //   }
  //   router.push('/auth/signin')
  //   setLoading(false)
  // }, [pathname])

  // Protect routes when user state changes
  useEffect(() => {
    // Only run this effect after initial authentication check
    if (!initialized) return

    if (!(user && user.email) && !window.location.pathname.includes('/auth/')) {
      router.push('/auth/signin')
    }
  }, [user, initialized, router])

  // Logout function
  const logout = useCallback(() => {
    // Remove token from axios headers
    delete api.defaults.headers.common['x-auth-token']

    // Clear localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    // Reset state
    setUser(null)

    // Redirect to login page
    router.push("/auth/signin")
  }, [router])

  // Set up activity tracking for session timeout
  useEffect(() => {
    if (!user) return // Only track activity when user is logged in

    // Update last activity time when user interacts with the page
    const updateActivity = () => {
      setLastActivity(Date.now())
    }

    // Add event listeners for user activity
    ACTIVITY_EVENTS.forEach(event => {
      window.addEventListener(event, updateActivity)
    })

    // Check for session timeout periodically
    const intervalId = setInterval(() => {
      const now = Date.now()
      const timeSinceLastActivity = now - lastActivity

      if (timeSinceLastActivity > SESSION_TIMEOUT_MS) {
        console.log('Session timeout due to inactivity')
        logout()
      }
    }, 60000) // Check every minute

    // Clean up event listeners and interval
    return () => {
      ACTIVITY_EVENTS.forEach(event => {
        window.removeEventListener(event, updateActivity)
      })
      clearInterval(intervalId)
    }
  }, [user, lastActivity, logout])

  // Login function
  const login = async (email: string, password: string) => {
    // setLoading(true)
    try {
      const response = await api.post<AuthResponse>("/api/auth/admin_login", { email, password })
      const data = response.data

      if (!data.token) {
        throw new Error("No authentication token received")
      }

      // Store authentication data securely
      await storeAuthData(data)

      // Redirect to home page
      router.push("/")
    } catch (error: any) {
      console.error("Login error:", error)
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg)
      } else {
        throw new Error("Failed to login. Please check your credentials.")
      }
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 1000);
    }
  }

  // Store authentication data
  const storeAuthData = async (data: AuthResponse) => {
    // Store token in localStorage
    localStorage.setItem("token", data.token)

    // Create user object from response
    const userData: User = {
      name: data.name,
      email: data.email,
      isAdmin: data.isAdmin
    }

    // Update state and localStorage
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))

    // Set token for future API requests
    api.defaults.headers.common['x-auth-token'] = data.token
  }

  // Refresh token function
  const refreshToken = useCallback(async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No token found")
      }

      // Check if token is expired
      if (isTokenExpired(token)) {
        throw new Error("Token is expired")
      }

      // This endpoint doesn't exist in the current API, but would be a good addition
      // For now, we'll just validate the current token
      const response = await api.get<User>("/api/auth/me")

      if (response.status === 200) {
        // Token is still valid, update user data if needed
        const userData: User = {
          name: response.data.name,
          email: response.data.email,
          isAdmin: response.data.isAdmin
        }

        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
      } else {
        // If token validation fails, log the user out
        logout()
        throw new Error("Session expired. Please login again.")
      }
    } catch (error: any) {
      console.error("Token refresh error:", error)
      // Clear auth data and redirect to login
      logout()
      throw new Error("Session expired. Please login again.")
    }
  }, [logout])

  // Create the context value object
  const value = {
    user,
    loading,
    login,
    logout,
    refreshToken,
    isAuthenticated: !!user,
    setLoading: (val: any) => setLoading(val),
    navshow,
    setNavshow: (val: any) => setNavshow(val)
  }

  return <AuthContext.Provider value={value}>{loading ? <LoadingPage /> : <>{children}</>}</AuthContext.Provider>
}

/**
 * Custom hook to access the authentication context
 *
 * @returns {AuthContextType} The authentication context
 * @throws {Error} If used outside of an AuthProvider
 *
 * @example
 * const { user, login, logout } = useAuth();
 *
 * // Check if user is authenticated
 * if (user) {
 *   // User is logged in
 * }
 *
 * // Login user
 * await login(email, password);
 *
 * // Logout user
 * logout();
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

