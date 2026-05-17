<script setup lang="ts">
import Multiselect from '@vueform/multiselect'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: any
  options: any[] | Record<string, any>
  placeholder?: string
  error?: boolean
  disabled?: boolean
  searchable?: boolean
  mode?: 'single' | 'multiple' | 'tags'
}>(), {
  modelValue: null,
  placeholder: 'Pilih...',
  error: false,
  disabled: false,
  searchable: true,
  mode: 'single'
})

const emit = defineEmits<{ 'update:modelValue': [value: any] }>()

const selectValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<template>
  <div class="relative app-select-wrapper" :class="{ 'has-error': error }">
    <Multiselect
      v-model="selectValue"
      :options="options"
      :placeholder="placeholder"
      :disabled="disabled"
      :searchable="searchable"
      :mode="mode"
      class="app-multiselect"
    />
  </div>
</template>

<style>
.app-select-wrapper {
  --ms-font-size: 14px;
  --ms-line-height: 1.5;
  --ms-bg: #ffffff;
  --ms-border-color: #d7e5f6;
  --ms-border-width: 1px;
  --ms-radius: 12px;
  --ms-py: 12px;
  --ms-px: 16px;
  --ms-ring-width: 4px;
  --ms-ring-color: rgba(11,99,246,0.12);
  --ms-placeholder-color: #6680a7;
  --ms-max-height: 15rem;
  --ms-spinner-color: #0d6dff;
  --ms-caret-color: #6680a7;
  --ms-clear-color: #6680a7;
  --ms-clear-color-hover: #071b3a;
  --ms-tag-bg: #e7f1ff;
  --ms-tag-color: #0d6dff;
  --ms-tag-radius: 6px;
  --ms-tag-font-weight: 600;
  
  --ms-dropdown-bg: #ffffff;
  --ms-dropdown-border-color: #d7e5f6;
  --ms-dropdown-border-width: 1px;
  --ms-dropdown-radius: 12px;
  --ms-option-color-pointed: #071b3a;
  --ms-option-bg-pointed: #f3f8ff;
  --ms-option-color-selected: #ffffff;
  --ms-option-bg-selected: #0d6dff;
  --ms-option-color-selected-pointed: #ffffff;
  --ms-option-bg-selected-pointed: #0b63f6;
}
.app-multiselect {
  min-height: 48px;
  box-shadow: 0 10px 24px rgba(30,88,160,0.06);
  font-weight: 500;
  color: #071b3a;
}
.app-select-wrapper.has-error .app-multiselect {
  --ms-border-color: #fca5a5 !important;
}
.app-multiselect.is-active {
  border-color: #0b63f6;
}
</style>
