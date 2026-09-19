import type { RiskEventStatus, RiskEventType, RiskSeverity } from './enums'

export type RiskEvent = {
  id: string
  title: string
  description: string
  type: RiskEventType
  severity: RiskSeverity
  status: RiskEventStatus
  inherentScore: number
  residualScore: number
  ownerId: string
  businessUnitId: string
  businessUnitName?: string
  riskCategory?: string
  submittedBy?: string
  submittedDate?: string
  createdAt: string
  updatedAt: string
}

export type CreateRiskEventInput = {
  title: string
  description: string
  type: RiskEventType
  severity: RiskSeverity
  ownerId: string
  businessUnitId: string
  businessUnitName?: string
  riskCategory?: string
}

export type UpdateRiskEventInput = Partial<CreateRiskEventInput>

export type RiskWorkflowAction = 'endorse' | 'approve_endorsement' | 'send_to_action_plan' | 'approve_committee' | 'close'

export type AssessRiskEventRequest = {
  riskCategory: string
  impact: number
  likelihood: number
  inherentRiskRating: number
  lossAmount?: number
  recoveryAmount?: number
  glReference?: string
  assessmentRationale: string
  existingControlsIdentified?: string
  reclassificationReason?: string
  status?: RiskEventStatus
}
