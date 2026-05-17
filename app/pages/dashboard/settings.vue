<script setup lang="ts">
import { Plus, Pencil, Trash2, Settings as SettingsIcon, Shield, Clock3 } from 'lucide-vue-next'
import { definePageMeta, ref, onMounted } from '#imports'
import { useCrud } from '~/composables/useCrud'
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const roleCrud = useCrud<{id:number;name:string;guard_name:string;permissions?:any[]}>({ resource: 'roles' })
const permCrud = useCrud<{id:number;name:string}>({ resource: 'permissions', perPage: 100 })
const schedCrud = useCrud<{id:number;name:string;clock_in_time:string;clock_out_time:string;late_tolerance_minutes:number;is_flexible:boolean}>({ resource: 'work-schedules' })
const leaveTCrud = useCrud<{id:number;code:string;name:string;annual_quota:number;is_paid:boolean;is_active:boolean}>({ resource: 'leave-types' })
const activeTab = ref<'roles'|'schedules'|'leave-types'>('roles')

// Role form
const showRoleModal = ref(false); const roleEditId = ref<number|null>(null)
const roleForm = ref({ name: '', guard_name: 'web', permissions: [] as string[] })
function openCreateRole() { roleForm.value = { name: '', guard_name: 'web', permissions: [] }; roleEditId.value = null; showRoleModal.value = true }
function openEditRole(r: any) { roleEditId.value = r.id; roleForm.value = { name: r.name, guard_name: r.guard_name, permissions: r.permissions?.map((p:any) => p.name) || [] }; showRoleModal.value = true }
async function saveRole() { if (roleEditId.value) await roleCrud.updateItem(roleEditId.value, roleForm.value); else await roleCrud.createItem(roleForm.value); showRoleModal.value = false; await roleCrud.fetchItems() }

// Schedule form
const showSchedModal = ref(false); const schedEditId = ref<number|null>(null)
const schedForm = ref({ name: '', clock_in_time: '08:00', clock_out_time: '17:00', late_tolerance_minutes: '15', is_flexible: false })
function openCreateSched() { schedForm.value = { name: '', clock_in_time: '08:00', clock_out_time: '17:00', late_tolerance_minutes: '15', is_flexible: false }; schedEditId.value = null; showSchedModal.value = true }
function openEditSched(s: any) { schedEditId.value = s.id; schedForm.value = { name: s.name, clock_in_time: s.clock_in_time, clock_out_time: s.clock_out_time, late_tolerance_minutes: String(s.late_tolerance_minutes), is_flexible: s.is_flexible }; showSchedModal.value = true }
async function saveSched() { const data = { ...schedForm.value, late_tolerance_minutes: Number(schedForm.value.late_tolerance_minutes) }; if (schedEditId.value) await schedCrud.updateItem(schedEditId.value, data); else await schedCrud.createItem(data); showSchedModal.value = false; await schedCrud.fetchItems() }

// Leave type form
const showLTModal = ref(false); const ltEditId = ref<number|null>(null)
const ltForm = ref({ code: '', name: '', annual_quota: '12', requires_attachment: false, is_paid: true })
function openCreateLT() { ltForm.value = { code: '', name: '', annual_quota: '12', requires_attachment: false, is_paid: true }; ltEditId.value = null; showLTModal.value = true }
function openEditLT(t: any) { ltEditId.value = t.id; ltForm.value = { code: t.code, name: t.name, annual_quota: String(t.annual_quota), requires_attachment: t.requires_attachment, is_paid: t.is_paid }; showLTModal.value = true }
async function saveLT() { const data = { ...ltForm.value, annual_quota: Number(ltForm.value.annual_quota) }; if (ltEditId.value) await leaveTCrud.updateItem(ltEditId.value, data); else await leaveTCrud.createItem(data); showLTModal.value = false; await leaveTCrud.fetchItems() }

const showDelete = ref(false); const deleteId = ref<number|null>(null)
async function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
async function doDelete() {
  if (!deleteId.value) return
  if (activeTab.value === 'roles') await roleCrud.deleteItem(deleteId.value)
  else if (activeTab.value === 'schedules') await schedCrud.deleteItem(deleteId.value)
  else await leaveTCrud.deleteItem(deleteId.value)
  showDelete.value = false
  if (activeTab.value === 'roles') await roleCrud.fetchItems()
  else if (activeTab.value === 'schedules') await schedCrud.fetchItems()
  else await leaveTCrud.fetchItems()
}

onMounted(async () => { await roleCrud.fetchItems(); await permCrud.fetchItems(1, {}); await schedCrud.fetchItems(); await leaveTCrud.fetchItems() })
</script>
<template>
  <div class="space-y-6 mt-6">
    <div><h1 class="text-2xl font-bold text-[#071b3a]">Pengaturan</h1><p class="mt-1 text-sm text-[#6680a7]">Kelola roles, jadwal kerja, dan tipe cuti.</p></div>
    <div class="flex gap-2 flex-wrap">
      <button :class="['h-10 rounded-lg px-5 text-sm font-semibold transition', activeTab === 'roles' ? 'bg-[#0d6dff] text-white' : 'border border-[#d9e6f5] bg-white text-[#4c6387] hover:bg-[#f3f8ff]']" @click="activeTab = 'roles'">Roles</button>
      <button :class="['h-10 rounded-lg px-5 text-sm font-semibold transition', activeTab === 'schedules' ? 'bg-[#0d6dff] text-white' : 'border border-[#d9e6f5] bg-white text-[#4c6387] hover:bg-[#f3f8ff]']" @click="activeTab = 'schedules'">Jadwal Kerja</button>
      <button :class="['h-10 rounded-lg px-5 text-sm font-semibold transition', activeTab === 'leave-types' ? 'bg-[#0d6dff] text-white' : 'border border-[#d9e6f5] bg-white text-[#4c6387] hover:bg-[#f3f8ff]']" @click="activeTab = 'leave-types'">Tipe Cuti</button>
    </div>

    <!-- Roles -->
    <div v-if="activeTab === 'roles'" class="rounded-xl border border-[#d9e6f5] bg-white shadow-card overflow-hidden">
      <div class="flex items-center justify-between border-b border-[#eef2f5] px-6 py-4"><span class="text-sm font-semibold text-[#071b3a]">Roles</span><button class="flex h-9 items-center gap-2 rounded-lg bg-[#0d6dff] px-4 text-[13px] font-semibold text-white" @click="openCreateRole"><Plus class="h-4 w-4" /> Tambah</button></div>
      <div v-if="roleCrud.loading.value" class="flex items-center justify-center py-20"><div class="h-8 w-8 animate-spin rounded-full border-[3px] border-[#0d6dff] border-t-transparent" /></div>
      <div v-else-if="roleCrud.items.value.length === 0" class="flex flex-col items-center justify-center py-20 text-[#6680a7]"><Shield class="h-12 w-12 mb-3 opacity-40" /><p class="text-sm">Belum ada role.</p></div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-[13px]">
          <thead class="bg-[#fafcff] text-[12px] font-semibold text-[#6680a7] uppercase tracking-wider"><tr><th class="px-6 py-3">Nama</th><th class="px-6 py-3">Guard</th><th class="px-6 py-3 text-right">Aksi</th></tr></thead>
          <tbody>
            <tr v-for="r in roleCrud.items.value" :key="(r as any).id" class="border-t border-[#eef2f5] hover:bg-[#f8fbff]">
              <td class="px-6 py-3 font-semibold text-[#071b3a]">{{ (r as any).name }}</td>
              <td class="px-6 py-3 text-[#4c6387]">{{ (r as any).guard_name }}</td>
              <td class="px-6 py-3"><div class="flex items-center justify-end gap-1"><button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#0d6dff] hover:bg-[#e7f1ff]" @click="openEditRole(r)"><Pencil class="h-4 w-4" /></button><button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#ef233c] hover:bg-red-50" @click="activeTab='roles';confirmDelete((r as any).id)"><Trash2 class="h-4 w-4" /></button></div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Schedules -->
    <div v-if="activeTab === 'schedules'" class="rounded-xl border border-[#d9e6f5] bg-white shadow-card overflow-hidden">
      <div class="flex items-center justify-between border-b border-[#eef2f5] px-6 py-4"><span class="text-sm font-semibold text-[#071b3a]">Jadwal Kerja</span><button class="flex h-9 items-center gap-2 rounded-lg bg-[#0d6dff] px-4 text-[13px] font-semibold text-white" @click="openCreateSched"><Plus class="h-4 w-4" /> Tambah</button></div>
      <div v-if="schedCrud.loading.value" class="flex items-center justify-center py-20"><div class="h-8 w-8 animate-spin rounded-full border-[3px] border-[#0d6dff] border-t-transparent" /></div>
      <div v-else-if="schedCrud.items.value.length === 0" class="flex flex-col items-center justify-center py-20 text-[#6680a7]"><Clock3 class="h-12 w-12 mb-3 opacity-40" /><p class="text-sm">Belum ada jadwal kerja.</p></div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-[13px]">
          <thead class="bg-[#fafcff] text-[12px] font-semibold text-[#6680a7] uppercase tracking-wider"><tr><th class="px-6 py-3">Nama</th><th class="px-6 py-3">Masuk</th><th class="px-6 py-3">Pulang</th><th class="px-6 py-3">Toleransi</th><th class="px-6 py-3 text-right">Aksi</th></tr></thead>
          <tbody>
            <tr v-for="s in schedCrud.items.value" :key="(s as any).id" class="border-t border-[#eef2f5] hover:bg-[#f8fbff]">
              <td class="px-6 py-3 font-semibold text-[#071b3a]">{{ (s as any).name }}</td>
              <td class="px-6 py-3 text-[#4c6387]">{{ (s as any).clock_in_time }}</td>
              <td class="px-6 py-3 text-[#4c6387]">{{ (s as any).clock_out_time }}</td>
              <td class="px-6 py-3 text-[#4c6387]">{{ (s as any).late_tolerance_minutes }} menit</td>
              <td class="px-6 py-3"><div class="flex items-center justify-end gap-1"><button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#0d6dff] hover:bg-[#e7f1ff]" @click="openEditSched(s)"><Pencil class="h-4 w-4" /></button><button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#ef233c] hover:bg-red-50" @click="activeTab='schedules';confirmDelete((s as any).id)"><Trash2 class="h-4 w-4" /></button></div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Leave Types -->
    <div v-if="activeTab === 'leave-types'" class="rounded-xl border border-[#d9e6f5] bg-white shadow-card overflow-hidden">
      <div class="flex items-center justify-between border-b border-[#eef2f5] px-6 py-4"><span class="text-sm font-semibold text-[#071b3a]">Tipe Cuti</span><button class="flex h-9 items-center gap-2 rounded-lg bg-[#0d6dff] px-4 text-[13px] font-semibold text-white" @click="openCreateLT"><Plus class="h-4 w-4" /> Tambah</button></div>
      <div v-if="leaveTCrud.loading.value" class="flex items-center justify-center py-20"><div class="h-8 w-8 animate-spin rounded-full border-[3px] border-[#0d6dff] border-t-transparent" /></div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-[13px]">
          <thead class="bg-[#fafcff] text-[12px] font-semibold text-[#6680a7] uppercase tracking-wider"><tr><th class="px-6 py-3">Kode</th><th class="px-6 py-3">Nama</th><th class="px-6 py-3">Kuota/Tahun</th><th class="px-6 py-3">Berbayar</th><th class="px-6 py-3 text-right">Aksi</th></tr></thead>
          <tbody>
            <tr v-for="t in leaveTCrud.items.value" :key="(t as any).id" class="border-t border-[#eef2f5] hover:bg-[#f8fbff]">
              <td class="px-6 py-3 font-mono text-[#0d6dff] font-semibold">{{ (t as any).code }}</td>
              <td class="px-6 py-3 font-semibold text-[#071b3a]">{{ (t as any).name }}</td>
              <td class="px-6 py-3 text-[#4c6387]">{{ (t as any).annual_quota }} hari</td>
              <td class="px-6 py-3"><UiAppBadge :variant="(t as any).is_paid ? 'success' : 'danger'">{{ (t as any).is_paid ? 'Ya' : 'Tidak' }}</UiAppBadge></td>
              <td class="px-6 py-3"><div class="flex items-center justify-end gap-1"><button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#0d6dff] hover:bg-[#e7f1ff]" @click="openEditLT(t)"><Pencil class="h-4 w-4" /></button><button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#ef233c] hover:bg-red-50" @click="activeTab='leave-types';confirmDelete((t as any).id)"><Trash2 class="h-4 w-4" /></button></div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modals -->
    <UiAppModal :show="showRoleModal" :title="roleEditId ? 'Edit Role' : 'Tambah Role'" @close="showRoleModal = false">
      <form class="space-y-4" @submit.prevent="saveRole">
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Nama Role</span><UiAppInput v-model="roleForm.name" placeholder="admin" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Hak Akses (Permissions)</span>
          <UiAppSelect v-model="roleForm.permissions" mode="tags" :options="permCrud.items.value.map(p => ({ label: p.name, value: p.name }))" placeholder="Pilih hak akses..." />
        </label>
        <div class="flex justify-end gap-3 pt-2"><button type="button" class="h-10 rounded-lg border border-[#d9e6f5] bg-white px-5 text-sm font-semibold text-[#4c6387]" @click="showRoleModal = false">Batal</button><button type="submit" class="h-10 rounded-lg bg-[#0d6dff] px-6 text-sm font-semibold text-white">Simpan</button></div>
      </form>
    </UiAppModal>

    <UiAppModal :show="showSchedModal" :title="schedEditId ? 'Edit Jadwal' : 'Tambah Jadwal'" @close="showSchedModal = false">
      <form class="space-y-4" @submit.prevent="saveSched">
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Nama</span><UiAppInput v-model="schedForm.name" placeholder="Shift Pagi" /></label>
        <div class="grid grid-cols-2 gap-4">
          <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Masuk</span><UiAppInput v-model="schedForm.clock_in_time" type="time" /></label>
          <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Pulang</span><UiAppInput v-model="schedForm.clock_out_time" type="time" /></label>
        </div>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Toleransi (menit)</span><UiAppInput v-model="schedForm.late_tolerance_minutes" type="number" /></label>
        <div class="flex justify-end gap-3 pt-2"><button type="button" class="h-10 rounded-lg border border-[#d9e6f5] bg-white px-5 text-sm font-semibold text-[#4c6387]" @click="showSchedModal = false">Batal</button><button type="submit" class="h-10 rounded-lg bg-[#0d6dff] px-6 text-sm font-semibold text-white">Simpan</button></div>
      </form>
    </UiAppModal>

    <UiAppModal :show="showLTModal" :title="ltEditId ? 'Edit Tipe Cuti' : 'Tambah Tipe Cuti'" @close="showLTModal = false">
      <form class="space-y-4" @submit.prevent="saveLT">
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Kode</span><UiAppInput v-model="ltForm.code" placeholder="CT" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Nama</span><UiAppInput v-model="ltForm.name" placeholder="Cuti Tahunan" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Kuota per Tahun</span><UiAppInput v-model="ltForm.annual_quota" type="number" /></label>
        <div class="flex justify-end gap-3 pt-2"><button type="button" class="h-10 rounded-lg border border-[#d9e6f5] bg-white px-5 text-sm font-semibold text-[#4c6387]" @click="showLTModal = false">Batal</button><button type="submit" class="h-10 rounded-lg bg-[#0d6dff] px-6 text-sm font-semibold text-white">Simpan</button></div>
      </form>
    </UiAppModal>

    <UiAppModal :show="showDelete" title="Hapus Data" @close="showDelete = false">
      <p class="text-sm text-[#4c6387]">Yakin ingin menghapus data ini?</p>
      <template #footer><button class="h-10 rounded-lg border border-[#d9e6f5] bg-white px-5 text-sm font-semibold text-[#4c6387]" @click="showDelete = false">Batal</button><button class="h-10 rounded-lg bg-[#ef233c] px-5 text-sm font-semibold text-white" @click="doDelete">Hapus</button></template>
    </UiAppModal>
  </div>
</template>
