export type ApiResponse<T> = {
  data: T
  message?: string
  success: boolean
}

export type PagedResult<T> = {
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export type ApiError = {
  message: string
  code?: string
  details?: Record<string, unknown>
}
