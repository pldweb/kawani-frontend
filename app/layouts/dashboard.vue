<script setup lang="ts">
import {
  Bell,
  BriefcaseBusiness,
  CalendarCheck,
  CalendarClock,
  ChevronDown,
  ClipboardList,
  Database,
  FileBarChart,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Network,
  Search,
  Settings,
  ShieldCheck,
  Star,
  UserCog,
  Users,
  WalletCards,
  Wrench,
  X
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useCan } from '~/composables/useCan'

const auth = useAuthStore()
const { can } = useCan()
const route = useRoute()
const sidebarOpen = ref(false)
const dataMasterOpen = ref(true)

const primaryItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard }
]

const dataMasterItems = [
  { label: 'Karyawan', to: '/dashboard/employees', icon: Users, permission: 'view_employees' },
  { label: 'Organisasi', to: '/dashboard/organization', icon: Network, permission: 'view_departments' },
  { label: 'Jabatan', to: '/dashboard/positions', icon: BriefcaseBusiness, permission: 'view_positions' },
  { label: 'Lokasi', to: '/dashboard/locations', icon: MapPin, permission: 'view_locations' },
  { label: 'Pendidikan', to: '/dashboard/education', icon: GraduationCap, permission: 'view_education' },
  { label: 'Skill', to: '/dashboard/skills', icon: Wrench, permission: 'view_skills' },
  { label: 'Data Lainnya', to: '/dashboard/more-data', icon: ClipboardList }
]

const moduleItems = [
  { label: 'Manajemen Karyawan', to: '/dashboard/employees', icon: UserCog, permission: 'view_employees' },
  { label: 'Presensi', to: '/dashboard/attendance', icon: CalendarClock, permission: 'view_attendances' },
  { label: 'Cuti & Izin', to: '/dashboard/leave', icon: CalendarCheck, permission: 'view_leave_requests' },
  { label: 'Payroll', to: '/dashboard/payroll', icon: WalletCards, permission: 'view_payslips' },
  { label: 'Penilaian Kinerja', to: '/dashboard/performance', icon: Star, permission: 'view_performance_reviews' },
  { label: 'Recruitment', to: '/dashboard/recruitment', icon: Search, permission: 'view_job_postings' },
  { label: 'Laporan', to: '/dashboard/reports', icon: FileBarChart, permission: 'view_reports' },
  { label: 'Pengaturan', to: '/dashboard/settings', icon: Settings, permission: 'manage_settings' }
]

const filteredDataMaster = computed(() => dataMasterItems.filter(item => !item.permission || can(item.permission)))
const filteredModules = computed(() => moduleItems.filter(item => !item.permission || can(item.permission)))

function isActive(to: string) {
  return route.path === to
}
</script>

<template>
  <div class="min-h-screen bg-[#f3f8ff] text-[#071b3a]">
    <!-- Mobile overlay -->
    <Transition name="fade">
      <div v-if="sidebarOpen" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm xl:hidden" @click="sidebarOpen = false" />
    </Transition>

    <!-- Sidebar -->
    <aside :class="['fixed inset-y-0 left-0 z-50 w-[260px] overflow-y-auto bg-gradient-to-b from-[#0d6dff] to-[#0045bd] px-4 py-6 text-white transition-transform duration-300', sidebarOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0']">
      <button class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-white/80 hover:bg-white/15 xl:hidden" type="button" @click="sidebarOpen = false">
        <X class="h-5 w-5" />
      </button>

      <div class="mb-7 flex items-center gap-3 px-3">
        <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
          <ShieldCheck class="h-7 w-7" />
        </div>
        <div>
          <p class="text-xl font-bold leading-none">HRIS</p>
          <p class="mt-1 text-[10px] leading-3 text-white/80">Human Resources<br>Information System</p>
        </div>
      </div>

      <div class="space-y-1">
        <NuxtLink v-for="item in primaryItems" :key="item.to" :to="item.to" class="flex h-11 items-center gap-3 rounded-lg px-3 text-[13px] font-semibold text-white transition hover:bg-white/15" :class="isActive(item.to) ? 'bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]' : ''" @click="sidebarOpen = false">
          <component :is="item.icon" class="h-[18px] w-[18px]" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </div>

      <div class="mt-6">
        <button class="flex h-10 w-full items-center justify-between rounded-lg px-3 text-[13px] font-semibold text-white/95 transition hover:bg-white/10" type="button" @click="dataMasterOpen = !dataMasterOpen">
          <span class="flex items-center gap-3"><Database class="h-[18px] w-[18px]" /> Data Master</span>
          <ChevronDown class="h-4 w-4 transition-transform duration-200" :class="dataMasterOpen ? 'rotate-0' : '-rotate-90'" />
        </button>
        <nav v-show="dataMasterOpen" class="mt-1 space-y-0.5">
          <NuxtLink v-for="item in filteredDataMaster" :key="item.to" :to="item.to" class="flex h-9 items-center gap-3 rounded-lg pl-10 pr-3 text-[13px] text-white/80 transition hover:bg-white/10 hover:text-white" :class="isActive(item.to) ? 'bg-white/12 text-white' : ''" @click="sidebarOpen = false">
            <component :is="item.icon" class="h-4 w-4" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>
      </div>

      <nav class="mt-5 space-y-0.5">
        <NuxtLink v-for="item in filteredModules" :key="item.to" :to="item.to" class="flex h-10 items-center justify-between rounded-lg px-3 text-[13px] font-medium text-white/90 transition hover:bg-white/10" :class="isActive(item.to) ? 'bg-white/14 text-white' : ''" @click="sidebarOpen = false">
          <span class="flex items-center gap-3"><component :is="item.icon" class="h-[18px] w-[18px]" /> {{ item.label }}</span>
          <ChevronDown class="h-4 w-4 text-white/50" />
        </NuxtLink>
      </nav>

      <div class="mt-auto pt-6">
        <div class="border-t border-white/15 pt-4">
          <button class="flex h-11 w-full items-center gap-3 rounded-lg bg-white/12 px-3 text-[13px] font-semibold text-white transition hover:bg-white/20" type="button" @click="auth.logout">
            <LogOut class="h-[18px] w-[18px]" /> Logout
          </button>
        </div>
      </div>
    </aside>

    <div class="min-h-screen xl:pl-[260px]">
      <header class="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-[#e3ecf7] bg-white/90 px-4 backdrop-blur-md md:px-8">
        <button class="flex h-10 w-10 items-center justify-center rounded-lg border border-[#d8e5f5] bg-white text-[#071b3a] shadow-sm hover:bg-[#f3f8ff]" type="button" @click="sidebarOpen = !sidebarOpen">
          <Menu class="h-5 w-5" />
        </button>

        <div class="flex items-center gap-4">
          <button class="relative flex h-10 w-10 items-center justify-center rounded-lg text-[#4c6387] hover:bg-[#eef5ff]" type="button">
            <Bell class="h-5 w-5" />
            <span class="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ef233c] px-1 text-[10px] font-bold text-white">5</span>
          </button>
          <div class="hidden h-8 w-px bg-[#d7e3f4] md:block" />
          <div class="flex items-center gap-3 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-[#f3f8ff]">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#0d6dff] to-[#6da8ff] text-white">
              <Users class="h-5 w-5" />
            </div>
            <div class="hidden sm:block">
              <p class="text-sm font-bold text-[#071b3a]">{{ auth.user?.name || 'Admin HRIS' }}</p>
              <p class="text-[11px] text-[#6680a7]">Super Admin</p>
            </div>
            <ChevronDown class="hidden h-4 w-4 text-[#8ba0bc] sm:block" />
          </div>
        </div>
      </header>

      <main class="px-4 pb-8 pt-1 md:px-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
