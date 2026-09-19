import apiClient from '../api/apiClient'
import type { ApiResponse, PagedResult } from '../types/api.types'
import { RiskEventStatus, RiskEventType, RiskSeverity } from '../types/enums'
import type { AssessRiskEventRequest, CreateRiskEventInput, RiskEvent, RiskWorkflowAction, UpdateRiskEventInput } from '../types/riskEvent.types'

const mockRiskEvents: Record<string, RiskEvent> = {
  'evt-1001': {
    id: 'evt-1001',
    title: 'Cybersecurity incident exposure in payment processing',
    description:
      'A third-party payment processor reported a control weakness that could expose customer data during peak transaction periods.',
    type: RiskEventType.LOSS_EVENT,
    severity: RiskSeverity.HIGH,
    status: RiskEventStatus.DRAFT,
    inherentScore: 0,
    residualScore: 0,
    ownerId: 'usr-100',
    businessUnitId: 'bu-1',
    businessUnitName: 'Technology Operations',
    riskCategory: 'Cybersecurity',
    submittedBy: 'M. Osei',
    submittedDate: '2026-09-01T08:30:00.000Z',
    createdAt: '2026-09-01T08:30:00.000Z',
    updatedAt: '2026-09-01T08:30:00.000Z',
  },
  'evt-1002': {
    id: 'evt-1002',
    title: 'Vendor concentration risk',
    description:
      'A single key vendor supports critical processing functions with limited alternative coverage.',
    type: RiskEventType.OPERATIONAL,
    severity: RiskSeverity.MEDIUM,
    status: RiskEventStatus.MONITORING,
    inherentScore: 0,
    residualScore: 0,
    ownerId: 'usr-101',
    businessUnitId: 'bu-2',
    businessUnitName: 'Procurement',
    riskCategory: 'Third Party',
    submittedBy: 'R. Smith',
    submittedDate: '2026-09-05T10:15:00.000Z',
    createdAt: '2026-09-05T10:15:00.000Z',
    updatedAt: '2026-09-05T10:15:00.000Z',
  },
}

export const riskEventService = {
  getAll: async (): Promise<ApiResponse<PagedResult<RiskEvent>>> => {
    try {
      const response = await apiClient.get<ApiResponse<PagedResult<RiskEvent>>>('/risk-events')
      return response.data
    } catch {
      const items = Object.values(mockRiskEvents)
      return {
        success: true,
        data: {
          items,
          page: 1,
          pageSize: items.length,
          total: items.length,
          totalPages: 1,
        },
      }
    }
  },

  getById: async (id: string): Promise<ApiResponse<RiskEvent>> => {
    try {
      const response = await apiClient.get<ApiResponse<RiskEvent>>(`/risk-events/${id}`)
      return response.data
    } catch {
      const item = mockRiskEvents[id] ?? mockRiskEvents['evt-1001']

      if (!item) {
        throw new Error('Risk event not found')
      }

      return {
        success: true,
        data: item,
      }
    }
  },

  create: async (payload: CreateRiskEventInput): Promise<ApiResponse<RiskEvent>> => {
    try {
      const response = await apiClient.post<ApiResponse<RiskEvent>>('/risk-events', payload)
      return response.data
    } catch {
      const now = new Date().toISOString()
      const id = `evt-${Date.now()}`
      const created: RiskEvent = {
        ...payload,
        id,
        status: RiskEventStatus.DRAFT,
        inherentScore: 0,
        residualScore: 0,
        createdAt: now,
        updatedAt: now,
      }

      mockRiskEvents[id] = created
      return { success: true, data: created }
    }
  },

  update: async (id: string, payload: UpdateRiskEventInput): Promise<ApiResponse<RiskEvent>> => {
    try {
      const response = await apiClient.put<ApiResponse<RiskEvent>>(`/risk-events/${id}`, payload)
      return response.data
    } catch {
      const current = mockRiskEvents[id]
      if (!current) {
        throw new Error('Risk event not found')
      }

      const updated: RiskEvent = {
        ...current,
        ...payload,
        updatedAt: new Date().toISOString(),
      }
      mockRiskEvents[id] = updated
      return { success: true, data: updated }
    }
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(`/risk-events/${id}`)
      return response.data
    } catch {
      if (!mockRiskEvents[id]) {
        throw new Error('Risk event not found')
      }

      delete mockRiskEvents[id]
      return { success: true, data: null
      }
    }
  },

  saveDraftAssessment: async (
    id: string,
    payload: Partial<AssessRiskEventRequest>,
  ): Promise<ApiResponse<RiskEvent>> => {
    const current = mockRiskEvents[id]

    if (!current) {
      throw new Error('Risk event not found')
    }

    const updated: RiskEvent = {
      ...current,
      riskCategory: payload.riskCategory ?? current.riskCategory,
      inherentScore: payload.inherentRiskRating ?? current.inherentScore,
      updatedAt: new Date().toISOString(),
    }

    mockRiskEvents[id] = updated

    return {
      success: true,
      data: updated,
    }
  },

  submitAssessment: async (
    id: string,
    payload: AssessRiskEventRequest,
  ): Promise<ApiResponse<RiskEvent>> => {
    const current = mockRiskEvents[id]

    if (!current) {
      throw new Error('Risk event not found')
    }

    const nextStatus = payload.inherentRiskRating >= 10 ? RiskEventStatus.COMMITTEE_REVIEW : RiskEventStatus.MONITORING
    const updated: RiskEvent = {
      ...current,
      riskCategory: payload.riskCategory,
      inherentScore: payload.inherentRiskRating,
      status: nextStatus,
      updatedAt: new Date().toISOString(),
    }

    mockRiskEvents[id] = updated

    return {
      success: true,
      data: updated,
    }
  },

  returnToRiskOwner: async (
    id: string,
    reason: string,
  ): Promise<ApiResponse<RiskEvent>> => {
    const current = mockRiskEvents[id]

    if (!current) {
      throw new Error('Risk event not found')
    }

    const updated: RiskEvent = {
      ...current,
      status: RiskEventStatus.DRAFT,
      updatedAt: new Date().toISOString(),
    }

    mockRiskEvents[id] = updated

    return {
      success: true,
      data: {
        ...updated,
        description: `${updated.description} (Returned to owner: ${reason})`,
      },
    }
  },

  transitionWorkflow: async (id: string, action: RiskWorkflowAction): Promise<ApiResponse<RiskEvent>> => {
    const current = mockRiskEvents[id]

    if (!current) {
      throw new Error('Risk event not found')
    }

    const nextStatusByAction: Record<RiskWorkflowAction, RiskEventStatus> = {
      endorse: RiskEventStatus.ENDORSEMENT,
      approve_endorsement: RiskEventStatus.RISK_ASSESSMENT,
      send_to_action_plan: RiskEventStatus.ACTION_PLAN,
      approve_committee: RiskEventStatus.ACTION_PLAN,
      close: RiskEventStatus.CLOSED,
    }

    const updated: RiskEvent = {
      ...current,
      status: nextStatusByAction[action],
      updatedAt: new Date().toISOString(),
    }

    mockRiskEvents[id] = updated
    return { success: true, data: updated }
  },
}
