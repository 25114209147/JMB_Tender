"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, DollarSign, Calendar, Building2 } from "lucide-react"
import Link from "next/link"
import { mockBids } from "@/data/bids"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useRole } from "@/contexts/role-context"
import { hasPermission } from "@/lib/roles"

export default function BidsPage() {
  const { role } = useRole()
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Only contractors can view their bids
  // In production, add proper route protection
  if (!hasPermission(role, "bids:view")) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Access Denied</p>
          <p className="text-muted-foreground mb-4">
            You don't have permission to view bids. This page is for contractors only.
          </p>
          <Link href="/tenders">
            <Button className="cursor-pointer">Go to Tenders</Button>
          </Link>
        </div>
      </div>
    )
  }

  const filteredBids = useMemo(() => {
    if (statusFilter === "all") return mockBids
    return mockBids.filter((bid) => bid.status === statusFilter)
  }, [statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      case "withdrawn":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
    }
  }

  const getBidStats = () => {
    const total = mockBids.length
    const pending = mockBids.filter((b) => b.status === "pending").length
    const approved = mockBids.filter((b) => b.status === "approved").length
    const rejected = mockBids.filter((b) => b.status === "rejected").length
    return { total, pending, approved, rejected }
  }

  const stats = getBidStats()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Bids</h1>
          <p className="text-muted-foreground">Track your bid submissions and their status</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bids</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="withdrawn">Withdrawn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bids List */}
      {filteredBids.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <h3 className="text-lg font-medium mb-2">No bids found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {statusFilter === "all"
                  ? "You haven't submitted any bids yet."
                  : `You don't have any ${statusFilter} bids.`}
              </p>
              <Link href="/tenders">
                <Button className="cursor-pointer">Browse Tenders</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBids.map((bid) => (
            <Card key={bid.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          className={cn(
                            getStatusColor(bid.status),
                            "shrink-0 text-xs px-2 py-0.5 font-medium w-fit"
                          )}
                        >
                          {bid.status.toUpperCase()}
                        </Badge>
                        <h3 className="text-lg font-semibold line-clamp-2">{bid.tender?.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" /> {bid.company_name}
                      </p>
                    </div>
                    <Link href={`/tenders/${bid.tender_id}`}>
                      <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer shrink-0">
                        <Eye className="h-3.5 w-3.5" />
                        View Tender
                      </Button>
                    </Link>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Proposed Amount</p>
                        <p className="text-base font-semibold">RM {bid.proposed_amount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Submitted</p>
                        <p className="text-base font-semibold">
                          {format(new Date(bid.created_at), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    {bid.timeline && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Timeline</p>
                          <p className="text-base font-semibold">{bid.timeline}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
