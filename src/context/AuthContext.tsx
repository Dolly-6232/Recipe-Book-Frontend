import React, { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { User } from "../types/auth"
import { AuthContext } from "../utils/authUtils"

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token")
        const storedUser = await AsyncStorage.getItem("user")

        if (storedToken && storedUser) {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Error loading auth data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAuthData()
  }, [])

  const login = async (userData: User, authToken: string) => {
    try {
      await AsyncStorage.setItem("token", authToken)
      await AsyncStorage.setItem("user", JSON.stringify(userData))
      setToken(authToken)
      setUser(userData)
    } catch (error) {
      console.error("Error saving auth data:", error)
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token")
      await AsyncStorage.removeItem("user")
      setToken(null)
      setUser(null)
    } catch (error) {
      console.error("Error removing auth data:", error)
    }
  }

  const isAuthenticated = !!token

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}
