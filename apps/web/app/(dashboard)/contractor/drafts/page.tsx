"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X, FileText, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRole } from "@/contexts/role-context"
import { hasPermission } from "@/lib/roles"
import { EmptyState } from "@/components/ui/empty-state"
import DashboardTemplate, { type DashboardConfig } from "@/components/dashboard/dashboard-template"
import type { BidFormData } from "@/data/bids-form"
import { useTender } from "@/hooks/use-tender"
import { useCurrentUser } from "@/hooks/use-current-user"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { toast } from "@/components/toast/toast"

interface DraftBid {
  tenderId: string
  formData: BidFormData
  lastSaved: string
}

export default function DraftsPage() {
  const { role } = useRole()
  const router = useRouter()
  const { user, loading: userLoading } = useCurrentUser()
  const [search, setSearch] = useState<string>("")
  const [sort, setSort] = useState<string>("date-desc")
  const [drafts, setDrafts] = useState<DraftBid[]>([])
  const [loading, setLoading] = useState(true)

  // Load drafts from localStorage - only for current user
  useEffect(() => {
    if (typeof window === "undefined" || userLoading || !user) {
      if (!userLoading && !user) {
        setLoading(false)
      }
      return
    }

    try {
      const allKeys = Object.keys(localStorage)
      // Filter for draft keys but exclude -timestamp keys (old format)
      const draftKeys = allKeys.filter((key) => 
        key.startsWith("bid-draft-") && !key.endsWith("-timestamp")
      )
      
      const loadedDrafts: DraftBid[] = draftKeys
        .map((key) => {
          try {
            const tenderId = key.replace("bid-draft-", "")
            const draftData = localStorage.getItem(key)
            if (!draftData) return null

            const draft = JSON.parse(draftData)
            
            // Handle old format (direct formData) or new format (with userId)
            const formData = (draft.formData || draft) as BidFormData
            const draftUserId = draft.userId
            const lastSaved = draft.savedAt || localStorage.getItem(`${key}-timestamp`) || new Date().toISOString()
            
            // Verify draft belongs to current user using user ID (most reliable)
            if (draftUserId && draftUserId !== user.id) {
              return null
            }
            
            // Fallback for old drafts without userId: use email/company match
            if (!draftUserId) {
              const matchesUser = 
                (user.company_name && formData.company_name && 
                 formData.company_name.trim().toLowerCase() === user.company_name.trim().toLowerCase()) ||
                (user.email && formData.contact_person_email && 
                 formData.contact_person_email.trim().toLowerCase() === user.email.trim().toLowerCase())
              
              if (!matchesUser) {
                return null
              }
            }

            return {
              tenderId,
              formData,
              lastSaved,
            }
          } catch (error) {
            console.error(`Failed to parse draft ${key}:`, error)
            return null
          }
        })
        .filter((draft): draft is DraftBid => draft !== null)

      setDrafts(loadedDrafts)
    } catch (error) {
      console.error("Failed to load drafts:", error)
    } finally {
      setLoading(false)
    }
  }, [user, userLoading])

  // Only contractors can view their drafts
  if (!hasPermission(role, "bids:view")) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Access Denied</p>
          <p className="text-muted-foreground mb-4">
            You don't have permission to view drafts. This page is for contractors only.
          </p>
          <Link href="/tenders">
            <Button className="cursor-pointer">Go to Tenders</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Filter and sort drafts
  const filteredDrafts = useMemo(() => {
    let filtered = [...drafts]

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        (draft) =>
          draft.formData.company_name?.toLowerCase().includes(q) ||
          draft.formData.contact_person_name?.toLowerCase().includes(q) ||
          draft.formData.contact_person_email?.toLowerCase().includes(q) ||
          draft.tenderId.includes(q)
      )
    }

    // Sort
    filtered.sort((a, b) => {
      if (sort === "date-desc") {
        return new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime()
      }
      if (sort === "date-asc") {
        return new Date(a.lastSaved).getTime() - new Date(b.lastSaved).getTime()
      }
      if (sort === "amount-asc") {
        const amountA = parseFloat(a.formData.proposed_amount) || 0
        const amountB = parseFloat(b.formData.proposed_amount) || 0
        return amountA - amountB
      }
      if (sort === "amount-desc") {
        const amountA = parseFloat(a.formData.proposed_amount) || 0
        const amountB = parseFloat(b.formData.proposed_amount) || 0
        return amountB - amountA
      }
      return 0
    })

    return filtered
  }, [drafts, search, sort])

  const handleDeleteDraft = (tenderId: string) => {
    if (typeof window === "undefined") return

    try {
      localStorage.removeItem(`bid-draft-${tenderId}`)
      localStorage.removeItem(`bid-draft-${tenderId}-timestamp`)
      setDrafts((prev) => prev.filter((d) => d.tenderId !== tenderId))
      toast.success("Draft deleted successfully")
    } catch (error) {
      console.error("Failed to delete draft:", error)
      toast.error("Failed to delete draft")
    }
  }

  const config: DashboardConfig = {
    title: "Draft Bids",
    description: `${drafts.length} ${drafts.length === 1 ? "draft" : "drafts"} saved`,
    summaryCards: [], // No stats cards as requested
    sections: [
      {
        content: (
          <div className="space-y-4">
            {/* Filters - Standardized with My Bids format */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full">
              {/* Search */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
                <Input
                  placeholder="Search by company name, contact person..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-full cursor-pointer"
                />
              </div>

              {/* Sort */}
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-full sm:w-[180px] shrink-0">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="amount-asc">Amount: Low to High</SelectItem>
                  <SelectItem value="amount-desc">Amount: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {search.trim() && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch("")
                    setSort("date-desc")
                  }}
                  className="gap-2 cursor-pointer shrink-0 w-full sm:w-auto"
                >
                  <X className="h-4 w-4" />
                  Clear filters
                </Button>
              )}
            </div>

            {/* Drafts List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Loading drafts...</p>
              </div>
            ) : filteredDrafts.length === 0 ? (
              <EmptyState
                icon={FileText}
                title={search.trim() ? "No drafts found" : "No draft bids"}
                description={
                  search.trim()
                    ? "Try adjusting your search terms"
                    : "You don't have any saved draft bids. Start applying to tenders to create drafts."
                }
                action={
                  <Link href="/tenders">
                    <Button className="cursor-pointer">Browse Tenders</Button>
                  </Link>
                }
              />
            ) : (
              <div className="space-y-4">
                {filteredDrafts.map((draft) => (
                  <DraftCard
                    key={draft.tenderId}
                    draft={draft}
                    onDelete={handleDeleteDraft}
                  />
                ))}
              </div>
            )}
          </div>
        ),
      },
    ],
  }

  return <DashboardTemplate config={config} />
}

interface DraftCardProps {
  draft: DraftBid
  onDelete: (tenderId: string) => void
}

function DraftCard({ draft, onDelete }: DraftCardProps) {
  const router = useRouter()
  const { tender, loading: tenderLoading } = useTender(parseInt(draft.tenderId))
  const proposedAmount = parseFloat(draft.formData.proposed_amount) || 0

  const handleContinue = () => {
    router.push(`/tenders/${draft.tenderId}/apply-bid`)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this draft? This action cannot be undone.")) {
      onDelete(draft.tenderId)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate">
              {tenderLoading ? (
                "Loading..."
              ) : tender ? (
                <Link
                  href={`/tenders/${draft.tenderId}`}
                  className="hover:text-primary transition-colors"
                >
                  {tender.title}
                </Link>
              ) : (
                `Tender #${draft.tenderId}`
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Last saved: {format(new Date(draft.lastSaved), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
          <Badge variant="secondary" className="ml-2 shrink-0">
            Draft
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Company Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-1">Company</p>
              <p className="text-sm font-medium">{draft.formData.company_name || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-1">Contact Person</p>
              <p className="text-sm font-medium">{draft.formData.contact_person_name || "—"}</p>
            </div>
          </div>

          {/* Financial Info */}
          {proposedAmount > 0 && (
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-1">Proposed Amount</p>
              <p className="text-sm font-semibold">RM {proposedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          )}

          {/* Progress Indicators */}
          <div className="flex flex-wrap gap-2">
            {draft.formData.company_name && (
              <Badge variant="outline" className="text-xs">Step 1: Company Info</Badge>
            )}
            {proposedAmount > 0 && (
              <Badge variant="outline" className="text-xs">Step 2: Financial</Badge>
            )}
            {(draft.formData.methodology || (draft.formData.supporting_documents && draft.formData.supporting_documents.length > 0)) && (
              <Badge variant="outline" className="text-xs">Step 3: Proposal</Badge>
            )}
            {draft.formData.agree_to_terms && (
              <Badge variant="outline" className="text-xs">Step 4: Review</Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex-1"></div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleContinue}
                size="sm"
                variant="outline"
                className="cursor-pointer"
              >
                <Edit className="h-4 w-4 mr-1.5" />
                Edit
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                size="sm"
                className="cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
