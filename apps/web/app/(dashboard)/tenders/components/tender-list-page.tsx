/**
 * Reusable component for displaying tender lists with different filters
 * 
 * Usage:
 * ```tsx
 * <TenderListPage
 *   title="Draft Tenders"
 *   description="Manage and publish your draft tenders"
 *   filters={{ status: "draft" }}
 *   showCreateButton={true}
 *   showAllStatuses={true}
 *   JMBOnly={true}
 *   emptyStateConfig={{
 *     title: "No draft tenders",
 *     description: "Create your first tender to get started",
 *     icon: FileText
 *   }}
 * />
 * ```
 */

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, FileText } from "lucide-react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import { useRole } from "@/contexts/role-context"
import { hasPermission } from "@/lib/roles"
import { useTenderList } from "@/hooks/use-tender-list"
import { useMyBids } from "@/hooks/use-my-bids"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { EmptyState } from "@/components/ui/empty-state"
import AllTendersList from "./all-tenders-list"
import type { TenderFilters } from "@/data/tenders/tender-types"
import type { LucideIcon } from "lucide-react"

interface TenderListPageProps {
  title: string
  description?: string
  filters?: TenderFilters
  useMyTendersHook?: boolean // If true, use useMyTenders instead of useTenders
  showCreateButton?: boolean
  showAllStatuses?: boolean
  JMBOnly?: boolean
  clientSideFilter?: (tender: any) => boolean // Optional client-side filter function
  emptyStateConfig?: {
    title: string
    description: string
    icon: LucideIcon
    action?: React.ReactNode
  }
  headerActions?: React.ReactNode // Custom actions in header
  infoBanner?: React.ReactNode // Optional info banner below header
}

export default function TenderListPage({
  title,
  description,
  filters,
  useMyTendersHook = false,
  showCreateButton = false,
  showAllStatuses = false,
  JMBOnly = false,
  clientSideFilter,
  emptyStateConfig,
  headerActions,
  infoBanner,
}: TenderListPageProps) {
  const { role } = useRole()
  const canCreate = hasPermission(role, "tenders:create")

  // Fetch tenders and bids IN PARALLEL (both hooks start fetching immediately)
  const { tenders, loading, error, total, refetch } = useTenderList({
    filters,
    useMyTendersHook,
    clientSideFilter,
  })
  
  // Fetch bids immediately in parallel (don't wait for tenders)
  // This ensures bids are loading while tenders are loading
  const bidsQuery = useMyBids(role === "contractor" ? 1 : 0, 100)

  // Progressive rendering - show page structure immediately, render content as data loads
  // This matches the My Bids pattern for fast perceived performance

  // Handle error state (only show if not loading and we have an error)
  if (error && !loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground mt-2">{description}</p>
          </div>
        </div>
        <ErrorMessage
          message={error}
          title={`Failed to load ${title.toLowerCase()}`}
          onRetry={refetch}
        />
      </div>
    )
  }

  // Handle empty state (only show if not loading and no tenders)
  if (!loading && tenders.length === 0) {
    const defaultEmptyState = {
      title: `No ${title.toLowerCase()}`,
      description: emptyStateConfig?.description || "Get started by creating your first tender",
      icon: emptyStateConfig?.icon || FileText,
      action: showCreateButton && canCreate ? (
        <Link href="/tenders/create">
          <Button className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Create Tender
          </Button>
        </Link>
      ) : emptyStateConfig?.action,
    }

    return (
      <div className="space-y-8">
        <DashboardHeader
          title={title}
          description={description || "Get started by creating your first tender"}
          primaryAction={
            showCreateButton && canCreate ? {
              label: "Create Tender",
              icon: <Plus className="mr-2 h-4 w-4" />,
              href: "/tenders/create",
            } : undefined
          }
        />

        <EmptyState
          icon={defaultEmptyState.icon}
          title={defaultEmptyState.title}
          description={defaultEmptyState.description}
          action={defaultEmptyState.action}
        />
      </div>
    )
  }

  // Render success state with data
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-2">
            {description || (
              <>
                {total} {total === 1 ? "tender" : "tenders"}
                {filters?.status && ` (${filters.status})`}
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {headerActions}
          {showCreateButton && canCreate && (
            <Link href="/tenders/create" className="cursor-pointer">
              <Button className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                Create Tender
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Info Banner */}
      {infoBanner && <div>{infoBanner}</div>}

      {/* Tender List - Render immediately, show loading state inside if needed */}
      {/* Pass bids data to avoid re-fetching */}
      <AllTendersList
        tenders={tenders}
        showAllStatuses={showAllStatuses}
        JMBOnly={JMBOnly}
        onTenderDeleted={refetch}
        tendersLoading={loading}
        bids={role === "contractor" ? bidsQuery.bids : []}
        bidsLoading={role === "contractor" ? bidsQuery.loading : false}
      />
    </div>
  )
}
