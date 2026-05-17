<script setup lang="ts">
import { X } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  show: boolean
  title?: string
  maxWidth?: string
}>(), {
  title: '',
  maxWidth: 'max-w-lg'
})

const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="emit('close')" />
        <div :class="['relative w-full rounded-2xl border border-[#d9e6f5] bg-white shadow-2xl', maxWidth]">
          <div v-if="title" class="flex items-center justify-between border-b border-[#eef2f5] px-6 py-4">
            <h3 class="text-lg font-bold text-[#071b3a]">{{ title }}</h3>
            <button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#6680a7] hover:bg-[#f3f8ff] hover:text-[#071b3a] transition" type="button" @click="emit('close')">
              <X class="h-5 w-5" />
            </button>
          </div>
          <div class="px-6 py-5">
            <slot />
          </div>
          <div v-if="$slots.footer" class="flex items-center justify-end gap-3 border-t border-[#eef2f5] px-6 py-4">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .relative, .modal-leave-to .relative { transform: scale(0.95); }
</style>
