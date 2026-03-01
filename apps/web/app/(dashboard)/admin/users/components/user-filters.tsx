/**
 * User Filters Component
 * Provides filtering options for the users list
 * Standardized to match All Tenders filter format - search bar first
 */

"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Search } from "lucide-react"

interface UserFiltersProps {
  searchQuery?: string
  onSearchChange?: (value: string) => void
  roleFilter: string
  onRoleChange: (value: string) => void
  joinedFilter?: string
  onJoinedChange?: (value: string) => void
  sortBy?: string
  onSortChange?: (value: string) => void
  onClearFilters: () => void
}

export function UserFilters({
  searchQuery = "",
  onSearchChange,
  roleFilter,
  onRoleChange,
  joinedFilter = "all",
  onJoinedChange,
  sortBy = "newest",
  onSortChange,
  onClearFilters,
}: UserFiltersProps) {
  const hasActiveFilters = roleFilter !== "all" || searchQuery.length > 0 || joinedFilter !== "all" || sortBy !== "newest"

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full">
      {/* Search Bar */}
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="pl-10 w-full cursor-pointer"
        />
      </div>

      {/* Role Filter */}
      <Select value={roleFilter} onValueChange={onRoleChange}>
        <SelectTrigger className="w-full sm:w-[180px] shrink-0">
          <SelectValue placeholder="All roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="JMB">JMB</SelectItem>
          <SelectItem value="contractor">Contractor</SelectItem>
        </SelectContent>
      </Select>

      {/* Joined Time Filter */}
      {onJoinedChange && (
        <Select value={joinedFilter} onValueChange={onJoinedChange}>
          <SelectTrigger className="w-full sm:w-[180px] shrink-0">
            <SelectValue placeholder="Joined" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* Sort By */}
      {onSortChange && (
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-[180px] shrink-0">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="gap-2 cursor-pointer shrink-0 w-full sm:w-auto"
        >
          <X className="h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  )
}
