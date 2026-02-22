"use client"

import { FormData } from "@/data/create-tender-form"
import { Label } from "@/components/ui/label"
import { CurrencyInput } from "@/components/ui/currency-input"
import { toast } from "@/components/toast/toast"

interface Props {
  formData: FormData;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

export function TenderFeeSection({ formData, updateField }: Props) {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold mb-1">Tender Fee</h2>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
        Set the fee contractors need to pay to participate in this tender (optional).
      </p>

      <div className="space-y-3 max-w-md">
        <Label htmlFor="tender_fee" className="text-sm font-medium">
          Fee Amount (RM)
        </Label>

        <CurrencyInput
          id="tender_fee"
          value={formData.tender_fee || ""}
          onValueChange={(values) => {
            const { floatValue, formattedValue } = values
            
            // Allow empty input
            if (formattedValue === "" || floatValue === undefined) {
              updateField("tender_fee", "")
              return
            }
            
            // Format to 2 decimal places
            if (floatValue >= 0) {
              updateField("tender_fee", floatValue.toFixed(2))
            }
          }}
          onBlur={(e) => {
            const value = e.target.value.trim()
            
            // Clear empty input
            if (value === "" || value === "RM ") {
              updateField("tender_fee", "")
              return
            }
            
            const numValue = parseFloat(value.replace(/[RM,\s]/g, ""))
            
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
          className="w-full"
          decimalScale={2}
          fixedDecimalScale
        />

        <p className="text-xs text-gray-500 dark:text-gray-400">
          Leave blank if no fee is required
        </p>
      </div>
    </div>
  );
}