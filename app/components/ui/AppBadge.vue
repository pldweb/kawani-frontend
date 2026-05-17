<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}>(), {
  variant: 'default'
})

const variantClasses: Record<string, string> = {
  default: 'bg-[#eef2f5] text-[#4c6387]',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700'
}
</script>

<template>
  <span :class="['inline-flex items-center rounded-md px-2.5 py-0.5 text-[11px] font-semibold', variantClasses[variant]]">
    <slot />
  </span>
</template>
