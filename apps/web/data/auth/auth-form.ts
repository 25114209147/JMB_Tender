export type UserType = "owner" | "contractor" | "admin"

export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterFormData {
  userType: UserType
  name: string
  companyName?: string // Only for contractors
  email: string
  password: string
  confirmPassword: string
}

export interface ForgotPasswordFormData {
  email: string
}

export interface ResetPasswordFormData {
  token: string
  password: string
  confirmPassword: string
}


// Default Values
export const defaultLoginFormData: LoginFormData = {
  email: "",
  password: "",
  rememberMe: false,
}

export const defaultRegisterFormData: RegisterFormData = {
  userType: "contractor",
  name: "",
  companyName: "",
  email: "",
  password: "",
  confirmPassword: "",
}

export const defaultForgotPasswordFormData: ForgotPasswordFormData = {
  email: "",
}

export const defaultResetPasswordFormData: ResetPasswordFormData = {
  token: "",
  password: "",
  confirmPassword: "",
}


// Constants
export const USER_TYPE_OPTIONS = [
  {
    value: "contractor" as UserType,
    label: "Contractor",
    description: "Bid on tenders",
  },
  {
    value: "jmb" as UserType,
    label: "JMB/Owner",
    description: "Post tenders",
  },
] as const

export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
} as const

export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid email or password",
  EMAIL_EXISTS: "An account with this email already exists",
  WEAK_PASSWORD: "Password does not meet security requirements",
  PASSWORDS_DONT_MATCH: "Passwords do not match",
  INVALID_EMAIL: "Please enter a valid email address",
  REQUIRED_FIELD: "This field is required",
  TOKEN_EXPIRED: "Reset link has expired",
  TOKEN_INVALID: "Invalid reset link",
} as const
