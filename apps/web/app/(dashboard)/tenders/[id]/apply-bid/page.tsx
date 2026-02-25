"use client"

import { useState, useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import { use } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/toast/toast"
import Stepper from "@/components/ui/stepper"
import { mockTenders } from "@/data/tenders"
import { Bid_Steps } from "./constants"
import Step1CompanyInfo from "./components/step1-company-info"
import Step2BidDetails from "./components/step2-bid-details"
import Step3Proposal from "./components/step3-proposal"
import Step4ReviewSubmit from "./components/step4-review-submit"
import type { BidFormData, BidFormDataWithTender } from "@/data/bids-form"
import {
  demoBidFormData,
  mockSubmitBid,
} from "@/data/bids-form"
import { validateBidFormData, canProceedToStep } from "@/data/bids-form-validation"
import { useFormState } from "@/hooks/use-form-state"
import PageHeader from "@/components/shared/page-header"

interface Props {
  params: Promise<{ id: string }>
}

export default function ApplyBidPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const { formData, updateField, setFormData, loadData } = useFormState<BidFormData>(demoBidFormData)

  const tender = mockTenders.find((t) => t.id === id) // In future: const tender = await fetchTender(id)

  // Load draft bid from localStorage, else use demo data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDraft = localStorage.getItem(`bid-draft-${id}`)
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft)
          loadData(draft)
        } catch (error) {
          console.error("Failed to load draft bid", error)
          loadData(demoBidFormData)
        }
      } else {
        loadData(demoBidFormData)
      }
    }
  }, [id])

  // Save draft to localStorage when form data changes
  useEffect(() => {
    if (typeof window !== "undefined" && formData.company_name) {
      localStorage.setItem(`bid-draft-${id}`, JSON.stringify(formData))
    }
  }, [formData, id])

  if (!tender) {
    notFound()
  }

  const handleSubmit = async () => {
    // Validate form data
    const validation = validateBidFormData(formData)
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0] ?? "Please fix the errors before submitting"
      toast.error(firstError)
      setCurrentStep(4) // Go to review step to show errors
      return
    }

    if (!formData.agree_to_terms) {
      toast.error("You must agree to the terms and conditions")
      return
    }

    setSubmitting(true)

    try {
      // Prepare form data with tender context
      const formDataWithTender: BidFormDataWithTender = {
        ...formData,
        tender_id: tender.id,
      }

      // Submit bid using mock service
      await mockSubmitBid(formDataWithTender, tender)

      // Clear draft from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem(`bid-draft-${id}`)
      }

      toast.success("Bid submitted successfully!")
      router.push("/bids")
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit bid. Please try again."
      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const sharedProps = {
    formData,
    updateField,
  }

  const stepComponents = {
    1: Step1CompanyInfo,
    2: Step2BidDetails,
    3: Step3Proposal,
    4: Step4ReviewSubmit,
  } as const

  const renderStepContent = () => {
    const StepComponent = stepComponents[currentStep as keyof typeof stepComponents]
    if (!StepComponent) return null

    // All steps receive tender for context
    return <StepComponent formData={formData} updateField={updateField} tender={tender} />
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
      <PageHeader
        backHref={`/tenders/${tender.id}`}
        backLabel="Back to Tender"
        title="Submit Your Bid"
        description={`Submit your bid for: ${tender.title}`}
      />

      <Stepper
        steps={Bid_Steps}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
      />

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

          {currentStep < Bid_Steps.length ? (
            <Button
              type="button"
              size="sm"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceedToStep(currentStep, formData)}
              className="hover:cursor-pointer disabled:cursor-not-allowed"
            >
              Next
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={handleSubmit}
              className="hover:cursor-pointer"
              disabled={submitting || !canProceedToStep(currentStep, formData)}
            >
              {submitting ? "Submitting..." : "Submit Bid"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
