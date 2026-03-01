/**
 * Bid Form Data Types, Converters & Services
 * 
 * This module provides everything needed for bid form management:
 * 
 * 1. Types & Interfaces
 *    - BidFormData: Form state structure (what users fill)
 *    - BidFormDataWithTender: Extended form data with tender context
 *    - Default values for form initialization
 * 
 * 2. Type Conversion Utilities
 *    - formDataToBid: Convert form data → Bid entity (for API submission)
 *    - bidToFormData: Convert Bid entity → form data (for editing/pre-population)
 * 
 * 3. Mock Data
 *    - demoBidFormData: Pre-filled demo data for testing
 *    - mockDraftBidFormData: Partial draft data example
 * 
 * 4. Mock Service Functions
 *    - mockSubmitBid: Simulate bid submission
 *    - mockSaveDraftBid: Simulate draft saving
 *    - mockGetBid: Simulate fetching existing bid
 * 
 * 5. Validation (re-exported)
 *    - All validation functions are re-exported from bids-form-validation.ts
 *    - See bids-form-validation.ts for validation logic
 * 
 * File Organization:
 * - bids.ts: Bid entity type + mock bid data (API/domain model)
 * - bids-form.ts: Form types + converters + services (this file)
 * - bids-form-validation.ts: All validation logic (separated for clarity)
 * 
 * Backend Migration Guide:
 * - Replace mock service functions with actual API calls
 * - Update types to match backend schema
 * - Keep form data types separate from entity types for flexibility
 * - Validation can remain client-side but add server-side validation too
 */

import type { Tender } from "./tenders"
import type { Bid } from "./bids"

// Form Data Types (for form state)
export interface BidFormData {
  company_name: string
  company_registration: string
  company_address: string
  contact_person_name: string
  contact_person_phone: string
  contact_person_email: string
  company_website?: string 

  // 2. Financial Proposal
  proposed_amount: string 
  include_sst: boolean 
  payment_terms: string 
  validity_period_days: number 

  // 3. Technical Proposal
  supporting_documents: string[] 
  methodology?: string 
  proposed_timeline?: string 

  agree_to_terms: boolean
}

// Extended form data with tender context (used internally)
export interface BidFormDataWithTender extends BidFormData {
  tender_id: number
}

// Default Empty Form Values
export const defaultBidFormValues: BidFormData = {
  // Company & Contact
  company_name: "",
  company_registration: "",
  company_address: "",
  contact_person_name: "",
  contact_person_phone: "",
  contact_person_email: "",
  company_website: "",

  // Financial Proposal 
  proposed_amount: "",
  include_sst: false,
  payment_terms: "",
  validity_period_days: 0,

  // Technical Proposal
  supporting_documents: [],
  methodology: "",
  proposed_timeline: "",

  // Declaration
  agree_to_terms: false,
}

// Type Conversion Utilities
export function formDataToBid(
  formData: BidFormDataWithTender,
  tender: Tender,
  bidId?: string
): Omit<Bid, "tender"> & { tender: Tender } {
  return {
    id: bidId || `bid-${Date.now()}`,
    tender_id: String(formData.tender_id),
    tender,
    company_name: formData.company_name,
    company_registration: formData.company_registration || undefined,
    years_of_experience: undefined,
    proposed_amount: parseFloat(formData.proposed_amount) || 0,
    timeline: formData.proposed_timeline || undefined,
    cover_letter: formData.methodology || undefined,
    proposal_document: formData.supporting_documents[0] || undefined,
    status: "submitted",
    created_at: new Date().toISOString(),
    updated_at: undefined,
  }
}

export function bidToFormData(bid: Bid): BidFormData {
  return {
    company_name: bid.company_name,
    company_registration: bid.company_registration || "",
    company_address: "",
    contact_person_name: "",
    contact_person_phone: "",
    contact_person_email: "",
    company_website: "",
    proposed_amount: bid.proposed_amount.toString(),
    include_sst: false,
    payment_terms: "30 Days",
    validity_period_days: 90,
    supporting_documents: bid.proposal_document ? [bid.proposal_document] : [],
    methodology: bid.cover_letter || "",
    proposed_timeline: bid.timeline || "",
    agree_to_terms: true,
  }
}

// Mock Data (for testing/preview)
export const mockBidFormData: BidFormData = {
  // Company & Contact
  company_name: "Sparkle Clean Solutions Sdn Bhd",
  company_registration: "202301234567",
  company_address: "123 Business Park, Jalan Ampang, 50450 Kuala Lumpur, Malaysia",
  contact_person_name: "Ahmad bin Hassan",
  contact_person_phone: "+60123456789",
  contact_person_email: "ahmad@sparkleclean.com.my",
  company_website: "https://www.sparkleclean.com.my",

  // Financial Proposal
  proposed_amount: "82000",
  include_sst: true,
  payment_terms: "Progressive",
  validity_period_days: 90,

  // Technical Proposal
  supporting_documents: [
    "https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/ssm-certificate.pdf/view",
    "https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/insurance-cert.pdf/view",
    "https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/references.pdf/view",
  ],
  methodology: "We are a certified cleaning service provider with 8+ years of experience in commercial high-rise buildings. Our team consists of 25 trained personnel and we use eco-friendly products. We commit to daily cleaning, weekly deep cleaning, and monthly maintenance checks. References from similar projects available upon request.",
  proposed_timeline: "Ready to commence within 10 working days; 6-month contract execution",

  // Declaration
  agree_to_terms: true,
}

export const demoBidFormData = mockBidFormData

export const mockDraftBidFormData: BidFormData = {
  // Company & Contact
  company_name: "Sparkle Clean Solutions Sdn Bhd",
  company_registration: "202301234567",
  company_address: "",
  contact_person_name: "",
  contact_person_phone: "",
  contact_person_email: "",
  company_website: "",

  // Financial Proposal
  proposed_amount: "82000",
  include_sst: false,
  payment_terms: "30 Days",
  validity_period_days: 90,

  // Technical Proposal
  supporting_documents: [],
  methodology: "Draft in progress...",
  proposed_timeline: "",

  // Declaration
  agree_to_terms: false,
}

// Mock Service Functions (replace with API calls)
export async function mockSubmitBid(
  formData: BidFormDataWithTender,
  tender: Tender
): Promise<Bid> {
  await new Promise((resolve) => setTimeout(resolve, 1200))
  if (Math.random() < 0.05) throw new Error("Network error: Failed to submit bid")
  return formDataToBid(formData, tender)
}

export async function mockSaveDraftBid(
  formData: BidFormDataWithTender,
  tender: Tender
): Promise<Bid> {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return formDataToBid(formData, tender)
}

export async function mockGetBid(tenderId: string, bidId: string): Promise<Bid | null> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return null
}
