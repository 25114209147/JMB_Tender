"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { UserRole, getCurrentRole } from "@/lib/roles"
import { useUser } from "./user-context"

interface RoleContextType {
  role: UserRole
  setRole: (role: UserRole) => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("JMB")
  const { user } = useUser()

  useEffect(() => {
    // If user is logged in, use their actual role from backend
    if (user?.role) {
      setRoleState(user.role as UserRole)
      // Also update localStorage for consistency
      if (typeof window !== "undefined") {
        localStorage.setItem("mock_user_role", user.role)
      }
    } else {
      // Fallback to mock role from localStorage if not logged in
      setRoleState(getCurrentRole())
    }
  }, [user])

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole)
    if (typeof window !== "undefined") {
      localStorage.setItem("mock_user_role", newRole)
    }
  }

  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
}
