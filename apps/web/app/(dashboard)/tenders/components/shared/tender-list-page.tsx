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
import { useRole } from "@/contexts/role-context"
import { hasPermission } from "@/lib/roles"
import { useTenderList } from "@/hooks/use-tender-list"
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

  // Use wrapper hook that handles data fetching and filtering
  const { tenders, loading, error, total, refetch } = useTenderList({
    filters,
    useMyTendersHook,
    clientSideFilter,
  })

  // Handle loading state
  if (loading) {
    return <LoadingSpinner message={`Loading ${title.toLowerCase()}...`} />
  }

  // Handle error state
  if (error) {
    return (
      <ErrorMessage
        message={error}
        title={`Failed to load ${title.toLowerCase()}`}
        onRetry={refetch}
      />
    )
  }

  // Handle empty state
  if (tenders.length === 0) {
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {description && <p className="text-muted-foreground mt-2">{description}</p>}
          </div>
          {showCreateButton && canCreate && (
            <Link href="/tenders/create" className="cursor-pointer">
              <Button className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                Create Tender
              </Button>
            </Link>
          )}
        </div>

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

      {/* Tender List */}
      <AllTendersList
        tenders={tenders}
        showAllStatuses={showAllStatuses}
        JMBOnly={JMBOnly}
      />
    </div>
  )
}
