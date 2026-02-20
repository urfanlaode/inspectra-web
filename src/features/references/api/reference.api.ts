import { api } from '@/shared/api/api'
import type { ApiResponse } from '@/shared/types'
import type { DropdownData, Item, Lot } from '../types/reference.types'

export function getDropdowns(): Promise<ApiResponse<DropdownData>> {
  return api.get('/v1/references/dropdowns')
}

export function getLots(): Promise<ApiResponse<Lot[]>> {
  return api.get('/v1/references/lots')
}

export function getItems(): Promise<ApiResponse<Item[]>> {
  return api.get('/v1/references/items')
}
