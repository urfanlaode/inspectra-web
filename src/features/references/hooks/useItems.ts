import { TTL_5_MINUTES } from '@/shared/constants/ttl'
import { toCamel } from '@/shared/utils/to-camel'
import { useQuery } from '@tanstack/vue-query'
import { getItems } from '../api/reference.api'

export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: () => getItems().then((data) => toCamel(data)),
    staleTime: TTL_5_MINUTES
  })
}
