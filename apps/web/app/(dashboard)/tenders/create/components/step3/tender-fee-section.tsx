import { FormData } from "@/data/create-tender-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/toast/toast"

interface Props {
    formData: FormData
    updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void
}

export function TenderFeeSection({ formData, updateField }: Props) {
    return (
        <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-1">Tender Fee</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                Set the fee contractors need to pay to participate in this tender.
            </p>

            <div className="space-y-4">
                <div className="max-w-md">
                    <Label htmlFor="tender_fee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Fee Amount (RM) <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">RM</span>
                        <Input
                            id="tender_fee"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.tender_fee}
                            onChange={(e) => {
                                const value = e.target.value
                                
                                // Allow empty input
                                if (value === "") {
                                    updateField("tender_fee", "")
                                    return
                                }
                                
                                // Block negative signs and scientific notation
                                if (value.includes("-") || value.includes("e") || value.includes("E")) {
                                    toast.warning("Invalid input", {
                                        description: "Please enter a positive number only.",
                                    })
                                    return
                                }
                                
                                // Allow valid input
                                updateField("tender_fee", value)
                            }}
                            onBlur={(e) => {
                                const value = e.target.value.trim()
                                
                                // Clear empty or invalid input
                                if (value === "" || value === "-") {
                                    updateField("tender_fee", "")
                                    return
                                }
                                
                                const numValue = parseFloat(value)
                                
                                // Format valid positive numbers to 2 decimal places
                                if (!isNaN(numValue) && numValue >= 0) {
                                    updateField("tender_fee", numValue.toFixed(2))
                                } else {
                                    // Show error for invalid input
                                    toast.error("Invalid amount", {
                                        description: "Please enter a valid positive number.",
                                    })
                                    updateField("tender_fee", "")
                                }
                            }}
                            placeholder="0.00"
                            className="w-full h-10 pl-10"
                            required
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
