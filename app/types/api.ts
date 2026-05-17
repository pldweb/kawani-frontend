export interface ApiEnvelope<T> {
  success: boolean
  data: T
  message: string
  meta: {
    pagination?: Record<string, unknown>
    [key: string]: unknown
  }
}

export interface ApiErrorEnvelope {
  success: false
  message: string
  errors: Record<string, string[]>
}

export interface User {
  id: number
  uuid?: string
  name: string
  email: string
  is_active: boolean
  roles?: Array<{ id: number; name: string }>
  permissions?: Array<{ id: number; name: string }>
  all_permissions?: string[]
}

export interface LoginResponse {
  user: User
  token: string
  token_type: 'Bearer'
}

export interface DashboardSummary {
  metrics: {
    total_employees: number
    active_employees: number
    departments_count: number
    leave_pending: number
    birthdays_this_month: number
  }
  employee_trend: Array<{ label: string; value: number }>
  departments: Array<{ label: string; count: number; percent: number }>
  attendance: {
    present: number
    late: number
    leave: number
    absent: number
  }
  recent_leaves: Array<{
    name: string
    role: string
    type: string
    date: string
    status: string
    avatar: string
  }>
  announcements: Array<{
    title: string
    date: string
    priority: string
    type: string
  }>
  payroll: {
    period: string
    total: number
    base: number
    allowance: number
    deduction: number
    trend: string
  }
}
