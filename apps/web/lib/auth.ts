import { api, setAuthToken, removeAuthToken, getAuthToken, ApiClientError } from "./api"
import type { LoginFormData, RegisterFormData } from "@/data/auth/auth-form"
import { clearUserCache } from "@/hooks/use-current-user"

export interface LoginResponse {
  access_token: string
  token_type: string
  user: {
    id: number
    email: string
    role: string
    name?: string
    company_name?: string
  }
}

export interface UserResponse {
  id: number
  email: string
  role: string
  name?: string
  company_name?: string
  phone_number?: string
  website?: string
  experience_years?: number
  bio?: string
}

/**
 * Register a new user
 */
export async function register(data: RegisterFormData): Promise<LoginResponse> {
  try {
    // Map frontend form data to backend API format
    const payload = {
      email: data.email,
      password: data.password,
      confirm_password: data.confirmPassword,
      role: data.userType 
    }

    const response = await api.post<LoginResponse>("/users/register", payload)
    
    // Store token for auto-login
    if (response.access_token) {
      setAuthToken(response.access_token, 1800) // 30 minutes
      // Clear cache to force fresh user fetch
      clearUserCache()
    }

    return response
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new Error("Registration failed. Please try again.")
  }
}

/**
 * Login with email and password
 */
export async function login(data: LoginFormData): Promise<LoginResponse> {
  try {
    // Backend uses JSON LoginRequest format
    const payload = {
      email: data.email,
      password: data.password,
      remember_me: data.rememberMe || false,
    }

    const response = await api.post<LoginResponse>("/users/login", payload)
    
    // Store token
    if (response.access_token) {
      setAuthToken(response.access_token, 1800) // 30 minutes
      
      // Store user email for display
      if (response.user?.email) {
        localStorage.setItem("user_email", response.user.email)
      }
      
      // Clear cache to force fresh user fetch
      clearUserCache()
    }

    return response
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new Error("Login failed. Please try again.")
  }
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<UserResponse> {
  return api.get<UserResponse>("/users/me")
}

/**
 * Update user profile
 */
export async function updateProfile(
  data: Partial<UserResponse>
): Promise<UserResponse> {
  return api.patch<UserResponse>("/users/me", data)
}

/**
 * Logout (clear token)
 */
export function logout(): void {
  removeAuthToken()
  localStorage.removeItem("user_email")
  
  // Clear user cache
  clearUserCache()
  
  // Redirect to login page
  if (typeof window !== "undefined") {
    window.location.href = "/login"
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null
}

/**
 * Get stored auth token
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("access_token")
}
