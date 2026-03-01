import { useState, useEffect, useCallback } from "react"
import { getMyTenders } from "@/lib/tenders"
import type { Tender } from "@/data/tenders/tender-types"
import { ApiClientError } from "@/lib/api"

interface UseMyTendersResult {
  tenders: Tender[]
  loading: boolean
  error: string | null
  total: number
  page: number
  totalPages: number
  refetch: () => Promise<void>
}

export function useMyTenders(
  page: number = 1,
  pageSize: number = 10
): UseMyTendersResult {
  const [tenders, setTenders] = useState<Tender[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(page)
  const [totalPages, setTotalPages] = useState(0)

  const fetchTenders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await getMyTenders(currentPage, pageSize)
      
      setTenders(response.tenders)
      setTotal(response.total)
      setCurrentPage(response.page)
      setTotalPages(response.total_pages)
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.detail)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to load your tenders")
      }
      setTenders([])
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize])

  useEffect(() => {
    fetchTenders()
  }, [fetchTenders])

  return {
    tenders,
    loading,
    error,
    total,
    page: currentPage,
    totalPages,
    refetch: fetchTenders,
  }
}
