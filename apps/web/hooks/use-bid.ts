import { useState, useEffect, useCallback } from "react"
import { getBid } from "@/lib/bids"
import type { Bid } from "@/data/bids/bid-types"
import { ApiClientError } from "@/lib/api"

interface UseBidResult {
  bid: Bid | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useBid(bidId: number | null): UseBidResult {
  const [bid, setBid] = useState<Bid | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBid = useCallback(async () => {
    if (!bidId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const data = await getBid(bidId)
      setBid(data)
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.detail)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to load bid")
      }
      setBid(null)
    } finally {
      setLoading(false)
    }
  }, [bidId])

  useEffect(() => {
    fetchBid()
  }, [fetchBid])

  return {
    bid,
    loading,
    error,
    refetch: fetchBid,
  }
}
