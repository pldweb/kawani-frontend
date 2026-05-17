<script setup lang="ts">
import { Plus, Pencil, Trash2, WalletCards } from 'lucide-vue-next'
import { definePageMeta, ref, onMounted } from '#imports'
import { useCrud } from '~/composables/useCrud'
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
interface PayPeriod { id: number; name: string; month: number; year: number; start_date: string; end_date: string; payment_date: string | null; status: string }
const { items, loading, saving, pagination, fetchItems, createItem, updateItem, deleteItem } = useCrud<PayPeriod>({ resource: 'payroll-periods' })
const salCrud = useCrud<{id:number;code:string;name:string;type:string;default_amount:number|null;is_active:boolean}>({ resource: 'salary-components' })
const activeTab = ref<'periods'|'components'>('periods')
const showModal = ref(false); const showDelete = ref(false); const editId = ref<number|null>(null); const deleteId = ref<number|null>(null)
const periodForm = ref({ name: '', month: '', year: '', start_date: '', end_date: '', payment_date: '', status: 'draft' })
const compForm = ref({ code: '', name: '', type: 'earning', calculation_type: 'fixed', default_amount: '', is_taxable: false })
const showCompModal = ref(false); const compEditId = ref<number|null>(null)

function resetPeriod() { periodForm.value = { name: '', month: '', year: '', start_date: '', end_date: '', payment_date: '', status: 'draft' }; editId.value = null }
function openCreatePeriod() { resetPeriod(); showModal.value = true }
function openEditPeriod(i: PayPeriod) { editId.value = i.id; periodForm.value = { name: i.name, month: String(i.month), year: String(i.year), start_date: i.start_date?.split('T')[0]||'', end_date: i.end_date?.split('T')[0]||'', payment_date: i.payment_date?.split('T')[0]||'', status: i.status }; showModal.value = true }
async function savePeriod() { const data = { ...periodForm.value, month: Number(periodForm.value.month), year: Number(periodForm.value.year) }; if (editId.value) await updateItem(editId.value, data); else await createItem(data); showModal.value = false; await fetchItems(pagination.value.current_page) }

function resetComp() { compForm.value = { code: '', name: '', type: 'earning', calculation_type: 'fixed', default_amount: '', is_taxable: false }; compEditId.value = null }
function openCreateComp() { resetComp(); showCompModal.value = true }
function openEditComp(i: any) { compEditId.value = i.id; compForm.value = { code: i.code, name: i.name, type: i.type, calculation_type: i.calculation_type || 'fixed', default_amount: String(i.default_amount || ''), is_taxable: i.is_taxable }; showCompModal.value = true }
async function saveComp() { const data = { ...compForm.value, default_amount: compForm.value.default_amount ? Number(compForm.value.default_amount) : null }; if (compEditId.value) await salCrud.updateItem(compEditId.value, data as any); else await salCrud.createItem(data as any); showCompModal.value = false; await salCrud.fetchItems() }

async function confirmDelete(id: number) { deleteId.value = id; showDelete.value = true }
async function doDelete() { if (!deleteId.value) return; if (activeTab.value === 'periods') await deleteItem(deleteId.value); else await salCrud.deleteItem(deleteId.value); showDelete.value = false; if (activeTab.value === 'periods') await fetchItems(pagination.value.current_page); else await salCrud.fetchItems() }

function statusV(s: string) { return { draft: 'default', processing: 'warning', finalized: 'info', paid: 'success' }[s] || 'default' }
function typeV(s: string) { return { earning: 'success', deduction: 'danger', benefit: 'info', tax: 'warning' }[s] || 'default' }
function typeL(s: string) { return { earning: 'Pendapatan', deduction: 'Potongan', benefit: 'Tunjangan', tax: 'Pajak' }[s] || s }

onMounted(async () => { await fetchItems(); await salCrud.fetchItems() })
</script>
<template>
  <div class="space-y-6 mt-6">
    <div><h1 class="text-2xl font-bold text-[#071b3a]">Payroll</h1><p class="mt-1 text-sm text-[#6680a7]">Kelola periode penggajian dan komponen gaji.</p></div>

    <div class="flex gap-2">
      <button :class="['h-10 rounded-lg px-5 text-sm font-semibold transition', activeTab === 'periods' ? 'bg-[#0d6dff] text-white' : 'border border-[#d9e6f5] bg-white text-[#4c6387] hover:bg-[#f3f8ff]']" @click="activeTab = 'periods'">Periode Payroll</button>
      <button :class="['h-10 rounded-lg px-5 text-sm font-semibold transition', activeTab === 'components' ? 'bg-[#0d6dff] text-white' : 'border border-[#d9e6f5] bg-white text-[#4c6387] hover:bg-[#f3f8ff]']" @click="activeTab = 'components'">Komponen Gaji</button>
    </div>

    <!-- Periods -->
    <div v-if="activeTab === 'periods'" class="rounded-xl border border-[#d9e6f5] bg-white shadow-card overflow-hidden">
      <div class="flex items-center justify-between border-b border-[#eef2f5] px-6 py-4">
        <span class="text-sm font-semibold text-[#071b3a]">Periode Payroll</span>
        <button class="flex h-9 items-center gap-2 rounded-lg bg-[#0d6dff] px-4 text-[13px] font-semibold text-white hover:opacity-90 transition" @click="openCreatePeriod"><Plus class="h-4 w-4" /> Tambah</button>
      </div>
      <div v-if="loading" class="flex items-center justify-center py-20"><div class="h-8 w-8 animate-spin rounded-full border-[3px] border-[#0d6dff] border-t-transparent" /></div>
      <div v-else-if="items.length === 0" class="flex flex-col items-center justify-center py-20 text-[#6680a7]"><WalletCards class="h-12 w-12 mb-3 opacity-40" /><p class="text-sm font-medium">Belum ada periode payroll.</p></div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-[13px]">
          <thead class="bg-[#fafcff] text-[12px] font-semibold text-[#6680a7] uppercase tracking-wider"><tr><th class="px-6 py-3">Nama</th><th class="px-6 py-3">Bulan/Tahun</th><th class="px-6 py-3">Periode</th><th class="px-6 py-3">Status</th><th class="px-6 py-3 text-right">Aksi</th></tr></thead>
          <tbody>
            <tr v-for="p in items" :key="p.id" class="border-t border-[#eef2f5] hover:bg-[#f8fbff]">
              <td class="px-6 py-3 font-semibold text-[#071b3a]">{{ p.name }}</td>
              <td class="px-6 py-3 text-[#4c6387]">{{ p.month }}/{{ p.year }}</td>
              <td class="px-6 py-3 text-[#4c6387]">{{ p.start_date?.split('T')[0] }} — {{ p.end_date?.split('T')[0] }}</td>
              <td class="px-6 py-3"><UiAppBadge :variant="statusV(p.status) as any">{{ p.status }}</UiAppBadge></td>
              <td class="px-6 py-3"><div class="flex items-center justify-end gap-1"><button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#0d6dff] hover:bg-[#e7f1ff]" @click="openEditPeriod(p)"><Pencil class="h-4 w-4" /></button><button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#ef233c] hover:bg-red-50" @click="confirmDelete(p.id)"><Trash2 class="h-4 w-4" /></button></div></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 pb-4"><UiAppPagination :current-page="pagination.current_page" :last-page="pagination.last_page" :total="pagination.total" @update:current-page="fetchItems($event)" /></div>
    </div>

    <!-- Components -->
    <div v-if="activeTab === 'components'" class="rounded-xl border border-[#d9e6f5] bg-white shadow-card overflow-hidden">
      <div class="flex items-center justify-between border-b border-[#eef2f5] px-6 py-4">
        <span class="text-sm font-semibold text-[#071b3a]">Komponen Gaji</span>
        <button class="flex h-9 items-center gap-2 rounded-lg bg-[#0d6dff] px-4 text-[13px] font-semibold text-white hover:opacity-90 transition" @click="openCreateComp"><Plus class="h-4 w-4" /> Tambah</button>
      </div>
      <div v-if="salCrud.loading.value" class="flex items-center justify-center py-20"><div class="h-8 w-8 animate-spin rounded-full border-[3px] border-[#0d6dff] border-t-transparent" /></div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-[13px]">
          <thead class="bg-[#fafcff] text-[12px] font-semibold text-[#6680a7] uppercase tracking-wider"><tr><th class="px-6 py-3">Kode</th><th class="px-6 py-3">Nama</th><th class="px-6 py-3">Tipe</th><th class="px-6 py-3">Jumlah Default</th><th class="px-6 py-3 text-right">Aksi</th></tr></thead>
          <tbody>
            <tr v-for="c in salCrud.items.value" :key="(c as any).id" class="border-t border-[#eef2f5] hover:bg-[#f8fbff]">
              <td class="px-6 py-3 font-mono text-[#0d6dff] font-semibold">{{ (c as any).code }}</td>
              <td class="px-6 py-3 font-semibold text-[#071b3a]">{{ (c as any).name }}</td>
              <td class="px-6 py-3"><UiAppBadge :variant="typeV((c as any).type) as any">{{ typeL((c as any).type) }}</UiAppBadge></td>
              <td class="px-6 py-3 text-[#4c6387]">{{ (c as any).default_amount ? Number((c as any).default_amount).toLocaleString('id-ID') : '-' }}</td>
              <td class="px-6 py-3"><div class="flex items-center justify-end gap-1"><button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#0d6dff] hover:bg-[#e7f1ff]" @click="openEditComp(c)"><Pencil class="h-4 w-4" /></button><button class="flex h-8 w-8 items-center justify-center rounded-lg text-[#ef233c] hover:bg-red-50" @click="activeTab = 'components'; confirmDelete((c as any).id)"><Trash2 class="h-4 w-4" /></button></div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <UiAppModal :show="showModal" :title="editId ? 'Edit Periode' : 'Tambah Periode'" @close="showModal = false">
      <form class="space-y-4" @submit.prevent="savePeriod">
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Nama</span><UiAppInput v-model="periodForm.name" placeholder="Payroll Mei 2024" /></label>
        <div class="grid grid-cols-2 gap-4">
          <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Bulan</span><UiAppInput v-model="periodForm.month" type="number" placeholder="5" /></label>
          <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Tahun</span><UiAppInput v-model="periodForm.year" type="number" placeholder="2024" /></label>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Mulai</span><UiAppDatePicker v-model="periodForm.start_date" /></label>
          <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Selesai</span><UiAppDatePicker v-model="periodForm.end_date" /></label>
        </div>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Status</span>
          <UiAppSelect v-model="periodForm.status" :options="[{label:'Draft',value:'draft'},{label:'Processing',value:'processing'},{label:'Finalized',value:'finalized'},{label:'Paid',value:'paid'}]" /></label>
        <div class="flex justify-end gap-3 pt-2">
          <button type="button" class="h-10 rounded-lg border border-[#d9e6f5] bg-white px-5 text-sm font-semibold text-[#4c6387]" @click="showModal = false">Batal</button>
          <button type="submit" :disabled="saving" class="h-10 rounded-lg bg-gradient-to-r from-[#0d6dff] to-[#0045bd] px-6 text-sm font-semibold text-white shadow-btn-blue transition disabled:opacity-50">{{ saving ? 'Menyimpan...' : 'Simpan' }}</button>
        </div>
      </form>
    </UiAppModal>

    <UiAppModal :show="showCompModal" :title="compEditId ? 'Edit Komponen' : 'Tambah Komponen'" @close="showCompModal = false">
      <form class="space-y-4" @submit.prevent="saveComp">
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Kode</span><UiAppInput v-model="compForm.code" placeholder="BASIC" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Nama</span><UiAppInput v-model="compForm.name" placeholder="Gaji Pokok" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Tipe</span>
          <UiAppSelect v-model="compForm.type" :options="[{label:'Pendapatan',value:'earning'},{label:'Potongan',value:'deduction'},{label:'Tunjangan',value:'benefit'},{label:'Pajak',value:'tax'}]" /></label>
        <label class="block"><span class="mb-1 block text-sm font-semibold text-[#071b3a]">Jumlah Default</span><UiAppInput v-model="compForm.default_amount" type="number" placeholder="5000000" /></label>
        <div class="flex justify-end gap-3 pt-2">
          <button type="button" class="h-10 rounded-lg border border-[#d9e6f5] bg-white px-5 text-sm font-semibold text-[#4c6387]" @click="showCompModal = false">Batal</button>
          <button type="submit" :disabled="salCrud.saving.value" class="h-10 rounded-lg bg-gradient-to-r from-[#0d6dff] to-[#0045bd] px-6 text-sm font-semibold text-white shadow-btn-blue transition disabled:opacity-50">{{ salCrud.saving.value ? 'Menyimpan...' : 'Simpan' }}</button>
        </div>
      </form>
    </UiAppModal>

    <UiAppModal :show="showDelete" title="Hapus Data" @close="showDelete = false">
      <p class="text-sm text-[#4c6387]">Yakin ingin menghapus data ini?</p>
      <template #footer><button class="h-10 rounded-lg border border-[#d9e6f5] bg-white px-5 text-sm font-semibold text-[#4c6387]" @click="showDelete = false">Batal</button><button class="h-10 rounded-lg bg-[#ef233c] px-5 text-sm font-semibold text-white" @click="doDelete">Hapus</button></template>
    </UiAppModal>
  </div>
</template>
