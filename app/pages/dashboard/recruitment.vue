<script setup lang="ts">
import { Plus, Pencil, Trash2, Search as SearchIcon, Briefcase } from 'lucide-vue-next'
import { definePageMeta, ref, onMounted } from '#imports'
import { useCrud } from '~/composables/useCrud'
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
interface Job { id: number; title: string; description: string; location: string|null; employment_type: string; salary_min: number|null; salary_max: number|null; status: string; deadline: string|null }
interface App { id: number; job_posting_id: number; applicant_name: string; applicant_email: string; applicant_phone: string|null; status: string }
const jobCrud = useCrud<Job>({ resource: 'job-postings' })
const appCrud = useCrud<App>({ resource: 'job-applications' })
const activeTab = ref<'jobs'|'apps'>('jobs')
const showModal = ref(false); const editId = ref<number|null>(null); const showDelete = ref(false); const deleteId = ref<number|null>(null)
const jobForm = ref({ title: '', description: '', location: '', employment_type: 'full_time', salary_min: '', salary_max: '', status: 'draft', deadline: '', created_by: '1' })
const showAppModal = ref(false); const appEditId = ref<number|null>(null)
const appForm = ref({ job_posting_id: '', applicant_name: '', applicant_email: '', applicant_phone: '', status: 'applied' })

function openCreateJob() { jobForm.value = { title: '', description: '', location: '', employment_type: 'full_time', salary_min: '', salary_max: '', status: 'draft', deadline: '', created_by: '1' }; editId.value = null; showModal.value = true }
function openEditJob(i: Job) { editId.value = i.id; jobForm.value = { title: i.title, description: i.description, location: i.location||'', employment_type: i.employment_type, salary_min: String(i.salary_min||''), salary_max: String(i.salary_max||''), status: i.status, deadline: i.deadline?.split('T')[0]||'', created_by: '1' }; showModal.value = true }
async function saveJob() { const data = { ...jobForm.value, salary_min: jobForm.value.salary_min ? Number(jobForm.value.salary_min) : null, salary_max: jobForm.value.salary_max ? Number(jobForm.value.salary_max) : null, created_by: Number(jobForm.value.created_by) }; if (editId.value) await jobCrud.updateItem(editId.value, data as any); else await jobCrud.createItem(data as any); showModal.value = false; await jobCrud.fetchItems() }

function openCreateApp() { appForm.value = { job_posting_id: '', applicant_name: '', applicant_email: '', applicant_phone: '', status: 'applied' }; appEditId.value = null; showAppModal.value = true }
function openEditApp(i: App) { appEditId.value = i.id; appForm.value = { job_posting_id: String(i.job_posting_id), applicant_name: i.applicant_name, applicant_email: i.applicant_email, applicant_phone: i.applicant_phone||'', status: i.status }; showAppModal.value = true }
async function saveApp() { const data = { ...appForm.value, job_posting_id: Number(appForm.value.job_posting_id) }; if (appEditId.value) await appCrud.updateItem(appEditId.value, data); else await appCrud.createItem(data); showAppModal.value = false; await appCrud.fetchItems() }

async function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
async function doDelete() { if (!deleteId.value) return; if (activeTab.value === 'jobs') await jobCrud.deleteItem(deleteId.value); else await appCrud.deleteItem(deleteId.value); showDelete.value = false; if (activeTab.value === 'jobs') await jobCrud.fetchItems(); else await appCrud.fetchItems() }

function statusV(s: string) { return { draft: 'default', open: 'success', closed: 'danger', filled: 'info', applied: 'info', screening: 'warning', interview: 'warning', offered: 'success', hired: 'success', rejected: 'danger' }[s] || 'default' }
function empType(t: string) { return { full_time: 'Full Time', part_time: 'Part Time', contract: 'Kontrak', intern: 'Magang' }[t] || t }

onMounted(async () => { await jobCrud.fetchItems(); await appCrud.fetchItems() })
</script>
<template>
  <div class="space-y-6 mt-6">
    <div><h1 class="text-2xl font-bold text-[#071b3a]">Recruitment</h1><p class="mt-1 text-sm text-[#6680a7]">Kelola lowongan pekerjaan dan lamaran.</p></div>
    <div class="flex gap-2">
      <button :class="['h-10 rounded-lg px-5 text-sm font-semibold transition', activeTab === 'jobs' ? 'bg-[#0d6dff] text-white' : 'border border-[#d9e6f5] bg-white text-[#4c6387] hover:bg-[#f3f8ff]']" @click="activeTab = 'jobs'">Lowongan</button>
      <button :class="['h-10 rounded-lg px-5 text-sm font-semibold transition', activeTab === 'apps' ? 'bg-[#0d6dff] text-white' : 'border border-[#d9e6f5] bg-white text-[#4c6387] hover:bg-[#f3f8ff]']" @click="activeTab = 'apps'">Lamaran</button>
    </div>

    <div v-if="activeTab === 'jobs'" class="rounded-xl border border-[#d9e6f5] bg-white shadow-card overflow-hidden">
      <div class="flex items-center justify-between border-b border-[#eef2f5] px-6 py-4"><span class="text-sm font-semibold text-[#071b3a]">Daftar Lowongan</span><button class="flex h-9 items-center gap-2 rounded-lg bg-[#0d6dff] px-4 text-[13px] font-semibold text-white" @click="openCreateJob"><Plus class="h-4 w-4" /> Tambah</button></div>
      <div v-if="jobCrud.loading.value" class="flex items-center justify-center py-20"><div class="h-8 w-8 animate-spin rounded-full border-[3px] border-[#0d6dff] border-t-transparent" /></div>
      <div v-else-if="jobCrud.items.value.length === 0" class="flex flex-col items-center justify-center py-20 text-[#6680a7]"><Briefcase class="h-12 w-12 mb-3 opacity-40" /><p class="text-sm">Belum ada lowongan.</p></div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-[13px]">
          <thead class="bg-[#fafcff] text-[12px] font-semibold text-[#6680a7] uppercase tracking-wider"><tr><th class="px-6 py-3">Judul</th><th class="px-6 py-3">Tipe</th><th class="px-6 py-3">Deadline</th><th class="px-6 py-3">Status</th><th class="px-6 py-3 text-right">Aksi</th></tr></thead>
          <tbody>
            <tr v-for="j in jobCrud.items.value" :key="(j as any).id" class="border-t border-[#eef2f5] hover:bg-[#f8fbff]">
              <td class="px-6 py-3 font-semibold text-[#071b3a]">{{ (j as any).title }}</td>
              <td class="px-6 py-3 text-[#4c6387]">{{ empType((j as any).employment_type) }}</td>
              <td class="px-6 py-3 text-[#4c6387]">{{ (j as any).deadline?.split('T')[0] || '-' }}</td>
              <td class="px-6 py-3"><UiAppBadge :variant="statusV((j as any).status) as any">{{ (j as any).status }}</UiAppBadge></td>
              <td class="px-6 py-3"><div class="flex items-center justify-end gap-1"><button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#0d6dff] hover:bg-[#e7f1ff]" @click="openEditJob(j as any)"><Pencil class="h-4 w-4" /></button><button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#ef233c] hover:bg-red-50" @click="activeTab='jobs';confirmDelete((j as any).id)"><Trash2 class="h-4 w-4" /></button></div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="activeTab === 'apps'" class="rounded-xl border border-[#d9e6f5] bg-white shadow-card overflow-hidden">
      <div class="flex items-center justify-between border-b border-[#eef2f5] px-6 py-4"><span class="text-sm font-semibold text-[#071b3a]">Daftar Lamaran</span><button class="flex h-9 items-center gap-2 rounded-lg bg-[#0d6dff] px-4 text-[13px] font-semibold text-white" @click="openCreateApp"><Plus class="h-4 w-4" /> Tambah</button></div>
      <div v-if="appCrud.loading.value" class="flex items-center justify-center py-20"><div class="h-8 w-8 animate-spin rounded-full border-[3px] border-[#0d6dff] border-t-transparent" /></div>
      <div v-else-if="appCrud.items.value.length === 0" class="flex flex-col items-center justify-center py-20 text-[#6680a7]"><SearchIcon class="h-12 w-12 mb-3 opacity-40" /><p class="text-sm">Belum ada lamaran.</p></div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-[13px]">
          <thead class="bg-[#fafcff] text-[12px] font-semibold text-[#6680a7] uppercase tracking-wider"><tr><th class="px-6 py-3">Nama</th><th class="px-6 py-3">Email</th><th class="px-6 py-3">Telepon</th><th class="px-6 py-3">Status</th><th class="px-6 py-3 text-right">Aksi</th></tr></thead>
          <tbody>
            <tr v-for="a in appCrud.items.value" :key="(a as any).id" class="border-t border-[#eef2f5] hover:bg-[#f8fbff]">
              <td class="px-6 py-3 font-semibold text-[#071b3a]">{{ (a as any).applicant_name }}</td>
              <td class="px-6 py-3 text-[#4c6387]">{{ (a as any).applicant_email }}</td>
              <td class="px-6 py-3 text-[#4c6387]">{{ (a as any).applicant_phone || '-' }}</td>
              <td class="px-6 py-3"><UiAppBadge :variant="statusV((a as any).status) as any">{{ (a as any).status }}</UiAppBadge></td>
              <td class="px-6 py-3"><div class="flex items-center justify-end gap-1"><button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#0d6dff] hover:bg-[#e7f1ff]" @click="openEditApp(a as any)"><Pencil class="h-4 w-4" /></button><button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#ef233c] hover:bg-red-50" @click="activeTab='apps';confirmDelete((a as any).id)"><Trash2 class="h-4 w-4" /></button></div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <UiAppModal :show="showModal" :title="editId ? 'Edit Lowongan' : 'Tambah Lowongan'" max-width="max-w-2xl" @close="showModal = false">
      <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="saveJob">
        <label class="block sm:col-span-2"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Judul</span><UiAppInput v-model="jobForm.title" placeholder="Software Engineer" /></label>
        <label class="block sm:col-span-2"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Deskripsi</span><UiAppInput v-model="jobForm.description" placeholder="Deskripsi lowongan" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Tipe</span>
          <UiAppSelect v-model="jobForm.employment_type" :options="[{label:'Full Time',value:'full_time'},{label:'Part Time',value:'part_time'},{label:'Kontrak',value:'contract'},{label:'Magang',value:'intern'}]" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Lokasi</span><UiAppInput v-model="jobForm.location" placeholder="Jakarta" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Deadline</span><UiAppDatePicker v-model="jobForm.deadline" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Status</span>
          <UiAppSelect v-model="jobForm.status" :options="[{label:'Draft',value:'draft'},{label:'Open',value:'open'},{label:'Closed',value:'closed'},{label:'Filled',value:'filled'}]" /></label>
        <div class="sm:col-span-2 flex justify-end gap-3 pt-2">
          <button type="button" class="h-10 rounded-lg border border-[#d9e6f5] bg-white px-5 text-sm font-semibold text-[#4c6387]" @click="showModal = false">Batal</button>
          <button type="submit" :disabled="jobCrud.saving.value" class="h-10 rounded-lg bg-gradient-to-r from-[#0d6dff] to-[#0045bd] px-6 text-sm font-semibold text-white shadow-btn-blue transition disabled:opacity-50">{{ jobCrud.saving.value ? 'Menyimpan...' : 'Simpan' }}</button>
        </div>
      </form>
    </UiAppModal>

    <UiAppModal :show="showAppModal" :title="appEditId ? 'Edit Lamaran' : 'Tambah Lamaran'" @close="showAppModal = false">
      <form class="space-y-4" @submit.prevent="saveApp">
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">ID Lowongan</span><UiAppInput v-model="appForm.job_posting_id" type="number" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Nama</span><UiAppInput v-model="appForm.applicant_name" placeholder="Nama pelamar" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Email</span><UiAppInput v-model="appForm.applicant_email" type="email" placeholder="email@example.com" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Telepon</span><UiAppInput v-model="appForm.applicant_phone" placeholder="08xxxxxxxxxx" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Status</span>
          <UiAppSelect v-model="appForm.status" :options="[{label:'Applied',value:'applied'},{label:'Screening',value:'screening'},{label:'Interview',value:'interview'},{label:'Offered',value:'offered'},{label:'Hired',value:'hired'},{label:'Rejected',value:'rejected'}]" /></label>
        <div class="flex justify-end gap-3 pt-2">
          <button type="button" class="h-10 rounded-lg border border-[#d9e6f5] bg-white px-5 text-sm font-semibold text-[#4c6387]" @click="showAppModal = false">Batal</button>
          <button type="submit" :disabled="appCrud.saving.value" class="h-10 rounded-lg bg-gradient-to-r from-[#0d6dff] to-[#0045bd] px-6 text-sm font-semibold text-white shadow-btn-blue transition disabled:opacity-50">{{ appCrud.saving.value ? 'Menyimpan...' : 'Simpan' }}</button>
        </div>
      </form>
    </UiAppModal>

    <UiAppModal :show="showDelete" title="Hapus Data" @close="showDelete = false">
      <p class="text-sm text-[#4c6387]">Yakin ingin menghapus data ini?</p>
      <template #footer><button class="h-10 rounded-lg border border-[#d9e6f5] bg-white px-5 text-sm font-semibold text-[#4c6387]" @click="showDelete = false">Batal</button><button class="h-10 rounded-lg bg-[#ef233c] px-5 text-sm font-semibold text-white" @click="doDelete">Hapus</button></template>
    </UiAppModal>
  </div>
</template>
