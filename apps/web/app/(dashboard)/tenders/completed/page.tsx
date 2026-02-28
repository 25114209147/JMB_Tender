"use client"

import { useTenders } from "@/hooks/use-tenders"
import { TenderCard } from "@/components/tender/tender-card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function CompletedTendersPage() {
  const { tenders, loading, error, total } = useTenders({
    status: "closed",
    page: 1,
    page_size: 20,
  })

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading completed tenders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Completed Tenders</h1>
          <p className="text-muted-foreground mt-1">
            View your closed and awarded tenders
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Total Completed</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Awarded</p>
              <p className="text-2xl font-bold">
                {tenders.filter(t => t.status === "awarded").length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-600" />
            <div>
              <p className="text-sm text-muted-foreground">Closed</p>
              <p className="text-2xl font-bold">
                {tenders.filter(t => t.status === "closed").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Badge variant="outline" className="cursor-pointer hover:bg-accent">
          All ({total})
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-accent">
          Awarded ({tenders.filter(t => t.status === "awarded").length})
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-accent">
          Closed ({tenders.filter(t => t.status === "closed").length})
        </Badge>
      </div>

      {/* Tender List */}
      {tenders.length === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed">
          <CheckCircle className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No completed tenders</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Completed tenders will appear here once they are closed or awarded
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tenders.map((tender) => (
            <TenderCard key={tender.id} tender={tender} showStatus />
          ))}
        </div>
      )}

      {/* Help Text */}
      <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
        <p className="font-medium">📊 About Completed Tenders</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li><strong>Closed:</strong> Tender deadline has passed, no bids are being accepted</li>
          <li><strong>Awarded:</strong> A contractor has been selected and awarded the tender</li>
          <li><strong>Cancelled:</strong> Tender was cancelled before completion</li>
          <li>You can export reports for accounting and record-keeping purposes</li>
        </ul>
      </div>
    </div>
  )
}
