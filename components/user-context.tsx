"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { AppUser } from "@/lib/mock-users"

interface UserContextType {
  user: AppUser | null
  setUser: (user: AppUser | null) => void
  isLoading: boolean
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
})

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AppUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("portal_user")
    if (stored) {
      try { setUserState(JSON.parse(stored)) } catch {}
    }
    setIsLoading(false)
  }, [])

  const setUser = (u: AppUser | null) => {
    setUserState(u)
    if (u) localStorage.setItem("portal_user", JSON.stringify(u))
    else localStorage.removeItem("portal_user")
  }

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
