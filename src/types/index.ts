// TypeScript types matching the ShedShare DB schema

export type ToolStatus = 'available' | 'lent_out' | 'not_available'

export type RequestStatus =
  | 'pending'
  | 'approved'
  | 'declined'
  | 'handed_off'
  | 'returned'
  | 'cancelled'

export type NutsTransactionType =
  | 'signup_bonus'
  | 'lend_earn'
  | 'borrow_spend'
  | 'bonus'
  | 'refund'

export type NotificationType =
  | 'borrow_request'
  | 'request_approved'
  | 'request_declined'
  | 'tool_handed_off'
  | 'tool_returned'
  | 'return_reminder'

export type CircleRole = 'admin' | 'member'

export interface NotificationPrefs {
  email: boolean
  sms: boolean
  borrow_requests: boolean
  request_responses: boolean
  return_reminders: boolean
}

export interface Profile {
  id: string
  display_name: string
  avatar_url: string | null
  phone: string | null
  email: string
  nuts_balance: number
  notification_prefs: NotificationPrefs
  created_at: string
  updated_at: string
}

export interface Circle {
  id: string
  name: string
  description: string | null
  invite_code: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface CircleMember {
  id: string
  circle_id: string
  user_id: string
  role: CircleRole
  joined_at: string
}

export interface ToolCategory {
  id: string
  name: string
  icon: string | null
  sort_order: number
}

export interface Tool {
  id: string
  owner_id: string
  name: string
  description: string | null
  category_id: string | null
  photo_url: string | null
  status: ToolStatus
  sku: string | null
  nuts_cost: number
  created_at: string
  updated_at: string
}

export interface ToolCircleListing {
  id: string
  tool_id: string
  circle_id: string
  listed_at: string
}

export interface BorrowRequest {
  id: string
  tool_id: string
  borrower_id: string
  lender_id: string
  circle_id: string
  status: RequestStatus
  message: string | null
  due_date: string | null
  nuts_amount: number
  responded_at: string | null
  handed_off_at: string | null
  returned_at: string | null
  created_at: string
  updated_at: string
}

export interface NutsTransaction {
  id: string
  user_id: string
  amount: number
  type: NutsTransactionType
  related_request_id: string | null
  description: string | null
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body: string
  related_request_id: string | null
  read: boolean
  email_sent: boolean
  sms_sent: boolean
  created_at: string
}
