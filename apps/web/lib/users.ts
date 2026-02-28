import { api, ApiClientError } from "./api"
import type { UserResponse } from "./auth"

export interface UserListResponse {
  users: UserResponse[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface UserFilters {
  page?: number
  page_size?: number
}

/**
 * Get paginated list of users (Admin only)
 */
export async function getUsers(
  filters?: UserFilters
): Promise<UserListResponse> {
  try {
    return await api.get<UserListResponse>("/users/", {
      params: {
        page: filters?.page,
        page_size: filters?.page_size,
      },
    })
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new Error("Failed to fetch users. Please try again.")
  }
}
