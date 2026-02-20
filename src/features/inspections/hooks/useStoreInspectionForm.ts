import { toTypedSchema } from '@vee-validate/zod'
import { useFieldArray, useForm } from 'vee-validate'
import { nextTick, ref, watch } from 'vue'
import { InspectionStatus } from '../enums'
import {
  inspectionSchema,
  type InspectionItemSchema,
  type InspectionSchema
} from '../schema/inspection.schema'
import type { InspectionItem, InspectionItemLot } from '../types/inspection.types'

export type UseStoreInspectionFormOptions = {
  initialValues?: Partial<InspectionSchema>
  disabledFields?: string[]
}

export function useStoreInspectionForm(options: UseStoreInspectionFormOptions = {}) {
  const opts = {
    initialValues: options.initialValues ?? {},
    disabledFields: options.disabledFields ?? []
  }

  const { handleSubmit, values, setValues, setFieldValue, resetForm, errors, setErrors } =
    useForm<InspectionSchema>({
      initialValues: {
        serviceTypeId: options.initialValues?.serviceTypeId ?? 0,
        scopeOfWorkId: opts.initialValues?.scopeOfWorkId ?? 0,
        locationId: opts.initialValues?.locationId ?? 0,
        estimatedCompletionDate: opts.initialValues?.estimatedCompletionDate ?? '',
        dcCode: opts.initialValues?.dcCode ?? '',
        items: (opts.initialValues?.items as InspectionItem[]) ?? [],
        note: opts.initialValues?.note ?? '',
        isCustomerCharged: opts.initialValues?.isCustomerCharged ?? false,
        customerId: opts.initialValues?.customerId ?? 0
      },
      validationSchema: toTypedSchema(inspectionSchema)
    })

  watch(
    () => opts.initialValues,
    (next) => {
      if (!next) return
      resetForm({ values: next })
    },
    { immediate: true, deep: true }
  )

  const {
    fields: inspectionFields,
    push,
    remove,
    replace
  } = useFieldArray<InspectionItemSchema>('items')

  const submitting = ref(false)

  function isFieldDisabled(field: string) {
    return opts.disabledFields?.includes(field)
  }

  function addItem() {
    push({
      inspectionId: 0,
      itemId: 0,
      qtyRequested: 1,
      lots: []
    } as any)
  }

  function removeItem(index: number) {
    remove(index)
  }

  function updateItemQty(index: number, qty: number) {
    setFieldValue(`items[${index}].qtyRequested`, qty as never)
  }

  function ensureLotsArray(itemIndex: number) {
    const items = (values.items as InspectionItem[] | undefined) ?? []
    if (!items[itemIndex]) {
      return
    }
    if (!items[itemIndex].lots) {
      setFieldValue(`items[${itemIndex}].lots`, [] as never)
    }
  }

  function addLot(itemIndex: number) {
    ensureLotsArray(itemIndex)
    const existing = (values.items as InspectionItem[])[itemIndex]?.lots ?? []
    const next = [
      ...existing,
      {
        inspectionItemId: (values.items as InspectionItem[])[itemIndex]?.inspectionId ?? 0,
        lotId: 0,
        qtyRequired: 1
      }
    ]
    setFieldValue(`items[${itemIndex}].lots`, next as never)
  }

  function removeLot(itemIndex: number, lotIndex: number) {
    const existing = (values.items as InspectionItem[])[itemIndex]?.lots ?? []
    if (!existing || existing.length === 0) return
    const next = [...existing]
    next.splice(lotIndex, 1)
    setFieldValue(`items[${itemIndex}].lots`, next as never)
  }

  function updateLotQty(itemIndex: number, lotIndex: number, qty: number) {
    const existing = (values.items as InspectionItem[])[itemIndex]?.lots ?? []
    if (!existing || !existing[lotIndex]) return
    const next = [...existing]
    next[lotIndex] = { ...(next[lotIndex] as InspectionItemLot), qtyRequired: qty }
    setFieldValue(`items[${itemIndex}].lots`, next as never)
  }

  function setInitialValues(next?: Partial<InspectionSchema>) {
    setValues({
      status: next?.status ?? InspectionStatus.NEW,
      serviceTypeId: next?.serviceTypeId ?? 0,
      scopeOfWorkId: next?.scopeOfWorkId ?? 0,
      locationId: next?.locationId ?? 0,
      estimatedCompletionDate: next?.estimatedCompletionDate ?? '',
      dcCode: next?.dcCode ?? '',
      items: (next?.items as InspectionItem[]) ?? [],
      note: next?.note ?? '',
      isCustomerCharged: next?.isCustomerCharged ?? false,
      customerId: next?.customerId ?? 0
    })
    replace((next?.items as InspectionItem[]) ?? [])
  }

  const submit = handleSubmit(async (vals) => {
    const items = (vals.items as InspectionItem[] | undefined) ?? []
    const payload: InspectionSchema = {
      ...vals,
      items: items.map((it) => ({
        ...it,
        lots: (it.lots ?? []).map((l) => ({ ...l }))
      }))
    }

    return payload
  })

  async function onSubmit(): Promise<InspectionSchema | void> {
    submitting.value = true
    try {
      const payload = await submit()
      return payload as InspectionSchema
    } finally {
      submitting.value = false
    }
  }

  function updateOptions(next: Partial<UseStoreInspectionFormOptions>) {
    if (next.disabledFields) opts.disabledFields = next.disabledFields
    if (next.initialValues) resetForm({ values: next.initialValues }, { force: true })
  }

  return {
    values,
    errors,
    submitting,

    inspectionFields,
    addItem,
    removeItem,
    updateItemQty,

    addLot,
    removeLot,
    updateLotQty,

    setFieldValue,
    resetForm,

    isFieldDisabled,
    setInitialValues,
    updateOptions,

    onSubmit,
    setErrors
  }
}
