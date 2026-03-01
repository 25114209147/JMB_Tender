"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Step1Basic from "./components/step1-basic-info"
import Step2Property from "./components/step2-property-info"
import Stepper from "@/components/ui/stepper"
import { STEPS } from "./constants"
import { emptyFormData, FormData } from "@/data/create-tender-form"
import { Button } from "@/components/ui/button"
import Step3ScopeRequirements from "./components/step3-scope-requirements"
import Step4BudgetTimeline from "./components/step4-budget-timeline"
import Step5ReviewSubmit from "./components/step5-review-submit"
import PageHeader from "@/components/shared/page-header"
import { createTender } from "@/lib/tenders"
import { ApiClientError } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function CreateTenderPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<FormData>(emptyFormData)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getTotalWeight = () => {
        return formData.evaluation_criteria.reduce((sum, item) => sum + item.weight, 0)
    }

    const handleSubmit = async (status: "draft" | "open" = "open") => {
        const totalWeight = getTotalWeight()
        
        // Only validate weights for publishing (status="open")
        if (status === "open" && totalWeight !== 100) {
            setError("Evaluation criteria weights must sum to 100")
            return
        }
        
        setLoading(true)
        setError(null) // Clear previous errors
        
        try {
            // Convert form data to API format (string to number conversions)
            const tenderData = {
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
                status,
            }
            await createTender(tenderData)
            
            // Redirect based on status
            if (status === "draft") {
                router.push("/dashboard/JMB/drafts")
            } else {
                router.push("/tenders/my-tenders")
            }
        } catch (err) {
            console.error("Error submitting tender:", err)
            
            // Extract user-friendly error message
            let errorMessage = `Failed to ${status === "draft" ? "save draft" : "submit tender"}. Please try again.`
            
            if (err instanceof ApiClientError) {
                // Use the detailed error message from API
                errorMessage = err.detail || errorMessage
            } else if (err instanceof Error) {
                errorMessage = err.message
            }
            
            setError(errorMessage)
            
            // Scroll to top to show error
            window.scrollTo({ top: 0, behavior: "smooth" })
        } finally {
            setLoading(false)
        }
    }
    
    const handleSaveDraft = () => handleSubmit("draft")
    const handlePublish = () => handleSubmit("open")

    const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }))
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
                backHref={`/tenders`}
                backLabel="Back to Tender"
                title="Create Tender"
                description="Fill in the details to create a new tender for your property"
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
                    
                    <div className="flex gap-3">
                        {currentStep === STEPS.length && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleSaveDraft}
                                disabled={loading}
                                className="hover:cursor-pointer"
                            >
                                {loading ? "Saving..." : "Save as Draft"}
                            </Button>
                        )}
                        
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
                                onClick={handlePublish} 
                                className="hover:cursor-pointer"
                                disabled={loading || getTotalWeight() !== 100}
                            >
                                {loading ? "Publishing..." : "Publish Tender"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}