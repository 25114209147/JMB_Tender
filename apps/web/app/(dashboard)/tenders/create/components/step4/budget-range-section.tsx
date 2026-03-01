"use client"

import { FormData } from "@/data/create-tender-form"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { CurrencyInput } from "@/components/ui/currency-input"
import { cn } from "@/lib/utils"

interface Props {
  formData: FormData
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void
}

export function BudgetRangeSection({ formData, updateField }: Props) {
  const min = Number(formData.min_budget) || 0
  const max = Number(formData.max_budget) || 1000000

  const handleSliderChange = (values: number[]) => {
    const [minVal, maxVal] = values
    if (typeof minVal === "number" && typeof maxVal === "number") {
      updateField("min_budget", minVal.toString())
      updateField("max_budget", maxVal.toString())
    }
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 border rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold">Budget Range (Optional)</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Helps contractors estimate feasibility.
      </p>

      {/* Slider */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm font-medium">
          <span>RM {min.toLocaleString()}</span>
          <span>RM {max.toLocaleString()}</span>
        </div>

        <Slider
            value={[min || 0, max || 0]}
            onValueChange={(values) => {
                const [min, max] = values
                if (typeof min === "number" && typeof max === "number") {
                    updateField("min_budget", min.toString())
                    updateField("max_budget", max.toString())
                }
            }}
            min={0}
            max={10000000}
            step={5000}
            className="cursor-pointer"
            />
      </div>

      {/* Manual inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <div>
          <Label>Minimum Budget</Label>
          <CurrencyInput
            value={min}
            onValueChange={(values) => {
              const val = values.floatValue || 0
              updateField("min_budget", val.toString())
              if (val > max) updateField("max_budget", val.toString())
            }}
            className={cn(min > max && "border-red-500")}
            decimalScale={0}
          />
        </div>

        <div>
          <Label>Maximum Budget</Label>
          <CurrencyInput
            value={max}
            onValueChange={(values) => {
              const val = values.floatValue || 0
              updateField("max_budget", val.toString())
              if (val < min && val > 0) updateField("min_budget", Math.max(0, val - 50000).toString())
            }}
            className={cn(min > max && "border-red-500")}
            decimalScale={0}
          />
        </div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2 mt-6">
        {[50000, 100000, 200000, 500000, 1000000].map((val) => (
          <Button
            key={val}
            variant="outline"
            className="cursor-pointer"
            size="sm"
            onClick={() => {
              updateField("min_budget", val.toString())
              updateField("max_budget", (val * 2).toString())
            }}
          >
            RM {val.toLocaleString()}+
          </Button>
        ))}
      </div>
    </div>
  )
}
