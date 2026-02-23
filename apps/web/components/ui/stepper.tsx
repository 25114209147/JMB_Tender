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
      <div className="md:hidden">
        <div className="flex items-center justify-between overflow-x-auto pb-2 -mx-2 px-2">
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
                <div className="flex flex-col items-center flex-shrink-0 min-w-[50px]">
                  <button
                    onClick={() => onStepClick?.(step.id)}
                    disabled={!onStepClick}
                    aria-current={status === "current" ? "step" : undefined}
                    className={cn(
                      "flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-all duration-200",
                      status === "completed" && "bg-primary-600 text-white",
                      status === "current" &&
                        "bg-primary-700 dark:bg-primary-600 text-white ring-2 ring-primary-200 dark:ring-primary-500/30",
                      status === "upcoming" &&
                        "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600",
                      onStepClick
                        ? "cursor-pointer active:scale-95"
                        : "cursor-default"
                    )}
                  >
                    {status === "completed" ? (
                      <CircleCheck className="w-4 h-4" />
                    ) : (
                      step.id
                    )}
                  </button>

                  {/* Title */}
                  <p
                    className={cn(
                      "mt-2 text-xs font-medium text-center leading-tight",
                      status === "completed" || status === "current"
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {step.title.split(" ")[0]}
                  </p>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex items-center flex-1 min-w-[15px] max-w-[20px] mx-1">
                    <div
                      className={cn(
                        "h-0.5 w-full transition-all duration-300",
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

        {/* Current Step Info */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-base font-semibold">{current?.title}</p>
          {current?.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{current.description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
