import { useState, useEffect, useCallback } from "react"
import { getTenderBids } from "@/lib/bids"
import type { Bid } from "@/data/bids/bid-types"
import { ApiClientError } from "@/lib/api"

interface UseTenderBidsResult {
  bids: Bid[]
  loading: boolean
  error: string | null
  total: number
  page: number
  totalPages: number
  refetch: () => Promise<void>
}

export function useTenderBids(
  tenderId: number | null,
  page: number = 1,
  pageSize: number = 10
): UseTenderBidsResult {
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(page)
  const [totalPages, setTotalPages] = useState(0)

  const fetchBids = useCallback(async () => {
    if (!tenderId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await getTenderBids(tenderId, currentPage, pageSize)
      
      setBids(response.bids)
      setTotal(response.total)
      setCurrentPage(response.page)
      setTotalPages(response.total_pages)
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.detail)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to load tender bids")
      }
      setBids([])
    } finally {
      setLoading(false)
    }
  }, [tenderId, currentPage, pageSize])

  useEffect(() => {
    fetchBids()
  }, [fetchBids])

  return {
    bids,
    loading,
    error,
    total,
    page: currentPage,
    totalPages,
    refetch: fetchBids,
  }
}
