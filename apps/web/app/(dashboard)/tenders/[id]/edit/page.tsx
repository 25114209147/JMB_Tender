"use client"

import { notFound, useRouter } from "next/navigation"
import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Stepper from "@/components/ui/stepper"
import { STEPS } from "../../create/constants"
import { FormData, emptyFormData } from "@/data/create-tender-form"
import Step1Basic from "../../create/components/step1-basic-info"
import Step2Property from "../../create/components/step2-property-info"
import Step3ScopeRequirements from "../../create/components/step3-scope-requirements"
import Step4BudgetTimeline from "../../create/components/step4-budget-timeline"
import Step5ReviewSubmit from "../../create/components/step5-review-submit"
import { useFormState } from "@/hooks/use-form-state"
import { useTender } from "@/hooks/use-tender"
import { updateTender } from "@/lib/tenders"
import { ApiClientError } from "@/lib/api"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import PageHeader from "@/components/shared/page-header"

export default function TenderEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const tenderId = parseInt(id)
  const [currentStep, setCurrentStep] = useState(1)
  const { formData, updateField, loadData } = useFormState<FormData>(emptyFormData)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ✅ Fetch tender data from API
  const { tender, loading: tenderLoading, error: tenderError } = useTender(tenderId)

  // Load tender data into form
  useEffect(() => {
    if (tender && !dataLoaded) {
      // Convert tender data to form format
      const formDataFromTender: FormData = {
        title: tender.title,
        description: tender.description || "",
        service_type: tender.service_type,
        custom_service_type: tender.custom_service_type,
        property_name: tender.property_name,
        property_address_line_1: tender.property_address_line_1,
        property_address_line_2: tender.property_address_line_2 || "",
        property_city: tender.property_city,
        property_state: tender.property_state,
        property_postcode: tender.property_postcode,
        property_country: tender.property_country,
        scope_of_work: tender.scope_of_work,
        contract_period_days: String(tender.contract_period_days),
        contract_start_date: tender.contract_start_date,
        contract_end_date: tender.contract_end_date,
        required_licenses: tender.required_licenses,
        custom_licenses: tender.custom_licenses || [],
        evaluation_criteria: tender.evaluation_criteria,
        tender_fee: String(tender.tender_fee),
        min_budget: String(tender.min_budget),
        max_budget: String(tender.max_budget),
        closing_date: tender.closing_date,
        closing_time: tender.closing_time,
        site_visit_date: tender.site_visit_date,
        site_visit_time: tender.site_visit_time,
        contact_person: tender.contact_person,
        contact_email: tender.contact_email,
        contact_phone: tender.contact_phone,
        tender_documents: tender.tender_documents || [],
        status: tender.status,
        created_at: tender.created_at,
        updated_at: tender.updated_at,
      }
      
      loadData(formDataFromTender)
      setDataLoaded(true)
    }
  }, [tender, dataLoaded, loadData])

  // Handle loading state
  if (tenderLoading) {
    return <LoadingSpinner message="Loading tender..." />
  }

  // Handle error state
  if (tenderError) {
    return (
      <ErrorMessage
        title="Failed to load tender"
        message={tenderError}
        onRetry={() => window.location.reload()}
      />
    )
  }

  // Handle not found
  if (!tender) {
    notFound()
  }

  const totalWeight = formData.evaluation_criteria.reduce((sum, item) => sum + item.weight, 0)

  const handleSubmit = async () => {
    // Validate evaluation criteria weights
    if (totalWeight !== 100) {
      setError("Evaluation criteria weights must sum to 100")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      // Convert form data to API format
      const updateData = {
        title: formData.title,
        description: formData.description,
        service_type: formData.service_type,
        custom_service_type: formData.custom_service_type,
        property_name: formData.property_name,
        property_address_line_1: formData.property_address_line_1,
        property_address_line_2: formData.property_address_line_2,
        property_city: formData.property_city,
        property_state: formData.property_state,
        property_postcode: formData.property_postcode,
        property_country: formData.property_country,
        scope_of_work: formData.scope_of_work,
        contract_period_days: formData.contract_period_days 
          ? parseInt(formData.contract_period_days, 10) 
          : 0,
        contract_start_date: formData.contract_start_date,
        contract_end_date: formData.contract_end_date,
        required_licenses: formData.required_licenses,
        custom_licenses: formData.custom_licenses,
        evaluation_criteria: formData.evaluation_criteria,
        tender_fee: formData.tender_fee 
          ? parseFloat(formData.tender_fee) 
          : 0,
        min_budget: formData.min_budget 
          ? parseFloat(formData.min_budget) 
          : 0,
        max_budget: formData.max_budget 
          ? parseFloat(formData.max_budget) 
          : 0,
        closing_date: formData.closing_date,
        closing_time: formData.closing_time,
        site_visit_date: formData.site_visit_date,
        site_visit_time: formData.site_visit_time,
        contact_person: formData.contact_person,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        tender_documents: formData.tender_documents || [],
        status: formData.status,
      }

      await updateTender(tenderId, updateData)
      router.push(`/tenders/${tenderId}`)
    } catch (err) {
      console.error("Error updating tender:", err)
      
      let errorMessage = "Failed to update tender. Please try again."
      if (err instanceof ApiClientError) {
        errorMessage = err.detail || errorMessage
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } finally {
      setSubmitting(false)
    }
  }

  const sharedProps = {
    formData,
    updateField,
  }

  const stepComponents = {
    1: Step1Basic,
    2: Step2Property,
    3: Step3ScopeRequirements,
    4: Step4BudgetTimeline,
    5: Step5ReviewSubmit,
  } as const

  const renderStepContent = () => {
    const StepComponent = stepComponents[currentStep as keyof typeof stepComponents]
    return StepComponent ? <StepComponent {...sharedProps} /> : null
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
      <PageHeader
        backHref={`/tenders/${tenderId}`}
        backLabel="Back to Tender"
        title="Edit Tender"
        description="Update tender information"
      />

      <Stepper
        steps={STEPS}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
      />

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mt-8 md:mt-10 min-h-[60vh] pb-24 md:pb-0">
        {renderStepContent()}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-10 md:static md:border-0 md:p-0 md:mt-12">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(currentStep - 1)}
            className={currentStep === 1 ? "cursor-not-allowed" : "cursor-pointer"}
          >
            Back
          </Button>

          {currentStep < STEPS.length ? (
            <Button
              type="button"
              size="sm"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="hover:cursor-pointer"
            >
              Next
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={handleSubmit}
              className="hover:cursor-pointer"
              disabled={submitting || totalWeight !== 100}
            >
              {submitting ? "Updating..." : "Update Tender"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
