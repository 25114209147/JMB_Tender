// const { stats, loading, error, refetch } = useDashboardStats()

import { useState, useEffect, useCallback } from "react"
import { getTenders } from "@/lib/tenders"
import { ApiClientError } from "@/lib/api"
import type { Tender } from "@/data/tenders/tender-types"
import { differenceInDays, parseISO } from "date-fns"

export interface DashboardStats {
  // Card metrics
  total_tenders: number
  active_tenders: number
  completed_tenders: number
  draft_tenders: number
  total_bids: number
  total_value: number
  
  // Tenders closing within 7 days
  tenders_closing_soon: Tender[]
  
  // All tenders for reference
  all_tenders: Tender[]
}

interface UseDashboardStatsResult {
  stats: DashboardStats | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useDashboardStats(): UseDashboardStatsResult {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await getTenders({ page: 1, page_size: 100 })
      
      const now = new Date()
      
      // Filter tenders closing within 7 days
      const tendersClosingSoon = response.tenders.filter(tender => {
        if (tender.status !== 'open') return false
        
        try {
          const closingDate = parseISO(tender.closing_date)
          const daysUntil = differenceInDays(closingDate, now)
          return daysUntil >= 0 && daysUntil <= 7
        } catch {
          return false
        }
      })
      
      // Calculate total bids across all tenders
      const totalBids = response.tenders.reduce((sum, t) => sum + (t.total_bids || 0), 0)
      
      const dashboardStats: DashboardStats = {
        total_tenders: response.total,
        active_tenders: response.tenders.filter(t => t.status === 'open').length,
        completed_tenders: response.tenders.filter(t => t.status === 'closed' || t.status === 'awarded').length,
        draft_tenders: response.tenders.filter(t => t.status === 'draft').length,
        total_bids: totalBids,
        total_value: response.tenders.reduce((sum, t) => sum + (t.max_budget || 0), 0),
        tenders_closing_soon: tendersClosingSoon,
        all_tenders: response.tenders,
      }
      
      console.log("Calculated dashboard stats:", dashboardStats) 
      setStats(dashboardStats)
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.detail)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to load dashboard statistics")
      }
      setStats(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}
