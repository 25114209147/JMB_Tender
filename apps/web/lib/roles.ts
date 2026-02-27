/**
 * User roles in the system
 */
export type UserRole = "JMB" | "contractor" | "admin"

/**
 * Mock role storage - In production, this would come from authentication/session
 * For development, you can change this value to test different roles
 */
const MOCK_ROLE_KEY = "mock_user_role"

/**
 * Get the current user role
 * In production, this would fetch from session/auth
 */
export function getCurrentRole(): UserRole {
  if (typeof window === "undefined") {
    // Server-side: default to JMB for now
    // In production, get from session/cookies
    return "JMB"
  }

  // Client-side: check localStorage for mock role
  const storedRole = localStorage.getItem(MOCK_ROLE_KEY)
  if (storedRole && ["JMB", "contractor", "admin"].includes(storedRole)) {
    return storedRole as UserRole
  }

  // Default role
  return "JMB"
}

/**
 * Set mock role (for development/testing)
 */
export function setMockRole(role: UserRole) {
  if (typeof window !== "undefined") {
    localStorage.setItem(MOCK_ROLE_KEY, role)
    // Trigger a reload to apply role changes
    window.location.reload()
  }
}

/**
 * Check if user has permission for an action
 */
export function hasPermission(role: UserRole, action: string): boolean {
  const permissions: Record<UserRole, string[]> = {
    JMB: [
      "tenders:create",
      "tenders:edit",
      "tenders:delete",
      "tenders:view",
      "bids:view",
      "bids:manage",
    ],
    contractor: [
      "tenders:view",
      "tenders:apply",
      "bids:create",
      "bids:view",
      "bids:withdraw",
    ],
    admin: [
      "tenders:create",
      "tenders:edit",
      "tenders:delete",
      "tenders:view",
      "tenders:manage_all",
      "bids:view",
      "bids:manage",
      "users:manage",
    ],
  }

  return permissions[role]?.includes(action) ?? false
}
