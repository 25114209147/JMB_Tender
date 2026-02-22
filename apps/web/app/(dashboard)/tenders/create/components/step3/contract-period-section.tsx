import { FormData } from "@/data/create-tender-form"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { useMemo, useEffect } from "react"
import { format, addDays, differenceInDays } from "date-fns"

interface Props {
    formData: FormData
    updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void
}

/**
 * Calculate end date from start date and duration (inclusive)
 */
function calculateEndDate(startDate: string, durationDays: number): string {
    if (!startDate || !durationDays || durationDays <= 0) return ""
    
    const start = new Date(startDate)
    if (isNaN(start.getTime())) return ""
    
    // Subtract 1 because duration is inclusive (e.g., 365 days from Jan 1 = Dec 31, not Jan 2)
    const end = addDays(start, durationDays - 1)
    return format(end, "yyyy-MM-dd")
}

/**
 * Calculate duration from start and end dates (inclusive)
 */
function calculateDuration(startDate: string, endDate: string): number | null {
    if (!startDate || !endDate) return null
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null
    
    // Add 1 day to include both start and end dates (inclusive)
    return differenceInDays(end, start) + 1
}

export function ContractPeriodSection({ formData, updateField }: Props) {
    // Parse duration from formData (stored as string, convert to number)
    const durationDays = formData.contract_period_days ? parseInt(formData.contract_period_days) : null
    
    // Auto-calculate end date when duration or start date changes
    useEffect(() => {
        if (formData.contract_start_date && durationDays && durationDays > 0) {
            const calculatedEndDate = calculateEndDate(formData.contract_start_date, durationDays)
            if (calculatedEndDate && calculatedEndDate !== formData.contract_end_date) {
                updateField("contract_end_date", calculatedEndDate)
            }
        }
    }, [formData.contract_start_date, durationDays, formData.contract_end_date, updateField])
    
    // Calculate duration display (for backward compatibility if both dates are manually set)
    const calculatedDuration = useMemo(() => {
        if (formData.contract_start_date && formData.contract_end_date) {
            return calculateDuration(formData.contract_start_date, formData.contract_end_date)
        }
        return durationDays
    }, [formData.contract_start_date, formData.contract_end_date, durationDays])


    return (
        <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
            <h2 className="text-lg font-bold mb-1">Contract Period</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                Specify the duration and dates for the contract period.
            </p>

            <div>
                <Label htmlFor="contract_period" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Contract Period
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="contract_period_days" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Duration (Days) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="contract_period_days"
                            type="number"
                            min="1"
                            value={formData.contract_period_days || ""}
                            onChange={(e) => updateField("contract_period_days", e.target.value)}
                            placeholder="e.g., 365"
                            className="w-full h-10"
                            required
                        />
                    </div>
                    
                    <div>
                        <Label htmlFor="contract_start_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Start Date <span className="text-gray-400 text-xs">(Optional)</span>
                        </Label>
                        <DatePicker
                            id="contract_start_date"
                            value={formData.contract_start_date}
                            onChange={(value) => updateField("contract_start_date", value)}
                            placeholder="Select start date"
                        />
                    </div>
                    
                    <div>
                        <Label htmlFor="contract_end_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            End Date 
                        </Label>
                        <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3 text-sm">
                            <span className="text-muted-foreground font-medium">
                                {formData.contract_end_date 
                                    ? format(new Date(formData.contract_end_date), "MMM dd, yyyy")
                                    : calculatedDuration 
                                        ? `${calculatedDuration} days from start`
                                        : "Enter duration & start date"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
