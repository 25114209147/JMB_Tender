import { FormData } from "@/data/create-tender-form"
import { BudgetRangeSection } from "./step4/budget-range-section"
import { TimelineSection } from "./step4/timeline-section"
import { ContactInfoSection } from "./step4/contact-info-section"

interface Props {
    formData: FormData
    updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void
}

export default function Step4BudgetTimeline({ formData, updateField }: Props) {
    return (
        <div className="space-y-6">
            <div className="mb-4">
                <h2 className="text-2xl font-bold">Step 4: Budget & Timeline</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Provide the budget and timeline for the tender.
                </p>
            </div>

            <BudgetRangeSection formData={formData} updateField={updateField} />
            <TimelineSection formData={formData} updateField={updateField} />
            <ContactInfoSection formData={formData} updateField={updateField} />
        </div>
    )
}
