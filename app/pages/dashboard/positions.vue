<script setup lang="ts">
import { Plus, Pencil, Trash2, BriefcaseBusiness } from 'lucide-vue-next'
import { definePageMeta, ref, onMounted } from '#imports'
import { useCrud } from '~/composables/useCrud'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

interface Position { id: number; code: string; name: string; level: string | null; department_id: number; description: string | null; is_active: boolean }

const { items, loading, saving, pagination, fetchItems, createItem, updateItem, deleteItem } = useCrud<Position>({ resource: 'positions' })
const deptCrud = useCrud<{id:number;name:string}>({ resource: 'departments', perPage: 100 })
const showModal = ref(false); const showDelete = ref(false); const editId = ref<number|null>(null); const deleteId = ref<number|null>(null)
const form = ref({ code: '', name: '', level: '', department_id: '', description: '' })

function resetForm() { form.value = { code: '', name: '', level: '', department_id: '', description: '' }; editId.value = null }
function openCreate() { resetForm(); showModal.value = true }
function openEdit(item: Position) {
  editId.value = item.id
  form.value = { code: item.code, name: item.name, level: item.level || '', department_id: String(item.department_id), description: item.description || '' }
  showModal.value = true
}
async function save() {
  const data = { ...form.value, department_id: Number(form.value.department_id) }
  if (editId.value) await updateItem(editId.value, data)
  else await createItem(data)
  showModal.value = false; await fetchItems(pagination.value.current_page)
}
async function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
async function doDelete() { if (deleteId.value) await deleteItem(deleteId.value); showDelete.value = false; await fetchItems(pagination.value.current_page) }

onMounted(async () => { await fetchItems(); await deptCrud.fetchItems(1, {}) })
</script>

<template>
  <div class="space-y-6 mt-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><h1 class="text-2xl font-bold text-[#071b3a]">Jabatan</h1><p class="mt-1 text-sm text-[#6680a7]">Kelola data jabatan dan posisi di perusahaan.</p></div>
      <button class="flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-[#0d6dff] to-[#0045bd] px-5 text-sm font-semibold text-white shadow-btn-blue hover:opacity-90 transition" @click="openCreate"><Plus class="h-4 w-4" /> Tambah Jabatan</button>
    </div>
    <div class="rounded-xl border border-[#d9e6f5] bg-white shadow-card overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center py-20"><div class="h-8 w-8 animate-spin rounded-full border-[3px] border-[#0d6dff] border-t-transparent" /></div>
      <div v-else-if="items.length === 0" class="flex flex-col items-center justify-center py-20 text-[#6680a7]"><BriefcaseBusiness class="h-12 w-12 mb-3 opacity-40" /><p class="text-sm font-medium">Belum ada data jabatan.</p></div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-[13px]">
          <thead class="bg-[#fafcff] text-[12px] font-semibold text-[#6680a7] uppercase tracking-wider"><tr><th class="px-6 py-3">Kode</th><th class="px-6 py-3">Nama</th><th class="px-6 py-3">Level</th><th class="px-6 py-3">Status</th><th class="px-6 py-3 text-right">Aksi</th></tr></thead>
          <tbody>
            <tr v-for="p in items" :key="p.id" class="border-t border-[#eef2f5] hover:bg-[#f8fbff] transition-colors">
              <td class="px-6 py-3 font-mono text-[#0d6dff] font-semibold">{{ p.code }}</td>
              <td class="px-6 py-3 font-semibold text-[#071b3a]">{{ p.name }}</td>
              <td class="px-6 py-3 text-[#4c6387]">{{ p.level || '-' }}</td>
              <td class="px-6 py-3"><UiAppBadge :variant="p.is_active ? 'success' : 'danger'">{{ p.is_active ? 'Aktif' : 'Nonaktif' }}</UiAppBadge></td>
              <td class="px-6 py-3"><div class="flex items-center justify-end gap-1"><button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#0d6dff] hover:bg-[#e7f1ff] transition" @click="openEdit(p)"><Pencil class="h-4 w-4" /></button><button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#ef233c] hover:bg-red-50 transition" @click="confirmDelete(p.id)"><Trash2 class="h-4 w-4" /></button></div></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 pb-4"><UiAppPagination :current-page="pagination.current_page" :last-page="pagination.last_page" :total="pagination.total" @update:current-page="fetchItems($event)" /></div>
    </div>

    <UiAppModal :show="showModal" :title="editId ? 'Edit Jabatan' : 'Tambah Jabatan'" @close="showModal = false">
      <form class="space-y-4" @submit.prevent="save">
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Kode</span><UiAppInput v-model="form.code" placeholder="POS-001" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Nama</span><UiAppInput v-model="form.name" placeholder="Nama jabatan" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Level</span>
          <UiAppSelect v-model="form.level" :options="[{label:'Staff',value:'staff'},{label:'Supervisor',value:'supervisor'},{label:'Manager',value:'manager'},{label:'Director',value:'director'}]" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Departemen</span>
          <UiAppSelect v-model="form.department_id" :options="deptCrud.items.value.map((d:any)=>({label:d.name,value:String(d.id)}))" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Deskripsi</span><UiAppInput v-model="form.description" placeholder="Deskripsi" /></label>
        <div class="flex justify-end gap-3 pt-2">
          <button type="button" class="h-10 rounded-lg border border-[#d9e6f5] bg-white px-5 text-sm font-semibold text-[#4c6387]" @click="showModal = false">Batal</button>
          <button type="submit" :disabled="saving" class="h-10 rounded-lg bg-gradient-to-r from-[#0d6dff] to-[#0045bd] px-6 text-sm font-semibold text-white shadow-btn-blue hover:opacity-90 transition disabled:opacity-50">{{ saving ? 'Menyimpan...' : 'Simpan' }}</button>
        </div>
      </form>
    </UiAppModal>

    <UiAppModal :show="showDelete" title="Hapus Jabatan" @close="showDelete = false">
      <p class="text-sm text-[#4c6387]">Yakin ingin menghapus jabatan ini?</p>
      <template #footer>
        <button class="h-10 rounded-lg border border-[#d9e6f5] bg-white px-5 text-sm font-semibold text-[#4c6387]" @click="showDelete = false">Batal</button>
        <button :disabled="saving" class="h-10 rounded-lg bg-[#ef233c] px-5 text-sm font-semibold text-white hover:bg-red-700 transition" @click="doDelete">Hapus</button>
      </template>
    </UiAppModal>
  </div>
</template>
