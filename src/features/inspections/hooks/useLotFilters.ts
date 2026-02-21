import { watch } from 'vue'

export function useLotFilters({ dropdowns, values, lotArr, setFieldValue }: any) {
  function getSelectionForRow(itemIndex: number, lotIndex: number) {
    const itemId = values.items?.[itemIndex]?.itemId ?? 0
    const lotId = values.items?.[itemIndex]?.lots?.[lotIndex]?.lotId ?? 0
    const allocationId = values.items?.[itemIndex]?.lots?.[lotIndex]?.allocationId ?? 0
    const ownerId = values.items?.[itemIndex]?.lots?.[lotIndex]?.ownerId ?? 0
    const conditionId = values.items?.[itemIndex]?.lots?.[lotIndex]?.conditionId ?? 0

    return { itemId, lotId, allocationId, ownerId, conditionId }
  }

  function getFilteredLotsForRow(itemIndex: number, lotIndex: number) {
    const sel = getSelectionForRow(itemIndex, lotIndex)
    let filtered = (lotArr.value?.data ?? []).filter((l: any) => {
      if (sel.itemId && sel.itemId !== 0 && l.itemId !== sel.itemId) return false
      if (sel.allocationId && sel.allocationId !== 0 && l.allocationId !== sel.allocationId)
        return false
      if (sel.ownerId && sel.ownerId !== 0 && l.ownerId !== sel.ownerId) return false
      if (sel.conditionId && sel.conditionId !== 0 && l.conditionId !== sel.conditionId)
        return false
      return true
    })

    if (sel.lotId && sel.lotId !== 0) {
      filtered = filtered.filter((l: any) => l.id === sel.lotId)
    }

    return filtered.map((l: any) => ({ label: l.lotNumber, value: l.id }))
  }

  function getFilteredAllocationOptions(itemIndex: number, lotIndex: number) {
    const sel = getSelectionForRow(itemIndex, lotIndex)

    if (sel.lotId && sel.lotId !== 0) {
      const lot = (lotArr.value?.data ?? []).find((l: any) => l.id === sel.lotId)
      if (lot && lot.allocation) return [{ label: lot.allocation.name, value: lot.allocation.id }]
      return []
    }

    const filtered = (lotArr.value?.data ?? []).filter((l: any) => {
      if (sel.itemId && sel.itemId !== 0 && l.itemId !== sel.itemId) return false
      if (sel.ownerId && sel.ownerId !== 0 && l.ownerId !== sel.ownerId) return false
      if (sel.conditionId && sel.conditionId !== 0 && l.conditionId !== sel.conditionId)
        return false
      return true
    })

    const allocationsMap = new Map<number, any>()
    filtered.forEach((l: any) => {
      const a = l.allocation
      if (a && !allocationsMap.has(a.id)) allocationsMap.set(a.id, a)
    })

    return Array.from(allocationsMap.values())
      .filter(Boolean)
      .map((a: any) => ({ label: a.name, value: a.id }))
  }

  function getFilteredOwnerOptions(itemIndex: number, lotIndex: number) {
    const sel = getSelectionForRow(itemIndex, lotIndex)

    if (sel.lotId && sel.lotId !== 0) {
      const lot = (lotArr.value?.data ?? []).find((l: any) => l.id === sel.lotId)
      if (lot && lot.owner) return [{ label: lot.owner.name, value: lot.owner.id }]
      return []
    }

    const filtered = (lotArr.value?.data ?? []).filter((l: any) => {
      if (sel.itemId && sel.itemId !== 0 && l.itemId !== sel.itemId) return false
      if (sel.allocationId && sel.allocationId !== 0 && l.allocationId !== sel.allocationId)
        return false
      if (sel.conditionId && sel.conditionId !== 0 && l.conditionId !== sel.conditionId)
        return false
      return true
    })

    const ownersMap = new Map<number, any>()
    filtered.forEach((l: any) => {
      const o = l.owner
      if (o && !ownersMap.has(o.id)) ownersMap.set(o.id, o)
    })

    return Array.from(ownersMap.values())
      .filter(Boolean)
      .map((o: any) => ({ label: o.name, value: o.id }))
  }

  function getFilteredConditionOptions(itemIndex: number, lotIndex: number) {
    const sel = getSelectionForRow(itemIndex, lotIndex)

    if (sel.lotId && sel.lotId !== 0) {
      const lot = (lotArr.value?.data ?? []).find((l: any) => l.id === sel.lotId)
      if (lot && lot.condition) return [{ label: lot.condition.name, value: lot.condition.id }]
      return []
    }

    const filtered = (lotArr.value?.data ?? []).filter((l: any) => {
      if (sel.itemId && sel.itemId !== 0 && l.itemId !== sel.itemId) return false
      if (sel.allocationId && sel.allocationId !== 0 && l.allocationId !== sel.allocationId)
        return false
      if (sel.ownerId && sel.ownerId !== 0 && l.ownerId !== sel.ownerId) return false
      return true
    })

    const conditionsMap = new Map<number, any>()
    filtered.forEach((l: any) => {
      const c = l.condition
      if (c && !conditionsMap.has(c.id)) conditionsMap.set(c.id, c)
    })

    return Array.from(conditionsMap.values())
      .filter(Boolean)
      .map((c: any) => ({ label: c.name, value: c.id }))
  }

  watch(
    [() => values.items, () => lotArr.value?.data],
    ([items]) => {
      if (!lotArr.value?.data?.length) return

      const current = (items ?? []) as any[]
      current.forEach((it: any, itemIndex: number) => {
        const lotsArr = it?.lots ?? []
        lotsArr.forEach((lf: any, lotIndex: number) => {
          const selectedLotId = lf?.lotId ?? 0
          if (selectedLotId && selectedLotId !== 0) {
            const lot = (lotArr.value?.data ?? []).find((l: any) => l.id === selectedLotId)
            if (lot) {
              setFieldValue(
                `items[${itemIndex}].lots[${lotIndex}].allocationId`,
                (lot.allocation?.id ?? 0) as never
              )
              setFieldValue(
                `items[${itemIndex}].lots[${lotIndex}].ownerId`,
                (lot.owner?.id ?? 0) as never
              )
              setFieldValue(
                `items[${itemIndex}].lots[${lotIndex}].conditionId`,
                (lot.condition?.id ?? 0) as never
              )
              setFieldValue(
                `items[${itemIndex}].lots[${lotIndex}].availableQty`,
                (lot.qty ?? 0) as never
              )
              return
            }
          }

          const itemId = it?.itemId ?? 0
          const allocId = lf?.allocationId ?? 0
          const ownerId = lf?.ownerId ?? 0
          const condId = lf?.conditionId ?? 0

          const isValid = (lotArr.value?.data ?? []).some((g: any) => {
            if (itemId && itemId !== 0 && g.itemId !== itemId) return false
            if (allocId && allocId !== 0 && g.allocationId !== allocId) return false
            if (ownerId && ownerId !== 0 && g.ownerId !== ownerId) return false
            if (condId && condId !== 0 && g.conditionId !== condId) return false
            return true
          })

          if (!isValid) {
            setFieldValue(`items[${itemIndex}].lots[${lotIndex}].lotId`, 0 as never)
            setFieldValue(`items[${itemIndex}].lots[${lotIndex}].availableQty`, 0 as never)
          }
        })
      })
    },
    { immediate: true, deep: true }
  )

  return {
    getFilteredLotsForRow,
    getFilteredAllocationOptions,
    getFilteredOwnerOptions,
    getFilteredConditionOptions
  }
}
