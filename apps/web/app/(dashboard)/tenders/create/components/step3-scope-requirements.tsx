import { FormData } from "@/data/create-tender-form"
import { ScopeOfWorkSection } from "./step3/scope-of-work-section"
import { ContractPeriodSection } from "./step3/contract-period-section"
import { RequiredLicensesSection } from "./step3/required-licenses-section"
import { EvaluationCriteriaSection } from "./step3/evaluation-criteria-section"
import { TenderFeeSection } from "./step3/tender-fee-section"

interface Props {
    formData: FormData
    updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void
}

export default function Step3ScopeRequirements({ formData, updateField }: Props) {
    return (
        <div className="space-y-6">
            <div className="mb-4">
                <h2 className="text-2xl font-bold">Step 3: Scope & Requirements</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Provide the scope of work, contract period, required licenses, evaluation criteria, and tender fee.
                </p>
            </div>

            <ScopeOfWorkSection formData={formData} updateField={updateField} />
            <ContractPeriodSection formData={formData} updateField={updateField} />
            <RequiredLicensesSection formData={formData} updateField={updateField} />
            <EvaluationCriteriaSection formData={formData} updateField={updateField} />
            <TenderFeeSection formData={formData} updateField={updateField} />
        </div>
    )
}
