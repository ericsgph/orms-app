import apiClient from '../api/apiClient'
import type { ApiResponse } from '../types/api.types'
import type { User, UserMaintenanceInput } from '../types/user.types'

export const userService = {
  getAll: async (): Promise<ApiResponse<User[]>> => {
    const response = await apiClient.get<ApiResponse<User[]>>('/users')
    return response.data
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>('/users/me')
    return response.data
  },

  create: async (payload: UserMaintenanceInput): Promise<ApiResponse<User>> => {
    const response = await apiClient.post<ApiResponse<User>>('/users', payload)
    return response.data
  },

  update: async (id: number, payload: Partial<UserMaintenanceInput>): Promise<ApiResponse<User>> => {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, payload)
    return response.data
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/users/${id}`)
    return response.data
  },
}
