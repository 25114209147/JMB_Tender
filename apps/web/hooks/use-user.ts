/**
 * useUser Hook
 * 
 * React hook for fetching a single user's profile data by ID
 * Used for viewing user details in admin panel
 */

import { useState, useEffect, useCallback } from "react"
import { getUserById } from "@/lib/users"
import type { UserResponse } from "@/lib/auth"
import { ApiClientError } from "@/lib/api"

interface UseUserResult {
  user: UserResponse | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useUser(userId: number): UseUserResult {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const userData = await getUserById(userId)
      setUser(userData)
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.detail)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to load user")
      }
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  }
}
