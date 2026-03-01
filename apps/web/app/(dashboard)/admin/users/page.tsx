"use client"

import { useState, useMemo } from "react"
import { useUsers } from "@/hooks/use-users"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent} from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { UserFilters } from "./components/user-filters"
import { UserList } from "./components/user-list"

export default function AllUsersPage() {
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [joinedFilter, setJoinedFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  
  const usersFilters = useMemo(() => ({ page: 1, page_size: 100 }), [])
  const { users, loading, error, total, refetch } = useUsers(usersFilters)

  // Filter users client-side
  const filteredUsers = useMemo(() => {
    let filtered = users
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((user) => 
        user.name?.toLowerCase().includes(query) ||
        user.full_name?.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.company_name?.toLowerCase().includes(query)
      )
    }
    
    // Filter by role
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }
    
    // Filter by joined time
    if (joinedFilter !== "all") {
      const now = new Date()
      filtered = filtered.filter((user) => {
        if (!user.created_at) return false
        const joinedDate = new Date(user.created_at)
        const daysDiff = Math.floor((now.getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24))
        
        switch (joinedFilter) {
          case "today":
            return daysDiff === 0
          case "week":
            return daysDiff <= 7
          case "month":
            return daysDiff <= 30
          case "3months":
            return daysDiff <= 90
          case "year":
            return daysDiff <= 365
          default:
            return true
        }
      })
    }
    
    // Sort users
    if (sortBy === "newest") {
      filtered.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
        return dateB - dateA // Newest first
      })
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
        return dateA - dateB // Oldest first
      })
    } else if (sortBy === "name") {
      filtered.sort((a, b) => {
        const nameA = (a.name || a.email).toLowerCase()
        const nameB = (b.name || b.email).toLowerCase()
        return nameA.localeCompare(nameB)
      })
    }
    
    return filtered
  }, [users, roleFilter, searchQuery, joinedFilter, sortBy])

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: users.length,
      admin: users.filter((u) => u.role === "admin").length,
      jmb: users.filter((u) => u.role === "JMB").length,
      contractor: users.filter((u) => u.role === "contractor").length,
    }
  }, [users])

  if (loading) {
    return <LoadingSpinner message="Loading users..." />
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error}
        title="Failed to load users"
        onRetry={refetch}
      />
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <header>
        <h1 className="text-xl font-bold tracking-tight">All Users</h1>
        <p className="text-muted-foreground">
          View and manage all users in the system ({total} {total === 1 ? "user" : "users"})
        </p>
      </header>

      <Tabs defaultValue="users" className="w-full">

        <TabsContent value="users" className="pt-4 space-y-4">
          {/* Filters */}
          <UserFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            roleFilter={roleFilter}
            onRoleChange={setRoleFilter}
            joinedFilter={joinedFilter}
            onJoinedChange={setJoinedFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onClearFilters={() => {
              setRoleFilter("all")
              setSearchQuery("")
              setJoinedFilter("all")
              setSortBy("newest")
            }}
          />

          {/* Stats Overview */}
          {stats.total > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatMiniCard label="Total Users" value={stats.total} color="blue" />
              <StatMiniCard label="JMB" value={stats.jmb} color="purple" />
              <StatMiniCard label="Contractors" value={stats.contractor} color="teal" />
              <StatMiniCard label="Admins" value={stats.admin} color="orange" />
            </div>
          )}

          {/* Users List */}
          <UserList users={filteredUsers} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Internal Helper for Stats
function StatMiniCard({ label, value, color }: { label: string, value: string | number, color: string }) {
  const colors: any = {
    blue: "text-blue-700",
    green: "text-green-700",
    purple: "text-purple-700",
    orange: "text-orange-700",
    teal: "text-teal-700"
  }
  return (
    <Card className="border-muted/60">
      <CardContent className="p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
        <p className={cn("text-lg font-extrabold truncate", colors[color])}>{value || "—"}</p>
      </CardContent>
    </Card>
  )
}
