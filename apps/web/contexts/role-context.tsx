"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { UserRole, getCurrentRole } from "@/lib/roles"

interface RoleContextType {
  role: UserRole
  setRole: (role: UserRole) => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("owner")

  useEffect(() => {
    // Initialize role from storage
    setRoleState(getCurrentRole())
  }, [])

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
