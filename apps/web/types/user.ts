export interface User {
  id: number
  email: string
  username?: string
  role: "admin" | "JMB" | "contractor"
  is_active: boolean
  created_at: string
  name?: string
  company_name?: string
  phone_number?: string
  website?: string
  experience_years?: number
  bio?: string
}
