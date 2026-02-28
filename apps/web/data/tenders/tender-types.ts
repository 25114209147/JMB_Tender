export type TenderStatus = "draft" | "open" | "closed" | "cancelled" | "awarded"

export interface EvaluationCriteria {
  criteria: string
  weight: number
}

export interface Tender {
  id: number
  created_at: string
  updated_at: string
  created_by_id?: number

  // Basic info
  title: string
  description?: string
  service_type: string
  custom_service_type?: string
  status: TenderStatus

  // Property details
  property_name: string
  property_address_line_1: string
  property_address_line_2?: string
  property_city: string
  property_state: string
  property_postcode: string
  property_country: string

  // Tender details
  scope_of_work: string
  contract_period_days: number
  contract_start_date: string // ISO date string
  contract_end_date: string   // ISO date string

  // Requirements
  required_licenses: string[]
  custom_licenses?: string[]
  evaluation_criteria: EvaluationCriteria[]

  // Financial
  tender_fee: number
  min_budget: number
  max_budget: number

  // Dates and contact
  closing_date: string  // ISO date string
  closing_time: string  // Time string "HH:MM"
  site_visit_date?: string
  site_visit_time?: string
  contact_person: string
  contact_email: string
  contact_phone: string
  tender_documents: string[]
  
  // Bid statistics (optional, populated by backend)
  total_bids?: number
  lowest_bid?: number
  highest_bid?: number
  average_bid?: number
}

/**
 * Response when fetching list of tenders
 */
export interface TenderListResponse {
  tenders: Tender[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

/**
 * Request body for creating a new tender
 */
export interface TenderCreateRequest {
  title: string
  description?: string
  service_type: string
  custom_service_type?: string
  property_name: string
  property_address_line_1: string
  property_address_line_2?: string
  property_city: string
  property_state: string
  property_postcode: string
  property_country: string
  scope_of_work: string
  contract_period_days: number
  contract_start_date: string
  contract_end_date: string
  required_licenses: string[]
  custom_licenses?: string[]
  evaluation_criteria: EvaluationCriteria[]
  tender_fee: number
  min_budget: number
  max_budget: number
  closing_date: string
  closing_time: string
  site_visit_date?: string
  site_visit_time?: string
  contact_person: string
  contact_email: string
  contact_phone: string
  tender_documents: string[]
  status?: TenderStatus
}

/**
 * Request body for updating a tender
 */
export interface TenderUpdateRequest {
  title?: string
  description?: string
  service_type?: string
  custom_service_type?: string
  property_name?: string
  property_address_line_1?: string
  property_address_line_2?: string
  property_city?: string
  property_state?: string
  property_postcode?: string
  property_country?: string
  scope_of_work?: string
  contract_period_days?: number
  contract_start_date?: string
  contract_end_date?: string
  required_licenses?: string[]
  custom_licenses?: string[]
  evaluation_criteria?: EvaluationCriteria[]
  tender_fee?: number
  min_budget?: number
  max_budget?: number
  closing_date?: string
  closing_time?: string
  site_visit_date?: string
  site_visit_time?: string
  contact_person?: string
  contact_email?: string
  contact_phone?: string
  tender_documents?: string[]
  status?: TenderStatus
}

/**
 * Query parameters for filtering tenders
 */
export interface TenderFilters {
  page?: number
  page_size?: number
  status?: TenderStatus
}
