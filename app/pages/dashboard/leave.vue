<script setup lang="ts">
import { Plus, Pencil, Trash2, CalendarCheck, Check, X as XIcon } from 'lucide-vue-next'
import { definePageMeta, ref, onMounted } from '#imports'
import { useCrud } from '~/composables/useCrud'
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
interface LeaveReq { id: number; employee_id: number; leave_type_id: number; start_date: string; end_date: string; total_days: number; reason: string; status: string }
const { items, loading, saving, pagination, fetchItems, createItem, updateItem, deleteItem } = useCrud<LeaveReq>({ resource: 'leave-requests' })
const showModal = ref(false); const showDelete = ref(false); const editId = ref<number|null>(null); const deleteId = ref<number|null>(null)
const form = ref({ employee_id: '', leave_type_id: '', start_date: '', end_date: '', total_days: '1', reason: '', status: 'pending' })
function resetForm() { form.value = { employee_id: '', leave_type_id: '', start_date: '', end_date: '', total_days: '1', reason: '', status: 'pending' }; editId.value = null }
function openCreate() { resetForm(); showModal.value = true }
function openEdit(i: LeaveReq) { editId.value = i.id; form.value = { employee_id: String(i.employee_id), leave_type_id: String(i.leave_type_id), start_date: i.start_date?.split('T')[0] || '', end_date: i.end_date?.split('T')[0] || '', total_days: String(i.total_days), reason: i.reason, status: i.status }; showModal.value = true }
async function save() { const data = { ...form.value, employee_id: Number(form.value.employee_id), leave_type_id: Number(form.value.leave_type_id), total_days: Number(form.value.total_days) }; if (editId.value) await updateItem(editId.value, data); else await createItem(data); showModal.value = false; await fetchItems(pagination.value.current_page) }
async function approve(id: number) { await updateItem(id, { status: 'approved' }); await fetchItems(pagination.value.current_page) }
async function reject(id: number) { await updateItem(id, { status: 'rejected' }); await fetchItems(pagination.value.current_page) }
async function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
async function doDelete() { if (deleteId.value) await deleteItem(deleteId.value); showDelete.value = false; await fetchItems(pagination.value.current_page) }
function statusV(s: string) { return { draft: 'default', pending: 'warning', approved: 'success', rejected: 'danger', cancelled: 'default' }[s] || 'default' }
function statusL(s: string) { return { draft: 'Draft', pending: 'Menunggu', approved: 'Disetujui', rejected: 'Ditolak', cancelled: 'Dibatalkan' }[s] || s }
onMounted(() => fetchItems())
</script>
<template>
  <div class="space-y-6 mt-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><h1 class="text-2xl font-bold text-[#071b3a]">Cuti & Izin</h1><p class="mt-1 text-sm text-[#6680a7]">Kelola pengajuan cuti dan izin karyawan.</p></div>
      <button class="flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-[#0d6dff] to-[#0045bd] px-5 text-sm font-semibold text-white shadow-btn-blue hover:opacity-90 transition" @click="openCreate"><Plus class="h-4 w-4" /> Ajukan Cuti</button>
    </div>
    <div class="rounded-xl border border-[#d9e6f5] bg-white shadow-card overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center py-20"><div class="h-8 w-8 animate-spin rounded-full border-[3px] border-[#0d6dff] border-t-transparent" /></div>
      <div v-else-if="items.length === 0" class="flex flex-col items-center justify-center py-20 text-[#6680a7]"><CalendarCheck class="h-12 w-12 mb-3 opacity-40" /><p class="text-sm font-medium">Belum ada pengajuan cuti.</p></div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-[13px]">
          <thead class="bg-[#fafcff] text-[12px] font-semibold text-[#6680a7] uppercase tracking-wider"><tr><th class="px-6 py-3">ID Karyawan</th><th class="px-6 py-3">Tanggal</th><th class="px-6 py-3">Hari</th><th class="px-6 py-3">Alasan</th><th class="px-6 py-3">Status</th><th class="px-6 py-3 text-right">Aksi</th></tr></thead>
          <tbody>
            <tr v-for="r in items" :key="r.id" class="border-t border-[#eef2f5] hover:bg-[#f8fbff] transition-colors">
              <td class="px-6 py-3 font-mono text-[#0d6dff]">{{ r.employee_id }}</td>
              <td class="px-6 py-3 text-[#071b3a]">{{ r.start_date?.split('T')[0] }} — {{ r.end_date?.split('T')[0] }}</td>
              <td class="px-6 py-3 text-[#4c6387]">{{ r.total_days }}</td>
              <td class="px-6 py-3 text-[#4c6387] max-w-[200px] truncate">{{ r.reason }}</td>
              <td class="px-6 py-3"><UiAppBadge :variant="statusV(r.status) as any">{{ statusL(r.status) }}</UiAppBadge></td>
              <td class="px-6 py-3"><div class="flex items-center justify-end gap-1">
                <button v-if="r.status === 'pending'" class="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-600 hover:bg-emerald-50 transition" title="Setujui" @click="approve(r.id)"><Check class="h-4 w-4" /></button>
                <button v-if="r.status === 'pending'" class="flex h-8 w-8 items-center justify-center rounded-lg text-[#ef233c] hover:bg-red-50 transition" title="Tolak" @click="reject(r.id)"><XIcon class="h-4 w-4" /></button>
                <button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#0d6dff] hover:bg-[#e7f1ff] transition" @click="openEdit(r)"><Pencil class="h-4 w-4" /></button>
                <button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#ef233c] hover:bg-red-50 transition" @click="confirmDelete(r.id)"><Trash2 class="h-4 w-4" /></button>
              </div></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 pb-4"><UiAppPagination :current-page="pagination.current_page" :last-page="pagination.last_page" :total="pagination.total" @update:current-page="fetchItems($event)" /></div>
    </div>
    <UiAppModal :show="showModal" :title="editId ? 'Edit Cuti' : 'Ajukan Cuti'" @close="showModal = false">
      <form class="space-y-4" @submit.prevent="save">
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">ID Karyawan</span><UiAppInput v-model="form.employee_id" type="number" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Tipe Cuti (ID)</span><UiAppInput v-model="form.leave_type_id" type="number" /></label>
        <div class="grid grid-cols-2 gap-4">
          <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Mulai</span><UiAppDatePicker v-model="form.start_date" /></label>
          <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Selesai</span><UiAppDatePicker v-model="form.end_date" /></label>
        </div>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Total Hari</span><UiAppInput v-model="form.total_days" type="number" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Alasan</span><UiAppInput v-model="form.reason" placeholder="Alasan pengajuan cuti" /></label>
        <div class="flex justify-end gap-3 pt-2">
          <button type="button" class="h-10 rounded-lg border border-[#d9e6f5] bg-white px-5 text-sm font-semibold text-[#4c6387]" @click="showModal = false">Batal</button>
          <button type="submit" :disabled="saving" class="h-10 rounded-lg bg-gradient-to-r from-[#0d6dff] to-[#0045bd] px-6 text-sm font-semibold text-white shadow-btn-blue transition disabled:opacity-50">{{ saving ? 'Menyimpan...' : 'Simpan' }}</button>
        </div>
      </form>
    </UiAppModal>
    <UiAppModal :show="showDelete" title="Hapus Pengajuan" @close="showDelete = false">
      <p class="text-sm text-[#4c6387]">Yakin ingin menghapus pengajuan ini?</p>
      <template #footer><button class="h-10 rounded-lg border border-[#d9e6f5] bg-white px-5 text-sm font-semibold text-[#4c6387]" @click="showDelete = false">Batal</button><button :disabled="saving" class="h-10 rounded-lg bg-[#ef233c] px-5 text-sm font-semibold text-white" @click="doDelete">Hapus</button></template>
    </UiAppModal>
  </div>
</template>
