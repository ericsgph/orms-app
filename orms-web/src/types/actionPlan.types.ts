import type { ActionItemStatus } from './enums'

export type ActionPlan = {
  id: string
  riskEventId: string
  title: string
  ownerId: string
  status: ActionItemStatus
  dueDate: string
  completedAt?: string
  notes?: string
}
