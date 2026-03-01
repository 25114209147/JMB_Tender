// take a raw list of tenders 
// decide exactly what buttons (Edit, Apply, View) a user should see based on their role

"use client"

import { useMemo, useState } from "react"
import TenderList from "./tender-list"
import { TenderCard } from "./tender-card"
import type { Tender } from "@/data/tenders/tender-types"
import { useRole } from "@/contexts/role-context"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useMyBids } from "@/hooks/use-my-bids"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, MoreVertical, Trash2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { deleteTender } from "@/lib/tenders"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import  {toast} from "@/components/toast/toast"

interface AllTendersListProps {
  tenders: Tender[]
  showAllStatuses?: boolean
  JMBOnly?: boolean
  onTenderDeleted?: () => void // Callback to refresh the list after deletion
  tendersLoading?: boolean // Whether tenders are still loading
  bids?: Array<{ tender_id: number }> // Pre-fetched bids data (optional, will fetch if not provided)
  bidsLoading?: boolean // Whether bids are still loading
}

export default function AllTendersList({ 
  tenders: tendersProp,
  showAllStatuses = false,
  JMBOnly = false,
  onTenderDeleted,
  tendersLoading = false,
  bids: bidsProp,
  bidsLoading: bidsLoadingProp
}: AllTendersListProps) {
  const { role } = useRole()
  const { user } = useCurrentUser()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tenderToDelete, setTenderToDelete] = useState<number | null>(null)
  
  // Use provided bids if available, otherwise fetch (fallback for backward compatibility)
  const bidsQuery = useMyBids(
    bidsProp !== undefined ? 0 : (role === "contractor" ? 1 : 0), 
    100
  )
  const bids = bidsProp !== undefined 
    ? (role === "contractor" ? bidsProp : [])
    : (role === "contractor" ? bidsQuery.bids : [])
  const bidsLoading = bidsLoadingProp !== undefined
    ? (role === "contractor" ? bidsLoadingProp : false)
    : (role === "contractor" ? bidsQuery.loading : false)
  
  // Create a Set for O(1) lookup performance
  const appliedTenderIds = useMemo(() => {
    if (role !== "contractor" || bidsLoading) return new Set<number>()
    return new Set(bids.map(bid => bid.tender_id))
  }, [bids, bidsLoading, role])
  
  // Check if current contractor has applied to a tender (using real data)
  // Only contractors can apply, so return false for all other roles
  // Return null if still loading to show loading state
  // Use Set for O(1) lookup instead of O(n) array search
  const hasContractorApplied = (tenderId: number): boolean | null => {
    if (role !== "contractor") return false
    if (bidsLoading) return null // Still loading - show loading state
    return appliedTenderIds.has(tenderId)
  }

  const isJMBTender = (tender: Tender): boolean => {
    if (!user) return false
    return tender.created_by_id === user.id
  }
  
  // Filter tenders based on showAllStatuses and JMBOnly props 
  const filteredTenders = useMemo(() => {
    // Handle case where tendersProp might be undefined/null
    if (!tendersProp || !Array.isArray(tendersProp)) {
      return []
    }
    
    let filtered = [...tendersProp] 
    
    // Filter by JMB if JMBOnly is true (only show user's own tenders)
    if (JMBOnly && user) {
      filtered = filtered.filter(t => t.created_by_id === user.id)
    }
    
    // Filter by status
    if (!showAllStatuses) {
      filtered = filtered.filter((tender) => tender.status === "open")
    }
    
    return filtered
  }, [tendersProp, JMBOnly, user, showAllStatuses])

  const openDeleteDialog = (tenderId: number) => {
    setTenderToDelete(tenderId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteTender = async () => {
    if (!tenderToDelete) return

    try {
      await deleteTender(tenderToDelete)
      toast.success("Tender deleted successfully")
      setDeleteDialogOpen(false)
      setTenderToDelete(null)
      // Refresh the list after successful deletion
      if (onTenderDeleted) {
        await onTenderDeleted()
      }
    } catch (error) {
      // Show detailed error from API
      let errorMessage = "Failed to delete tender. Please try again."
      
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
      console.error("Delete error:", error)
    }
  }

  const renderTenderCard = (tender: Tender) => {
    // Admin: Can view and edit all open tenders
    if (role === "admin") {
      const canEdit = tender.status === "open" || tender.status === "draft"
      const actions = canEdit ? (
        <>
          <Link href={`/tenders/${tender.id}/edit`}>
            <Button size="sm" className="gap-1.5 cursor-pointer">
              <Edit className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
          </Link>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {/* <DropdownMenuItem className="cursor-pointer">Duplicate</DropdownMenuItem>
              <DropdownMenuItem disabled>Export PDF</DropdownMenuItem> */}
              <DropdownMenuItem 
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                onSelect={() => openDeleteDialog(tender.id as number)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : null

      return <TenderCard tender={tender} viewHref={`/tenders/${tender.id}`} actions={actions} collapsible={true} />
    }

    // Contractor: Can view or apply (if not yet applied)
    if (role === "contractor") {
      if (tender.status === "open") {
        const hasApplied = hasContractorApplied(tender.id as number)
        const actions = hasApplied === null ? (
          // Still loading bids - show loading state
          <Button size="sm" variant="outline" disabled className="gap-1.5 cursor-not-allowed">
            <span className="hidden sm:inline">Loading...</span>
            <span className="sm:hidden">...</span>
          </Button>
        ) : hasApplied ? (
          <Button size="sm" variant="outline" disabled className="gap-1.5 cursor-not-allowed">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Applied</span>
            <span className="sm:hidden">Applied</span>
          </Button>
        ) : (
          <Link href={`/tenders/${tender.id}/apply-bid`}>
            <Button size="sm" className="gap-1.5 cursor-pointer">
              <span className="hidden sm:inline">Apply</span>
              <span className="sm:hidden">Apply</span>
            </Button>
          </Link>
        )

        return <TenderCard tender={tender} viewHref={`/tenders/${tender.id}`} actions={actions} collapsible={true} />
      }
      // For non-open tenders, contractor can only view
      return <TenderCard tender={tender} viewHref={`/tenders/${tender.id}`} collapsible={true} />
    }

    // JMB: Can only view and edit their own tenders 
    if (role === "JMB") {
      const isOwnTender = isJMBTender(tender)
      
      // Show edit button for draft, open, and closed statuses
      const editableStatuses: string[] = ["draft", "open", "closed"]
      const canEdit = isOwnTender && editableStatuses.includes(tender.status)
      
      const actions = canEdit ? (
        <>
          <Link href={`/tenders/${tender.id}/edit`}>
            <Button size="sm" className="gap-1.5 cursor-pointer">
              <Edit className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
          </Link>
          {JMBOnly && ( // Show dropdown menu only in "My Tenders"
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {/* <DropdownMenuItem className="cursor-pointer">Duplicate</DropdownMenuItem> */}
                <DropdownMenuItem 
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                  onSelect={() => openDeleteDialog(tender.id as number)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </>
      ) : null

      return <TenderCard tender={tender} viewHref={`/tenders/${tender.id}`} actions={actions} collapsible={true} />
    }

    // Fallback: Just view (no actions for unknown roles)
    return <TenderCard tender={tender} viewHref={`/tenders/${tender.id}`} collapsible={true} />
  }

  const emptyState = (
    <div className="rounded-lg border border-dashed p-12 text-center">
      <p className="mb-4 text-muted-foreground">
        {JMBOnly
          ? "You haven't created any tenders yet"
          : showAllStatuses 
          ? "No tenders available at the moment" 
          : "No open tenders available at the moment"}
      </p>
      <p className="text-sm text-muted-foreground">
        {JMBOnly
          ? "Create your first tender to get started"
          : "Check back later for new opportunities"}
      </p>
    </div>
  )

  // Show loading spinner only if tenders are loading AND we have no tenders yet
  if (tendersLoading && filteredTenders.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading tenders...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <TenderList tenders={filteredTenders} renderCard={renderTenderCard} emptyState={emptyState} />
      
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteTender}
        title="Delete Tender"
        description="Are you sure you want to delete this tender? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  )
}
