/**
 * useTenders Hook
 * 
 * React hook for fetching and managing tender data
 * Provides loading, error, and data states
 * 
 * Usage:
 * ```tsx
 * const { tenders, loading, error, refetch } = useTenders({ status: 'open' })
 * ```
 */

import { useState, useEffect, useCallback } from "react"
import { getTenders } from "@/lib/tenders"
import type { Tender, TenderFilters } from "@/data/tenders/tender-types"
import { ApiClientError } from "@/lib/api"

interface UseTendersResult {
  tenders: Tender[]
  loading: boolean
  error: string | null
  total: number
  page: number
  totalPages: number
  refetch: () => Promise<void>
}

export function useTenders(filters?: TenderFilters): UseTendersResult {
  const [tenders, setTenders] = useState<Tender[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(filters?.page || 1)
  const [totalPages, setTotalPages] = useState(0)

  const fetchTenders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await getTenders(filters)
      
      setTenders(response.tenders)
      setTotal(response.total)
      setPage(response.page)
      setTotalPages(response.total_pages)
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.detail)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to load tenders")
      }
      setTenders([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchTenders()
  }, [fetchTenders])

  return {
    tenders,
    loading,
    error,
    total,
    page,
    totalPages,
    refetch: fetchTenders,
  }
}
