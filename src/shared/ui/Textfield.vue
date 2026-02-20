<script setup lang="ts">
import { cva } from 'class-variance-authority'
import { computed, useAttrs } from 'vue'
import { cn } from '../utils/cn'

const inputVariants = cva(
  'flex items-center rounded-sm gap-2 px-2 py-1 min-h-10 text-sm border border-gray-300 bg-white w-full focus-within:border focus-within:border-primary',
  {
    variants: {
      disabled: {
        true: 'opacity-60 cursor-not-allowed',
        false: 'cursor-text'
      }
    },
    defaultVariants: {
      disabled: false
    }
  }
)

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null
    disabled?: boolean
    loading?: boolean
    placeholder?: string
    label?: string
    type?: string
  }>(),
  {
    modelValue: '',
    disabled: false,
    loading: false,
    placeholder: '',
    label: '',
    type: 'text'
  }
)

const attrs = useAttrs()
const inputClasses = computed(() =>
  cn(
    inputVariants({
      disabled: props.disabled || props.loading
    }),
    attrs.class
  )
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
  (e: 'input', ev: Event): void
  (e: 'focus', ev: FocusEvent): void
  (e: 'blur', ev: FocusEvent): void
  (e: 'enter', ev: KeyboardEvent): void
}>()

function onInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value
  const value = props.type === 'number' ? (raw === '' ? null : Number(raw)) : raw
  emit('update:modelValue', value)
  emit('input', e)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') emit('enter', e)
}

function onFocus(e: FocusEvent) {
  emit('focus', e)
}

function onBlur(e: FocusEvent) {
  emit('blur', e)
}
</script>

<template>
  <div :class="inputClasses" v-bind="attrs" :aria-disabled="disabled || loading">
    <slot name="left" />

    <input
      :type="type"
      class="flex-1 bg-transparent outline-none px-1"
      :value="modelValue"
      :placeholder="placeholder || label"
      :disabled="disabled || loading"
      @input="onInput"
      @keydown="onKeydown"
      @focus="onFocus"
      @blur="onBlur"
    />

    <slot name="right" />
  </div>
</template>
