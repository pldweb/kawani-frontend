<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  currentPage: number
  lastPage: number
  total: number
}>()

const emit = defineEmits<{ 'update:currentPage': [page: number] }>()

function pages() {
  const p: (number | '...')[] = []
  const c = props.currentPage
  const l = props.lastPage
  if (l <= 7) {
    for (let i = 1; i <= l; i++) p.push(i)
  } else {
    p.push(1)
    if (c > 3) p.push('...')
    for (let i = Math.max(2, c - 1); i <= Math.min(l - 1, c + 1); i++) p.push(i)
    if (c < l - 2) p.push('...')
    p.push(l)
  }
  return p
}
</script>

<template>
  <div v-if="lastPage > 1" class="flex items-center justify-between gap-4 pt-4 text-sm">
    <span class="text-[13px] text-[#6680a7]">{{ total }} data</span>
    <div class="flex items-center gap-1">
      <button :disabled="currentPage <= 1" class="flex h-8 w-8 items-center justify-center rounded-lg border border-[#d9e6f5] bg-white text-[#4c6387] transition hover:bg-[#f3f8ff] disabled:opacity-40" @click="emit('update:currentPage', currentPage - 1)">
        <ChevronLeft class="h-4 w-4" />
      </button>
      <template v-for="p in pages()" :key="p">
        <span v-if="p === '...'" class="px-1 text-[#6680a7]">…</span>
        <button v-else :class="['flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-medium transition', p === currentPage ? 'bg-[#0d6dff] text-white shadow-sm' : 'border border-[#d9e6f5] bg-white text-[#4c6387] hover:bg-[#f3f8ff]']" @click="emit('update:currentPage', p)">
          {{ p }}
        </button>
      </template>
      <button :disabled="currentPage >= lastPage" class="flex h-8 w-8 items-center justify-center rounded-lg border border-[#d9e6f5] bg-white text-[#4c6387] transition hover:bg-[#f3f8ff] disabled:opacity-40" @click="emit('update:currentPage', currentPage + 1)">
        <ChevronRight class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>
