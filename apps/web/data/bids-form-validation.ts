 // Step-by-step validation (for navigation) and full form validation (for submission).
import type { BidFormData } from "./bids-form"

// Validation Constants
export const VALIDATION_CONSTRAINTS = {
  methodology: {
    minLength: 100,
    maxLength: 800,
  },
  validityPeriod: {
    min: 30,
    max: 365,
  },
  ssmRegistration: {
    pattern: /^\d{12}$/,
    message: "SSM registration number should be 12 digits",
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  },
  phone: {
    pattern: /^\+?\d{10,15}$/,
    message: "Please enter a valid phone number",
  },
} as const

export const STEP_FIELDS: Record<number, (keyof BidFormData)[]> = {
  1: ["company_name", "company_address", "company_registration", "contact_person_name", "contact_person_phone", "contact_person_email"],
  2: ["proposed_amount", "payment_terms", "validity_period_days"],
  3: ["supporting_documents", "methodology"],
  4: ["agree_to_terms"],
}

// Step-by-step validation functions
export function validateStep1(formData: BidFormData): boolean {
  return (
    formData.company_name.trim() !== "" &&
    formData.company_address.trim() !== "" &&
    formData.contact_person_name.trim() !== "" &&
    formData.contact_person_phone.trim() !== "" &&
    formData.contact_person_email.trim() !== ""
  )
}

export function validateStep2(formData: BidFormData): boolean {
  return (
    formData.proposed_amount !== "" &&
    parseFloat(formData.proposed_amount) > 0 &&
    formData.payment_terms !== "" &&
    formData.validity_period_days > 0
  )
}

export function validateStep3(formData: BidFormData): boolean {
  return (
    formData.supporting_documents.length > 0 ||
    Boolean(
      formData.methodology &&
      formData.methodology.trim().length >= VALIDATION_CONSTRAINTS.methodology.minLength
    )
  )
}

export function validateStep4(formData: BidFormData): boolean {
  return formData.agree_to_terms === true
}

export function canProceedToStep(currentStep: number, formData: BidFormData): boolean {
  const validators = {
    1: validateStep1,
    2: validateStep2,
    3: validateStep3,
    4: validateStep4,
  }
  return validators[currentStep as keyof typeof validators]?.(formData) ?? false
}

// Full Form Validation (for submission)
export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

// Helper functions for validation
const isRequired = (value: string): boolean => value.trim() !== ""
const isValidAmount = (amount: string): boolean => {
  const num = parseFloat(amount)
  return !isNaN(num) && num > 0
}
const isValidPhone = (phone: string): boolean => {
  const clean = phone.replace(/[\s-]/g, "")
  return VALIDATION_CONSTRAINTS.phone.pattern.test(clean)
}
const isValidEmail = (email: string): boolean => {
  return VALIDATION_CONSTRAINTS.email.pattern.test(email)
}

export function validateBidFormData(formData: BidFormData): ValidationResult {
  const errors: Record<string, string> = {}

  // Step 1: Company & Contact
  if (!isRequired(formData.company_name)) errors.company_name = "Company name is required"
  if (!isRequired(formData.company_address)) errors.company_address = "Company address is required"
  if (!isRequired(formData.contact_person_name)) errors.contact_person_name = "Contact person name is required"
  
  if (!isRequired(formData.contact_person_phone)) {
    errors.contact_person_phone = "Contact phone is required"
  } else if (!isValidPhone(formData.contact_person_phone)) {
    errors.contact_person_phone = VALIDATION_CONSTRAINTS.phone.message
  }
  
  if (!isRequired(formData.contact_person_email)) {
    errors.contact_person_email = "Contact email is required"
  } else if (!isValidEmail(formData.contact_person_email)) {
    errors.contact_person_email = VALIDATION_CONSTRAINTS.email.message
  }
  
  if (formData.company_registration && !VALIDATION_CONSTRAINTS.ssmRegistration.pattern.test(formData.company_registration)) {
    errors.company_registration = VALIDATION_CONSTRAINTS.ssmRegistration.message
  }
  
  // Step 2: Financial Proposal
  if (!isValidAmount(formData.proposed_amount)) {
    errors.proposed_amount = "Please enter a valid amount"
  }
  if (!formData.payment_terms) errors.payment_terms = "Payment terms are required"
  
  const { min, max } = VALIDATION_CONSTRAINTS.validityPeriod
  if (!formData.validity_period_days || formData.validity_period_days < min || formData.validity_period_days > max) {
    errors.validity_period_days = `Validity period must be between ${min} and ${max} days`
  }
  
  // Step 3: Technical Proposal
  const hasDocuments = formData.supporting_documents.length > 0
  const hasMethodology = formData.methodology && formData.methodology.trim().length >= VALIDATION_CONSTRAINTS.methodology.minLength
  
  if (!hasDocuments && !hasMethodology) {
    errors.methodology = `Please provide either supporting documents or a methodology description (minimum ${VALIDATION_CONSTRAINTS.methodology.minLength} characters)`
  }
  
  if (formData.methodology && formData.methodology.length > VALIDATION_CONSTRAINTS.methodology.maxLength) {
    errors.methodology = `Methodology description must not exceed ${VALIDATION_CONSTRAINTS.methodology.maxLength} characters`
  }
  
  // Step 4: Declaration
  if (!formData.agree_to_terms) {
    errors.agree_to_terms = "You must agree to the terms and conditions"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function getStepErrors(step: number, formData: BidFormData): Record<string, string> {
  const validation = validateBidFormData(formData)
  const fields = STEP_FIELDS[step] || []
  const errors: Record<string, string> = {}
  
  fields.forEach((field) => {
    if (validation.errors[field]) {
      errors[field] = validation.errors[field]
    }
  })
  
  return errors
}
