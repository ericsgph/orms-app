export const RiskEventStatus = {
  DRAFT: 'DRAFT',
  ENDORSEMENT: 'ENDORSEMENT',
  RISK_ASSESSMENT: 'RISK_ASSESSMENT',
  MONITORING: 'MONITORING',
  COMMITTEE_REVIEW: 'COMMITTEE_REVIEW',
  ACTION_PLAN: 'ACTION_PLAN',
  ACTIVE: 'ACTIVE',
  UNDER_REVIEW: 'UNDER_REVIEW',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
} as const

export type RiskEventStatus = (typeof RiskEventStatus)[keyof typeof RiskEventStatus]

export const RiskEventType = {
  FINANCIAL: 'FINANCIAL',
  OPERATIONAL: 'OPERATIONAL',
  STRATEGIC: 'STRATEGIC',
  COMPLIANCE: 'COMPLIANCE',
  REPUTATIONAL: 'REPUTATIONAL',
  LOSS_EVENT: 'LOSS_EVENT',
} as const

export type RiskEventType = (typeof RiskEventType)[keyof typeof RiskEventType]

export const RiskSeverity = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const

export type RiskSeverity = (typeof RiskSeverity)[keyof typeof RiskSeverity]

export const ActionItemStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  BLOCKED: 'BLOCKED',
  COMPLETED: 'COMPLETED',
  OVERDUE: 'OVERDUE',
} as const

export type ActionItemStatus = (typeof ActionItemStatus)[keyof typeof ActionItemStatus]

export const AppRole = {
  ADMIN: 'admin',
  RISK_MANAGER: 'risk_manager',
  COMPLIANCE_OFFICER: 'compliance_officer',
  AUDITOR: 'auditor',
} as const

export type AppRole = (typeof AppRole)[keyof typeof AppRole]
