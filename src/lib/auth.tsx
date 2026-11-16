"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { User, AuthTokens } from "@/types"
import { api } from "@/lib/api"

interface AuthContextType {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isAdmin: boolean
  login: (tokens: AuthTokens, user: User) => void
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    setUser(null)
    setAccessToken(null)
    router.push("/login")
  }, [router])

  const login = useCallback((tokens: AuthTokens, userData: User) => {
    localStorage.setItem("accessToken", tokens.accessToken)
    localStorage.setItem("refreshToken", tokens.refreshToken)
    localStorage.setItem("user", JSON.stringify(userData))
    setAccessToken(tokens.accessToken)
    setUser(userData)
  }, [])

  const updateUser = useCallback((updatedUserData: User) => {
    localStorage.setItem("user", JSON.stringify(updatedUserData))
    setUser(updatedUserData)
  }, [])

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("accessToken")
      const storedUser = localStorage.getItem("user")

      if (storedToken && storedUser) {
        try {
          setAccessToken(storedToken)
          setUser(JSON.parse(storedUser))
          const response = await api.get("/auth/me")
          const freshUser = response.data.data || response.data
          setUser(freshUser)
          localStorage.setItem("user", JSON.stringify(freshUser))
        } catch {
          logout()
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [logout])

  const value: AuthContextType = {
    user,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    isLoading,
    isAdmin: user?.role === "admin",
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
