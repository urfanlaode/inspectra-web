<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn'

export interface Tab {
  label?: string
  value?: string
  disabled?: boolean
}

const tabVariants = cva('py-3 px-2 -mb-px relative inline-flex items-center gap-2', {
  variants: {
    active: {
      true: 'border-b-5 border-teal-400 text-teal-600',
      false: 'text-gray-500'
    },
    disabled: {
      true: 'opacity-60 cursor-not-allowed pointer-events-none',
      false: 'cursor-pointer'
    }
  },
  defaultVariants: {
    active: false,
    disabled: false
  }
})

const props = withDefaults(
  defineProps<{
    tabs: Tab[]
    activeTab: string
  }>(),
  {
    activeTab: ''
  }
)

const emit = defineEmits<{
  (e: 'update:activeTab', value: string): void
  (e: 'select', value: string): void
}>()

const attrs = useAttrs()

const modelActive = computed<string>({
  get() {
    return props.activeTab ?? props.tabs?.[0]?.value ?? ''
  },
  set(value: string) {
    emit('update:activeTab', value)
  }
})

function onSelect(tab: Tab) {
  if (tab.disabled) return
  const val = tab.value ?? tab.label ?? ''
  modelActive.value = val
  emit('select', val)
}

function getTabClasses(tab: Tab) {
  const isActive = modelActive.value === (tab.value ?? tab.label ?? '')
  return cn(
    tabVariants({
      active: isActive,
      disabled: !!tab.disabled
    }),
    attrs.class
  )
}
</script>

<template>
  <div role="tablist" class="flex">
    <button
      v-for="tab in tabs"
      :key="tab.value ?? tab.label"
      type="button"
      role="tab"
      :class="getTabClasses(tab)"
      :aria-selected="modelActive === (tab.value ?? tab.label ?? '')"
      :aria-disabled="tab.disabled"
      @click="onSelect(tab)"
    >
      <slot name="tab" :tab="tab" :isActive="modelActive === (tab.value ?? tab.label ?? '')">
        {{ tab.label ?? tab.value }}
      </slot>
    </button>
  </div>
</template>
