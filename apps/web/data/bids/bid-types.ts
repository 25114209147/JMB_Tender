export type BidStatus = "submitted" | "rejected" | "withdrawn" | "awarded"

export interface Bid {
  id: number
  tender_id: number
  user_id: number
  company_name: string
  company_registration: string
  company_address: string
  company_website?: string
  contact_person_name: string
  contact_person_phone: string
  contact_person_email: string
  proposed_amount: number
  include_sst: boolean
  payment_terms: string
  validity_period_days: number
  supporting_documents?: string[]
  methodology?: string
  proposed_timeline?: string
  agree_to_terms: boolean
  status: BidStatus
  tender_title: string
  created_at: string
  updated_at?: string
}

export interface BidCreateRequest {
  tender_id: number
  company_name: string
  company_registration: string
  company_address: string
  company_website?: string
  contact_person_name: string
  contact_person_phone: string
  contact_person_email: string
  proposed_amount: number
  include_sst: boolean
  payment_terms: string
  validity_period_days: number
  supporting_documents?: string[]
  methodology?: string
  proposed_timeline?: string
  agree_to_terms: boolean
}

export interface BidUpdateRequest {
  company_name?: string
  company_registration?: string
  company_address?: string
  company_website?: string
  contact_person_name?: string
  contact_person_phone?: string
  contact_person_email?: string
  proposed_amount?: number
  include_sst?: boolean
  payment_terms?: string
  validity_period_days?: number
  supporting_documents?: string[]
  methodology?: string
  proposed_timeline?: string
  agree_to_terms?: boolean
  status?: BidStatus
}

export interface BidListResponse {
  bids: Bid[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface BidFilters {
  page?: number
  page_size?: number
  tender_id?: number
  status?: BidStatus
}
