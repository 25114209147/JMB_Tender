import { useState, useEffect, useCallback } from "react"
import { getUsers } from "@/lib/users"
import type { UserResponse } from "@/lib/auth"
import type { UserFilters } from "@/lib/users"
import { ApiClientError } from "@/lib/api"

interface UseUsersResult {
  users: UserResponse[]
  loading: boolean
  error: string | null
  total: number
  page: number
  totalPages: number
  refetch: () => Promise<void>
}

export function useUsers(filters?: UserFilters): UseUsersResult {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(filters?.page || 1)
  const [totalPages, setTotalPages] = useState(0)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await getUsers(filters)
      
      setUsers(response.users)
      setTotal(response.total)
      setPage(response.page)
      setTotalPages(response.total_pages)
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.detail)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to load users")
      }
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    users,
    loading,
    error,
    total,
    page,
    totalPages,
    refetch: fetchUsers,
  }
}
