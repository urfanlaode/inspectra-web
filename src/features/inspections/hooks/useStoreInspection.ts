import { toSnake } from '@/shared/utils/to-snake'
import { useMutation } from '@tanstack/vue-query'
import { storeInspection } from '../api/inspection.api'
import type { StoreInspectionPayload } from '../types/inspection.types'

interface StoreInspectionData {
  payload: StoreInspectionPayload
  id?: number
}

export function useStoreInspection() {
  return useMutation({
    mutationFn: (vars: StoreInspectionData) =>
      storeInspection(toSnake(vars.payload) as any, vars.id)
  })
}
