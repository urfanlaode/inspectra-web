<script setup lang="ts">
import { router } from '@/app/router'
import StatusChip from '@/features/inspections/components/StatusChip.vue'
import Header from '@/shared/layout/Header.vue'
import Button from '@/shared/ui/Button.vue'
import Table from '@/shared/ui/Table.vue'
import { humanDatestring } from '@/shared/utils/datestring'
import { ArrowLeft, Pencil, Plus } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useInspection } from '../hooks/useInspection'

const route = useRoute()
const id = computed(() => route.params.id as string)

const { data, isLoading, isEditable, isReadyForReview } = useInspection(+id.value)

const inspection = computed(() => data.value?.data)

function onEdit() {
  router.push({ name: 'InspectionEdit', params: { id: id.value } })
}
</script>

<template>
  <Header
    :title="`Inspection Details - ${inspection?.inspectionNo}`"
    :crumbs="[
      { label: 'Inspection', to: '#' },
      { label: 'Inspection Record', to: '/inspections' },
      { label: 'Details' }
    ]"
  />

  <div v-if="isLoading" class="h-full flex-1">
    <div class="bg-white p-4 h-full flex-1">
      <div class="animate-pulse">Loading...</div>
    </div>
  </div>

  <div v-else class="bg-white p-4">
    <!-- detail header -->
    <div class="flex gap-2 justify-between mb-4">
      <Button variant="ghost" @click="$router.back()">
        <template #left><ArrowLeft class="h-4 w-4" /></template> Back
      </Button>
      <Button v-if="isEditable" variant="ghost" @click="onEdit">
        <template #left><Pencil class="h-4 w-4" /></template>
        Modify
      </Button>
    </div>

    <!-- detail -->
    <div class="border border-gray-100 p-4 rounded">
      <div class="flex justify-between w-full">
        <!-- detail -->
        <div class="flex gap-8 w-full">
          <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-500">Request No</label>
            <div class="font-bold">{{ inspection?.inspectionNo }}</div>
          </div>
          <div class="flex flex-col flex-1">
            <div class="flex gap-24">
              <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                  <label class="text-sm text-gray-500">Service Type</label>
                  <div class="font-bold">{{ inspection?.serviceType.name }}</div>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-sm text-gray-500">Date Submitted</label>
                  <div class="font-bold">{{ humanDatestring(inspection?.createdAt) }}</div>
                </div>
              </div>
              <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                  <label class="text-sm text-gray-500">Location</label>
                  <div class="font-bold">{{ inspection?.location.name }}</div>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-sm text-gray-500">Esimated Completion Date</label>
                  <div class="font-bold">
                    {{ humanDatestring(inspection?.estimatedCompletionDate) }}
                  </div>
                </div>
              </div>
            </div>
            <!-- custom -->
            <div class="mt-4 mb-1 pt-1 border-b border-b-gray-200">Custom Field Header</div>
            <div class="flex flex-col gap-1">
              <label class="text-sm text-gray-500">D/C Code</label>
              <div class="font-bold">{{ inspection?.dcCode }}</div>
            </div>
          </div>
        </div>

        <!-- charge -->
        <div
          class="border-l border-dashed border-l-gray-200 pl-4 ml-4 min-w-80 flex flex-col gap-4"
        >
          <div class="inline-flex gap-4 justify-between">
            <div class="flex flex-col gap-1">
              <label class="text-sm text-gray-500">Charge to Customer</label>
              <div class="font-bold">{{ inspection?.customer.name }}</div>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm text-gray-500">Status</label>
              <StatusChip :status="inspection?.status" size="md" />
            </div>
          </div>
          <div class="flex flex-col gap-1 mt-8">
            <Button v-if="isReadyForReview" class="w-fit self-end px-8" size="lg" disabled
              >Approve</Button
            >
          </div>
        </div>
      </div>
    </div>

    <!-- scope of work -->
    <div class="font-bold pl-4 mt-4">Scope of work</div>
    <div class="border border-gray-100 p-4 rounded">
      <Table
        :columns="[
          {
            key: 'type',
            label: 'Service Type'
          },
          {
            key: 'name',
            label: 'Service Name'
          },
          {
            key: 'description',
            label: 'Service Description'
          }
        ]"
        :data="[inspection]"
      >
        <template #cell-type="{ row }">
          {{ row?.serviceType.name }}
        </template>
        <template #cell-name="{ row }">
          <Button variant="secondary">
            {{ row?.scopeOfWork.name }}
          </Button>
        </template>
        <template #cell-description="{ row }">
          {{ row?.scopeOfWork.description }}
        </template>
      </Table>
    </div>

    <!-- item information -->
    <div class="font-bold pl-4 mt-4">Item information</div>
    <div class="border border-gray-100 p-4 rounded">
      <Table
        :columns="[
          {
            key: 'itemNo',
            label: 'Item No.'
          },
          {
            key: 'itemDescription',
            label: 'Item Description'
          },
          {
            key: 'lotNo',
            label: 'Lot No.'
          },
          {
            key: 'allocationName',
            label: 'Allocation'
          },
          {
            key: 'ownerName',
            label: 'Owner'
          },
          {
            key: 'conditionName',
            label: 'Condition'
          },
          {
            key: 'qtyRequested',
            label: 'Requested'
          },
          {
            key: 'qtyPending',
            label: 'Pending'
          },
          {
            key: 'qtyApproved',
            label: 'Approved'
          }
        ]"
        :data="inspection?.lots ?? []"
      >
        <template #cell-lotNo="{ row }">
          {{ row.lot.lotNumber }}
        </template>
        <template #cell-itemNo="{ row }">
          {{ row.lot.item.id }}
        </template>
        <template #cell-itemDescription="{ row }">
          {{ row?.lot.item.name }}
        </template>
        <template #cell-allocationName="{ row }">
          {{ row?.lot.allocation.name }}
        </template>
        <template #cell-ownerName="{ row }">
          {{ row?.lot.owner.name }}
        </template>
        <template #cell-conditionName="{ row }">
          {{ row?.lot.condition.name }}
        </template>
        <template #cell-qtyRequested="{ row }">
          {{ row.qtyRequired }}
        </template>
      </Table>
    </div>

    <!-- charges -->
    <div class="inline-flex w-full gap-4 justify-between my-2">
      <div class="font-bold pl-4">Charges to customer</div>
      <div class="font-bold pl-4">
        <Button disabled>
          <template #left><Plus class="h-4 w-4" /></template>
          Add Charges
        </Button>
      </div>
    </div>
    <div class="border border-gray-100 p-4 rounded">
      <Table
        :columns="[
          {
            key: 'orderNo',
            label: 'Order No'
          },
          {
            key: 'name',
            label: 'Service Description'
          },
          {
            key: 'qty',
            label: 'Service Qty'
          },
          {
            key: 'unitPrice',
            label: 'Unit Price'
          },
          {
            key: 'Total',
            label: 'Unit Price'
          }
        ]"
        :data="[]"
      >
      </Table>
    </div>
  </div>
</template>
