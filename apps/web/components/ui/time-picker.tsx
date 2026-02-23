"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Clock, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimePickerProps {
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

export function TimePicker({
  value,
  onChange,
  placeholder = "Select time",
  disabled = false,
  min,
  max,
  className,
  id,
  required = false,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [selectedTime, setSelectedTime] = React.useState<string>(value || "")

  // Sync with external value changes
  React.useEffect(() => {
    setSelectedTime(value || "")
  }, [value])

  // Handle click outside to close time picker
  React.useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        // Apply the selected time when closing
        if (selectedTime) {
          onChange(selectedTime)
        }
      }
    }

    // Prevent body scroll when time picker is open
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, selectedTime, onChange])

  // Format time for display (HH:mm -> HH:mm AM/PM)
  const formatTimeDisplay = (timeValue: string): string => {
    if (!timeValue) return placeholder
    
    const [hours, minutes] = timeValue.split(":")
    if (!hours || !minutes) return placeholder
    
    const hour = parseInt(hours, 10)
    if (isNaN(hour)) return placeholder
    
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    const displayMinutes = minutes.padStart(2, "0")
    
    return `${displayHour}:${displayMinutes} ${ampm}`
  }

  const displayValue = selectedTime ? formatTimeDisplay(selectedTime) : placeholder

  const [hours, setHours] = React.useState(() => {
    if (selectedTime) {
      const h = parseInt(selectedTime.split(":")[0] || "0", 10)
      return isNaN(h) ? 12 : h
    }
    return 12
  })
  const [minutes, setMinutes] = React.useState(() => {
    if (selectedTime) {
      const m = parseInt(selectedTime.split(":")[1] || "0", 10)
      return isNaN(m) ? 0 : m
    }
    return 0
  })

  // Sync hours/minutes when selectedTime changes externally
  React.useEffect(() => {
    if (selectedTime) {
      const [h, m] = selectedTime.split(":")
      const hour = parseInt(h || "0", 10)
      const minute = parseInt(m || "0", 10)
      if (!isNaN(hour)) setHours(hour)
      if (!isNaN(minute)) setMinutes(minute)
    }
  }, [selectedTime])

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen((prev) => !prev)
  }

  const updateTime = (newHours: number, newMinutes: number) => {
    const formattedHours = String(newHours).padStart(2, "0")
    const formattedMinutes = String(newMinutes).padStart(2, "0")
    const timeValue = `${formattedHours}:${formattedMinutes}`
    setSelectedTime(timeValue)
    onChange(timeValue)
  }

  const handleHourChange = (newHour: number) => {
    const clampedHour = Math.max(0, Math.min(23, newHour))
    setHours(clampedHour)
    updateTime(clampedHour, minutes)
  }

  const handleMinuteChange = (newMinute: number) => {
    const clampedMinute = Math.max(0, Math.min(59, newMinute))
    setMinutes(clampedMinute)
    updateTime(hours, clampedMinute)
  }

  const handleDone = () => {
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Button
        id={id}
        type="button"
        variant="outline"
        className={cn(
          "w-full h-10 justify-start text-left font-normal cursor-pointer",
          !selectedTime && "text-muted-foreground"
        )}
        onClick={handleButtonClick}
        disabled={disabled}
        aria-label={isOpen ? "Close time picker" : "Open time picker"}
        aria-required={required}
      >
        <Clock className="mr-2 h-4 w-4" />
        <span>{displayValue}</span>
      </Button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 w-[280px] rounded-md border bg-popover shadow-lg p-4">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Select Time
              </label>
              <div className="flex items-center justify-center gap-4">
                {/* Hours */}
                <div className="flex flex-col items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleHourChange(hours + 1)}
                    disabled={hours >= 23}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={hours}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10)
                      if (!isNaN(val)) {
                        handleHourChange(val)
                      }
                    }}
                    onBlur={(e) => {
                      const val = parseInt(e.target.value, 10)
                      if (isNaN(val) || val < 0) {
                        handleHourChange(0)
                      } else if (val > 23) {
                        handleHourChange(23)
                      }
                    }}
                    className="w-16 h-12 text-center border rounded-md bg-background font-semibold text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label="Hours"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleHourChange(hours - 1)}
                    disabled={hours <= 0}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>

                <span className="text-2xl font-bold">:</span>

                {/* Minutes */}
                <div className="flex flex-col items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleMinuteChange(minutes + 1)}
                    disabled={minutes >= 59}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10)
                      if (!isNaN(val)) {
                        handleMinuteChange(val)
                      }
                    }}
                    onBlur={(e) => {
                      const val = parseInt(e.target.value, 10)
                      if (isNaN(val) || val < 0) {
                        handleMinuteChange(0)
                      } else if (val > 59) {
                        handleMinuteChange(59)
                      }
                    }}
                    className="w-16 h-12 text-center border rounded-md bg-background font-semibold text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label="Minutes"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleMinuteChange(minutes - 1)}
                    disabled={minutes <= 0}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDone}
                className="h-8 hover:cursor-pointer"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
