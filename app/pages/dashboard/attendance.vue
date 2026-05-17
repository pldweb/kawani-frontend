<script setup lang="ts">
import { Plus, Pencil, Trash2, CalendarClock } from 'lucide-vue-next'
import { definePageMeta, ref, onMounted } from '#imports'
import { useCrud } from '~/composables/useCrud'
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
interface Att { id: number; employee_id: number; attendance_date: string; clock_in_at: string | null; clock_out_at: string | null; status: string; notes: string | null }
const { items, loading, saving, pagination, fetchItems, createItem, updateItem, deleteItem } = useCrud<Att>({ resource: 'attendances' })
const showModal = ref(false); const editId = ref<number|null>(null)
const form = ref({ employee_id: '', attendance_date: '', clock_in_at: '', clock_out_at: '', status: 'present', notes: '' })
function resetForm() { form.value = { employee_id: '', attendance_date: '', clock_in_at: '', clock_out_at: '', status: 'present', notes: '' }; editId.value = null }
function openCreate() { resetForm(); showModal.value = true }
function openEdit(i: Att) { editId.value = i.id; form.value = { employee_id: String(i.employee_id), attendance_date: i.attendance_date?.split('T')[0] || '', clock_in_at: i.clock_in_at || '', clock_out_at: i.clock_out_at || '', status: i.status, notes: i.notes || '' }; showModal.value = true }
async function save() { const data = { ...form.value, employee_id: Number(form.value.employee_id) }; if (editId.value) await updateItem(editId.value, data); else await createItem(data); showModal.value = false; await fetchItems(pagination.value.current_page) }
function statusV(s: string) { return { present: 'success', late: 'warning', absent: 'danger', leave: 'info', sick: 'warning', holiday: 'info' }[s] || 'default' }
function statusL(s: string) { return { present: 'Hadir', late: 'Terlambat', absent: 'Absen', leave: 'Cuti', sick: 'Sakit', holiday: 'Libur' }[s] || s }
onMounted(() => fetchItems())
</script>
<template>
  <div class="space-y-6 mt-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><h1 class="text-2xl font-bold text-[#071b3a]">Presensi</h1><p class="mt-1 text-sm text-[#6680a7]">Kelola data kehadiran karyawan.</p></div>
      <button class="flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-[#0d6dff] to-[#0045bd] px-5 text-sm font-semibold text-white shadow-btn-blue hover:opacity-90 transition" @click="openCreate"><Plus class="h-4 w-4" /> Input Presensi</button>
    </div>
    <div class="rounded-xl border border-[#d9e6f5] bg-white shadow-card overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center py-20"><div class="h-8 w-8 animate-spin rounded-full border-[3px] border-[#0d6dff] border-t-transparent" /></div>
      <div v-else-if="items.length === 0" class="flex flex-col items-center justify-center py-20 text-[#6680a7]"><CalendarClock class="h-12 w-12 mb-3 opacity-40" /><p class="text-sm font-medium">Belum ada data presensi.</p></div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-[13px]">
          <thead class="bg-[#fafcff] text-[12px] font-semibold text-[#6680a7] uppercase tracking-wider"><tr><th class="px-6 py-3">ID Karyawan</th><th class="px-6 py-3">Tanggal</th><th class="px-6 py-3">Clock In</th><th class="px-6 py-3">Clock Out</th><th class="px-6 py-3">Status</th><th class="px-6 py-3">Catatan</th><th class="px-6 py-3 text-right">Aksi</th></tr></thead>
          <tbody>
            <tr v-for="a in items" :key="a.id" class="border-t border-[#eef2f5] hover:bg-[#f8fbff] transition-colors">
              <td class="px-6 py-3 font-mono text-[#0d6dff]">{{ a.employee_id }}</td>
              <td class="px-6 py-3 text-[#071b3a]">{{ a.attendance_date?.split('T')[0] }}</td>
              <td class="px-6 py-3 text-[#4c6387]">{{ a.clock_in_at ? new Date(a.clock_in_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-' }}</td>
              <td class="px-6 py-3 text-[#4c6387]">{{ a.clock_out_at ? new Date(a.clock_out_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-' }}</td>
              <td class="px-6 py-3"><UiAppBadge :variant="statusV(a.status) as any">{{ statusL(a.status) }}</UiAppBadge></td>
              <td class="px-6 py-3 text-[#4c6387] max-w-[200px] truncate">{{ a.notes || '-' }}</td>
              <td class="px-6 py-3"><div class="flex items-center justify-end gap-1"><button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#0d6dff] hover:bg-[#e7f1ff] transition" @click="openEdit(a)"><Pencil class="h-4 w-4" /></button></div></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 pb-4"><UiAppPagination :current-page="pagination.current_page" :last-page="pagination.last_page" :total="pagination.total" @update:current-page="fetchItems($event)" /></div>
    </div>
    <UiAppModal :show="showModal" :title="editId ? 'Edit Presensi' : 'Input Presensi'" @close="showModal = false">
      <form class="space-y-4" @submit.prevent="save">
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">ID Karyawan</span><UiAppInput v-model="form.employee_id" type="number" placeholder="1" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Tanggal</span><UiAppDatePicker v-model="form.attendance_date" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Status</span>
          <UiAppSelect v-model="form.status" :options="[{label:'Hadir',value:'present'},{label:'Terlambat',value:'late'},{label:'Absen',value:'absent'},{label:'Cuti',value:'leave'},{label:'Sakit',value:'sick'}]" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Catatan</span><UiAppInput v-model="form.notes" placeholder="Catatan (opsional)" /></label>
        <div class="flex justify-end gap-3 pt-2">
          <button type="button" class="h-10 rounded-lg border border-[#d9e6f5] bg-white px-5 text-sm font-semibold text-[#4c6387]" @click="showModal = false">Batal</button>
          <button type="submit" :disabled="saving" class="h-10 rounded-lg bg-gradient-to-r from-[#0d6dff] to-[#0045bd] px-6 text-sm font-semibold text-white shadow-btn-blue transition disabled:opacity-50">{{ saving ? 'Menyimpan...' : 'Simpan' }}</button>
        </div>
      </form>
    </UiAppModal>
  </div>
</template>
