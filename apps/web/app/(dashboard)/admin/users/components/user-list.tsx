/**
 * User List Component
 * Displays list of users in a table format
 */

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { Users } from "lucide-react"
import type { UserResponse } from "@/lib/auth"
import Link from "next/link"

interface UserListProps {
  users: UserResponse[]
}

export function UserList({ users }: UserListProps) {
  if (!users || users.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No users found"
        description="No users match your current filters."
      />
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-sm">Name</th>
                <th className="text-left p-4 font-medium text-sm">Email</th>
                <th className="text-left p-4 font-medium text-sm">Role</th>
                <th className="text-left p-4 font-medium text-sm">Status</th>
                <th className="text-left p-4 font-medium text-sm">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <Link href={`/admin/users/${user.id}`} className="block font-medium hover:text-primary transition-colors">
                      {user.full_name || user.name || user.email.split('@')[0]}
                    </Link>
                  </td>
                  <td className="p-4">
                    <Link href={`/admin/users/${user.id}`} className="block text-muted-foreground hover:text-foreground transition-colors">
                      {user.email}
                    </Link>
                  </td>
                  <td className="p-4">
                    <Link href={`/admin/users/${user.id}`} className="block">
                      <Badge
                        variant={
                          user.role === "admin"
                            ? "destructive"
                            : user.role === "JMB"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </Link>
                  </td>
                  <td className="p-4">
                    <Link href={`/admin/users/${user.id}`} className="block">
                      <Badge variant="default">Active</Badge>
                    </Link>
                  </td>
                  <td className="p-4">
                    <Link href={`/admin/users/${user.id}`} className="block text-muted-foreground hover:text-foreground transition-colors">
                      {user.created_at ? (
                        new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      ) : (
                        "—"
                      )}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
