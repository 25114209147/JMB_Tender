import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { getBids } from "@/lib/bids"
import type { Bid, BidFilters, BidListResponse } from "@/data/bids/bid-types"
import { ApiClientError } from "@/lib/api"

interface UseBidsResult {
  bids: Bid[]
  loading: boolean
  error: string | null
  total: number
  page: number
  totalPages: number
  refetch: () => Promise<void>
  updateBidStatus: (bidId: number, status: string) => void
}

// Helper to create a stable filter key for comparison
function getFilterKey(filters?: BidFilters): string {
  if (!filters) return "default"
  return JSON.stringify({
    page: filters.page,
    page_size: filters.page_size,
    tender_id: filters.tender_id,
    status: filters.status,
  })
}

// In-memory cache for bids
const bidsCache = new Map<string, { data: BidListResponse; timestamp: number }>()
const CACHE_DURATION = 30 * 1000 // 30 seconds cache

export function useBids(filters?: BidFilters): UseBidsResult {
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(filters?.page || 1)
  const [totalPages, setTotalPages] = useState(0)
  
  // Use ref to track previous filter key and prevent unnecessary refetches
  const prevFilterKeyRef = useRef<string>("")
  const filtersRef = useRef<BidFilters | undefined>(filters)

  // Update ref when filters change
  useEffect(() => {
    filtersRef.current = filters
  }, [filters])

  // Memoize filter key to detect actual changes
  const filterKey = useMemo(() => getFilterKey(filters), [filters])

  const fetchBids = useCallback(async () => {
    const currentFilters = filtersRef.current
    const filterKey = getFilterKey(currentFilters)
    
    // Check cache first
    const cached = bidsCache.get(filterKey)
    const now = Date.now()
    
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      // Use cached data
      setBids(cached.data.bids)
      setTotal(cached.data.total)
      setPage(cached.data.page)
      setTotalPages(cached.data.total_pages)
      setLoading(false)
      setError(null)
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      const response = await getBids(currentFilters)
      
      // Cache the response
      bidsCache.set(filterKey, { data: response, timestamp: now })
      
      setBids(response.bids)
      setTotal(response.total)
      setPage(response.page)
      setTotalPages(response.total_pages)
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.detail)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to load bids")
      }
      setBids([])
    } finally {
      setLoading(false)
    }
  }, []) // Empty deps - use refs instead

  useEffect(() => {
    // Only fetch if filter key actually changed
    if (prevFilterKeyRef.current !== filterKey) {
      prevFilterKeyRef.current = filterKey
      fetchBids()
    }
  }, [filterKey, fetchBids])

  // Optimistically update bid status without refetching
  const updateBidStatus = useCallback((bidId: number, status: string) => {
    setBids(currentBids => 
      currentBids.map(bid => 
        bid.id === bidId ? { ...bid, status } : bid
      )
    )
    
    // Update cache as well
    const cached = bidsCache.get(filterKey)
    if (cached) {
      const updatedBids = cached.data.bids.map(bid =>
        bid.id === bidId ? { ...bid, status } : bid
      )
      bidsCache.set(filterKey, {
        data: { ...cached.data, bids: updatedBids },
        timestamp: cached.timestamp
      })
    }
  }, [filterKey])

  return {
    bids,
    loading,
    error,
    total,
    page,
    totalPages,
    refetch: fetchBids,
    updateBidStatus,
  }
}
