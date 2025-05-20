"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from 'axios'
import { LoadingPage } from "@/components/ui/loading-page"

type User = {
  id: string
  name: string
  email: string
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])
  
  const login = (email: string, password: string) => {
    setIsLoading(true)
    return api.post("/api/auth/login", { email, password })
      .then((response) => {
        const user = response.data
        console.log(user)
        setUser(user)
        localStorage.setItem("user", JSON.stringify(user))
        router.push("/admin")
        return { success: true, message: "Login successful" }
      })
      .catch((error) => {
        console.error("Failed to login:", error)
        return { success: false, message: "Failed to login" }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  // Signup function - not async at the component level

  const signup = (name: string, email: string, password: string) => {
    setIsLoading(true)
    return api.post("/api/auth/register", { name, email, password })
      .then((response) => {
        const user = response.data
        setUser(user)
        localStorage.setItem("user", JSON.stringify(user))
        router.push(user.isAdmin ? "/admin" : "/")
        return { success: true, message: "Signup successful" }
      })
      .catch((error) => {
        console.error("Failed to signup:", error)
        return { success: false, message: "Failed to signup" }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin: user?.isAdmin || false,
        login,
        signup,
        logout,
      }}
    >
      {isLoading && <LoadingPage />}
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
