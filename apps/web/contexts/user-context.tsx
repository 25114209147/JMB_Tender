/**
 * User Context
 * 
 * Provides current user data to all components
 * Automatically fetches user on mount if authenticated
 */

"use client"

import React, { createContext, useContext, ReactNode } from "react"
import { useCurrentUser } from "@/hooks/use-current-user"
import type { UserResponse } from "@/lib/auth"

interface UserContextType {
  user: UserResponse | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const currentUser = useCurrentUser()

  return (
    <UserContext.Provider value={currentUser}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
