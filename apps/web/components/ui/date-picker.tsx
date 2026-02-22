"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  min?: string
  max?: string
  className?: string
  id?: string
  required?: boolean
}

/**
 * DatePicker component using Shadcn Calendar.
 * Displays a button with formatted date that opens a calendar popover.
 * Uses calendar.tsx (Shadcn Calendar component) internally.
 */
export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  min,
  max,
  className,
  id,
  required = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  )

  // Sync with external value changes
  React.useEffect(() => {
    if (value) {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        setSelectedDate(date)
      }
    } else {
      setSelectedDate(undefined)
    }
  }, [value])

  // Close calendar when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isOpen])

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      onChange(format(date, "yyyy-MM-dd"))
      setIsOpen(false)
    }
  }

  // Format date for display
  const displayValue = selectedDate 
    ? format(selectedDate, "MMM dd, yyyy")
    : placeholder

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Button
        id={id}
        type="button"
        variant="outline"
        className={cn(
          "w-full h-10 justify-start text-left font-normal",
          !selectedDate && "text-muted-foreground"
        )}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        aria-label={isOpen ? "Close calendar" : "Open calendar"}
        aria-required={required}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        <span>{displayValue}</span>
      </Button>
      {isOpen && (
        <div className="absolute z-50 mt-2 rounded-md border bg-popover p-3 shadow-md">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => {
              if (min && date < new Date(min)) return true
              if (max && date > new Date(max)) return true
              return false
            }}
            initialFocus
          />
        </div>
      )}
    </div>
  )
}
