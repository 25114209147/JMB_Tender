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

  // Handle click outside to close calendar
  React.useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    // Prevent body scroll when calendar is open to avoid extra scrollbar
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener("mousedown", handleClickOutside)
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
          "w-full h-10 justify-start text-left font-normal cursor-pointer",
          !selectedDate && "text-muted-foreground"
        )}
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen((prev) => !prev)
        }}
        disabled={disabled}
        aria-label={isOpen ? "Close calendar" : "Open calendar"}
        aria-required={required}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        <span>{displayValue}</span>
      </Button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 w-[320px] rounded-md border bg-popover shadow-lg">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            defaultMonth={selectedDate || new Date()}
            captionLayout="dropdown"
            fromYear={min ? new Date(min).getFullYear() : 2026}
            toYear={max ? new Date(max).getFullYear() : new Date().getFullYear() + 10}
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
