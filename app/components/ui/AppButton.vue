<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-teal-800',
        secondary: 'border border-border bg-white text-foreground hover:bg-muted',
        ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground'
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        icon: 'h-10 w-10 px-0'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)

type ButtonVariants = VariantProps<typeof buttonVariants>

const props = withDefaults(defineProps<{
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false
})
</script>

<template>
  <button :type="props.type" :disabled="props.disabled" :class="buttonVariants({ variant, size })">
    <slot />
  </button>
</template>
