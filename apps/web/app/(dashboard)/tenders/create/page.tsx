"use client"

import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import Step1Basic from "./components/step1-basic-info"
import Step2Property from "./components/step2-property-info"
import Stepper from "@/components/ui/stepper"
import { STEPS } from "./constants"
import { demoFormData, FormData } from "@/data/create-tender-form"
import { Button } from "@/components/ui/button"
import Step3ScopeRequirements from "./components/step3-scope-requirements"
import Step4BudgetTimeline from "./components/step4-budget-timeline"
import Step5ReviewSubmit from "./components/step5-review-submit"

export default function CreateTenderPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<FormData>(demoFormData)
    const [loading, setLoading] = useState(false)

    const totalWeight = formData.evaluation_criteria.reduce((sum, item) => sum + item.weight, 0)

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const response = await fetch("/api/tenders", {
                method: "POST",
                body: JSON.stringify(formData),
            })
            if (!response.ok) {
                throw new Error("Failed to submit tender")
            }
            const data = await response.json()
            console.log("Tender submitted successfully", data)
        } catch (error) {
            console.error("Error submitting tender", error)
        } finally {
            setLoading(false)
        }
    }

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
            <div className="mb-6 flex items-center justify-between">
                <Link  
                    href="/tenders"
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground border border-gray-200 rounded-md px-4 py-2 bg-gray-50">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Tenders
                </Link>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold mb-2">Create New Tender</h1>
            <p className="text-muted-foreground mb-6 md:mb-8">Fill in the details to create a new tender for your property</p>

            <Stepper
                steps={STEPS}
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
                            disabled={loading || totalWeight !== 100}>
                                {loading ? "Submitting..." : "Submit Tender"}
                            
                            </Button>
                        )
                    }
                </div>
            </div>
        </div>
    );
}