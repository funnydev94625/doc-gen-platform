"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

// Add auth token to all requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['x-auth-token'] = token
  }
  return config
})

type User = {
  name: string
  email: string
  isAdmin: boolean
}

type UserData = {
  name: string
  email: string
  password: string
  company?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: UserData) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem("token")
        if (token) {
          // Get user data from localStorage
          const userData = JSON.parse(localStorage.getItem("user") || "{}")
          if (userData && userData.email) {
            setUser(userData)
          } else {
            // If user data is incomplete, clear token
            localStorage.removeItem("token")
            localStorage.removeItem("user")
          }
        }
      } catch (error) {
        console.error("Authentication error:", error)
        // Clear potentially corrupted data
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  // Register function
  const register = async (userData: UserData): Promise<void> => {
    setLoading(true)
    try {
      const response = await api.post("/api/auth/register", userData)

      if (response.status === 200 || response.status === 201) {
        // After successful registration, log the user in
        await login(userData.email, userData.password)
        return
      } else {
        throw new Error(response.data.msg || "Registration failed")
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      if (error.response && error.response.data && error.response.data.msg) {
        throw new Error(error.response.data.msg)
      } else {
        throw new Error("Failed to register. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await api.post("/api/auth/login", { email, password })
      const data = response.data

      if (!data.token) {
        throw new Error("No authentication token received")
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token)

      // Create user object from response
      const userData = {
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin
      }

      // Update state and localStorage
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))

      // Set token for future API requests
      api.defaults.headers.common['x-auth-token'] = data.token

      // Redirect based on user role
      router.push("/")
    } catch (error: any) {
      console.error("Login error:", error)
      if (error.response && error.response.data && error.response.data.msg) {
        throw new Error(error.response.data.msg)
      } else {
        throw new Error("Failed to login. Please check your credentials.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    // Remove token from axios headers
    delete api.defaults.headers.common['x-auth-token']

    // Clear localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    // Reset state
    setUser(null)

    // Redirect to home
    router.push("/")
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

