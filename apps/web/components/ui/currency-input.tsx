"use client"

import * as React from "react"
import { NumericFormat, NumericFormatProps } from "react-number-format"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface CurrencyInputProps extends Omit<NumericFormatProps, "customInput" | "allowLeadingZeros" | "allowNegative"> {
  onValueChange?: (values: { floatValue?: number; formattedValue: string; value: string }) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  className?: string
  clearZeroOnFocus?: boolean
  decimalScale?: number
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ onValueChange, onBlur, onFocus, className, clearZeroOnFocus = true, value, decimalScale = 0, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    const isZeroValue = React.useMemo(() => {
      if (value === undefined || value === null || value === "") return true
      const numValue = typeof value === "number" ? value : parseFloat(String(value).replace(/[RM,\s]/g, ""))
      return numValue === 0 || isNaN(numValue)
    }, [value])

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setTimeout(() => inputRef.current?.select(), 0)

      if (clearZeroOnFocus && isZeroValue && onValueChange) {
        onValueChange({ floatValue: undefined, formattedValue: "", value: "" })
      }

      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e)
    }

    return (
      <NumericFormat
        {...props}
        value={value}
        onValueChange={onValueChange}
        customInput={Input}
        className={cn("h-10", className)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        getInputRef={inputRef}
        allowNegative={false}
        allowLeadingZeros={false}
        thousandSeparator={true}
        decimalScale={decimalScale}
        prefix="RM "
      />
    )
  }
)

CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }
