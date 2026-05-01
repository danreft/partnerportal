"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "./user-context"
import type { UserRole } from "@/lib/mock-users"

export function AuthGuard({ children, role }: { children: ReactNode; role?: UserRole }) {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (!user) { router.replace("/login"); return }
    if (role && user.role !== role) {
      router.replace(user.role === "manager" ? "/manager" : "/")
    }
  }, [user, isLoading, role, router])

  if (isLoading || !user || (role && user.role !== role)) return null

  return <>{children}</>
}
