import { api, ApiClientError } from "./api"
import type {
  Bid,
  BidListResponse,
  BidCreateRequest,
  BidUpdateRequest,
  BidFilters,
  BidStatus,
} from "@/data/bids/bid-types"

/**
 * Get list of bids with optional filters
 */
export async function getBids(filters?: BidFilters): Promise<BidListResponse> {
  try {
    return await api.get<BidListResponse>("/bids/", {
      params: {
        page: filters?.page,
        page_size: filters?.page_size,
        tender_id: filters?.tender_id,
        status: filters?.status,
      },
    })
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new Error("Failed to fetch bids. Please try again.")
  }
}

/**
 * Get a single bid by ID
 */
export async function getBid(bidId: number): Promise<Bid> {
  try {
    return await api.get<Bid>(`/bids/${bidId}`)
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new Error("Failed to fetch bid details. Please try again.")
  }
}

/**
 * Create a new bid
 */
export async function createBid(data: BidCreateRequest): Promise<Bid> {
  try {
    return await api.post<Bid>("/bids/create", data)
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new Error("Failed to create bid. Please try again.")
  }
}

/**
 * Update an existing bid
 */
export async function updateBid(
  bidId: number,
  data: BidUpdateRequest
): Promise<Bid> {
  try {
    return await api.patch<Bid>(`/bids/${bidId}`, data)
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new Error("Failed to update bid. Please try again.")
  }
}

/**
 * Delete a bid (or withdraw if submitted)
 */
export async function deleteBid(bidId: number): Promise<void> {
  try {
    await api.delete<void>(`/bids/${bidId}`)
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new Error("Failed to delete bid. Please try again.")
  }
}

/**
 * Get bids for a specific tender (Owner/Admin only)
 */
export async function getTenderBids(
  tenderId: number,
  page: number = 1,
  pageSize: number = 10
): Promise<BidListResponse> {
  try {
    return await api.get<BidListResponse>(`/bids/tender/${tenderId}/bids`, {
      params: {
        page,
        page_size: pageSize,
      },
    })
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new Error("Failed to fetch tender bids. Please try again.")
  }
}

/**
 * Get current user's bids
 */
export async function getMyBids(
  page: number = 1,
  pageSize: number = 10
): Promise<BidListResponse> {
  try {
    return await api.get<BidListResponse>("/bids/my/bids", {
      params: {
        page,
        page_size: pageSize,
      },
    })
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new Error("Failed to fetch your bids. Please try again.")
  }
}

/**
 * Award a bid (Owner/Admin only)
 */
export async function awardBid(bidId: number): Promise<Bid> {
  return updateBid(bidId, { status: "awarded" })
}

/**
 * Reject a bid (Owner/Admin only)
 */
export async function rejectBid(bidId: number): Promise<Bid> {
  return updateBid(bidId, { status: "rejected" })
}
