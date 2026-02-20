<script setup lang="ts">
import { Switch } from '@headlessui/vue'
import { computed, useAttrs, toRef } from 'vue'
import { cn } from '../utils/cn'
import { cva } from 'class-variance-authority'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean | null
    label?: string
    size?: 'sm' | 'md'
    full?: boolean
    disabled?: boolean
  }>(),
  {
    modelValue: null,
    label: '',
    size: 'md',
    full: false,
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const attrs = useAttrs()

const disabled = toRef(props, 'disabled')

const isOn = computed<boolean>({
  get: () => props.modelValue ?? false,
  set: (v: boolean) => emit('update:modelValue', v)
})

const switchBase = cva(
  'relative inline-flex items-center shrink-0 cursor-pointer rounded-full border-2 border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50',
  {
    variants: {
      size: {
        md: 'h-8 w-14'
      },
      disabled: {
        true: 'opacity-60 cursor-not-allowed',
        false: ''
      }
    },
    defaultVariants: {
      size: 'md',
      disabled: false
    }
  }
)

const switchClasses = computed(() =>
  cn(
    switchBase({ disabled: props.disabled }),
    isOn.value ? 'bg-primary' : 'bg-gray-400',
    attrs.class
  )
)

const knobBase = cva(
  'pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
  {
    variants: {
      size: {
        md: 'h-[26px] w-[26px]'
      },
      on: {
        true: '',
        false: ''
      }
    },
    compoundVariants: [
      { size: 'md', on: true, className: 'translate-x-[24px]' },
      { size: 'md', on: false, className: 'translate-x-[2px]' }
    ],
    defaultVariants: {
      size: 'md',
      on: false
    }
  }
)

const knobClasses = computed(() =>
  cn(
    knobBase({
      on: isOn.value
    })
  )
)

const containerClasses = computed(() => cn(props.full ? 'w-full' : 'inline-block', 'select-none'))
</script>

<template>
  <div :class="containerClasses">
    <Switch v-model="isOn" :disabled="disabled" :class="switchClasses">
      <span class="sr-only">Toggle {{ label || 'setting' }}</span>

      <span aria-hidden="true" :class="knobClasses" />

      <span
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 flex items-center justify-between px-2 text-[11px] font-medium select-none"
      >
        <span :class="isOn ? 'text-white opacity-100' : 'text-white opacity-60'">On</span>
        <span :class="isOn ? 'text-white opacity-60' : 'text-white opacity-100'">Off</span>
      </span>
    </Switch>
  </div>
</template>
