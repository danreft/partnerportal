"use client"

import { UserProvider } from "./user-context"
import type { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return <UserProvider>{children}</UserProvider>
}
