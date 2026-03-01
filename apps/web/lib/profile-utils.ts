/**
 * Profile Utilities
 * 
 * Helper functions for checking contractor profile completion
 */

import type { UserResponse } from "./auth"

/**
 * Required fields for contractor profile completion
 */
const REQUIRED_CONTRACTOR_FIELDS = [
  "name",
  "company_name",
  "phone_number",
] as const

/**
 * Check if contractor profile is complete
 */
export function isContractorProfileComplete(user: UserResponse | null): boolean {
  if (!user || user.role !== "contractor") {
    return false
  }

  return REQUIRED_CONTRACTOR_FIELDS.every((field) => {
    const value = user[field]
    return value !== undefined && value !== null && String(value).trim() !== ""
  })
}

/**
 * Get list of missing profile fields
 */
export function getMissingProfileFields(user: UserResponse | null): string[] {
  if (!user || user.role !== "contractor") {
    return REQUIRED_CONTRACTOR_FIELDS.map((f) => f.replace(/_/g, " "))
  }

  const missing: string[] = []
  
  REQUIRED_CONTRACTOR_FIELDS.forEach((field) => {
    const value = user[field]
    if (!value || String(value).trim() === "") {
      missing.push(field.replace(/_/g, " "))
    }
  })

  return missing
}

/**
 * Get profile completion percentage
 */
export function getProfileCompletionPercentage(user: UserResponse | null): number {
  if (!user || user.role !== "contractor") {
    return 0
  }

  const totalFields = REQUIRED_CONTRACTOR_FIELDS.length
  const completedFields = REQUIRED_CONTRACTOR_FIELDS.filter((field) => {
    const value = user[field]
    return value !== undefined && value !== null && String(value).trim() !== ""
  }).length

  return Math.round((completedFields / totalFields) * 100)
}
