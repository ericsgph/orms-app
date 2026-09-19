import apiClient from '../api/apiClient'
import type { ApiResponse } from '../types/api.types'
import type { BusinessUnit } from '../types/businessUnit.types'

export const businessUnitService = {
  getAll: async (): Promise<ApiResponse<BusinessUnit[]>> => {
    const response = await apiClient.get<ApiResponse<BusinessUnit[]>>('/business-units')
    return response.data
  },
}
