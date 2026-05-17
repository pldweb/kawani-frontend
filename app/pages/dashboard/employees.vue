<script setup lang="ts">
import { Plus, Pencil, Trash2, Search, Users } from 'lucide-vue-next'
import { definePageMeta, ref, onMounted } from '#imports'
import { useCrud } from '~/composables/useCrud'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

interface Employee {
  id: number; employee_number: string; full_name: string; gender: string | null
  email: string | null; phone: string | null; employment_status: string
  department_id: number | null; position_id: number | null
  joined_date: string; birth_date: string | null; address: string | null
}

const { items, loading, saving, pagination, fetchItems, createItem, updateItem, deleteItem } = useCrud<Employee>({ resource: 'employees' })
const deptCrud = useCrud<{id:number;name:string}>({ resource: 'departments', perPage: 100 })
const posCrud = useCrud<{id:number;name:string}>({ resource: 'positions', perPage: 100 })

const showModal = ref(false)
const showDelete = ref(false)
const editId = ref<number | null>(null)
const deleteId = ref<number | null>(null)
const search = ref('')
const form = ref({
  employee_number: '', full_name: '', gender: '', email: '', phone: '',
  employment_status: 'probation', department_id: '', position_id: '',
  joined_date: '', birth_date: '', address: ''
})

function resetForm() {
  form.value = { employee_number: '', full_name: '', gender: '', email: '', phone: '', employment_status: 'probation', department_id: '', position_id: '', joined_date: '', birth_date: '', address: '' }
  editId.value = null
}

function openCreate() { resetForm(); showModal.value = true }

function openEdit(item: Employee) {
  editId.value = item.id
  form.value = {
    employee_number: item.employee_number, full_name: item.full_name,
    gender: item.gender || '', email: item.email || '', phone: item.phone || '',
    employment_status: item.employment_status, department_id: String(item.department_id || ''),
    position_id: String(item.position_id || ''), joined_date: item.joined_date?.split('T')[0] || '',
    birth_date: item.birth_date?.split('T')[0] || '', address: item.address || ''
  }
  showModal.value = true
}

async function save() {
  const data = { ...form.value, department_id: form.value.department_id ? Number(form.value.department_id) : null, position_id: form.value.position_id ? Number(form.value.position_id) : null }
  if (editId.value) await updateItem(editId.value, data)
  else await createItem(data)
  showModal.value = false
  await fetchItems(pagination.value.current_page)
}

async function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }

async function doDelete() {
  if (deleteId.value) await deleteItem(deleteId.value)
  showDelete.value = false
  await fetchItems(pagination.value.current_page)
}

function statusVariant(s: string) {
  return { permanent: 'success', probation: 'warning', contract: 'info', intern: 'info', resigned: 'danger' }[s] || 'default'
}

function statusLabel(s: string) {
  return { permanent: 'Tetap', probation: 'Percobaan', contract: 'Kontrak', intern: 'Magang', resigned: 'Resign' }[s] || s
}

onMounted(async () => {
  await fetchItems()
  await deptCrud.fetchItems(1, {})
  await posCrud.fetchItems(1, {})
})
</script>

<template>
  <div class="space-y-6 mt-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[#071b3a]">Manajemen Karyawan</h1>
        <p class="mt-1 text-sm text-[#6680a7]">Kelola data seluruh karyawan perusahaan.</p>
      </div>
      <button v-can="'create_employees'" class="flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-[#0d6dff] to-[#0045bd] px-5 text-sm font-semibold text-white shadow-btn-blue hover:opacity-90 transition" @click="openCreate">
        <Plus class="h-4 w-4" /> Tambah Karyawan
      </button>
    </div>

    <div class="rounded-xl border border-[#d9e6f5] bg-white shadow-card overflow-hidden">
      <div class="flex items-center gap-3 border-b border-[#eef2f5] px-6 py-4">
        <div class="relative flex-1 max-w-xs">
          <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6680a7]" />
          <input v-model="search" placeholder="Cari karyawan..." class="h-10 w-full rounded-lg border border-[#d9e6f5] bg-[#fafcff] pl-10 pr-4 text-sm outline-none focus:border-[#0d6dff] transition" />
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="h-8 w-8 animate-spin rounded-full border-[3px] border-[#0d6dff] border-t-transparent" />
      </div>

      <div v-else-if="items.length === 0" class="flex flex-col items-center justify-center py-20 text-[#6680a7]">
        <Users class="h-12 w-12 mb-3 opacity-40" />
        <p class="text-sm font-medium">Belum ada data karyawan.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-[13px]">
          <thead class="bg-[#fafcff] text-[12px] font-semibold text-[#6680a7] uppercase tracking-wider">
            <tr>
              <th class="px-6 py-3">NIK</th>
              <th class="px-6 py-3">Nama</th>
              <th class="px-6 py-3">Email</th>
              <th class="px-6 py-3">Status</th>
              <th class="px-6 py-3">Tgl Bergabung</th>
              <th class="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="emp in items" :key="emp.id" class="border-t border-[#eef2f5] hover:bg-[#f8fbff] transition-colors">
              <td class="px-6 py-3 font-mono text-[#0d6dff] font-semibold">{{ emp.employee_number }}</td>
              <td class="px-6 py-3 font-semibold text-[#071b3a]">{{ emp.full_name }}</td>
              <td class="px-6 py-3 text-[#4c6387]">{{ emp.email || '-' }}</td>
              <td class="px-6 py-3"><UiAppBadge :variant="statusVariant(emp.employment_status) as any">{{ statusLabel(emp.employment_status) }}</UiAppBadge></td>
              <td class="px-6 py-3 text-[#4c6387]">{{ emp.joined_date?.split('T')[0] }}</td>
              <td class="px-6 py-3">
                <div class="flex items-center justify-end gap-1">
                  <button v-can="'update_employees'" class="flex h-8 w-8 items-center justify-center rounded-lg text-[#0d6dff] hover:bg-[#e7f1ff] transition" @click="openEdit(emp)"><Pencil class="h-4 w-4" /></button>
                  <button v-can="'delete_employees'" class="flex h-8 w-8 items-center justify-center rounded-lg text-[#ef233c] hover:bg-red-50 transition" @click="confirmDelete(emp.id)"><Trash2 class="h-4 w-4" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-6 pb-4">
        <UiAppPagination :current-page="pagination.current_page" :last-page="pagination.last_page" :total="pagination.total" @update:current-page="fetchItems($event)" />
      </div>
    </div>

    <UiAppModal :show="showModal" :title="editId ? 'Edit Karyawan' : 'Tambah Karyawan'" max-width="max-w-2xl" @close="showModal = false">
      <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="save">
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">NIK</span>
          <UiAppInput v-model="form.employee_number" placeholder="EMP-001" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Nama Lengkap</span>
          <UiAppInput v-model="form.full_name" placeholder="Nama lengkap" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Email</span>
          <UiAppInput v-model="form.email" type="email" placeholder="email@company.com" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Telepon</span>
          <UiAppInput v-model="form.phone" placeholder="08xxxxxxxxxx" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Gender</span>
          <UiAppSelect v-model="form.gender" :options="[{label:'Laki-laki',value:'male'},{label:'Perempuan',value:'female'}]" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Status</span>
          <UiAppSelect v-model="form.employment_status" :options="[{label:'Percobaan',value:'probation'},{label:'Tetap',value:'permanent'},{label:'Kontrak',value:'contract'},{label:'Magang',value:'intern'}]" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Departemen</span>
          <UiAppSelect v-model="form.department_id" :options="deptCrud.items.value.map((d:any)=>({label:d.name,value:String(d.id)}))" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Jabatan</span>
          <UiAppSelect v-model="form.position_id" :options="posCrud.items.value.map((p:any)=>({label:p.name,value:String(p.id)}))" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Tanggal Bergabung</span>
          <UiAppDatePicker v-model="form.joined_date" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Tanggal Lahir</span>
          <UiAppDatePicker v-model="form.birth_date" /></label>
        <label class="block sm:col-span-2"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Alamat</span>
          <UiAppInput v-model="form.address" placeholder="Alamat lengkap" /></label>
        <div class="sm:col-span-2 flex justify-end gap-3 pt-2">
          <button type="button" class="h-10 rounded-lg border border-[#d9e6f5] bg-white px-5 text-sm font-semibold text-[#4c6387] hover:bg-[#f3f8ff] transition" @click="showModal = false">Batal</button>
          <button type="submit" :disabled="saving" class="h-10 rounded-lg bg-gradient-to-r from-[#0d6dff] to-[#0045bd] px-6 text-sm font-semibold text-white shadow-btn-blue hover:opacity-90 transition disabled:opacity-50">
            {{ saving ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </form>
    </UiAppModal>

    <UiAppModal :show="showDelete" title="Hapus Karyawan" @close="showDelete = false">
      <p class="text-sm text-[#4c6387]">Apakah Anda yakin ingin menghapus data karyawan ini? Tindakan ini tidak dapat dibatalkan.</p>
      <template #footer>
        <button class="h-10 rounded-lg border border-[#d9e6f5] bg-white px-5 text-sm font-semibold text-[#4c6387] hover:bg-[#f3f8ff] transition" @click="showDelete = false">Batal</button>
        <button :disabled="saving" class="h-10 rounded-lg bg-[#ef233c] px-5 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-50" @click="doDelete">Hapus</button>
      </template>
    </UiAppModal>
  </div>
</template>
