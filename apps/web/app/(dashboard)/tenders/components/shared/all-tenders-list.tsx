"use client"

import { useMemo } from "react"
import TenderList from "./tender-list"
import TenderCard from "./tender-card"
import type { Tender } from "@/data/tenders/tender-types"
import { useRole } from "@/contexts/role-context"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useMyBids } from "@/hooks/use-my-bids"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, MoreVertical, Trash2, CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface AllTendersListProps {
  tenders: Tender[]
  showAllStatuses?: boolean
  JMBOnly?: boolean // If true, only show tenders belonging to the current JMB
}

export default function AllTendersList({ 
  tenders: tendersProp,
  showAllStatuses = false,
  JMBOnly = false
}: AllTendersListProps) {
  const { role } = useRole()
  const { user } = useCurrentUser()
  
  // ✅ Use real hook to get contractor's bids (ONLY if contractor role)
  // Don't call hook for other roles to avoid unnecessary API calls
  const bidsQuery = useMyBids(1, 100)
  const bids = role === "contractor" ? bidsQuery.bids : []
  
  // ✅ Check if current contractor has applied to a tender (using real data)
  // Only contractors can apply, so return false for all other roles
  const hasContractorApplied = (tenderId: number): boolean => {
    if (role !== "contractor") return false
    return bids.some(bid => bid.tender_id === tenderId)
  }

  // ✅ Check if tender belongs to current user (using real data)
  const isJMBTender = (tender: Tender): boolean => {
    if (!user) return false
    return tender.created_by_id === user.id
  }
  
  // ✅ Filter tenders based on showAllStatuses and JMBOnly props (using real data)
  const filteredTenders = useMemo(() => {
    // Handle case where tendersProp might be undefined/null
    if (!tendersProp || !Array.isArray(tendersProp)) {
      return []
    }
    
    let filtered = [...tendersProp] // Use prop data, not mock data
    
    // Filter by JMB if JMBOnly is true (only show user's own tenders)
    if (JMBOnly && user) {
      filtered = filtered.filter(t => t.created_by_id === user.id)
    }
    
    // Filter by status
    if (!showAllStatuses) {
      filtered = filtered.filter((tender) => tender.status === "open")
    }
    
    return filtered
  }, [tendersProp, showAllStatuses, JMBOnly, user])

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
              <DropdownMenuItem className="cursor-pointer">Duplicate</DropdownMenuItem>
              <DropdownMenuItem disabled>Export PDF</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : null

      return <TenderCard tender={tender} viewHref={`/tenders/${tender.id}`} actions={actions} />
    }

    // Contractor: Can view or apply (if not yet applied)
    // ONLY contractors can apply - JMB cannot apply
    if (role === "contractor") {
      if (tender.status === "open") {
        const hasApplied = hasContractorApplied(tender.id as number)
        const actions = hasApplied ? (
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

        return <TenderCard tender={tender} viewHref={`/tenders/${tender.id}`} actions={actions} />
      }
      // For non-open tenders, contractor can only view
      return <TenderCard tender={tender} viewHref={`/tenders/${tender.id}`} />
    }

    // JMB: Can only view and edit their own tenders - CANNOT apply
    // JMB should never see "Apply" button - only edit/view actions
    if (role === "JMB") {
      const isOwnTender = isJMBTender(tender)
      
      // Show edit button for own tenders in both views
      // Allow editing for draft, open, and closed statuses
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
                <DropdownMenuItem className="cursor-pointer">Duplicate</DropdownMenuItem>
                <DropdownMenuItem disabled>Export PDF</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </>
      ) : null

      return <TenderCard tender={tender} viewHref={`/tenders/${tender.id}`} actions={actions} />
    }

    // Fallback: Just view (no actions for unknown roles)
    // This ensures JMB or any other role that doesn't match above cases can only view
    return <TenderCard tender={tender} viewHref={`/tenders/${tender.id}`} />
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

  return <TenderList tenders={filteredTenders} renderCard={renderTenderCard} emptyState={emptyState} />
}
