<script setup lang="ts">
import { Plus, Pencil, Trash2, Star } from 'lucide-vue-next'
import { definePageMeta, ref, onMounted } from '#imports'
import { useCrud } from '~/composables/useCrud'
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
interface PerfReview { id: number; employee_id: number; performance_period_id: number; reviewer_id: number; score: number|null; rating: string|null; strengths: string|null; improvements: string|null; goals: string|null; status: string }
const { items, loading, saving, pagination, fetchItems, createItem, updateItem, deleteItem } = useCrud<PerfReview>({ resource: 'performance-reviews' })
const showModal = ref(false); const showDelete = ref(false); const editId = ref<number|null>(null); const deleteId = ref<number|null>(null)
const form = ref({ employee_id: '', performance_period_id: '', reviewer_id: '1', score: '', rating: '', strengths: '', improvements: '', goals: '', status: 'draft' })
function resetForm() { form.value = { employee_id: '', performance_period_id: '', reviewer_id: '1', score: '', rating: '', strengths: '', improvements: '', goals: '', status: 'draft' }; editId.value = null }
function openCreate() { resetForm(); showModal.value = true }
function openEdit(i: PerfReview) { editId.value = i.id; form.value = { employee_id: String(i.employee_id), performance_period_id: String(i.performance_period_id), reviewer_id: String(i.reviewer_id), score: String(i.score||''), rating: i.rating||'', strengths: i.strengths||'', improvements: i.improvements||'', goals: i.goals||'', status: i.status }; showModal.value = true }
async function save() { const data = { ...form.value, employee_id: Number(form.value.employee_id), performance_period_id: Number(form.value.performance_period_id), reviewer_id: Number(form.value.reviewer_id), score: form.value.score ? Number(form.value.score) : null }; if (editId.value) await updateItem(editId.value, data); else await createItem(data); showModal.value = false; await fetchItems(pagination.value.current_page) }
async function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
async function doDelete() { if (deleteId.value) await deleteItem(deleteId.value); showDelete.value = false; await fetchItems(pagination.value.current_page) }
function ratingV(r: string|null) { return { excellent: 'success', good: 'success', average: 'warning', below_average: 'danger', poor: 'danger' }[r||''] || 'default' }
function ratingL(r: string|null) { return { excellent: 'Sangat Baik', good: 'Baik', average: 'Cukup', below_average: 'Kurang', poor: 'Buruk' }[r||''] || r || '-' }
onMounted(() => fetchItems())
</script>
<template>
  <div class="space-y-6 mt-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><h1 class="text-2xl font-bold text-[#071b3a]">Penilaian Kinerja</h1><p class="mt-1 text-sm text-[#6680a7]">Kelola evaluasi kinerja karyawan.</p></div>
      <button class="flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-[#0d6dff] to-[#0045bd] px-5 text-sm font-semibold text-white shadow-btn-blue hover:opacity-90 transition" @click="openCreate"><Plus class="h-4 w-4" /> Tambah Review</button>
    </div>
    <div class="rounded-xl border border-[#d9e6f5] bg-white shadow-card overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center py-20"><div class="h-8 w-8 animate-spin rounded-full border-[3px] border-[#0d6dff] border-t-transparent" /></div>
      <div v-else-if="items.length === 0" class="flex flex-col items-center justify-center py-20 text-[#6680a7]"><Star class="h-12 w-12 mb-3 opacity-40" /><p class="text-sm font-medium">Belum ada data penilaian kinerja.</p></div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-[13px]">
          <thead class="bg-[#fafcff] text-[12px] font-semibold text-[#6680a7] uppercase tracking-wider"><tr><th class="px-6 py-3">ID Karyawan</th><th class="px-6 py-3">Skor</th><th class="px-6 py-3">Rating</th><th class="px-6 py-3">Status</th><th class="px-6 py-3 text-right">Aksi</th></tr></thead>
          <tbody>
            <tr v-for="r in items" :key="r.id" class="border-t border-[#eef2f5] hover:bg-[#f8fbff]">
              <td class="px-6 py-3 font-mono text-[#0d6dff]">{{ r.employee_id }}</td>
              <td class="px-6 py-3 font-bold text-[#071b3a]">{{ r.score || '-' }}</td>
              <td class="px-6 py-3"><UiAppBadge :variant="ratingV(r.rating) as any">{{ ratingL(r.rating) }}</UiAppBadge></td>
              <td class="px-6 py-3"><UiAppBadge :variant="r.status === 'submitted' ? 'success' : 'default'">{{ r.status }}</UiAppBadge></td>
              <td class="px-6 py-3"><div class="flex items-center justify-end gap-1"><button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#0d6dff] hover:bg-[#e7f1ff]" @click="openEdit(r)"><Pencil class="h-4 w-4" /></button><button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#ef233c] hover:bg-red-50" @click="confirmDelete(r.id)"><Trash2 class="h-4 w-4" /></button></div></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 pb-4"><UiAppPagination :current-page="pagination.current_page" :last-page="pagination.last_page" :total="pagination.total" @update:current-page="fetchItems($event)" /></div>
    </div>
    <UiAppModal :show="showModal" :title="editId ? 'Edit Review' : 'Tambah Review'" max-width="max-w-2xl" @close="showModal = false">
      <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="save">
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">ID Karyawan</span><UiAppInput v-model="form.employee_id" type="number" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">ID Periode</span><UiAppInput v-model="form.performance_period_id" type="number" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Skor (0-100)</span><UiAppInput v-model="form.score" type="number" placeholder="85" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Rating</span>
          <UiAppSelect v-model="form.rating" :options="[{label:'Sangat Baik',value:'excellent'},{label:'Baik',value:'good'},{label:'Cukup',value:'average'},{label:'Kurang',value:'below_average'},{label:'Buruk',value:'poor'}]" /></label>
        <label class="block sm:col-span-2"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Kekuatan</span><UiAppInput v-model="form.strengths" placeholder="Kekuatan karyawan" /></label>
        <label class="block sm:col-span-2"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Perbaikan</span><UiAppInput v-model="form.improvements" placeholder="Area yang perlu ditingkatkan" /></label>
        <label class="block sm:col-span-2"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Target</span><UiAppInput v-model="form.goals" placeholder="Target ke depan" /></label>
        <div class="sm:col-span-2 flex justify-end gap-3 pt-2">
          <button type="button" class="h-10 rounded-lg border border-[#d9e6f5] bg-white px-5 text-sm font-semibold text-[#4c6387]" @click="showModal = false">Batal</button>
          <button type="submit" :disabled="saving" class="h-10 rounded-lg bg-gradient-to-r from-[#0d6dff] to-[#0045bd] px-6 text-sm font-semibold text-white shadow-btn-blue transition disabled:opacity-50">{{ saving ? 'Menyimpan...' : 'Simpan' }}</button>
        </div>
      </form>
    </UiAppModal>
    <UiAppModal :show="showDelete" title="Hapus Review" @close="showDelete = false">
      <p class="text-sm text-[#4c6387]">Yakin ingin menghapus review ini?</p>
      <template #footer><button class="h-10 rounded-lg border border-[#d9e6f5] bg-white px-5 text-sm font-semibold text-[#4c6387]" @click="showDelete = false">Batal</button><button class="h-10 rounded-lg bg-[#ef233c] px-5 text-sm font-semibold text-white" @click="doDelete">Hapus</button></template>
    </UiAppModal>
  </div>
</template>
