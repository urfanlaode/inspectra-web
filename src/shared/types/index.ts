export interface ApiResponse<T = unknown> {
  ok: boolean
  timestamp: string
  message?: string
  data?: T
  errors?: Record<string, string[]>
}

export interface PaginatedMeta {
  page: number
  limit: number
  next?: number
  prev?: number
}

export interface ApiPaginatedResponse<T = unknown> {
  ok: boolean
  timestamp: string
  message?: string
  data: T[]
  meta: PaginatedMeta
}
