const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface ApiErrorResponse {
  detail?: string | Array<{
    type: string
    loc: string[]
    msg: string
    input?: unknown
  }>
  message?: string
}

export class ApiClientError extends Error {
  status: number
  detail: string

  constructor(status: number, detail: string) {
    super(detail)
    this.name = "ApiClientError"
    this.status = status
    this.detail = detail
  }
}

/* =========================================================
   Auth Helpers
========================================================= */

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  const token = localStorage.getItem("access_token")
  
  // Check if token is about to expire (within 1 minute)
  if (token) {
    const expiryTime = localStorage.getItem("token_expiry")
    if (expiryTime) {
      const expiryMs = parseInt(expiryTime, 10)
      const now = Date.now()
      const timeUntilExpiry = expiryMs - now
      
      // If token expires in less than 1 minute, treat as expired
      if (timeUntilExpiry < 60000) {
        removeAuthToken()
        return null
      }
    }
  }
  
  return token
}

export function setAuthToken(token: string, expiresIn?: number): void {
  if (typeof window === "undefined") return
  localStorage.setItem("access_token", token)
  
  // Default to 30 minutes if not specified
  const expirationTime = Date.now() + ((expiresIn || 1800) * 1000)
  localStorage.setItem("token_expiry", expirationTime.toString())
}

export function removeAuthToken(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("access_token")
  localStorage.removeItem("token_expiry")
}

/* =========================================================
   Core Fetch Logic
========================================================= */

interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined>
  skipAuth?: boolean
  body?: unknown
}

function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>) {
  const url = new URL(`${API_BASE_URL}${endpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  return url.toString()
}

function getRequestBody(body: unknown): BodyInit | null | undefined {
  if (body === undefined || body === null) {
    return undefined
  }
  
  if (body instanceof FormData) {
    return body
  }
  
  if (typeof body === "string") {
    return body
  }
  
  // For all other types, try to JSON.stringify
  try {
    return JSON.stringify(body)
  } catch {
    // If JSON.stringify fails, return undefined
    return undefined
  }
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, skipAuth, headers, body, ...rest } = options

  const token = getAuthToken()

  const finalHeaders: HeadersInit = {
    ...(!(body instanceof FormData) && { "Content-Type": "application/json" }),
    ...(headers as Record<string, string>),
  }

  if (token && !skipAuth) {
    finalHeaders["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(buildUrl(endpoint, params), {
    ...rest,
    headers: finalHeaders,
    body: getRequestBody(body),
    credentials: "include",
  })

  return handleResponse<T>(response)
}

async function handleResponse<T>(response: Response): Promise<T> {
  // Handle 204 No Content (common for DELETE requests)
  if (response.status === 204) {
    return null as T
  }

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`

    try {
      // Clone response to read body without consuming the original
      const clonedResponse = response.clone()
      const errorData: ApiErrorResponse = await clonedResponse.json()
      
      // Handle FastAPI validation errors (array format)
      if (Array.isArray(errorData.detail)) {
        // Extract all error messages and join them, or use the first one
        const messages = errorData.detail
          .map((err) => {
            // Format: "field_name: error message" or just "error message"
            const field = err.loc && err.loc.length > 1 ? err.loc[err.loc.length - 1] : null
            return field ? `${field}: ${err.msg}` : err.msg
          })
          .filter(Boolean)
        
        errorMessage = messages.length > 0 
          ? messages.join(". ") 
          : errorMessage
      } else if (typeof errorData.detail === "string") {
        // Handle simple string errors
        errorMessage = errorData.detail
      } else if (errorData.message) {
        errorMessage = errorData.message
      }
    } catch {
      // If JSON parsing fails, use status text
      errorMessage = response.statusText || `HTTP ${response.status}`
    }

    // Auto logout on 401
    if (response.status === 401) {
      removeAuthToken()
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    }

    throw new ApiClientError(response.status, errorMessage)
  }

  // For successful responses, check content-type before parsing
  const contentType = response.headers.get("content-type")
  
  // If no content-type or not JSON, return null (empty response)
  if (!contentType || !contentType.includes("application/json")) {
    return null as T
  }

  // Try to parse JSON, but handle empty responses gracefully
  try {
    const text = await response.text()
    if (!text || text.trim() === "") {
      return null as T
    }
    return JSON.parse(text) as T
  } catch {
    // If JSON parsing fails and status is successful, assume empty response
    return null as T
  }
}

/* =========================================================
   Public API Methods
========================================================= */

export const api = {
  get<T>(endpoint: string, options?: Omit<RequestOptions, 'body' | 'method'>) {
    return apiFetch<T>(endpoint, { ...options, method: "GET" })
  },

  post<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'body' | 'method'>) {
    return apiFetch<T>(endpoint, {
      ...options,
      method: "POST",
      body,
    })
  },

  put<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'body' | 'method'>) {
    return apiFetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body,
    })
  },

  patch<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'body' | 'method'>) {
    return apiFetch<T>(endpoint, {
      ...options,
      method: "PATCH",
      body,
    })
  },

  delete<T>(endpoint: string, options?: Omit<RequestOptions, 'body' | 'method'>) {
    return apiFetch<T>(endpoint, { ...options, method: "DELETE" })
  },
}