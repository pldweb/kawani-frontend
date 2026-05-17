<script setup lang="ts">
import { Plus, Pencil, Trash2, MapPin } from 'lucide-vue-next'
import { definePageMeta, ref, onMounted } from '#imports'
import { useCrud } from '~/composables/useCrud'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })
interface Loc { id: number; name: string; latitude: number; longitude: number; radius_meter: number; is_active: boolean }
const { items, loading, saving, pagination, fetchItems, createItem, updateItem, deleteItem } = useCrud<Loc>({ resource: 'work-locations' })
const showModal = ref(false); const showDelete = ref(false); const editId = ref<number|null>(null); const deleteId = ref<number|null>(null)
const form = ref({ name: '', latitude: '', longitude: '', radius_meter: '100' })
function resetForm() { form.value = { name: '', latitude: '', longitude: '', radius_meter: '100' }; editId.value = null }
function openCreate() { resetForm(); showModal.value = true }
function openEdit(i: Loc) { editId.value = i.id; form.value = { name: i.name, latitude: String(i.latitude), longitude: String(i.longitude), radius_meter: String(i.radius_meter) }; showModal.value = true }
async function save() { const data = { ...form.value, latitude: Number(form.value.latitude), longitude: Number(form.value.longitude), radius_meter: Number(form.value.radius_meter) }; if (editId.value) await updateItem(editId.value, data); else await createItem(data); showModal.value = false; await fetchItems(pagination.value.current_page) }
async function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
async function doDelete() { if (deleteId.value) await deleteItem(deleteId.value); showDelete.value = false; await fetchItems(pagination.value.current_page) }
onMounted(() => fetchItems())
</script>
<template>
  <div class="space-y-6 mt-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><h1 class="text-2xl font-bold text-[#071b3a]">Lokasi Kerja</h1><p class="mt-1 text-sm text-[#6680a7]">Kelola lokasi kerja untuk presensi karyawan.</p></div>
      <button class="flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-[#0d6dff] to-[#0045bd] px-5 text-sm font-semibold text-white shadow-btn-blue hover:opacity-90 transition" @click="openCreate"><Plus class="h-4 w-4" /> Tambah Lokasi</button>
    </div>
    <div class="rounded-xl border border-[#d9e6f5] bg-white shadow-card overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center py-20"><div class="h-8 w-8 animate-spin rounded-full border-[3px] border-[#0d6dff] border-t-transparent" /></div>
      <div v-else-if="items.length === 0" class="flex flex-col items-center justify-center py-20 text-[#6680a7]"><MapPin class="h-12 w-12 mb-3 opacity-40" /><p class="text-sm font-medium">Belum ada data lokasi.</p></div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-[13px]">
          <thead class="bg-[#fafcff] text-[12px] font-semibold text-[#6680a7] uppercase tracking-wider"><tr><th class="px-6 py-3">Nama</th><th class="px-6 py-3">Latitude</th><th class="px-6 py-3">Longitude</th><th class="px-6 py-3">Radius (m)</th><th class="px-6 py-3">Status</th><th class="px-6 py-3 text-right">Aksi</th></tr></thead>
          <tbody>
            <tr v-for="l in items" :key="l.id" class="border-t border-[#eef2f5] hover:bg-[#f8fbff] transition-colors">
              <td class="px-6 py-3 font-semibold text-[#071b3a]">{{ l.name }}</td>
              <td class="px-6 py-3 font-mono text-[#4c6387]">{{ l.latitude }}</td>
              <td class="px-6 py-3 font-mono text-[#4c6387]">{{ l.longitude }}</td>
              <td class="px-6 py-3 text-[#4c6387]">{{ l.radius_meter }}m</td>
              <td class="px-6 py-3"><UiAppBadge :variant="l.is_active ? 'success' : 'danger'">{{ l.is_active ? 'Aktif' : 'Nonaktif' }}</UiAppBadge></td>
              <td class="px-6 py-3"><div class="flex items-center justify-end gap-1"><button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#0d6dff] hover:bg-[#e7f1ff] transition" @click="openEdit(l)"><Pencil class="h-4 w-4" /></button><button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#ef233c] hover:bg-red-50 transition" @click="confirmDelete(l.id)"><Trash2 class="h-4 w-4" /></button></div></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 pb-4"><UiAppPagination :current-page="pagination.current_page" :last-page="pagination.last_page" :total="pagination.total" @update:current-page="fetchItems($event)" /></div>
    </div>
    <UiAppModal :show="showModal" :title="editId ? 'Edit Lokasi' : 'Tambah Lokasi'" @close="showModal = false">
      <form class="space-y-4" @submit.prevent="save">
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Nama Lokasi</span><UiAppInput v-model="form.name" placeholder="Kantor Pusat" /></label>
        <div class="grid grid-cols-2 gap-4">
          <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Latitude</span><UiAppInput v-model="form.latitude" placeholder="-6.2088" /></label>
          <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Longitude</span><UiAppInput v-model="form.longitude" placeholder="106.8456" /></label>
        </div>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Radius (meter)</span><UiAppInput v-model="form.radius_meter" type="number" placeholder="100" /></label>
        <div class="flex justify-end gap-3 pt-2">
          <button type="button" class="h-10 rounded-lg border border-[#d9e6f5] bg-white px-5 text-sm font-semibold text-[#4c6387]" @click="showModal = false">Batal</button>
          <button type="submit" :disabled="saving" class="h-10 rounded-lg bg-gradient-to-r from-[#0d6dff] to-[#0045bd] px-6 text-sm font-semibold text-white shadow-btn-blue transition disabled:opacity-50">{{ saving ? 'Menyimpan...' : 'Simpan' }}</button>
        </div>
      </form>
    </UiAppModal>
    <UiAppModal :show="showDelete" title="Hapus Lokasi" @close="showDelete = false">
      <p class="text-sm text-[#4c6387]">Yakin ingin menghapus lokasi ini?</p>
      <template #footer><button class="h-10 rounded-lg border border-[#d9e6f5] bg-white px-5 text-sm font-semibold text-[#4c6387]" @click="showDelete = false">Batal</button><button :disabled="saving" class="h-10 rounded-lg bg-[#ef233c] px-5 text-sm font-semibold text-white" @click="doDelete">Hapus</button></template>
    </UiAppModal>
  </div>
</template>
