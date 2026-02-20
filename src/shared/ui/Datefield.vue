<!-- TODO(improvement): have a better date input -->

<script setup lang="ts">
import { cva } from 'class-variance-authority'
import { format as formatFn, isValid, parseISO } from 'date-fns'
import { computed, ref, useAttrs, watch } from 'vue'
import { cn } from '../utils/cn'

const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    placeholder?: string
    disabled?: boolean
    inputClass?: string
    ariaLabel?: string
  }>(),
  {
    modelValue: '',
    placeholder: 'YYYY-MM-DD',
    disabled: false,
    inputClass: '',
    ariaLabel: 'Date (YYYY-MM-DD)'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | null): void
  (e: 'input', v: string): void
}>()

const attrs = useAttrs()

const inputVariants = cva(
  'flex items-center rounded-sm gap-2 px-2 py-1 min-h-10 text-sm border border-gray-300 bg-white w-full focus-within:border focus-within:border-primary',
  {
    variants: {
      disabled: {
        true: 'opacity-60 cursor-not-allowed bg-gray-50',
        false: 'cursor-text'
      }
    },
    defaultVariants: {
      disabled: false
    }
  }
)

const inputClasses = computed(() =>
  cn(inputVariants({ disabled: !!props.disabled }), props.inputClass, attrs.class)
)

const display = ref('')

function normalizeFromModel(v?: string | null) {
  if (!v) {
    display.value = ''
    return
  }
  try {
    const parsed = parseISO(v)
    if (isValid(parsed)) {
      display.value = formatFn(parsed, 'yyyy-MM-dd')
    } else {
      const digits = (v ?? '').replace(/\D/g, '').slice(0, 8)
      display.value = formatDigitsToPattern(digits)
    }
  } catch {
    const digits = (v ?? '').replace(/\D/g, '').slice(0, 8)
    display.value = formatDigitsToPattern(digits)
  }
}

normalizeFromModel(props.modelValue)

watch(
  () => props.modelValue,
  (v) => {
    normalizeFromModel(v)
  }
)

function formatDigitsToPattern(digits: string) {
  const y = digits.slice(0, 4)
  const m = digits.slice(4, 6)
  const d = digits.slice(6, 8)
  let out = ''
  if (y.length) {
    out += y
  }
  if (m.length) {
    out += '-' + m
  }
  if (d.length) {
    out += '-' + d
  }
  return out
}

function validateAndEmit(digits: string) {
  if (digits.length < 8) {
    emit('update:modelValue', '')
    return
  }
  const y = digits.slice(0, 4)
  const m = digits.slice(4, 6)
  const d = digits.slice(6, 8)
  const iso = `${y}-${m}-${d}`
  try {
    const parsed = parseISO(iso)
    if (
      isValid(parsed) &&
      parsed.getFullYear() === Number(y) &&
      parsed.getMonth() + 1 === Number(m) &&
      parsed.getDate() === Number(d)
    ) {
      emit('update:modelValue', iso)
      return
    }
  } catch {}
  emit('update:modelValue', '')
}

function onInput(e: Event) {
  const t = e.target as HTMLInputElement
  const raw = (t.value ?? '').replace(/\D/g, '').slice(0, 8)
  display.value = formatDigitsToPattern(raw)
  emit('input', display.value)
  validateAndEmit(raw)
}

function onPaste(e: ClipboardEvent) {
  const text = e.clipboardData?.getData('text') ?? ''
  const digits = text.replace(/\D/g, '').slice(0, 8)
  if (!digits) return
  e.preventDefault()
  display.value = formatDigitsToPattern(digits)
  emit('input', display.value)
  validateAndEmit(digits)
}

function onKeydown(e: KeyboardEvent) {
  if (props.disabled) return
  if (e.ctrlKey || e.metaKey || e.altKey) return

  const allowedKeys = [
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'Home',
    'End',
    'Tab',
    'Enter',
    'Escape'
  ]
  if (allowedKeys.includes(e.key)) return

  const t = e.target as HTMLInputElement | null
  if (!t) {
    return
  }

  if (e.key.length === 1 && /\d/.test(e.key)) {
    const value = t.value ?? ''
    const selStart = t.selectionStart ?? 0
    const selEnd = t.selectionEnd ?? 0

    const totalDigits = value.replace(/\D/g, '').length
    const selectedText = value.slice(selStart, selEnd)
    const selectedDigits = selectedText.replace(/\D/g, '').length

    if (totalDigits - selectedDigits + 1 > 8) {
      e.preventDefault()
    }
    return
  }

  if (e.key.length === 1) {
    e.preventDefault()
  }
}
</script>

<template>
  <div :class="inputClasses" v-bind="attrs" :aria-disabled="props.disabled">
    <slot name="left" />

    <input
      class="flex-1 bg-transparent outline-none px-1"
      :placeholder="props.placeholder"
      :value="display"
      @input="onInput"
      @paste="onPaste"
      @keydown="onKeydown"
      :disabled="props.disabled"
      :aria-label="props.ariaLabel"
      inputmode="numeric"
      autocomplete="off"
      maxlength="10"
    />

    <slot name="right" />
  </div>
</template>
