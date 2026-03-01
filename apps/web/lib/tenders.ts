import { api, ApiClientError } from "./api"
import type {
  Tender,
  TenderListResponse,
  TenderCreateRequest,
  TenderUpdateRequest,
  TenderFilters,
} from "@/data/tenders/tender-types"

// Get list of tenders with optional filters
export async function getTenders(
  filters?: TenderFilters
): Promise<TenderListResponse> {
  try {
    // Only include params that are defined and valid
    const params: Record<string, any> = {}
    if (filters?.page !== undefined && filters.page > 0) {
      params.page = filters.page
    }
    if (filters?.page_size !== undefined && filters.page_size > 0) {
      params.page_size = filters.page_size
    }
    if (filters?.status) {
      params.status = filters.status
    }
    
    return await api.get<TenderListResponse>("/tenders/", { params })
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new Error("Failed to fetch tenders. Please try again.")
  }
}

 //Get a single tender by ID
export async function getTender(tenderId: number): Promise<Tender> {
  try {
    return await api.get<Tender>(`/tenders/${tenderId}`)
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new Error("Failed to fetch tender details. Please try again.")
  }
}

//Create a new tender
export async function createTender(
  data: TenderCreateRequest
): Promise<Tender> {
  try {
    return await api.post<Tender>("/tenders/create", data)
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new Error("Failed to create tender. Please try again.")
  }
}

//Update an existing tender
export async function updateTender(
  tenderId: number,
  data: TenderUpdateRequest
): Promise<Tender> {
  try {
    return await api.patch<Tender>(`/tenders/${tenderId}`, data)
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new Error("Failed to update tender. Please try again.")
  }
}

//Delete a tender
export async function deleteTender(tenderId: number): Promise<void> {
  try {
    await api.delete<void>(`/tenders/${tenderId}`)
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new Error(error.detail || "Failed to delete tender. Please try again.")
    }
    throw new Error("Failed to delete tender. Please try again.")
  }
}

//Get current user's tenders (Owner only)
export async function getMyTenders(
  page: number = 1,
  pageSize: number = 10
): Promise<TenderListResponse> {
  try {
    return await api.get<TenderListResponse>("/tenders/my/tenders", {
      params: {
        page,
        page_size: pageSize,
      },
    })
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new Error("Failed to fetch your tenders. Please try again.")
  }
}

//Publish a draft tender (change status to 'open')
export async function publishTender(tenderId: number): Promise<Tender> {
  return updateTender(tenderId, { status: "open" })
}

// Close a tender (change status to 'closed')
export async function closeTender(tenderId: number): Promise<Tender> {
  return updateTender(tenderId, { status: "closed" })
}

// Cancel a tender (change status to 'cancelled')
export async function cancelTender(tenderId: number): Promise<Tender> {
  return updateTender(tenderId, { status: "cancelled" })
}
