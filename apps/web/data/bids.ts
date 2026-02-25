import type { Tender } from "./tenders"
import { Users, CheckCircle, Clock, XCircle } from "lucide-react"
import type { SummaryCardData } from "@/components/layout/dashboard-summary-card"

// Bid Entity Type (returned from API)
export interface Bid {
  id: string
  tender_id: string
  tender?: Tender // Optional populated tender data
  company_name: string
  company_registration?: string
  years_of_experience?: number
  proposed_amount: number
  timeline?: string
  cover_letter?: string
  proposal_document?: string
  status: "pending" | "approved" | "rejected" | "withdrawn"
  created_at: string
  updated_at?: string
}

// Mock Bids Data
export const mockBids: Bid[] = [
  {
    id: "bid-1",
    tender_id: "1",
    company_name: "SecureGuard Services Sdn Bhd",
    company_registration: "202101234567",
    years_of_experience: 12,
    proposed_amount: 180000,
    timeline: "Can commence within 2 weeks; full 12-month contract",
    cover_letter: "We are a PSMB-certified security company with 12 years of experience managing residential properties. Our team includes 25 trained guards with expertise in visitor management systems and CCTV monitoring. We provide comprehensive insurance coverage and comply with all AKTA 2010 and BOMBA guidelines.",
    proposal_document: "https://drive.google.com/file/d/example1/proposal.pdf",
    status: "pending",
    created_at: "2026-02-20T10:30:00Z",
  },
  {
    id: "bid-2",
    tender_id: "1",
    company_name: "Elite Protection Services",
    company_registration: "202002345678",
    years_of_experience: 8,
    proposed_amount: 165000,
    timeline: "Ready to start March 1st, 2026",
    cover_letter: "Professional security services with modern technology integration. Our guards are equipped with real-time reporting systems and we maintain a 24/7 control center.",
    proposal_document: "https://drive.google.com/file/d/example2/proposal.pdf",
    status: "approved",
    created_at: "2026-02-19T14:15:00Z",
    updated_at: "2026-02-22T09:00:00Z",
  },
  {
    id: "bid-3",
    tender_id: "2",
    company_name: "Sparkle Clean Solutions Sdn Bhd",
    company_registration: "202301234567",
    years_of_experience: 8,
    proposed_amount: 82000,
    timeline: "Ready to commence within 10 working days; 6-month contract execution",
    cover_letter: "We are a certified cleaning service provider with 8+ years of experience in commercial high-rise buildings. Our team consists of 25 trained personnel and we use eco-friendly products. We commit to daily cleaning, weekly deep cleaning, and monthly maintenance checks. References from similar projects available upon request.",
    proposal_document: "https://drive.google.com/file/d/example3/proposal.pdf",
    status: "pending",
    created_at: "2026-02-18T11:00:00Z",
  },
  {
    id: "bid-4",
    tender_id: "2",
    company_name: "GreenClean Pro Services",
    company_registration: "201912345678",
    years_of_experience: 15,
    proposed_amount: 95000,
    timeline: "Available to start April 1st, 2026",
    cover_letter: "Eco-friendly cleaning solutions with ISO 14001 certification. We specialize in high-rise office buildings and use only green-certified products. Our team includes 40 trained staff members.",
    status: "pending",
    created_at: "2026-02-17T16:30:00Z",
  },
  {
    id: "bid-5",
    tender_id: "3",
    company_name: "Garden Paradise Landscaping",
    company_registration: "202005678901",
    years_of_experience: 10,
    proposed_amount: 48000,
    timeline: "Can begin May 1st, 2026; 2-year maintenance contract",
    cover_letter: "Specialized in luxury residential landscaping with a focus on sustainable practices. Our team has maintained over 30 high-end properties across Mont Kiara and KLCC areas.",
    proposal_document: "https://drive.google.com/file/d/example5/proposal.pdf",
    status: "pending",
    created_at: "2026-02-21T09:45:00Z",
  },
  {
    id: "bid-6",
    tender_id: "1",
    company_name: "Guardian Security Solutions",
    company_registration: "201809876543",
    years_of_experience: 15,
    proposed_amount: 205000,
    timeline: "Immediate availability; full compliance with all requirements",
    cover_letter: "Premium security services with advanced technology. We offer facial recognition systems, drone surveillance, and AI-powered threat detection. Our guards are ex-military personnel with extensive training.",
    status: "rejected",
    created_at: "2026-02-16T08:00:00Z",
    updated_at: "2026-02-23T11:30:00Z",
  },
]

// Summary Card Data (derived from mockBids)
export const allBidsCardData: SummaryCardData[] = [
  {
    title: "Total Bids",
    value: mockBids.length,
    icon: Users,
    link: "/all-bids",
  },
  {
    title: "Accepted Bids",
    value: mockBids.filter((b) => b.status === "approved").length,
    icon: CheckCircle,
    link: "/all-bids?status=approved",
  },
  {
    title: "Pending Review",
    value: mockBids.filter((b) => b.status === "pending").length,
    icon: Clock,
    link: "/all-bids?status=pending",
  },
  {
    title: "Rejected Bids",
    value: mockBids.filter((b) => b.status === "rejected").length,
    icon: XCircle,
    link: "/all-bids?status=rejected",
  },
]
