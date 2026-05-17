<script setup lang="ts">
import { computed, useSlots } from 'vue'

defineOptions({
  inheritAttrs: false
})

const props = withDefaults(defineProps<{
  id?: string
  modelValue?: string
  type?: string
  placeholder?: string
  autocomplete?: string
  error?: boolean
  disabled?: boolean
}>(), {
  type: 'text',
  modelValue: '',
  placeholder: '',
  autocomplete: undefined,
  error: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const slots = useSlots()

const inputClass = computed(() => [
  'h-12 w-full rounded-xl border bg-white/95 text-sm font-medium text-[#071b3a] shadow-[0_10px_24px_rgba(30,88,160,0.06)] outline-none transition duration-200 placeholder:text-[#9aacc5]',
  'hover:border-[#b8cff0] hover:bg-white',
  'focus:border-[#0b63f6] focus:bg-white focus:shadow-[0_0_0_4px_rgba(11,99,246,0.12),0_14px_30px_rgba(30,88,160,0.10)]',
  'disabled:cursor-not-allowed disabled:bg-[#eef4fb] disabled:text-[#8497b0]',
  slots.leftIcon ? 'pl-12 pr-4' : 'px-4',
  slots.rightIcon ? 'pr-12' : '',
  props.error ? 'border-red-300 bg-red-50/60 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.12)]' : 'border-[#d7e5f6]'
])
</script>

<template>
  <div class="group relative">
    <span
      v-if="$slots.leftIcon"
      class="pointer-events-none absolute left-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-[#6b83a5] transition group-focus-within:text-[#0b63f6]"
    >
      <slot name="leftIcon" />
    </span>

    <input
      v-bind="$attrs"
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :aria-invalid="error || undefined"
      :class="inputClass"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >

    <span
      v-if="$slots.rightIcon"
      class="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-[#6b83a5]"
    >
      <slot name="rightIcon" />
    </span>
  </div>
</template>
