/**
 * Wrapper hook that combines data fetching logic for tender list pages
 * Handles both useTenders and useMyTenders hooks
 * Applies client-side filtering if needed
 * This reduces redundancy in TenderListPage component
 */

import { useMemo } from "react"
import { useTenders } from "./use-tenders"
import { useMyTenders } from "./use-my-tenders"
import type { TenderFilters } from "@/data/tenders/tender-types"
import type { Tender } from "@/data/tenders/tender-types"

interface UseTenderListOptions {
  filters?: TenderFilters
  useMyTendersHook?: boolean
  clientSideFilter?: (tender: Tender) => boolean
}

interface UseTenderListResult {
  tenders: Tender[]
  loading: boolean
  error: string | null
  total: number
  page: number
  totalPages: number
  refetch: () => Promise<void>
}

export function useTenderList({
  filters,
  useMyTendersHook = false,
  clientSideFilter,
}: UseTenderListOptions = {}): UseTenderListResult {
  // Use appropriate hook based on prop
  const tendersQuery = useMyTendersHook
    ? useMyTenders(filters?.page || 1, filters?.page_size || 10)
    : useTenders(filters)

  const { tenders: rawTenders, loading, error, total, page, totalPages, refetch } = tendersQuery

  // Apply client-side filter if provided
  const tenders = useMemo(() => {
    if (clientSideFilter) {
      return rawTenders.filter(clientSideFilter)
    }
    return rawTenders
  }, [rawTenders, clientSideFilter])

  return {
    tenders,
    loading,
    error,
    total,
    page,
    totalPages,
    refetch,
  }
}
