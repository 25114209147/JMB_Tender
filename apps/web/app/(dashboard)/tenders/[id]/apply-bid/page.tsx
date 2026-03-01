"use client"

import { useState, useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import { use } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/toast/toast"
import Stepper from "@/components/ui/stepper"
import { Bid_Steps } from "./constants"
import Step1CompanyInfo from "./components/step1-company-info"
import Step2BidDetails from "./components/step2-bid-details"
import Step3Proposal from "./components/step3-proposal"
import Step4ReviewSubmit from "./components/step4-review-submit"
import type { BidFormData } from "@/data/bids-form"
import {
  defaultBidFormValues,
} from "@/data/bids-form"
import { createBid } from "@/lib/bids"
import type { BidCreateRequest } from "@/data/bids/bid-types"
import { validateBidFormData, canProceedToStep } from "@/data/bids-form-validation"
import { useFormState } from "@/hooks/use-form-state"
import PageHeader from "@/components/shared/page-header"
import { useRole } from "@/contexts/role-context"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useTender } from "@/hooks/use-tender"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { isContractorProfileComplete, getMissingProfileFields } from "@/lib/profile-utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

interface Props {
  params: Promise<{ id: string }>
}

export default function ApplyBidPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  const { role } = useRole()
  const { user, loading: userLoading } = useCurrentUser()
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  // Initialize form with completely empty values - will be populated by useEffect
  const { formData, updateField, setFormData, loadData } = useFormState<BidFormData>(defaultBidFormValues)

  // Fetch tender from API
  const tenderId = parseInt(id)
  const { tender, loading: tenderLoading, error: tenderError, refetch } = useTender(tenderId)

  // Check if contractor profile is complete
  const profileComplete = isContractorProfileComplete(user)
  const missingFields = getMissingProfileFields(user)

  // Load draft bid from localStorage if exists, otherwise auto-fill from current user profile
  // IMPORTANT: Wait for user data to load before initializing form
  // Only auto-fill fields that exist in user profile, leave others blank
  useEffect(() => {
    // Don't initialize until user data is loaded
    if (userLoading) return
    
    // Only initialize once when user data is available
    if (typeof window !== "undefined" && user && !isInitialized) {
      const savedDraft = localStorage.getItem(`bid-draft-${id}`)
      
      // Start with completely empty form (no demo data)
      const baseFormData = { ...defaultBidFormValues }
      
      // Only auto-fill fields that have values in current user profile
      // User profile fields (only fill if user has these values)
      if (user.company_name) baseFormData.company_name = user.company_name
      if (user.name) baseFormData.contact_person_name = user.name
      if (user.email) baseFormData.contact_person_email = user.email
      if (user.phone_number) baseFormData.contact_person_phone = user.phone_number
      if (user.website) baseFormData.company_website = user.website
      
      // Note: company_registration and company_address are not in UserResponse
      // These will remain empty and user must fill manually
      
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft)
          
          // Handle old format (direct formData) or new format (with userId)
          const draftFormData = draft.formData || draft
          const draftUserId = draft.userId
          
          // ✅ Verify draft belongs to current user using user ID (most reliable)
          if (draftUserId && draftUserId !== user.id) {
            console.log("Draft belongs to different user, clearing...")
            localStorage.removeItem(`bid-draft-${id}`)
            loadData(baseFormData)
            setIsInitialized(true)
            return
          }
          
          // AGGRESSIVE CLEANUP: Clear ANY draft that has step 2-4 data unless it's clearly user-entered
          // This ensures we start fresh and don't load old test/demo data
          const hasStep2Data = draftFormData.proposed_amount || 
                              draftFormData.payment_terms || 
                              (draftFormData.validity_period_days && draftFormData.validity_period_days > 0) ||
                              draftFormData.include_sst
          
          const hasStep3Data = draftFormData.methodology || 
                              draftFormData.proposed_timeline || 
                              (draftFormData.supporting_documents && draftFormData.supporting_documents.length > 0)
          
          const hasStep4Data = draftFormData.agree_to_terms
          
          // Check for mock/demo data patterns
          const hasMockData = 
            // Check for common mock methodology text
            (draft.methodology && (
              draft.methodology.includes("comprehensive") ||
              draft.methodology.includes("systematic") ||
              draft.methodology.includes("PSMB-certified") ||
              draft.methodology.includes("SecureGuard") ||
              draft.methodology.includes("Elite Protection") ||
              draft.methodology.includes("Professional security services") ||
              draft.methodology.includes("Draft in progress")
            )) ||
            // Check for mock amounts
            (draftFormData.proposed_amount && (
              draftFormData.proposed_amount === "180000" || 
              draftFormData.proposed_amount === 180000 ||
              draftFormData.proposed_amount === "165000" ||
              draftFormData.proposed_amount === 165000 ||
              draftFormData.proposed_amount === "82000" ||
              draftFormData.proposed_amount === 82000
            )) ||
            // Check for default payment terms without user-entered amount
            (draftFormData.payment_terms === "30 Days" && !draftFormData.proposed_amount) ||
            // Check for default validity period without user-entered amount
            (draftFormData.validity_period_days === 90 && !draftFormData.proposed_amount) ||
            // Check for mock company names
            (draftFormData.company_name && (
              draftFormData.company_name.includes("SecureGuard") ||
              draftFormData.company_name.includes("Elite Protection") ||
              draftFormData.company_name.includes("Demo") ||
              draftFormData.company_name.includes("Sparkle Clean")
            )) ||
            // Check if draft has step 2-4 data but looks like defaults (not user-entered)
            ((draftFormData.payment_terms === "30 Days" || draftFormData.validity_period_days === 90) && 
             !draftFormData.proposed_amount && 
             !draftFormData.methodology && 
             !draftFormData.proposed_timeline &&
             (!draftFormData.supporting_documents || draftFormData.supporting_documents.length === 0))
          
          // CLEAR ALL DRAFTS WITH STEP 2-4 DATA - Start completely fresh
          // Only preserve drafts if they have NO step 2-4 data (user hasn't filled those steps yet)
          if (hasMockData || hasStep2Data || hasStep3Data || hasStep4Data) {
            console.log("Clearing draft with step 2-4 data to start fresh. Draft had:", {
              hasStep2Data,
              hasStep3Data,
              hasStep4Data,
              hasMockData,
            })
            localStorage.removeItem(`bid-draft-${id}`)
            // Use only user profile data (all other fields completely empty)
            loadData(baseFormData)
            setIsInitialized(true)
            return
          }
          
          // Draft has NO step 2-4 data - it's safe to load (only step 1 data)
          // But still ensure user profile fields are current
          loadData({
            ...baseFormData,
            // Only preserve step 1 fields from draft (company_registration, company_address)
            company_registration: draftFormData.company_registration || "",
            company_address: draftFormData.company_address || "",
            // All step 2-4 fields remain empty (already set in baseFormData)
          })
          setIsInitialized(true)
        } catch (error) {
          console.error("Failed to load draft bid", error)
          // If draft is corrupted, clear it and use only user profile data
          localStorage.removeItem(`bid-draft-${id}`)
          loadData(baseFormData)
          setIsInitialized(true)
        }
      } else {
        // No draft - use only user profile data (all other fields completely empty)
        loadData(baseFormData)
        setIsInitialized(true)
      }
    }
  }, [id, loadData, user, isInitialized, userLoading])

  // Save draft to localStorage when form data changes
  // Only save after form is initialized to avoid saving default values
  // IMPORTANT: Only save if user has actually entered step 2-4 data (not just step 1)
  useEffect(() => {
    if (typeof window !== "undefined" && isInitialized && formData.company_name) {
      // Check if user has entered any step 2-4 data
      const hasStep2Data = formData.proposed_amount || 
                          formData.payment_terms || 
                          (formData.validity_period_days && formData.validity_period_days > 0)
      
      const hasStep3Data = formData.methodology || 
                          formData.proposed_timeline || 
                          (formData.supporting_documents && formData.supporting_documents.length > 0)
      
      const hasStep4Data = formData.agree_to_terms
      
      // Only save if user has entered step 1 data AND at least some step 2-4 data
      // This prevents saving empty forms or forms with only user profile data
      if (hasStep2Data || hasStep3Data || hasStep4Data) {
        localStorage.setItem(`bid-draft-${id}`, JSON.stringify(formData))
        // Save timestamp for "last saved" display
        localStorage.setItem(`bid-draft-${id}-timestamp`, new Date().toISOString())
      } else {
        // If no step 2-4 data, remove any existing draft to keep it clean
        localStorage.removeItem(`bid-draft-${id}`)
        localStorage.removeItem(`bid-draft-${id}-timestamp`)
      }
    }
  }, [formData, id, isInitialized])

  // Show loading state while fetching tender or user data
  if (tenderLoading || userLoading) {
    return <LoadingSpinner message="Loading tender details..." />
  }
  
  // Don't render form until user data is loaded and form is initialized
  if (!user || !isInitialized) {
    return <LoadingSpinner message="Loading your profile..." />
  }

  // Show error state if tender fetch failed
  if (tenderError) {
    return (
      <ErrorMessage
        message={tenderError}
        title="Failed to load tender"
        onRetry={refetch}
      />
    )
  }

  // Show 404 if tender not found
  if (!tender) {
    notFound()
  }

  // ✅ ROLE PROTECTION: Only contractors can apply to tenders
  if (role !== "contractor") {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h3 className="mt-4 text-lg font-semibold">Access Denied</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Only contractors can apply to tenders
          </p>
          <Button onClick={() => router.push("/tenders")} className="mt-4">
            Back to Tenders
          </Button>
        </div>
      </div>
    )
  }

  // ✅ PROFILE COMPLETION CHECK: Only contractors with complete profiles can bid
  if (role === "contractor" && !profileComplete) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Alert variant="destructive" className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800 dark:text-yellow-300">
            Profile Incomplete
          </AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-400">
            <div className="space-y-3 mt-2">
              <p>
                You need to complete your profile before you can submit bids on tenders.
              </p>
              <p>
                Missing information: <strong>{missingFields.join(", ")}</strong>
              </p>
              <div className="flex gap-3 mt-4">
                <Link href="/profile">
                  <Button variant="default">
                    Complete Profile
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => router.push(`/tenders/${id}`)}
                >
                  Back to Tender
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!tender) {
    notFound()
  }

  const handleSaveDraft = () => {
    // Save current form data to localStorage as draft with user ID for verification
    if (typeof window !== "undefined") {
      const draftData = {
        formData,
        userId: user?.id,
        savedAt: new Date().toISOString(),
      }
      localStorage.setItem(`bid-draft-${id}`, JSON.stringify(draftData))
      toast.success("Bid saved as draft")
      router.push("/my-bids")
    }
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
      // Convert form data to API request format
      const bidRequest: BidCreateRequest = {
        tender_id: tender.id,
        company_name: formData.company_name,
        company_registration: formData.company_registration,
        company_address: formData.company_address,
        company_website: formData.company_website || undefined,
        contact_person_name: formData.contact_person_name,
        contact_person_phone: formData.contact_person_phone,
        contact_person_email: formData.contact_person_email,
        proposed_amount: parseFloat(formData.proposed_amount) || 0,
        include_sst: formData.include_sst,
        payment_terms: formData.payment_terms || "",
        validity_period_days: formData.validity_period_days > 0 ? formData.validity_period_days : 0,
        supporting_documents: formData.supporting_documents.length > 0 
          ? formData.supporting_documents 
          : undefined,
        methodology: formData.methodology || undefined,
        proposed_timeline: formData.proposed_timeline || undefined,
        agree_to_terms: formData.agree_to_terms,
      }

      // Submit bid using real API
      await createBid(bidRequest)

      // Clear draft from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem(`bid-draft-${id}`)
      }

      toast.success("Bid submitted successfully!")
      router.push("/my-bids")
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit bid. Please try again."
      toast.error(errorMessage)
      console.error("Bid submission error:", error)
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
        backHref="/tenders"
        backLabel="Back to All Tenders"
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

          <div className="flex gap-3">
            {/* {currentStep === Bid_Steps.length && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                disabled={submitting}
                className="hover:cursor-pointer"
              >
                Save as Draft
              </Button>
            )} */}

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
    </div>
  )
}
