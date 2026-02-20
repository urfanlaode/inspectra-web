import { TTL_5_MINUTES } from '@/shared/constants/ttl'
import { toCamel } from '@/shared/utils/to-camel'
import { useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { getInspections } from '../api/inspection.api'
import type { GetInspectionsParams } from '../types/inspection.types'

export function useInspections(params: Ref<GetInspectionsParams>) {
  return useQuery({
    queryKey: ['inspections', params],
    queryFn: () =>
      getInspections({
        ...params.value
      }).then((data) => toCamel(data)),
    staleTime: TTL_5_MINUTES
  })
}
