import apiClient from '../api/apiClient'
import type { ApiResponse } from '../types/api.types'
import type { ActionPlan } from '../types/actionPlan.types'

export const actionPlanService = {
  getByRiskEventId: async (riskEventId: string): Promise<ApiResponse<ActionPlan[]>> => {
    const response = await apiClient.get<ApiResponse<ActionPlan[]>>(`/risk-events/${riskEventId}/actions`)
    return response.data
  },
}
