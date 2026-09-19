import apiClient from '../api/apiClient'
import type { ApiResponse } from '../types/api.types'
import type { RiskCategory } from '../types/riskCategory.types'

export const riskCategoryService = {
  getAll: async (): Promise<ApiResponse<RiskCategory[]>> => {
    const response = await apiClient.get<ApiResponse<RiskCategory[]>>('/risk-categories')
    return response.data
  },
}
