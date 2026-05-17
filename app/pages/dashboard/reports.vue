<script setup lang="ts">
import { FileBarChart, Users, CalendarClock, WalletCards, TrendingUp } from 'lucide-vue-next'
import { definePageMeta, ref, onMounted } from '#imports'
import { useCrud } from '~/composables/useCrud'
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const empCrud = useCrud<any>({ resource: 'employees', perPage: 1 })
const attCrud = useCrud<any>({ resource: 'attendances', perPage: 1 })
const leaveCrud = useCrud<any>({ resource: 'leave-requests', perPage: 1 })
const payPeriodCrud = useCrud<any>({ resource: 'payroll-periods', perPage: 1 })
const deptCrud = useCrud<any>({ resource: 'departments', perPage: 100 })

onMounted(async () => {
  await Promise.all([empCrud.fetchItems(), attCrud.fetchItems(), leaveCrud.fetchItems(), payPeriodCrud.fetchItems(), deptCrud.fetchItems()])
})
</script>
<template>
  <div class="space-y-6 mt-6">
    <div><h1 class="text-2xl font-bold text-[#071b3a]">Laporan</h1><p class="mt-1 text-sm text-[#6680a7]">Ringkasan dan statistik data HRIS.</p></div>

    <!-- Summary Cards -->
    <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <div class="rounded-xl border border-[#d9e6f5] bg-white p-5 shadow-card">
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0d6dff] to-[#0045bd] text-white shadow-icon-blue"><Users class="h-6 w-6" /></div>
          <div><p class="text-[13px] text-[#6680a7]">Total Karyawan</p><p class="text-2xl font-bold text-[#071b3a]">{{ empCrud.pagination.value.total }}</p></div>
        </div>
      </div>
      <div class="rounded-xl border border-[#d9e6f5] bg-white p-5 shadow-card">
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669] text-white"><CalendarClock class="h-6 w-6" /></div>
          <div><p class="text-[13px] text-[#6680a7]">Total Presensi</p><p class="text-2xl font-bold text-[#071b3a]">{{ attCrud.pagination.value.total }}</p></div>
        </div>
      </div>
      <div class="rounded-xl border border-[#d9e6f5] bg-white p-5 shadow-card">
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#f97316] to-[#ea580c] text-white"><FileBarChart class="h-6 w-6" /></div>
          <div><p class="text-[13px] text-[#6680a7]">Pengajuan Cuti</p><p class="text-2xl font-bold text-[#071b3a]">{{ leaveCrud.pagination.value.total }}</p></div>
        </div>
      </div>
      <div class="rounded-xl border border-[#d9e6f5] bg-white p-5 shadow-card">
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] text-white"><WalletCards class="h-6 w-6" /></div>
          <div><p class="text-[13px] text-[#6680a7]">Periode Payroll</p><p class="text-2xl font-bold text-[#071b3a]">{{ payPeriodCrud.pagination.value.total }}</p></div>
        </div>
      </div>
    </div>

    <!-- Department Summary -->
    <div class="rounded-xl border border-[#d9e6f5] bg-white p-6 shadow-card">
      <h2 class="text-base font-bold text-[#071b3a] mb-4">Data per Departemen</h2>
      <div v-if="deptCrud.loading.value" class="flex items-center justify-center py-10"><div class="h-8 w-8 animate-spin rounded-full border-[3px] border-[#0d6dff] border-t-transparent" /></div>
      <div v-else-if="deptCrud.items.value.length === 0" class="text-center py-10 text-sm text-[#6680a7]">Belum ada data departemen.</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-[13px]">
          <thead class="bg-[#fafcff] text-[12px] font-semibold text-[#6680a7] uppercase tracking-wider"><tr><th class="px-6 py-3">Kode</th><th class="px-6 py-3">Nama Departemen</th><th class="px-6 py-3">Status</th></tr></thead>
          <tbody>
            <tr v-for="d in deptCrud.items.value" :key="(d as any).id" class="border-t border-[#eef2f5]">
              <td class="px-6 py-3 font-mono text-[#0d6dff] font-semibold">{{ (d as any).code }}</td>
              <td class="px-6 py-3 font-semibold text-[#071b3a]">{{ (d as any).name }}</td>
              <td class="px-6 py-3"><UiAppBadge :variant="(d as any).is_active ? 'success' : 'danger'">{{ (d as any).is_active ? 'Aktif' : 'Nonaktif' }}</UiAppBadge></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
