import { api } from '@/shared/api/api'
import type { ApiResponse } from '@/shared/types'
import type {
  GetInspectionsParams,
  Inspection,
  StoreInspectionPayload
} from '../types/inspection.types'

export function storeInspection(
  payload: StoreInspectionPayload,
  id?: number
): Promise<ApiResponse<Inspection>> {
  if (id) {
    return api.put(`/v1/inspections/${id}`, payload)
  }
  return api.post('/v1/inspections', payload)
}

export function getInspections(params: GetInspectionsParams): Promise<ApiResponse<Inspection[]>> {
  return api.get('/v1/inspections', { params })
}

export function getInspection(id: number): Promise<ApiResponse<Inspection>> {
  return api.get(`/v1/inspections/${id}`)
}
