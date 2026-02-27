/**
 * useCurrentUser Hook
 * 
 * Fetches and caches the current logged-in user's information
 * Only fetches if user is authenticated (has token)
 * Uses in-memory cache to prevent duplicate API calls
 * 
 * Usage:
 * ```tsx
 * const { user, loading, error } = useCurrentUser()
 * ```
 */

import { useState, useEffect, useRef } from "react"
import { getCurrentUser, getToken } from "@/lib/auth"
import type { UserResponse } from "@/lib/auth"
import { ApiClientError } from "@/lib/api"

interface UseCurrentUserResult {
  user: UserResponse | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// In-memory cache to prevent duplicate API calls
let userCache: UserResponse | null = null
let cachePromise: Promise<UserResponse> | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Clear the user cache
 * Call this after login/logout to force a refetch
 */
export function clearUserCache(): void {
  userCache = null
  cachePromise = null
  cacheTimestamp = 0
}

export function useCurrentUser(): UseCurrentUserResult {
  const [user, setUser] = useState<UserResponse | null>(userCache)
  const [loading, setLoading] = useState(!userCache)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchUser = async () => {
    // Check if user is authenticated
    const token = getToken()
    if (!token) {
      if (mountedRef.current) {
        setLoading(false)
        setUser(null)
      }
      clearUserCache()
      return
    }

    // Check cache validity
    const now = Date.now()
    if (userCache && (now - cacheTimestamp) < CACHE_DURATION) {
      if (mountedRef.current) {
        setUser(userCache)
        setLoading(false)
      }
      return
    }

    // If there's already a pending request, wait for it
    if (cachePromise) {
      try {
        const cachedUser = await cachePromise
        if (mountedRef.current) {
          setUser(cachedUser)
          setLoading(false)
        }
        return
      } catch {
        // If cached promise fails, continue to fetch
        cachePromise = null
      }
    }

    try {
      if (mountedRef.current) {
        setLoading(true)
        setError(null)
      }
      
      // Create promise and cache it
      cachePromise = getCurrentUser()
      const userData = await cachePromise
      
      // Update cache
      userCache = userData
      cacheTimestamp = now
      cachePromise = null
      
      if (mountedRef.current) {
        setUser(userData)
      }
    } catch (err) {
      cachePromise = null
      
      if (err instanceof ApiClientError) {
        // If 401, token is invalid - clear cache
        if (err.status === 401) {
          clearUserCache()
          if (mountedRef.current) {
            setUser(null)
          }
        }
        if (mountedRef.current) {
          setError(err.detail)
        }
      } else if (err instanceof Error) {
        if (mountedRef.current) {
          setError(err.message)
        }
      } else {
        if (mountedRef.current) {
          setError("Failed to load user data")
        }
      }
      
      if (mountedRef.current) {
        setUser(null)
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    mountedRef.current = true
    fetchUser()
    
    return () => {
      mountedRef.current = false
    }
  }, [])

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  }
}
