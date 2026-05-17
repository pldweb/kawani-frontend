<script setup lang="ts">
import { VueDatePicker } from '@vuepic/vue-datepicker'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string | Date | null
  placeholder?: string
  error?: boolean
  disabled?: boolean
  format?: string
  enableTimePicker?: boolean
}>(), {
  modelValue: null,
  placeholder: 'Pilih tanggal',
  error: false,
  disabled: false,
  format: 'yyyy-MM-dd',
  enableTimePicker: false
})

const emit = defineEmits<{ 'update:modelValue': [value: string | Date | null] }>()

const dateValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<template>
  <div class="relative app-datepicker" :class="{ 'has-error': error }">
    <VueDatePicker
      v-model="dateValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :format="format"
      :enable-time-picker="enableTimePicker"
      auto-apply
      :hide-input-icon="false"
      position="left"
    />
  </div>
</template>

<style>
.app-datepicker {
  --dp-font-family: 'Inter', sans-serif;
  --dp-border-radius: 12px;
  --dp-input-padding: 12px 16px;
  --dp-border-color: #d7e5f6;
  --dp-border-color-hover: #b8cff0;
  --dp-border-color-focus: #0b63f6;
  --dp-text-color: #071b3a;
  --dp-primary-color: #0d6dff;
  --dp-font-size: 14px;
}
.app-datepicker .dp__input {
  box-shadow: 0 10px 24px rgba(30,88,160,0.06);
  font-weight: 500;
  height: 48px;
  padding-left: 36px;
}
.app-datepicker .dp__input:focus {
  box-shadow: 0 0 0 4px rgba(11,99,246,0.12);
}
.app-datepicker.has-error .dp__input {
  border-color: #fca5a5 !important;
}
</style>
