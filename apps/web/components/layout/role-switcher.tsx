"use client"

import { useRole } from "@/contexts/role-context"
import { UserRole } from "@/lib/roles"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { User } from "lucide-react"

/**
 * Role Switcher Component
 * For development/testing - allows switching between roles
 * Remove or hide this in production
 */
export default function RoleSwitcher() {
  const { role, setRole } = useRole()

  const handleRoleChange = (newRole: string) => {
    setRole(newRole as UserRole)
    // Reload to apply role changes
    if (typeof window !== "undefined") {
      window.location.reload()
    }
  }

  return (
    <div className="flex items-center gap-2">
      <User className="h-4 w-4 text-muted-foreground" />
      <Select value={role} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-[140px] h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="JMB">JMB</SelectItem>
          <SelectItem value="contractor">Contractor</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
