"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { CircleCheck } from "lucide-react"

export interface Step {
  id: number
  title: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (stepId: number) => void
}

export default function Stepper({
  steps,
  currentStep,
  onStepClick,
}: StepperProps) {
  const current = steps.find((s) => s.id === currentStep)

  return (
    <div className="w-full py-6">
      {/* ================= DESKTOP ================= */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const status =
            currentStep > step.id
              ? "completed"
              : currentStep === step.id
              ? "current"
              : "upcoming"

          return (
            <React.Fragment key={step.id}>
              {/* Step */}
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => onStepClick?.(step.id)}
                  disabled={!onStepClick}
                  aria-current={status === "current" ? "step" : undefined}
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-full text-sm font-semibold transition-all duration-200",
                    status === "completed" && "bg-primary-600 text-white",
                    status === "current" &&
                      "bg-primary-700 dark:bg-primary-600 text-white ring-4 ring-gray-100 dark:ring-gray-500/20",
                    status === "upcoming" &&
                      "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600",
                    onStepClick
                      ? "cursor-pointer hover:scale-110"
                      : "cursor-default"
                  )}
                >
                  {status === "completed" ? (
                    <CircleCheck className="w-6 h-6" />
                  ) : (
                    step.id
                  )}
                </button>

                {/* Title + Description */}
                <div className="mt-3 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      status === "completed" || status === "current"
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {step.title}
                  </p>

                  {step.description && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex items-center w-full max-w-[80px]">
                  <div
                    className={cn(
                      "h-1 w-full transition-all duration-300",
                      currentStep > step.id
                        ? "bg-primary-600"
                        : "bg-gray-200 dark:bg-gray-700"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden space-y-3">
        <div className="flex justify-between text-sm">
          <span className="font-medium">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-gray-500">
            {Math.round((currentStep / steps.length) * 100)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>

        {/* Current Step Info */}
        <div>
          <p className="text-lg font-semibold">{current?.title}</p>
          {current?.description && (
            <p className="text-sm text-gray-500">{current.description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
