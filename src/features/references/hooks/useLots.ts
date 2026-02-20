import { TTL_5_MINUTES } from '@/shared/constants/ttl'
import { toCamel } from '@/shared/utils/to-camel'
import { useQuery } from '@tanstack/vue-query'
import { getLots } from '../api/reference.api'

export function useLots() {
  return useQuery({
    queryKey: ['lots'],
    queryFn: () => getLots().then((data) => toCamel(data)),
    staleTime: TTL_5_MINUTES
  })
}
