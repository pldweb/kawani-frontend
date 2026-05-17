<script setup lang="ts">
import { Plus, Pencil, Trash2, Wrench } from 'lucide-vue-next'
import { definePageMeta, ref, onMounted } from '#imports'
import { useCrud } from '~/composables/useCrud'
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
interface SkillItem { id: number; name: string; category: string | null; description: string | null; is_active: boolean }
const { items, loading, saving, pagination, fetchItems, createItem, updateItem, deleteItem } = useCrud<SkillItem>({ resource: 'skills' })
const showModal = ref(false); const showDelete = ref(false); const editId = ref<number|null>(null); const deleteId = ref<number|null>(null)
const form = ref({ name: '', category: '', description: '' })
function resetForm() { form.value = { name: '', category: '', description: '' }; editId.value = null }
function openCreate() { resetForm(); showModal.value = true }
function openEdit(i: SkillItem) { editId.value = i.id; form.value = { name: i.name, category: i.category || '', description: i.description || '' }; showModal.value = true }
async function save() { if (editId.value) await updateItem(editId.value, form.value); else await createItem(form.value); showModal.value = false; await fetchItems(pagination.value.current_page) }
async function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
async function doDelete() { if (deleteId.value) await deleteItem(deleteId.value); showDelete.value = false; await fetchItems(pagination.value.current_page) }
onMounted(() => fetchItems())
</script>
<template>
  <div class="space-y-6 mt-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><h1 class="text-2xl font-bold text-[#071b3a]">Skill</h1><p class="mt-1 text-sm text-[#6680a7]">Kelola data skill dan keahlian karyawan.</p></div>
      <button class="flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-[#0d6dff] to-[#0045bd] px-5 text-sm font-semibold text-white shadow-btn-blue hover:opacity-90 transition" @click="openCreate"><Plus class="h-4 w-4" /> Tambah Skill</button>
    </div>
    <div class="rounded-xl border border-[#d9e6f5] bg-white shadow-card overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center py-20"><div class="h-8 w-8 animate-spin rounded-full border-[3px] border-[#0d6dff] border-t-transparent" /></div>
      <div v-else-if="items.length === 0" class="flex flex-col items-center justify-center py-20 text-[#6680a7]"><Wrench class="h-12 w-12 mb-3 opacity-40" /><p class="text-sm font-medium">Belum ada data skill.</p></div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-[13px]">
          <thead class="bg-[#fafcff] text-[12px] font-semibold text-[#6680a7] uppercase tracking-wider"><tr><th class="px-6 py-3">Nama</th><th class="px-6 py-3">Kategori</th><th class="px-6 py-3">Status</th><th class="px-6 py-3 text-right">Aksi</th></tr></thead>
          <tbody>
            <tr v-for="s in items" :key="s.id" class="border-t border-[#eef2f5] hover:bg-[#f8fbff] transition-colors">
              <td class="px-6 py-3 font-semibold text-[#071b3a]">{{ s.name }}</td>
              <td class="px-6 py-3 text-[#4c6387]">{{ s.category || '-' }}</td>
              <td class="px-6 py-3"><UiAppBadge :variant="s.is_active ? 'success' : 'danger'">{{ s.is_active ? 'Aktif' : 'Nonaktif' }}</UiAppBadge></td>
              <td class="px-6 py-3"><div class="flex items-center justify-end gap-1"><button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#0d6dff] hover:bg-[#e7f1ff] transition" @click="openEdit(s)"><Pencil class="h-4 w-4" /></button><button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#ef233c] hover:bg-red-50 transition" @click="confirmDelete(s.id)"><Trash2 class="h-4 w-4" /></button></div></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 pb-4"><UiAppPagination :current-page="pagination.current_page" :last-page="pagination.last_page" :total="pagination.total" @update:current-page="fetchItems($event)" /></div>
    </div>
    <UiAppModal :show="showModal" :title="editId ? 'Edit Skill' : 'Tambah Skill'" @close="showModal = false">
      <form class="space-y-4" @submit.prevent="save">
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Nama</span><UiAppInput v-model="form.name" placeholder="JavaScript" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Kategori</span>
          <UiAppSelect v-model="form.category" :options="[{label:'Technical',value:'technical'},{label:'Soft Skill',value:'soft_skill'},{label:'Management',value:'management'},{label:'Language',value:'language'}]" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Deskripsi</span><UiAppInput v-model="form.description" placeholder="Deskripsi skill" /></label>
        <div class="flex justify-end gap-3 pt-2">
          <button type="button" class="h-10 rounded-lg border border-[#d9e6f5] bg-white px-5 text-sm font-semibold text-[#4c6387]" @click="showModal = false">Batal</button>
          <button type="submit" :disabled="saving" class="h-10 rounded-lg bg-gradient-to-r from-[#0d6dff] to-[#0045bd] px-6 text-sm font-semibold text-white shadow-btn-blue transition disabled:opacity-50">{{ saving ? 'Menyimpan...' : 'Simpan' }}</button>
        </div>
      </form>
    </UiAppModal>
    <UiAppModal :show="showDelete" title="Hapus Skill" @close="showDelete = false">
      <p class="text-sm text-[#4c6387]">Yakin ingin menghapus skill ini?</p>
      <template #footer><button class="h-10 rounded-lg border border-[#d9e6f5] bg-white px-5 text-sm font-semibold text-[#4c6387]" @click="showDelete = false">Batal</button><button :disabled="saving" class="h-10 rounded-lg bg-[#ef233c] px-5 text-sm font-semibold text-white" @click="doDelete">Hapus</button></template>
    </UiAppModal>
  </div>
</template>
