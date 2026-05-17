<script setup lang="ts">
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  CalendarRange,
  ChevronDown,
  Clock3,
  Gift,
  Minus,
  Network,
  UserCheck,
  UserRound,
  UserRoundCheck,
  UserRoundX,
  Users,
  PlusCircle,
  FileCheck,
  Megaphone,
  Briefcase,
  Wallet,
  Activity,
  FileText
} from 'lucide-vue-next'
import { computed, definePageMeta, useAsyncData, useNuxtApp } from '#imports'
import type { ApiEnvelope, DashboardSummary } from '~/types/api'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { $api } = useNuxtApp()

const { data } = await useAsyncData('dashboard-summary', async () => {
  try {
    const response = await $api.get<ApiEnvelope<DashboardSummary>>('/dashboard/summary')
    return response.data.data
  } catch {
    return null
  }
})

const trendFilter = ref('6m')

const totalEmployees = computed(() => data.value?.metrics?.total_employees || 0)
const activeEmployees = computed(() => data.value?.metrics?.active_employees || 0)

const metricCards = computed(() => [
  {
    label: 'Total Karyawan',
    value: totalEmployees.value.toLocaleString('id-ID'),
    unit: 'Orang',
    icon: Users,
    trend: 'Total data',
    trendTone: 'flat'
  },
  {
    label: 'Departemen',
    value: String(data.value?.metrics?.departments_count || 0),
    unit: 'Departemen',
    icon: Network,
    trend: 'Aktif',
    trendTone: 'flat'
  },
  {
    label: 'Karyawan Aktif',
    value: activeEmployees.value.toLocaleString('id-ID'),
    unit: 'Orang',
    icon: UserRound,
    trend: 'Status Aktif',
    trendTone: 'flat'
  },
  {
    label: 'Cuti Pending',
    value: String(data.value?.metrics?.leave_pending || 0),
    unit: 'Pengajuan',
    icon: UserCheck,
    trend: 'Menunggu Persetujuan',
    trendTone: 'pending'
  },
  {
    label: 'Ulang Tahun Bulan Ini',
    value: String(data.value?.metrics?.birthdays_this_month || 0),
    unit: 'Orang',
    icon: CalendarDays,
    trend: 'Bulan Ini',
    trendTone: 'flat'
  }
])

const maxTrendValue = computed(() => {
  if (!data.value?.employee_trend?.length) return 100
  return Math.max(...data.value.employee_trend.map(t => t.value)) * 1.2 || 100
})

const employeeTrend = computed(() => {
  if (!data.value?.employee_trend) return []
  // Map x from 45 to 620, y from 55 to 215 (inverted)
  const count = data.value.employee_trend.length
  return data.value.employee_trend.map((item, idx) => {
    const x = 45 + (575 / (count > 1 ? count - 1 : 1)) * idx
    const y = 215 - ((item.value / maxTrendValue.value) * 160)
    return { ...item, x, y }
  })
})

const linePoints = computed(() => employeeTrend.value.map(item => `${item.x},${item.y}`).join(' '))
const areaPoints = computed(() => `45,215 ${linePoints.value} 620,215`)

const colors = ['#0d6dff', '#277ff8', '#4592fb', '#68a7ff', '#93bdff', '#d7e8ff']

const departments = computed(() => {
  if (!data.value?.departments) return []
  return data.value.departments.map((d, i) => ({
    ...d,
    color: colors[i % colors.length]
  }))
})

const donutGradient = computed(() => {
  if (departments.value.length === 0) return 'conic-gradient(#eef2f5 0 100%)'
  let currentPct = 0
  const stops = departments.value.map(d => {
    const start = currentPct
    currentPct += d.percent
    return `${d.color} ${start}% ${currentPct}%`
  })
  return `conic-gradient(${stops.join(', ')})`
})

const leaveRequests = computed(() => {
  if (!data.value?.recent_leaves) return []
  return data.value.recent_leaves.map(req => ({
    ...req,
    tone: req.status === 'pending' ? 'pending' : (req.status === 'approved' ? 'approved' : 'rejected'),
    status: req.status === 'pending' ? 'Menunggu' : (req.status === 'approved' ? 'Disetujui' : 'Ditolak')
  }))
})

const attendanceData = computed(() => data.value?.attendance || { present: 0, late: 0, leave: 0, absent: 0 })
const totalAttendance = computed(() => activeEmployees.value || 1)
const attendanceRate = computed(() => ((attendanceData.value.present + attendanceData.value.late) / totalAttendance.value * 100).toFixed(1))

const attendance = computed(() => [
  { label: 'Hadir', value: attendanceData.value.present, percent: ((attendanceData.value.present / totalAttendance.value) * 100).toFixed(1) + '%', icon: UserRoundCheck, color: '#10b981', bg: '#dcfce7' },
  { label: 'Terlambat', value: attendanceData.value.late, percent: ((attendanceData.value.late / totalAttendance.value) * 100).toFixed(1) + '%', icon: Clock3, color: '#f97316', bg: '#ffedd5' },
  { label: 'Izin', value: attendanceData.value.leave, percent: ((attendanceData.value.leave / totalAttendance.value) * 100).toFixed(1) + '%', icon: UserCheck, color: '#0d6dff', bg: '#e7f1ff' },
  { label: 'Tidak Hadir', value: attendanceData.value.absent, percent: ((attendanceData.value.absent / totalAttendance.value) * 100).toFixed(1) + '%', icon: UserRoundX, color: '#ef233c', bg: '#ffe4e6' }
])

const quickActions = [
  { label: 'Tambah Karyawan', icon: PlusCircle, color: 'text-blue-600', bg: 'bg-blue-50', to: '/dashboard/employees' },
  { label: 'Input Presensi', icon: Clock3, color: 'text-emerald-600', bg: 'bg-emerald-50', to: '/dashboard/attendance' },
  { label: 'Ajukan Cuti', icon: FileCheck, color: 'text-orange-600', bg: 'bg-orange-50', to: '/dashboard/leave' },
  { label: 'Buat Pengumuman', icon: Megaphone, color: 'text-purple-600', bg: 'bg-purple-50', to: '/dashboard/more-data' }
]

const recentActivities = [
  { user: 'Sistem', action: 'sinkronisasi otomatis', target: 'Data HRIS', time: 'Baru saja', icon: Activity, color: 'text-blue-500' }
]

const announcements = computed(() => data.value?.announcements || [])
const payroll = computed(() => data.value?.payroll)

function statusClasses(tone: string) {
  return {
    pending: 'border-[#ffd99a] bg-[#fff7e8] text-[#d97706]',
    approved: 'border-[#b7f0d0] bg-[#ebfff4] text-[#039b62]',
    rejected: 'border-[#ffc6c9] bg-[#fff0f0] text-[#df2839]',
    urgent: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700'
  }[tone] || ''
}
</script>

<template>
  <div class="space-y-7 mt-6">
    <!-- Header Section -->
    <section class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between animate-fade-in-up stagger-1">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-[#071b3a]">Dashboard</h1>
        <p class="mt-2 text-[15px] text-[#6680a7]">Selamat datang kembali, Admin! Kelola data dan informasi HRIS perusahaan.</p>
      </div>

      <div class="flex h-11 w-fit items-center gap-3 rounded-lg border border-[#d8e5f5] bg-white px-5 text-sm font-semibold text-[#071b3a] shadow-sm">
        <CalendarRange class="h-[18px] w-[18px] text-[#0d6dff]" />
        {{ new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up stagger-2">
      <NuxtLink v-for="action in quickActions" :key="action.label" :to="action.to" class="flex items-center gap-3 rounded-xl border border-white bg-white p-4 shadow-card hover:shadow-card-hover transition-all duration-300 card-hover text-left">
        <div :class="['flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', action.bg, action.color]">
          <component :is="action.icon" class="h-5 w-5" />
        </div>
        <span class="text-sm font-semibold text-[#071b3a]">{{ action.label }}</span>
      </NuxtLink>
    </section>

    <!-- Metric Cards -->
    <section class="grid gap-5 md:grid-cols-2 2xl:grid-cols-5 animate-fade-in-up stagger-3">
      <article v-for="card in metricCards" :key="card.label" class="group rounded-xl border border-[#d9e6f5] bg-white p-5 shadow-card transition-all duration-300 hover:shadow-card-hover">
        <div class="flex gap-4">
          <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0d6dff] to-[#0045bd] text-white shadow-icon-blue transition-transform duration-300 group-hover:scale-110">
            <component :is="card.icon" class="h-7 w-7" />
          </div>
          <div class="min-w-0">
            <p class="text-[14px] font-medium text-[#6680a7]">{{ card.label }}</p>
            <p class="mt-2 text-[26px] font-bold leading-none text-[#071b3a]">{{ card.value }}</p>
            <p class="mt-1.5 text-[13px] text-[#6680a7]">{{ card.unit }}</p>
          </div>
        </div>
        <div class="mt-5 flex items-center gap-2 text-[13px]">
          <ArrowUp v-if="card.trendTone === 'up'" class="h-4 w-4 text-[#10b981]" />
          <ArrowDown v-else-if="card.trendTone === 'down'" class="h-4 w-4 text-[#ef233c]" />
          <Minus v-else-if="card.trendTone === 'flat'" class="h-4 w-4 text-[#6680a7]" />
          <span :class="[
            card.trendTone === 'up' && 'text-[#10b981]',
            card.trendTone === 'down' && 'text-[#ef233c]',
            card.trendTone === 'flat' && 'text-[#6680a7]',
            card.trendTone === 'link' && 'font-semibold text-[#0d6dff] hover:underline cursor-pointer'
          ]">
            {{ card.trend }}
          </span>
        </div>
      </article>
    </section>

    <div class="grid gap-6 xl:grid-cols-3">
      <!-- Main Content Left (Charts & Tables) -->
      <div class="xl:col-span-2 space-y-6">
        
        <!-- Charts Row -->
        <div class="grid gap-6 md:grid-cols-2">
          <!-- Trend Karyawan -->
          <article class="rounded-xl border border-[#d9e6f5] bg-white p-6 shadow-card animate-fade-in-up stagger-4">
            <div class="mb-5 flex items-center justify-between">
              <h2 class="text-base font-bold text-[#071b3a]">Grafik Karyawan</h2>
              <div class="w-32">
                <UiAppSelect v-model="trendFilter" :options="[{label:'6 Bulan',value:'6m'},{label:'1 Tahun',value:'1y'}]" :searchable="false" />
              </div>
            </div>
            <div class="overflow-hidden">
              <svg class="w-full h-full" viewBox="0 0 680 270" fill="none" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
                    <stop stop-color="#0d6dff" stop-opacity="0.2" />
                    <stop offset="1" stop-color="#0d6dff" stop-opacity="0.01" />
                  </linearGradient>
                </defs>
                <g class="text-[13px] text-[#6680a7]">
                  <text x="0" y="62" fill="currentColor">{{ Math.round(maxTrendValue * 0.75) }}</text>
                  <text x="0" y="102" fill="currentColor">{{ Math.round(maxTrendValue * 0.5) }}</text>
                  <text x="0" y="142" fill="currentColor">{{ Math.round(maxTrendValue * 0.25) }}</text>
                  <text x="0" y="182" fill="currentColor">{{ Math.round(maxTrendValue * 0.125) }}</text>
                  <text x="0" y="222" fill="currentColor">0</text>
                </g>
                <g stroke="#f0f4f8" stroke-dasharray="4 4">
                  <line x1="50" y1="55" x2="660" y2="55" />
                  <line x1="50" y1="95" x2="660" y2="95" />
                  <line x1="50" y1="135" x2="660" y2="135" />
                  <line x1="50" y1="175" x2="660" y2="175" />
                  <line x1="50" y1="215" x2="660" y2="215" />
                </g>
                <polygon :points="areaPoints" fill="url(#areaFill)" class="animate-fade-in-up" />
                <polyline :points="linePoints" fill="none" stroke="#0d6dff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                <g v-for="(item, idx) in employeeTrend" :key="item.label" class="animate-scale-in" :style="`animation-delay: ${idx * 0.1}s`">
                  <circle :cx="item.x" :cy="item.y" r="5" fill="#0d6dff" stroke="white" stroke-width="2" class="hover:r-6 cursor-pointer transition-all" />
                  <text :x="item.x - 16" :y="item.y - 12" class="text-[12px] font-semibold" fill="#071b3a">{{ item.value.toLocaleString('id-ID') }}</text>
                  <text :x="item.x - 24" y="246" class="text-[12px]" fill="#6680a7">{{ item.label }}</text>
                </g>
              </svg>
            </div>
          </article>

          <!-- Departemen Donut -->
          <article class="rounded-xl border border-[#d9e6f5] bg-white p-6 shadow-card animate-fade-in-up stagger-4">
            <h2 class="text-base font-bold text-[#071b3a]">Karyawan by Departemen</h2>
            <div class="mt-6 flex flex-col items-center">
              <div class="relative h-[180px] w-[180px] rounded-full donut-animate" :style="{ background: donutGradient }">
                <div class="absolute inset-[45px] rounded-full bg-white flex items-center justify-center flex-col shadow-sm">
                  <span class="text-2xl font-bold text-[#071b3a]">{{ totalEmployees.toLocaleString('id-ID') }}</span>
                  <span class="text-[10px] text-[#6680a7] font-medium uppercase tracking-wider">Total</span>
                </div>
              </div>
              <div class="mt-6 w-full space-y-2.5">
                <div v-for="dept in departments.slice(0, 3)" :key="dept.label" class="flex items-center justify-between text-[13px]">
                  <div class="flex items-center gap-2">
                    <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: dept.color }" />
                    <span class="text-[#4c6387]">{{ dept.label }}</span>
                  </div>
                  <span class="font-semibold text-[#071b3a]">{{ dept.percent }}%</span>
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- Attendance Summary -->
        <article class="rounded-xl border border-[#d9e6f5] bg-white p-6 shadow-card animate-fade-in-up stagger-5">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-base font-bold text-[#071b3a]">Ringkasan Presensi Hari Ini</h2>
            <NuxtLink to="/dashboard/attendance" class="text-[13px] font-semibold text-[#0d6dff] hover:underline">Lihat Detail</NuxtLink>
          </div>
          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div v-for="item in attendance" :key="item.label" class="rounded-lg border border-[#eef2f5] bg-[#fafcff] p-4 transition-colors hover:bg-white hover:shadow-sm">
              <div class="flex items-start justify-between">
                <div>
                  <p class="text-[13px] font-medium text-[#6680a7]">{{ item.label }}</p>
                  <p class="mt-2 text-2xl font-bold leading-none" :style="{ color: item.color }">{{ item.value }}</p>
                  <p class="mt-1 text-[12px] font-medium text-[#071b3a]">{{ item.percent }}</p>
                </div>
                <div class="flex h-10 w-10 items-center justify-center rounded-lg" :style="{ backgroundColor: item.bg, color: item.color }">
                  <component :is="item.icon" class="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
          <div class="mt-6">
            <div class="mb-2.5 flex items-center justify-between text-[13px] font-semibold">
              <span class="text-[#4c6387]">Tingkat Kehadiran</span>
              <span class="text-[#0d6dff]">{{ attendanceRate }}%</span>
            </div>
            <div class="h-2.5 overflow-hidden rounded-full bg-[#eef2f5]">
              <div class="h-full rounded-full bg-gradient-to-r from-[#0d6dff] to-[#4592fb] progress-animate" :style="{ width: `${attendanceRate}%` }" />
            </div>
          </div>
        </article>

        <!-- Leave Requests Table -->
        <article class="rounded-xl border border-[#d9e6f5] bg-white p-0 shadow-card overflow-hidden animate-fade-in-up stagger-6">
          <div class="flex items-center justify-between p-6 pb-4 border-b border-[#eef2f5]">
            <h2 class="text-base font-bold text-[#071b3a]">Pengajuan Cuti & Izin</h2>
            <NuxtLink to="/dashboard/leave" class="text-[13px] font-semibold text-[#0d6dff] hover:underline">Lihat Semua</NuxtLink>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-[13px]">
              <thead class="bg-[#fafcff] text-[12px] font-semibold text-[#6680a7] uppercase tracking-wider">
                <tr>
                  <th class="px-6 py-3 border-b border-[#eef2f5]">Karyawan</th>
                  <th class="px-6 py-3 border-b border-[#eef2f5]">Jenis</th>
                  <th class="px-6 py-3 border-b border-[#eef2f5]">Tanggal</th>
                  <th class="px-6 py-3 border-b border-[#eef2f5]">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="leaveRequests.length === 0">
                  <td colspan="4" class="px-6 py-8 text-center text-[#6680a7]">Belum ada pengajuan cuti terbaru.</td>
                </tr>
                <tr v-for="request in leaveRequests" :key="request.name" class="border-b border-[#eef2f5] last:border-0 hover:bg-[#f8fbff] transition-colors">
                  <td class="px-6 py-3.5">
                    <div class="flex items-center gap-3">
                      <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#e7f1ff] to-[#c5dff] text-[13px] font-bold text-[#0d6dff]">
                        {{ request.avatar }}
                      </div>
                      <div>
                        <p class="font-semibold text-[#071b3a]">{{ request.name }}</p>
                        <p class="text-[12px] text-[#6680a7]">{{ request.role }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-3.5 font-medium text-[#4c6387]">{{ request.type }}</td>
                  <td class="px-6 py-3.5 text-[#4c6387]">{{ request.date }}</td>
                  <td class="px-6 py-3.5">
                    <span :class="['inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-semibold', statusClasses(request.tone)]">
                      {{ request.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <!-- Sidebar Right (Widgets) -->
      <div class="space-y-6">
        
        <!-- Payroll Summary -->
        <article class="rounded-xl border border-[#d9e6f5] bg-white p-6 shadow-card animate-fade-in-up stagger-5">
          <div class="flex items-center gap-3 mb-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e7f1ff] text-[#0d6dff]">
              <Wallet class="h-5 w-5" />
            </div>
            <div>
              <h2 class="text-base font-bold text-[#071b3a]">Payroll Bulan Ini</h2>
              <p class="text-[12px] text-[#6680a7]">{{ payroll?.period || '-' }}</p>
            </div>
          </div>
          <div class="mb-4">
            <p class="text-3xl font-bold text-[#071b3a]">Rp {{ (payroll?.total || 0).toLocaleString('id-ID') }}</p>
          </div>
          <div class="space-y-3 pt-4 border-t border-[#eef2f5]">
            <div class="flex justify-between text-[13px]">
              <span class="text-[#6680a7]">Gaji Pokok</span>
              <span class="font-semibold text-[#071b3a]">Rp {{ (payroll?.base || 0).toLocaleString('id-ID') }}</span>
            </div>
            <div class="flex justify-between text-[13px]">
              <span class="text-[#6680a7]">Tunjangan</span>
              <span class="font-semibold text-[#071b3a]">Rp {{ (payroll?.allowance || 0).toLocaleString('id-ID') }}</span>
            </div>
            <div class="flex justify-between text-[13px]">
              <span class="text-[#6680a7]">Potongan</span>
              <span class="font-semibold text-[#ef233c]">-Rp {{ (payroll?.deduction || 0).toLocaleString('id-ID') }}</span>
            </div>
          </div>
        </article>

        <!-- Announcements -->
        <article class="rounded-xl border border-[#d9e6f5] bg-white p-6 shadow-card animate-fade-in-up stagger-6">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-base font-bold text-[#071b3a]">Pengumuman</h2>
          </div>
          <div class="space-y-3">
            <div v-if="announcements.length === 0" class="text-center py-4 text-sm text-[#6680a7]">Belum ada pengumuman.</div>
            <div v-for="item in announcements" :key="item.title" class="rounded-lg border border-[#eef2f5] p-3 hover:bg-[#f8fbff] transition cursor-pointer">
              <div class="flex items-start justify-between gap-2">
                <p class="text-[13px] font-semibold text-[#071b3a] leading-tight">{{ item.title }}</p>
                <span :class="['shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold', statusClasses(item.type)]">
                  {{ item.priority }}
                </span>
              </div>
              <div class="mt-2 flex items-center gap-1.5 text-[11px] text-[#6680a7]">
                <CalendarDays class="h-3 w-3" />
                {{ item.date }}
              </div>
            </div>
          </div>
          <NuxtLink to="/dashboard/more-data" class="mt-4 flex w-full justify-center rounded-lg border border-[#eef2f5] py-2 text-[13px] font-semibold text-[#4c6387] hover:bg-[#f8fbff] transition">Lihat Semua Pengumuman</NuxtLink>
        </article>

        <!-- Recent Activity -->
        <article class="rounded-xl border border-[#d9e6f5] bg-white p-6 shadow-card animate-fade-in-up stagger-7">
          <div class="mb-5 flex items-center justify-between">
            <h2 class="text-base font-bold text-[#071b3a]">Aktivitas Terbaru</h2>
            <Activity class="h-4 w-4 text-[#6680a7]" />
          </div>
          <div class="relative pl-3">
            <!-- Timeline Line -->
            <div class="absolute left-[17px] top-2 bottom-2 w-px bg-[#eef2f5]" />
            
            <div class="space-y-5">
              <div v-for="(act, idx) in recentActivities" :key="idx" class="relative flex gap-4">
                <div class="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[3px] border-white bg-white shadow-sm">
                  <component :is="act.icon" :class="['h-3.5 w-3.5', act.color]" />
                </div>
                <div class="pt-0.5">
                  <p class="text-[13px] text-[#4c6387] leading-snug">
                    <span class="font-semibold text-[#071b3a]">{{ act.user }}</span>
                    {{ act.action }}
                    <span class="font-medium text-[#071b3a]">{{ act.target }}</span>
                  </p>
                  <p class="mt-1 text-[11px] text-[#8ba0bc]">{{ act.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </article>

      </div>
    </div>

    <!-- Footer -->
    <footer class="flex flex-col justify-between gap-2 border-t border-[#eef2f5] pt-6 pb-2 text-[12px] text-[#6680a7] sm:flex-row animate-fade-in-up stagger-8">
      <span>© 2024 HRIS - Human Resources Information System. All rights reserved.</span>
      <span class="font-medium">Versi 1.1.0</span>
    </footer>
  </div>
</template>
