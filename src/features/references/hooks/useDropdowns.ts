import { TTL_ONE_MONTH } from '@/shared/constants/ttl'
import { toCamel } from '@/shared/utils/to-camel'
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { getDropdowns } from '../api/reference.api'
import type { DropdownData } from '../types/reference.types'

export function useDropdowns() {
  const res = useQuery({
    queryKey: ['dropdowns'],
    queryFn: () => getDropdowns(),
    staleTime: TTL_ONE_MONTH // Long cache time
  })

  const data = computed<DropdownData>(() => {
    return toCamel(res.data?.value?.data) as any
  })
  const serviceTypes = computed(() => data.value?.serviceTypes ?? [])
  const scopeOfWorks = computed(() => data.value?.scopeOfWorks ?? [])
  const itemCategories = computed(() => data.value?.itemCategories ?? [])
  const allocations = computed(() => data.value?.allocations ?? [])
  const owners = computed(() => data.value?.owners ?? [])
  const conditions = computed(() => data.value?.conditions ?? [])
  const uoms = computed(() => data.value?.uoms ?? [])
  const locations = computed(() => data.value?.locations ?? [])
  const customers = computed(() => data.value?.customers ?? [])

  return {
    serviceTypes,
    scopeOfWorks,
    itemCategories,
    allocations,
    owners,
    conditions,
    uoms,
    locations,
    customers,

    isLoading: res.isLoading,
    isFetching: res.isFetching,
    error: res.error,
    refetch: res.refetch
  }
}
