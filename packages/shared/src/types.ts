export type UserRole = 'driver' | 'office' | 'welder' | 'run_around'

export type StopStatus = 'pending' | 'arrived' | 'complete' | 'missed'
export type AccountStatus = 'active' | 'suspended' | 'paid'
export type RouteStatus = 'pending' | 'in_progress' | 'complete'
export type TicketStatus = 'open' | 'in_progress' | 'complete' | 'pending_pickup'
export type TicketSource = 'pre_trip' | 'stop_photo' | 'office'
export type LogisticsType = 'delivery' | 'pickup' | 'repair_transport'

export interface User {
  id: string
  name: string
  role: UserRole
}

export interface Stop {
  id: string
  routeId: string
  address: string
  sequence: number
  status: StopStatus
  accountStatus: AccountStatus
  flaggedByOffice: boolean
  notes: string | null
  completedAt: string | null
  latitude: number | null
  longitude: number | null
}

export interface Route {
  id: string
  driverId: string
  date: string
  status: RouteStatus
  stops: Stop[]
}

export interface RepairTicket {
  id: string
  source: TicketSource
  stopId: string | null
  assignedTo: string
  status: TicketStatus
  priority: number
  notes: string | null
  photoUrl: string | null
  createdAt: string
  completedAt: string | null
}

export interface LogisticsTicket {
  id: string
  type: LogisticsType
  repairTicketId: string | null
  assignedTo: string
  status: 'pending' | 'in_progress' | 'complete'
  createdAt: string
}

export interface AppEvent {
  id: string
  type: 'payment_cleared' | 'repair_complete' | 'stop_reassigned' | 'stop_flagged'
  payload: Record<string, unknown>
  createdAt: string
}
