/**
 * Error Formatter Utility
 * Converts backend validation errors into user-friendly messages
 */

export interface ValidationError {
  field: string
  message: string
}

/**
 * Field name mapping to user-friendly labels
 */
const FIELD_LABELS: Record<string, string> = {
  contract_start_date: "Contract Start Date",
  contract_end_date: "Contract End Date",
  closing_date: "Closing Date",
  closing_time: "Closing Time",
  site_visit_date: "Site Visit Date",
  site_visit_time: "Site Visit Time",
  contact_email: "Contact Email",
  contact_person: "Contact Person",
  contact_phone: "Contact Phone",
  title: "Tender Title",
  description: "Description",
  service_type: "Service Type",
  property_name: "Property Name",
  property_address_line_1: "Property Address",
  property_city: "City",
  property_state: "State",
  property_postcode: "Postcode",
  min_budget: "Minimum Budget",
  max_budget: "Maximum Budget",
  tender_fee: "Tender Fee",
  scope_of_work: "Scope of Work",
  contract_period_days: "Contract Period",
  required_licenses: "Required Licenses",
  evaluation_criteria: "Evaluation Criteria",
}

/**
 * Error message mapping to user-friendly messages
 */
const ERROR_MESSAGES: Record<string, string> = {
  "Input should be a valid date or datetime, input is too short": "Please enter a valid date",
  "Input should be a valid date or datetime": "Please enter a valid date",
  "Input should be in a valid time format, input is too short": "Please enter a valid time (HH:MM format)",
  "Input should be in a valid time format": "Please enter a valid time (HH:MM format)",
  "value is not a valid email address": "Please enter a valid email address",
  "An email address must have an @-sign": "Please enter a valid email address",
  "Input should be a valid integer": "Please enter a valid number",
  "Input should be a valid number": "Please enter a valid number",
  "String should have at least": "This field is too short",
  "String should have at most": "This field is too long",
  "field required": "This field is required",
  "Field required": "This field is required",
}

/**
 * Parse error detail string into structured validation errors
 */
export function parseValidationErrors(errorDetail: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (!errorDetail || !errorDetail.trim()) {
    return errors
  }
  
  // Handle error format: "field_name: error message. field_name2: error message2."
  // Split by pattern: field_name: message (ending with period before next field or end)
  // First, try splitting by ". " (period + space) which separates errors
  const errorParts = errorDetail.split(/\.\s+(?=\w+:)/).filter(p => p.trim())
  
  for (const part of errorParts) {
    const trimmedPart = part.trim().replace(/\.$/, "") // Remove trailing period
    const colonIndex = trimmedPart.indexOf(":")
    
    if (colonIndex > 0 && colonIndex < trimmedPart.length) {
      const field = trimmedPart.substring(0, colonIndex).trim()
      const rawMessage = trimmedPart.substring(colonIndex + 1).trim()
      
      if (field && rawMessage) {
        // Get user-friendly field label
        const fieldLabel = FIELD_LABELS[field] || field.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())
        
        // Get user-friendly error message
        let friendlyMessage = rawMessage
        for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
          if (rawMessage.toLowerCase().includes(key.toLowerCase())) {
            friendlyMessage = value
            break
          }
        }
        
        errors.push({
          field: fieldLabel,
          message: friendlyMessage,
        })
      }
    }
  }
  
  // If splitting didn't work, try regex pattern matching
  if (errors.length === 0) {
    const errorPattern = /(\w+):\s*([^\.]+?)(?=\s+\w+:|\.\s+\w+:|$)/g
    let match: RegExpExecArray | null
    
    while ((match = errorPattern.exec(errorDetail)) !== null) {
      const field = match[1]
      const rawMessage = match[2]?.trim()
      
      if (field && rawMessage) {
        const fieldLabel = FIELD_LABELS[field] || field.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())
        
        let friendlyMessage = rawMessage
        for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
          if (rawMessage.toLowerCase().includes(key.toLowerCase())) {
            friendlyMessage = value
            break
          }
        }
        
        errors.push({
          field: fieldLabel,
          message: friendlyMessage,
        })
      }
    }
  }
  
  // If still no matches, treat as single error
  if (errors.length === 0 && errorDetail.trim()) {
    if (errorDetail.includes(":")) {
      const parts = errorDetail.split(":").map(p => p.trim()).filter(p => p)
      if (parts.length >= 2 && parts[0]) {
        const field = parts[0]
        const message = parts.slice(1).join(": ").trim()
        if (message) {
          const fieldLabel = FIELD_LABELS[field] || field.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())
          
          let friendlyMessage = message
          for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
            if (message.toLowerCase().includes(key.toLowerCase())) {
              friendlyMessage = value
              break
            }
          }
          
          errors.push({
            field: fieldLabel,
            message: friendlyMessage,
          })
        } else {
          errors.push({
            field: "Form",
            message: errorDetail,
          })
        }
      } else {
        errors.push({
          field: "Form",
          message: errorDetail,
        })
      }
    } else {
      errors.push({
        field: "Form",
        message: errorDetail,
      })
    }
  }
  
  return errors
}

/**
 * Format validation errors into a user-friendly message
 */
export function formatValidationErrors(errorDetail: string): string {
  const errors = parseValidationErrors(errorDetail)
  
  if (errors.length === 0) {
    return errorDetail
  }
  
  const firstError = errors[0]
  if (errors.length === 1 && firstError) {
    return `${firstError.field}: ${firstError.message}`
  }
  
  // Format multiple errors as a bulleted list
  return `Please fix the following errors:\n${errors.filter(e => e).map(e => `• ${e.field}: ${e.message}`).join("\n")}`
}

/**
 * Format validation errors as HTML/React content
 */
export function formatValidationErrorsAsList(errorDetail: string): { field: string; message: string }[] {
  return parseValidationErrors(errorDetail)
}
