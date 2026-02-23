"use client"

import { use } from "react"
import Link from "next/link"
import { ChevronLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import ViewTenderDetails from "../components/view-tender-details"
import { mockTenders } from "@/data/tenders"
import { mockBids } from "@/data/bids"
import { FormData } from "@/data/create-tender-form"
import { useRole } from "@/contexts/role-context"
import { hasPermission } from "@/lib/roles"

export default function TenderViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { role } = useRole()
  const tender = mockTenders.find((t) => t.id === id)

  // Mock function to check if tender belongs to current owner
  const isOwnerTender = (tenderId: string): boolean => {
    // Mock: For demo, tenders with IDs "1" and "2" belong to the current owner
    // In production: return tender.owner_id === currentUser.id
    return tenderId === "1" || tenderId === "2"
  }

  // Mock function to check if current contractor has applied
  const hasContractorApplied = (tenderId: string): boolean => {
    // Mock: Check if there's a bid for this tender
    // In production: filter by current contractor's user ID
    return mockBids.some(bid => bid.tender_id === tenderId)
  }

  if (!tender) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Tender not found</p>
          <Link
            href="/tenders"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground border border-gray-200 rounded-md px-4 py-2 bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Tenders
          </Link>
        </div>
      </div>
    )
  }

  // Convert Tender to FormData format for Step5ReviewSubmit
  const formData: FormData = {
    title: tender.title,
    service_type: tender.service_type,
    custom_service_type: tender.custom_service_type,
    property_name: tender.property_name,
    property_address_line_1: tender.property_address_line_1,
    property_address_line_2: tender.property_address_line_2,
    property_city: tender.property_city,
    property_state: tender.property_state,
    property_postcode: tender.property_postcode,
    property_country: tender.property_country,
    scope_of_work: tender.scope_of_work,
    contract_period_days: tender.contract_period_days,
    contract_start_date: tender.contract_start_date,
    contract_end_date: tender.contract_end_date,
    required_licenses: tender.required_licenses,
    custom_licenses: tender.custom_licenses,
    evaluation_criteria: tender.evaluation_criteria,
    tender_fee: tender.tender_fee,
    min_budget: tender.min_budget,
    max_budget: tender.max_budget,
    closing_date: tender.closing_date,
    closing_time: tender.closing_time,
    site_visit_date: tender.site_visit_date,
    site_visit_time: tender.site_visit_time,
    contact_person: tender.contact_person,
    contact_email: tender.contact_email,
    contact_phone: tender.contact_phone,
    tender_documents: tender.tender_documents,
    status: tender.status,
    created_at: tender.created_at,
    updated_at: tender.updated_at,
  }

  const updateField = () => {}

  // Determine actions based on role
  const canEdit = 
    role === "admin" 
      ? (tender.status === "open" || tender.status === "draft")
      : role === "owner"
      ? isOwnerTender(tender.id) && (tender.status === "open" || tender.status === "draft")
      : false

  const canApply = 
    role === "contractor" && 
    tender.status === "open" && 
    !hasContractorApplied(tender.id)

  const hasApplied = 
    role === "contractor" && 
    tender.status === "open" && 
    hasContractorApplied(tender.id)

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/tenders"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground border border-gray-200 rounded-md px-4 py-2 bg-gray-50"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Tenders
        </Link>
        <div className="flex gap-2">
          {canApply && (
            <Link href={`/tenders/${tender.id}/apply`}>
              <Button className="cursor-pointer">Apply Now</Button>
            </Link>
          )}
          {hasApplied && (
            <Button variant="outline" disabled className="cursor-not-allowed">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Already Applied
            </Button>
          )}
          {canEdit && (
            <Link href={`/tenders/${tender.id}/edit`}>
              <Button variant="outline" className="cursor-pointer">Edit Tender</Button>
            </Link>
          )}
        </div>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-2">Tender Details</h1>
      <p className="text-muted-foreground mb-6 md:mb-8">View tender information</p>

      <ViewTenderDetails formData={formData} updateField={updateField} />
    </div>
  )
}
