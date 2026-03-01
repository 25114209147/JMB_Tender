/**
 * Recent Activity Section for Contractor Dashboard
 * Shows recent bid submissions with real data
 */

"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMyBids } from "@/hooks/use-my-bids"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react"

const statusConfig = {
  submitted: {
    label: "Pending",
    variant: "secondary" as const,
    icon: Clock,
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
  },
  awarded: {
    label: "Awarded",
    variant: "default" as const,
    icon: CheckCircle2,
    className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
  },
  rejected: {
    label: "Rejected",
    variant: "destructive" as const,
    icon: XCircle,
    className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
  },
  withdrawn: {
    label: "Withdrawn",
    variant: "secondary" as const,
    icon: AlertCircle,
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300",
  },
}

export function RecentActivitySection() {
  const { bids, loading, error } = useMyBids(1, 10) // Get first 10 bids

  // Get recent bids (last 7 days) and sort by date
  const recentBids = useMemo(() => {
    if (!bids || bids.length === 0) return []
    
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    return bids
      .filter(bid => {
        const bidDate = new Date(bid.created_at)
        return bidDate >= sevenDaysAgo
      })
      .sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
      .slice(0, 5) // Show max 5 recent bids
  }, [bids])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Bids</CardTitle>
          <CardDescription>Bids you've submitted in the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingSpinner message="Loading recent bids..." />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Bids</CardTitle>
          <CardDescription>Bids you've submitted in the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Failed to load recent bids</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bids</CardTitle>
        <CardDescription>Bids you've submitted in the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        {recentBids.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              No bids submitted in the last 7 days
            </p>
            <Link href="/tenders" className="text-sm text-primary hover:underline mt-2 inline-block">
              Browse available tenders
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentBids.map((bid) => {
              const statusInfo = statusConfig[bid.status as keyof typeof statusConfig] || statusConfig.submitted
              const StatusIcon = statusInfo.icon
              const timeAgo = formatDistanceToNow(new Date(bid.created_at), { addSuffix: true })
              
              return (
                <Link
                  key={bid.id}
                  href={`/tenders/${bid.tender_id}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{bid.tender_title || `Tender #${bid.tender_id}`}</p>
                    <p className="text-sm text-muted-foreground">
                      Submitted {timeAgo}
                    </p>
                    {bid.proposed_amount && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Amount: RM {bid.proposed_amount.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={statusInfo.variant}
                    className={`ml-4 shrink-0 ${statusInfo.className}`}
                  >
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </Link>
              )
            })}
            {bids.length > recentBids.length && (
              <div className="text-center pt-2">
                <Link
                  href="/my-bids"
                  className="text-sm text-primary hover:underline"
                >
                  View all bids ({bids.length})
                </Link>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
