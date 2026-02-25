/**
 * Auth Form Validation
 * 
 * This file contains all validation logic for authentication forms:
 * - Login validation
 * - Registration validation  
 * - Password reset validation
 * - Email & password utilities
 */

import type {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
} from "./auth-form"

import {
  AUTH_ERROR_MESSAGES,
  PASSWORD_REQUIREMENTS,
  USER_TYPE_OPTIONS,
} from "./auth-form"

// Shared Validation Result Type
export interface ValidationResult<Errors = Record<string, string>> {
  isValid: boolean
  errors: Errors
}

// Specific Error Types 
export interface LoginFormErrors {
  email?: string
  password?: string
}

export interface RegisterFormErrors {
  userType?: string
  name?: string
  companyName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export interface ForgotPasswordFormErrors {
  email?: string
}

export interface ResetPasswordFormErrors {
  token?: string
  password?: string
  confirmPassword?: string
}

// Reusable Field Validators
function validateEmail(email: string): string | undefined {
  if (!email?.trim()) {
    return AUTH_ERROR_MESSAGES.REQUIRED_FIELD
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return AUTH_ERROR_MESSAGES.INVALID_EMAIL
  }
  return undefined
}

function validateRequired(value: string, fieldName: string): string | undefined {
  if (!value?.trim()) {
    return `${fieldName} ${AUTH_ERROR_MESSAGES.REQUIRED_FIELD.toLowerCase()}`
  }
  return undefined
}

function validateMinLength(
  value: string,
  min: number,
  fieldName: string
): string | undefined {
  if (value.trim().length < min) {
    return `${fieldName} must be at least ${min} characters`
  }
  return undefined
}

// Password Validation
export interface PasswordStrength {
  score: number // 0–5
  hasLength: boolean
  hasUpper: boolean
  hasLower: boolean
  hasNumber: boolean
  hasSpecial: boolean
  strengthLabel: "Weak" | "Fair" | "Good" | "Strong" | "Very Strong"
}

export function getPasswordStrength(password: string): PasswordStrength {
  const checks = {
    hasLength: password.length >= PASSWORD_REQUIREMENTS.minLength,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  const score = Object.values(checks).filter(Boolean).length

  let strengthLabel: PasswordStrength["strengthLabel"] = "Weak"
  if (score >= 5) strengthLabel = "Very Strong"
  else if (score >= 4) strengthLabel = "Strong"
  else if (score >= 3) strengthLabel = "Good"
  else if (score >= 2) strengthLabel = "Fair"

  return { ...checks, score, strengthLabel }
}

export function validatePassword(password: string): string | undefined {
  if (!password?.trim()) {
    return AUTH_ERROR_MESSAGES.REQUIRED_FIELD
  }

  const strength = getPasswordStrength(password)

  if (!strength.hasLength) {
    return `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`
  }
  if (!strength.hasUpper) {
    return "Must contain at least one uppercase letter"
  }
  if (!strength.hasLower) {
    return "Must contain at least one lowercase letter"
  }
  if (!strength.hasNumber) {
    return "Must contain at least one number"
  }
  if (!strength.hasSpecial) {
    return "Must contain at least one special character"
  }

  return undefined
}

function validatePasswordMatch(
  password: string,
  confirm: string
): string | undefined {
  if (!confirm?.trim()) {
    return "Please confirm your password"
  }
  if (password !== confirm) {
    return AUTH_ERROR_MESSAGES.PASSWORDS_DONT_MATCH
  }
  return undefined
}

// Full Form Validators
export function validateLoginForm(
  data: LoginFormData
): ValidationResult<LoginFormErrors> {
  const errors: LoginFormErrors = {}

  const emailErr = validateEmail(data.email)
  if (emailErr) errors.email = emailErr

  if (!data.password?.trim()) {
    errors.password = AUTH_ERROR_MESSAGES.REQUIRED_FIELD
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateRegisterForm(
  data: RegisterFormData
): ValidationResult<RegisterFormErrors> {
  const errors: RegisterFormErrors = {}

  // userType
  if (!data.userType || !USER_TYPE_OPTIONS.some(opt => opt.value === data.userType)) {
    errors.userType = "Please select a valid user type"
  }

  // name
  let err = validateRequired(data.name, "Full name")
  if (err) errors.name = err
  else {
    err = validateMinLength(data.name, 2, "Full name")
    if (err) errors.name = err
  }

  // companyName — only required for contractor
  if (data.userType === "contractor") {
    err = validateRequired(data.companyName || "", "Company name")
    if (err) errors.companyName = err
    else {
      err = validateMinLength(data.companyName || "", 2, "Company name")
      if (err) errors.companyName = err
    }
  }

  // email
  err = validateEmail(data.email)
  if (err) errors.email = err

  // password
  err = validatePassword(data.password)
  if (err) errors.password = err

  // confirmPassword
  err = validatePasswordMatch(data.password, data.confirmPassword)
  if (err) errors.confirmPassword = err

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateForgotPasswordForm(
  data: ForgotPasswordFormData
): ValidationResult<ForgotPasswordFormErrors> {
  const errors: ForgotPasswordFormErrors = {}

  const err = validateEmail(data.email)
  if (err) errors.email = err

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateResetPasswordForm(
  data: ResetPasswordFormData
): ValidationResult<ResetPasswordFormErrors> {
  const errors: ResetPasswordFormErrors = {}

  if (!data.token?.trim()) {
    errors.token = "Reset token is missing or invalid"
  }

  const pwdErr = validatePassword(data.password)
  if (pwdErr) errors.password = pwdErr

  const matchErr = validatePasswordMatch(data.password, data.confirmPassword)
  if (matchErr) errors.confirmPassword = matchErr

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Field-level validation (for real-time / onBlur / onChange)
export function validateField(
  field: keyof RegisterFormData | keyof ResetPasswordFormData | keyof LoginFormData,
  value: string,
  context?: Partial<RegisterFormData | ResetPasswordFormData | LoginFormData>
): string | undefined {
  switch (field) {
    case "email":
      return validateEmail(value)

    case "password":
      return validatePassword(value)

    case "confirmPassword":
      if (context && "password" in context && context.password) {
        return validatePasswordMatch(context.password, value)
      }
      return undefined

    case "name":
      return (
        validateRequired(value, "Full name") ||
        validateMinLength(value, 2, "Full name")
      )

    case "companyName":
      return (
        validateRequired(value, "Company name") ||
        validateMinLength(value, 2, "Company name")
      )

    default:
      return undefined
  }
}