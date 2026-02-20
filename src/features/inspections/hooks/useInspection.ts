import { TTL_5_MINUTES } from '@/shared/constants/ttl'
import { useQuery } from '@tanstack/vue-query'
import { getInspection } from '../api/inspection.api'
import { toCamel } from '@/shared/utils/to-camel'
import { computed } from 'vue'

export function useInspection(id: number) {
  const res = useQuery({
    queryKey: ['inspection', id],
    queryFn: () => getInspection(id).then((data) => toCamel(data)),
    staleTime: TTL_5_MINUTES
  })

  const isEditable = computed(() => {
    const status = res.data?.value?.data?.status
    return status === 'draft' || status === 'new'
  })

  const isReadyForReview = computed(() => {
    const status = res.data?.value?.data?.status
    return status === 'ready_for_review'
  })

  return { ...res, isEditable, isReadyForReview }
}
