import type { FormData } from "./create-tender-form"

export function validateStep1(formData: FormData): boolean {
  return (
    formData.title.trim() !== "" &&
    formData.service_type.trim() !== ""
  )
}

export function validateStep2(formData: FormData): boolean {
  return (
    formData.property_name.trim() !== "" &&
    formData.property_address_line_1.trim() !== "" &&
    formData.property_city.trim() !== "" &&
    formData.property_state.trim() !== "" &&
    formData.property_postcode.trim() !== "" &&
    formData.property_country.trim() !== ""
  )
}

export function validateStep3(formData: FormData): boolean {
  const totalWeight = formData.evaluation_criteria.reduce(
    (sum, item) => sum + item.weight,
    0
  )

  return (
    formData.scope_of_work.trim() !== "" &&
    formData.contract_period_days.trim() !== "" &&
    formData.contract_start_date.trim() !== "" &&
    formData.contract_end_date.trim() !== "" &&
    formData.evaluation_criteria.length > 0 &&
    totalWeight === 100 
  )
}

export function validateStep4(formData: FormData): boolean {
  const minBudget = parseFloat(formData.min_budget)
  const maxBudget = parseFloat(formData.max_budget)

  return (
    formData.min_budget.trim() !== "" &&
    formData.max_budget.trim() !== "" &&
    minBudget > 0 &&
    maxBudget > 0 &&
    maxBudget >= minBudget &&
    formData.closing_date.trim() !== "" &&
    formData.closing_time.trim() !== ""
  )
}

export function validateStep5(formData: FormData): boolean {
  return (
    formData.contact_person.trim() !== "" &&
    formData.contact_email.trim() !== "" &&
    formData.contact_phone.trim() !== ""
  )
}

/**
 * Check if user can proceed to next step
 * 
 * @param currentStep - Current step number (1-5)
 * @param formData - Current form data
 * @returns true if user can proceed
 */
export function canProceedToStep(
  currentStep: number,
  formData: FormData
): boolean {
  switch (currentStep) {
    case 1:
      return validateStep1(formData)
    case 2:
      return validateStep2(formData)
    case 3:
      return validateStep3(formData)
    case 4:
      return validateStep4(formData)
    case 5:
      return validateStep5(formData)
    default:
      return false
  }
}

// ───────────────────────────────────────────────
// Full Form Validation (for submission)
// ───────────────────────────────────────────────

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export function validateTenderFormData(formData: FormData): ValidationResult {
  const errors: Record<string, string> = {}

  // Step 1: Basic Information
  if (!formData.title.trim()) {
    errors.title = "Tender title is required"
  } else if (formData.title.length < 10) {
    errors.title = "Tender title must be at least 10 characters"
  }

  if (!formData.service_type.trim()) {
    errors.service_type = "Service type is required"
  }

  if (formData.service_type === "Others" && !formData.custom_service_type?.trim()) {
    errors.custom_service_type = "Please specify the service type"
  }

  // Step 2: Property Information
  if (!formData.property_name.trim()) {
    errors.property_name = "Property name is required"
  }

  if (!formData.property_address_line_1.trim()) {
    errors.property_address_line_1 = "Address is required"
  }

  if (!formData.property_city.trim()) {
    errors.property_city = "City is required"
  }

  if (!formData.property_state.trim()) {
    errors.property_state = "State is required"
  }

  if (!formData.property_postcode.trim()) {
    errors.property_postcode = "Postcode is required"
  } else if (!/^\d{5}$/.test(formData.property_postcode)) {
    errors.property_postcode = "Postcode must be 5 digits"
  }

  if (!formData.property_country.trim()) {
    errors.property_country = "Country is required"
  }

  // Step 3: Scope & Requirements
  if (!formData.scope_of_work.trim()) {
    errors.scope_of_work = "Scope of work is required"
  } else if (formData.scope_of_work.length < 50) {
    errors.scope_of_work = "Scope of work must be at least 50 characters"
  }

  if (!formData.contract_period_days.trim()) {
    errors.contract_period_days = "Contract period is required"
  } else {
    const days = parseInt(formData.contract_period_days, 10)
    if (isNaN(days) || days <= 0) {
      errors.contract_period_days = "Please enter a valid number of days"
    }
  }

  if (!formData.contract_start_date.trim()) {
    errors.contract_start_date = "Contract start date is required"
  }

  if (!formData.contract_end_date.trim()) {
    errors.contract_end_date = "Contract end date is required"
  }

  // Validate start date is before end date
  if (formData.contract_start_date && formData.contract_end_date) {
    const startDate = new Date(formData.contract_start_date)
    const endDate = new Date(formData.contract_end_date)
    if (endDate <= startDate) {
      errors.contract_end_date = "End date must be after start date"
    }
  }

  // Validate evaluation criteria
  if (formData.evaluation_criteria.length === 0) {
    errors.evaluation_criteria = "At least one evaluation criterion is required"
  } else {
    const totalWeight = formData.evaluation_criteria.reduce(
      (sum, item) => sum + item.weight,
      0
    )
    if (totalWeight !== 100) {
      errors.evaluation_criteria = `Total weight must equal 100% (currently ${totalWeight}%)`
    }

    // Check for empty criteria
    const hasEmptyCriteria = formData.evaluation_criteria.some(
      (item) => !item.criteria.trim() || item.weight <= 0
    )
    if (hasEmptyCriteria) {
      errors.evaluation_criteria = "All criteria must have a name and weight greater than 0"
    }
  }

  // Step 4: Budget & Timeline
  if (!formData.min_budget.trim()) {
    errors.min_budget = "Minimum budget is required"
  } else {
    const minBudget = parseFloat(formData.min_budget)
    if (isNaN(minBudget) || minBudget <= 0) {
      errors.min_budget = "Please enter a valid minimum budget"
    }
  }

  if (!formData.max_budget.trim()) {
    errors.max_budget = "Maximum budget is required"
  } else {
    const maxBudget = parseFloat(formData.max_budget)
    if (isNaN(maxBudget) || maxBudget <= 0) {
      errors.max_budget = "Please enter a valid maximum budget"
    }
  }

  // Validate max >= min
  if (formData.min_budget && formData.max_budget) {
    const minBudget = parseFloat(formData.min_budget)
    const maxBudget = parseFloat(formData.max_budget)
    if (maxBudget < minBudget) {
      errors.max_budget = "Maximum budget must be greater than or equal to minimum budget"
    }
  }

  if (!formData.closing_date.trim()) {
    errors.closing_date = "Closing date is required"
  } else {
    const closingDate = new Date(formData.closing_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (closingDate < today) {
      errors.closing_date = "Closing date cannot be in the past"
    }
  }

  if (!formData.closing_time.trim()) {
    errors.closing_time = "Closing time is required"
  }

  // Step 5: Contact Information
  if (!formData.contact_person.trim()) {
    errors.contact_person = "Contact person name is required"
  }

  if (!formData.contact_email.trim()) {
    errors.contact_email = "Contact email is required"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
    errors.contact_email = "Please enter a valid email address"
  }

  if (!formData.contact_phone.trim()) {
    errors.contact_phone = "Contact phone is required"
  } else if (!/^\+?\d{10,15}$/.test(formData.contact_phone.replace(/[\s-]/g, ""))) {
    errors.contact_phone = "Please enter a valid phone number"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Get validation errors for a specific step
 * Useful for showing step-specific error messages
 */
export function getStepErrors(
  step: number,
  formData: FormData
): Record<string, string> {
  const fullValidation = validateTenderFormData(formData)
  const stepFields: Record<number, string[]> = {
    1: ["title", "service_type", "custom_service_type"],
    2: [
      "property_name",
      "property_address_line_1",
      "property_address_line_2",
      "property_city",
      "property_state",
      "property_postcode",
      "property_country",
    ],
    3: [
      "scope_of_work",
      "contract_period_days",
      "contract_start_date",
      "contract_end_date",
      "evaluation_criteria",
    ],
    4: ["min_budget", "max_budget", "closing_date", "closing_time"],
    5: ["contact_person", "contact_email", "contact_phone"],
  }

  const fieldsForStep = stepFields[step] || []
  const stepErrors: Record<string, string> = {}

  fieldsForStep.forEach((field) => {
    if (fullValidation.errors[field]) {
      stepErrors[field] = fullValidation.errors[field]
    }
  })

  return stepErrors
}

/**
 * Helper: Check if evaluation criteria weights total 100%
 */
export function validateEvaluationCriteriaWeights(
  criteria: { criteria: string; weight: number }[]
): { isValid: boolean; total: number } {
  const total = criteria.reduce((sum, item) => sum + item.weight, 0)
  return {
    isValid: total === 100,
    total,
  }
}
