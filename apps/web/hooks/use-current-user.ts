/**
 * useCurrentUser Hook
 * 
 * Fetches and caches the current logged-in user's information
 * Only fetches if user is authenticated (has token)
 * 
 * Usage:
 * ```tsx
 * const { user, loading, error } = useCurrentUser()
 * ```
 */

import { useState, useEffect } from "react"
import { getCurrentUser, getToken } from "@/lib/auth"
import type { UserResponse } from "@/lib/auth"
import { ApiClientError } from "@/lib/api"

interface UseCurrentUserResult {
  user: UserResponse | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useCurrentUser(): UseCurrentUserResult {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = async () => {
    // Check if user is authenticated
    const token = getToken()
    if (!token) {
      setLoading(false)
      setUser(null)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const userData = await getCurrentUser()
      setUser(userData)
    } catch (err) {
      if (err instanceof ApiClientError) {
        // If 401, token is invalid - clear it
        if (err.status === 401) {
          setUser(null)
        }
        setError(err.detail)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to load user data")
      }
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  }
}
