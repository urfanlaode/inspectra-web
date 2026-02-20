<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn'
import { LoaderCircle, ChevronDown } from 'lucide-vue-next'

type Size = 'sm' | 'md' | 'lg'

const tableVariants = cva('w-full border-collapse', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    }
  },
  defaultVariants: {
    size: 'md'
  }
})

type Column<T = Record<string, any>> = {
  key: string
  label?: string
  class?: string
  render?: (row: T) => string | number | null | undefined
}

const props = withDefaults(
  defineProps<{
    columns: Column[]
    data?: any[]
    size?: Size
    loading?: boolean
    emptyText?: string

    expandable?: boolean
    singleExpand?: boolean
    initialExpanded?: number | null
  }>(),
  {
    data: () => [],
    size: 'md',
    loading: false,
    emptyText: 'No records',

    expandable: false,
    singleExpand: false,
    initialExpanded: null
  }
)

const tableClasses = computed(() =>
  cn(
    tableVariants({
      size: props.size
    })
  )
)

const emit = defineEmits<{
  (e: 'row-click', row: any, index: number): void
  (e: 'toggle-expand', row: any, index: number, expanded: boolean): void
}>()

const expandedRows = ref<Set<number>>(new Set())

function isRowExpanded(index: number) {
  return expandedRows.value.has(index)
}

function toggleExpand(row: any, index: number) {
  if (!props.expandable) return

  const set = expandedRows.value
  const already = set.has(index)

  if (props.singleExpand) {
    set.clear()
  }

  if (already) {
    set.delete(index)
  } else {
    set.add(index)
  }

  expandedRows.value = new Set(set)
  emit('toggle-expand', row, index, !already)
}

function onRowClick(row: any, index: number) {
  emit('row-click', row, index)
}

onMounted(async () => {
  await nextTick()
  if (
    props.expandable &&
    props.initialExpanded != null &&
    props.data &&
    props.data.length > props.initialExpanded
  ) {
    expandedRows.value = new Set([props.initialExpanded])
  }
})

watch(
  () => props.initialExpanded,
  (idx) => {
    if (!props.expandable) return
    if (idx == null) return
    if (!props.data) return
    if (props.data.length > idx) {
      expandedRows.value = new Set([idx])
      emit('toggle-expand', props.data[idx], idx, true)
    }
  },
  { immediate: false }
)
</script>

<template>
  <div class="w-full overflow-auto relative">
    <div v-if="loading" class="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
      <LoaderCircle class="w-6 h-6 animate-spin" />
    </div>

    <table :class="tableClasses" role="table">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :class="
              cn(
                'px-3 py-2 text-left font-bold text-xs whitespace-nowrap bg-gray-400 text-white',
                col.class
              )
            "
          >
            <slot :name="'header-' + col.key">
              {{ col.label ?? col.key }}
            </slot>
          </th>

          <th
            v-if="props.expandable"
            class="px-3 py-2 text-left font-bold text-xs whitespace-nowrap bg-gray-400 text-white"
          >
            <slot name="header-expand"> </slot>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="!data || data.length === 0">
          <td
            :colspan="columns.length + (props.expandable ? 1 : 0)"
            class="px-3 py-4 text-center text-sm text-gray-500"
          >
            {{ emptyText }}
          </td>
        </tr>

        <template v-else>
          <template v-for="(row, rIdx) in data" :key="rIdx">
            <tr
              @click="onRowClick(row, rIdx)"
              class="cursor-pointer border-b border-b-gray-200 hover:bg-gray-50 text-sm"
            >
              <td
                v-for="col in columns"
                :key="col.key"
                :class="cn('px-3 py-2 align-top', col.class)"
              >
                <slot :name="'cell-' + col.key" :row="row" :index="rIdx">
                  <template v-if="col.render">
                    {{ col.render(row) }}
                  </template>
                  <template v-else>
                    {{ row[col.key] }}
                  </template>
                </slot>
              </td>

              <!-- expand control -->
              <td v-if="props.expandable" class="px-3 py-2 text-center align-center">
                <button
                  type="button"
                  @click.stop="toggleExpand(row, rIdx)"
                  :aria-expanded="isRowExpanded(rIdx)"
                  class="p-1 cursor-pointer rounded hover:bg-gray-100 text-gray-600"
                >
                  <ChevronDown class="w-4 h-4 transition-transform text-primary" />
                </button>
              </td>
            </tr>

            <!-- expanded panel -->
            <tr v-if="isRowExpanded(rIdx)" class="bg-white">
              <td :colspan="columns.length + (props.expandable ? 1 : 0)" class="px-3 py-3">
                <slot name="expanded-row" :row="row" :index="rIdx">
                  <div class="text-sm text-gray-600">-</div>
                </slot>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>
