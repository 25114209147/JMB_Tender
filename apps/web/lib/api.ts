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
  return localStorage.getItem("access_token")
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem("access_token", token)
}

export function removeAuthToken(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("access_token")
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
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`

    try {
      const errorData: ApiErrorResponse = await response.json()
      
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

  if (response.status === 204) {
    return null as T
  }

  return response.json()
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