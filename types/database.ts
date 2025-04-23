export interface User {
  id: string
  name: string
  email: string
  password?: string
  role: "ATHLETE" | "ORGANIZER" | "ADMIN"
  region?: string
  organization?: string
  phone?: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface Competition {
  id: string
  title: string
  type: "OPEN" | "REGIONAL" | "FEDERAL"
  discipline: string
  description?: string
  rules?: string
  prizes?: string
  region: string
  registrationStart: Date
  registrationEnd: Date
  eventStart: Date
  eventEnd: Date
  maxParticipants?: number
  currentParticipants: number
  status:
    | "DRAFT"
    | "MODERATION"
    | "REGISTRATION_OPEN"
    | "REGISTRATION_CLOSED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"
  organizerId: string
  createdAt: Date
  updatedAt: Date
}

export interface Team {
  id: string
  name: string
  competitionId: string
  captainId: string
  status: "PENDING" | "CONFIRMED" | "NEEDS_MEMBERS" | "REJECTED"
  createdAt: Date
  updatedAt: Date
}

export interface TeamMember {
  id: string
  teamId: string
  userId: string
  isCaptain: boolean
  joinedAt: Date
}

export interface Registration {
  id: string
  competitionId: string
  userId: string
  teamId?: string
  status: "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED"
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED"
  paymentId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Result {
  id: string
  competitionId: string
  teamId?: string
  userId?: string
  place?: number
  score?: number
  timeSpent?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Achievement {
  id: string
  userId: string
  title: string
  place: number
  points: number
  date: Date
  description?: string
  createdAt: Date
  updatedAt: Date
}
