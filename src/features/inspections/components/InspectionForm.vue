<script setup lang="ts">
import { useDropdowns } from '@/features/references/hooks/useDropdowns'
import { useItems } from '@/features/references/hooks/useItems'
import { useLots } from '@/features/references/hooks/useLots'
import Button from '@/shared/ui/Button.vue'
import Datefield from '@/shared/ui/Datefield.vue'
import RadioSwitch from '@/shared/ui/RadioSwitch.vue'
import SelectDropdown from '@/shared/ui/SelectDropdown.vue'
import Table from '@/shared/ui/Table.vue'
import Textfield from '@/shared/ui/Textfield.vue'
import { findById } from '@/shared/utils/array'
import { Pencil, Plus, Trash } from 'lucide-vue-next'
import { Field, FieldArray } from 'vee-validate'
import { computed, nextTick, ref, toRef, unref, watch, type Ref } from 'vue'
import { InspectionStatus } from '../enums'
import { useLotFilters } from '../hooks/useLotFilters'
import { useStoreInspectionForm } from '../hooks/useStoreInspectionForm'
import type { InspectionSchema } from '../schema/inspection.schema'
import type { StoreInspectionPayload } from '../types/inspection.types'
import StatusChip from './StatusChip.vue'

const props = withDefaults(
  defineProps<{
    mode?: 'create' | 'edit'
    initialValues?: Partial<InspectionSchema>
    disabledFields?: string[]
  }>(),
  { mode: 'create' }
)

const emit = defineEmits<{
  (e: 'submit', payload: StoreInspectionPayload): void
  (e: 'cancel'): void
}>()

const dropdowns = useDropdowns()
const { data: itemArr } = useItems()
const { data: lotArr } = useLots()

function getInitialValues(): InspectionSchema {
  const rawItems = props.initialValues?.items ?? []

  const initialItems = rawItems.map((it: any) => {
    return {
      inspectionId: it?.inspectionId ?? 0,
      itemId: it?.itemId ?? 0,
      qtyRequested: it?.qtyRequested ?? 1,
      lots: (it?.lots ?? []).map((l: any) => {
        return {
          inspectionItemId: l?.inspectionItemId ?? 0,
          lotId: l?.lotId ?? 0,
          qtyRequired: l?.qtyRequired ?? 1,
          allocationId: l?.lot?.allocationId ?? 0,
          ownerId: l?.lot?.ownerId ?? 0,
          conditionId: l?.lot?.conditionId ?? 0,
          availableQty: l?.availableQtySnapshot ?? 0
        }
      })
    }
  })

  if (initialItems.length === 0) {
    initialItems.push({
      inspectionId: 0,
      itemId: 0,
      qtyRequested: 1,
      lots: []
    })
  }

  return {
    status: props.initialValues?.status ?? InspectionStatus.NEW,
    serviceTypeId: (props.initialValues?.serviceTypeId as number) ?? 0,
    scopeOfWorkId: (props.initialValues?.scopeOfWorkId as number) ?? 0,
    locationId: (props.initialValues?.locationId as number) ?? 0,
    estimatedCompletionDate: props.initialValues?.estimatedCompletionDate ?? '',
    dcCode: props.initialValues?.dcCode ?? '',
    items: initialItems,
    note: props.initialValues?.note ?? '',
    isCustomerCharged: props.initialValues?.isCustomerCharged ?? false,
    customerId: props.initialValues?.customerId ?? 0
  }
}

const form = useStoreInspectionForm({
  initialValues: getInitialValues(),
  disabledFields: props.disabledFields ?? []
})

const { values, errors, onSubmit, updateOptions, setFieldValue, submitting, isFieldDisabled } = form

watch(
  () => [props.initialValues, props.disabledFields],
  (next) => {
    if (!next) return
    updateOptions({
      initialValues: getInitialValues(),
      disabledFields: props.disabledFields ?? []
    })
  },
  { deep: true }
)

function getScopeOfWorks(serviceTypeId: Ref<number | undefined>) {
  return computed(() => {
    const id = unref(serviceTypeId)
    if (id == null) return []
    return (dropdowns.scopeOfWorks.value ?? []).filter((s) => s?.serviceTypeId == id)
  })
}

function getScopeOfWork(scopeOfWorkid: Ref<number | undefined>) {
  return computed(() => {
    const id = unref(scopeOfWorkid)
    if (id == null) return null
    return findById(dropdowns.scopeOfWorks, id)
  })
}

// region: items and lots

const tableInitialExpanded = ref<number>(0)

async function onAddItem(push: any, newIndex: number) {
  push({
    inspectionId: 0,
    itemId: 0,
    qtyRequested: 1,
    lots: []
  })

  await nextTick()
  tableInitialExpanded.value = newIndex

  setTimeout(() => {
    tableInitialExpanded.value = 0
  }, 300)
}

async function onAddLot(push: any, index: number) {
  push({
    inspectionItemId: values.items?.[index]?.inspectionId ?? 0,
    lotId: 0,
    qtyRequired: 1
  })
}

const {
  getFilteredLotsForRow,
  getFilteredAllocationOptions,
  getFilteredOwnerOptions,
  getFilteredConditionOptions
} = useLotFilters({ values, lotArr, setFieldValue })

// endregion

async function submit() {
  const payload = await onSubmit()
  if (payload) {
    emit('submit', payload as any)
  }
}

async function onSend() {
  if (submitting?.value) return
  if (props.mode === 'edit') {
    setFieldValue('status', InspectionStatus.READY_FOR_REVIEW)
  } else {
    setFieldValue('status', InspectionStatus.NEW)
  }
  await submit()
}

async function onSave() {
  if (submitting?.value) return
  setFieldValue('status', InspectionStatus.DRAFT)
  await submit()
}
</script>

<template>
  <form @submit.prevent="() => {}" class="flex flex-col gap-4">
    <div class="flex flex-col gap-4">
      <div class="flex gap-4 flex-wrap">
        <!-- inspections -->
        <div class="flex flex-col gap-4 flex-1">
          <div class="flex flex-col gap-4">
            <div class="flex flex-wrap gap-4 items-start">
              <div class="w-60">
                <label class="block text-sm font-medium">*Service Type</label>
                <Field name="serviceTypeId" v-slot="{ field }">
                  <SelectDropdown
                    :modelValue="field.value"
                    @update:modelValue="field.onChange"
                    :options="
                      dropdowns.serviceTypes.value.map((s) => ({ label: s.name, value: s.id }))
                    "
                    class="w-full"
                    menuClass="w-60"
                    :disabled="isFieldDisabled(field.name)"
                  />
                </Field>
              </div>

              <div class="w-80">
                <label class="block text-sm font-medium">*Scope of Work</label>
                <Field name="scopeOfWorkId" v-slot="{ field }">
                  <SelectDropdown
                    :modelValue="field.value"
                    @update:modelValue="field.onChange"
                    :options="
                      getScopeOfWorks(toRef(values.serviceTypeId)).value.map((s) => ({
                        label: s.name,
                        value: s.id
                      }))
                    "
                    :disabled="!values.serviceTypeId"
                    class="w-full"
                    menuClass="w-80"
                    placeholder=""
                  />
                </Field>
              </div>

              <div>
                <label class="block text-sm font-medium invisible">-</label>
                <Button variant="icon" size="lg" disabled
                  ><Pencil class="w-4 h-4 text-primary"
                /></Button>
              </div>

              <div>
                <label class="block text-sm font-medium invisible">-</label>
                <div class="font-bold text-sm py-2.5">Or</div>
              </div>

              <div>
                <label class="block text-sm font-medium invisible">-</label>
                <Button variant="secondary" size="lg" disabled>
                  <template #left>
                    <Plus class="w-4 h-4 text-primary" />
                  </template>
                  Create new SOW
                </Button>
              </div>
            </div>

            <div>
              <div class="w-full">
                <label class="block text-sm font-medium">Scope included</label>
                <div class="p-2.5 border border-gray-200 rounded-md w-full min-h-12">
                  <div
                    v-if="values.scopeOfWorkId"
                    class="px-2 p-1 text-xs bg-gray-200 rounded w-fit"
                  >
                    {{ getScopeOfWork(toRef(values.scopeOfWorkId))?.value?.description || '-' }}
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-4 items-start mb-2">
              <div class="w-60">
                <label class="block text-sm font-medium">*Location</label>
                <Field name="locationId" v-slot="{ field }">
                  <SelectDropdown
                    :modelValue="field.value"
                    @update:modelValue="field.onChange"
                    :options="
                      dropdowns.locations.value.map((s) => ({ label: s.name, value: s.id }))
                    "
                    class="w-full"
                    menuClass="w-60"
                    placeholder="Select location"
                  />
                </Field>
              </div>

              <div class="w-60">
                <label class="block text-sm font-medium">*Estimated Completion Date</label>
                <Field name="estimatedCompletionDate" v-slot="{ field }">
                  <Datefield
                    :modelValue="field.value"
                    @update:modelValue="field.onChange"
                    placeholder="YYYY-MM-DD"
                    inputClass="w-full"
                  />
                </Field>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <div class="border-b border-b-gray-100 text-muted pb-1 text-sm">
              Custom Field Header
            </div>
            <div class="w-70">
              <label class="block text-sm font-medium">D/C Code</label>
              <Field name="dcCode" v-slot="{ field }">
                <Textfield
                  :modelValue="field.value"
                  @update:modelValue="field.onChange"
                  placeholder="Optional DC Code"
                  class="w-full"
                />
              </Field>
            </div>
          </div>
        </div>

        <!-- charges -->
        <div class="border-l border-dashed border-l-gray-200 pl-4 min-w-80 flex flex-col gap-4">
          <div class="flex items-center gap-2 mt-2">
            <div class="flex flex-col">
              <label for="charged" class="text-sm">Charge to Customer</label>
              <Field name="isCustomerCharged" v-slot="{ field }">
                <RadioSwitch v-model="field.value" @update:modelValue="field.onChange" size="sm" />
              </Field>
            </div>
            <div class="ml-auto">
              <label for="charged" class="text-sm">Status</label>
              <StatusChip :status="values.status" class="px-5" />
            </div>
          </div>

          <div class="flex flex-wrap gap-4">
            <div class="w-full">
              <label class="block text-sm font-medium">*Customer Name</label>
              <Field name="customerId" v-slot="{ field }">
                <SelectDropdown
                  :modelValue="field.value"
                  @update:modelValue="field.onChange"
                  :options="dropdowns.customers.value.map((s) => ({ label: s.name, value: s.id }))"
                  class="w-full"
                  placeholder="Select customer"
                />
              </Field>
            </div>
          </div>
        </div>
      </div>

      <!-- Items -->
      <div class="">
        <FieldArray name="items" v-slot="{ fields, push, remove }">
          <div class="flex justify-between">
            <div class="font-bold">Order Information</div>
            <div>
              <div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  class="font-bold"
                  @click="onAddItem(push, fields?.length ?? 0)"
                >
                  <Plus class="w-4 h-4 text-primary" /> Add Item
                </Button>
              </div>
            </div>
          </div>

          <Table
            :columns="[
              { label: '', key: 'action', class: 'align-middle' },
              { label: 'Item Description', key: 'itemId', class: 'w-full' },
              { label: 'Qty', key: 'qtyRequested' }
            ]"
            :data="fields"
            expandable
            expand-on-row-click
            single-expand
            :initialExpanded="tableInitialExpanded"
          >
            <!-- lots -->
            <template #expanded-row="{ index }">
              <FieldArray
                :name="`items[${index}].lots`"
                v-slot="{ fields: lotFields, push: pushLot, remove: removeLot }"
              >
                <div class="flex items-center gap-2 mb-2 justify-end">
                  <Button
                    type="button"
                    size="sm"
                    class="font-bold"
                    @click="onAddLot(pushLot, index)"
                  >
                    <Plus class="h-4 w-4" /> Add Lot
                  </Button>
                </div>

                <div
                  v-for="(lf, j) in lotFields || []"
                  :key="lf.key"
                  class="flex items-center gap-2 mb-2"
                >
                  <div class="w-10">
                    <label class="block text-sm font-medium invisible">Action</label>
                    <Button variant="icon" type="button" class="bg-red-500" @click="removeLot(j)">
                      <Trash class="h-4 w-4 text-white" />
                    </Button>
                  </div>

                  <div class="flex-1">
                    <label class="block text-sm font-medium">Allocation</label>
                    <Field :name="`items[${index}].lots[${j}].allocationId`" v-slot="{ field }">
                      <SelectDropdown
                        :modelValue="field.value"
                        @update:modelValue="field.onChange"
                        :options="getFilteredAllocationOptions(index, j)"
                        class="w-40"
                        placeholder=""
                      />
                    </Field>
                  </div>

                  <div class="flex-1">
                    <label class="block text-sm font-medium">Owner</label>
                    <Field :name="`items[${index}].lots[${j}].ownerId`" v-slot="{ field }">
                      <SelectDropdown
                        :modelValue="field.value"
                        @update:modelValue="field.onChange"
                        :options="getFilteredOwnerOptions(index, j)"
                        class="w-40"
                        placeholder=""
                      />
                    </Field>
                  </div>

                  <div class="flex-1">
                    <label class="block text-sm font-medium">Condition</label>
                    <Field :name="`items[${index}].lots[${j}].conditionId`" v-slot="{ field }">
                      <SelectDropdown
                        :modelValue="field.value"
                        @update:modelValue="field.onChange"
                        :options="getFilteredConditionOptions(index, j)"
                        class="w-40"
                        placeholder=""
                      />
                    </Field>
                  </div>

                  <div class="flex-1">
                    <label class="block text-sm font-medium">Lot</label>
                    <Field :name="`items[${index}].lots[${j}].lotId`" v-slot="{ field }">
                      <SelectDropdown
                        :modelValue="field.value"
                        @update:modelValue="field.onChange"
                        :options="getFilteredLotsForRow(index, j)"
                        class="w-full"
                        placeholder=""
                      />
                    </Field>
                  </div>

                  <div class="flex-1">
                    <label class="block text-sm font-medium">Available Qty</label>
                    <Field :name="`items[${index}].lots[${j}].availableQty`" v-slot="{ field }">
                      <div class="bg-muted rounded bg-gray-200 text-gray-600 py-2 px-2.5 w-full">
                        {{ field.value || '-' }}
                      </div>
                    </Field>
                  </div>

                  <div class="flex-1">
                    <label class="block text-sm font-medium">Qty Required</label>
                    <Field :name="`items[${index}].lots[${j}].qtyRequired`" v-slot="{ field }">
                      <Textfield
                        :modelValue="field.value"
                        @update:modelValue="field.onChange"
                        class="w-full rounded px-2 py-1.5"
                        type="number"
                        placeholder="Enter Qty"
                      />
                    </Field>
                  </div>
                </div>
              </FieldArray>
            </template>

            <template #cell-action="{ index }">
              <Button variant="icon" type="button" class="text-red-500" @click="remove(index)">
                <Trash class="h-4 w-4" />
              </Button>
            </template>

            <template #cell-itemId="{ index }">
              <Field :name="`items[${index}].itemId`" v-slot="{ field }">
                <SelectDropdown
                  :modelValue="field.value"
                  @update:modelValue="field.onChange"
                  :options="itemArr?.data?.map((s) => ({ label: s.name, value: s.id }))"
                  class="w-full"
                />
              </Field>
            </template>

            <template #cell-qtyRequested="{ index }">
              <Field :name="`items[${index}].qtyRequested`" v-slot="{ field }">
                <Textfield
                  :modelValue="field.value"
                  @update:modelValue="field.onChange"
                  class="w-full rounded px-2 py-1.5"
                  type="number"
                  placeholder="Enter Qty"
                />
              </Field>
            </template>

            <template #cell-status="{ row }">
              <div class="w-fit mx-auto">
                <StatusChip :status="row.status" size="sm" />
              </div>
            </template>
          </Table>
        </FieldArray>
      </div>
    </div>

    <div class="">
      <label class="block text-sm font-medium">Note</label>
      <Field name="note" v-slot="{ field }">
        <Textfield
          :modelValue="field.value"
          @update:modelValue="field.onChange"
          placeholder="Enter note"
          class="w-full"
        />
      </Field>
    </div>

    <!-- display errors -->
    <div v-if="Object.keys(errors || {}).length" class="text-sm text-red-500 mt-4">
      <div class="font-medium mb-1">Errors:</div>
      <ul class="list-disc list-inside">
        <li v-for="(msg, key) in errors" :key="key">{{ msg }}</li>
      </ul>
    </div>

    <!-- actions -->
    <div class="flex items-center gap-2 justify-end mt-4">
      <Button variant="secondary" size="lg" @click="$emit('cancel')" class="font-bold"
        >Cancel</Button
      >
      <Button
        v-if="mode === 'edit'"
        variant="secondary"
        size="lg"
        class="font-bold"
        @click="onSave"
        :disabled="submitting"
        >Save as Draft</Button
      >
      <Button
        variant="primary"
        size="lg"
        class="px-15 font-bold"
        @click="onSend"
        :disabled="submitting"
        >Submit</Button
      >
    </div>
  </form>
</template>
