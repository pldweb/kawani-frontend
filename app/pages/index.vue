<script setup lang="ts">
import { definePageMeta, navigateTo } from '#imports'

definePageMeta({
  middleware: 'guest'
})

await navigateTo('/login', { replace: true })
</script>

<template>
  <section class="flex min-h-screen items-center justify-center bg-[#f3f8ff] px-6">
    <div class="rounded-xl border border-[#d9e6f5] bg-white px-8 py-6 text-center shadow-[0_18px_42px_rgba(30,88,160,0.12)]">
      <p class="text-sm font-semibold text-[#0061ee]">Kawani HRIS</p>
      <p class="mt-2 text-sm text-[#6680a7]">Mengalihkan ke halaman login...</p>
    </div>
  </section>
</template>
