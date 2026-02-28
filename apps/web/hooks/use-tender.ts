/**
 * useTender Hook (Single)
 * 
 * React hook for fetching a single tender by ID
 * 
 * Usage:
 * ```tsx
 * const { tender, loading, error, refetch } = useTender(tenderId)
 * ```
 */

import { useState, useEffect, useCallback } from "react"
import { getTender } from "@/lib/tenders"
import type { Tender } from "@/data/tenders/tender-types"
import { ApiClientError } from "@/lib/api"

interface UseTenderResult {
  tender: Tender | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useTender(tenderId: number | null): UseTenderResult {
  const [tender, setTender] = useState<Tender | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTender = useCallback(async () => {
    if (!tenderId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const data = await getTender(tenderId)
      setTender(data)
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.detail)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to load tender")
      }
      setTender(null)
    } finally {
      setLoading(false)
    }
  }, [tenderId])

  useEffect(() => {
    fetchTender()
  }, [fetchTender])

  return {
    tender,
    loading,
    error,
    refetch: fetchTender,
  }
}
