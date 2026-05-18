<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { AxiosError } from 'axios'
import { Building2, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Users } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { definePageMeta, navigateTo, ref } from '#imports'
import { useAuthStore } from '~/stores/auth'
import type { ApiErrorEnvelope } from '~/types/api'

definePageMeta({
  middleware: 'guest'
})

const auth = useAuthStore()
const serverError = ref('')
const showPassword = ref(false)

const { defineField, errors, handleSubmit } = useForm({
  validationSchema: toTypedSchema(z.object({
    email: z.string().email('Email tidak valid.'),
    password: z.string().min(1, 'Password wajib diisi.')
  })),
  initialValues: {
    email: 'superadmin@kawani.test',
    password: 'password'
  }
})

const [email] = defineField('email')
const [password] = defineField('password')

const stats = [
  { label: 'Core Modules', value: '8' },
  { label: 'API Version', value: 'v1' },
  { label: 'Rate Limit', value: '300' }
]

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''

  try {
    await auth.login(values)
    await navigateTo('/dashboard')
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 422) {
        serverError.value = 'Kombinasi email dan password tidak sesuai, atau format salah.'
      } else if (error.response?.status === 401) {
        serverError.value = 'Email atau password yang Anda masukkan salah.'
      } else {
        serverError.value = (error.response?.data as ApiErrorEnvelope | undefined)?.message || 'Terjadi kendala saat memproses login. Silakan coba lagi.'
      }
      return
    }

    serverError.value = 'Gagal terhubung ke server. Silakan periksa koneksi internet Anda.'
  }
})
</script>

<template>
  <section class="min-h-screen overflow-hidden bg-[#f3f8ff]">
    <div class="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <div class="relative hidden overflow-hidden bg-gradient-to-br from-[#0d6dff] via-[#0058de] to-[#003ca7] px-12 py-10 text-white lg:block">
        <div class="absolute -right-28 top-16 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div class="absolute -bottom-20 left-10 h-80 w-80 rounded-full bg-[#8cc1ff]/20 blur-3xl" />

        <div class="relative z-10 flex h-full flex-col justify-between">
          <div>
            <div class="flex items-center gap-4">
              <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/16 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                <ShieldCheck class="h-10 w-10" />
              </div>
              <div>
                <p class="text-4xl font-bold leading-none">HRIS</p>
                <p class="mt-2 text-sm leading-5 text-white/90">Human Resources<br>Information System</p>
              </div>
            </div>

            <div class="mt-16 max-w-2xl">
              <p class="text-sm font-semibold uppercase tracking-[0.18em] text-[#cfe4ff]">Kawani Enterprise Suite</p>
              <h1 class="mt-5 text-[56px] font-bold leading-[1.05] tracking-normal">
                Kelola siklus kerja karyawan dalam satu dashboard.
              </h1>
              <p class="mt-6 max-w-xl text-lg leading-8 text-[#d8e9ff]">
                Absensi, cuti, payroll, struktur organisasi, dan laporan HRIS terhubung langsung ke Laravel API.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div v-for="item in stats" :key="item.label" class="rounded-xl border border-white/18 bg-white/12 p-5 backdrop-blur">
              <p class="text-3xl font-bold">{{ item.value }}</p>
              <p class="mt-2 text-xs font-medium text-[#d8e9ff]">{{ item.label }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center px-5 py-10 sm:px-8">
        <div class="w-full max-w-[520px]">
          <div class="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0d6dff] to-[#004ed3] text-white">
              <ShieldCheck class="h-7 w-7" />
            </div>
            <div>
              <p class="text-2xl font-bold text-[#071b3a]">HRIS</p>
              <p class="text-xs text-[#6680a7]">Human Resources Information System</p>
            </div>
          </div>

          <form class="rounded-2xl border border-[#d9e6f5] bg-white p-8 shadow-[0_22px_48px_rgba(30,88,160,0.12)] sm:p-10" @submit.prevent="onSubmit">
            <div class="flex items-start justify-between gap-6">
              <div>
                <p class="text-sm font-bold uppercase tracking-[0.18em] text-[#0061ee]">Login</p>
                <h2 class="mt-3 text-[32px] font-bold leading-tight text-[#071b3a]">Dashboard HRIS</h2>
                <p class="mt-3 text-sm leading-6 text-[#6680a7]">Gunakan akun admin awal untuk masuk ke workspace HRIS.</p>
              </div>
              <div class="hidden h-14 w-14 items-center justify-center rounded-2xl bg-[#e7f1ff] text-[#0b63f6] sm:flex">
                <Building2 class="h-7 w-7" />
              </div>
            </div>

            <div class="mt-8 space-y-5">
              <label class="block">
                <span class="mb-2.5 flex items-center justify-between text-sm font-semibold text-[#071b3a]">
                  Email
                  <span class="text-xs font-medium text-[#8ba0bc]">Akun admin</span>
                </span>
                <UiAppInput
                  v-model="email"
                  type="email"
                  autocomplete="email"
                  placeholder="superadmin@kawani.test"
                  :error="Boolean(errors.email)"
                >
                  <template #leftIcon>
                    <Mail class="h-[18px] w-[18px]" />
                  </template>
                </UiAppInput>
                <span v-if="errors.email" class="mt-2 block text-xs font-medium text-red-600">{{ errors.email }}</span>
              </label>

              <label class="block">
                <span class="mb-2.5 flex items-center justify-between text-sm font-semibold text-[#071b3a]">
                  Password
                  <span class="text-xs font-medium text-[#8ba0bc]">Min. 1 karakter</span>
                </span>
                <UiAppInput
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="Masukkan password"
                  :error="Boolean(errors.password)"
                >
                  <template #leftIcon>
                    <LockKeyhole class="h-[18px] w-[18px]" />
                  </template>
                  <template #rightIcon>
                    <button
                      type="button"
                      class="flex h-8 w-8 items-center justify-center rounded-lg text-[#6b83a5] transition hover:bg-[#eef5ff] hover:text-[#0b63f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b63f6]/30"
                      :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
                      @click="showPassword = !showPassword"
                    >
                      <EyeOff v-if="showPassword" class="h-[18px] w-[18px]" />
                      <Eye v-else class="h-[18px] w-[18px]" />
                    </button>
                  </template>
                </UiAppInput>
                <span v-if="errors.password" class="mt-2 block text-xs font-medium text-red-600">{{ errors.password }}</span>
              </label>

              <div class="flex items-center justify-between rounded-lg bg-[#f3f8ff] px-4 py-3 text-sm">
                <span class="flex items-center gap-2 font-medium text-[#28415f]">
                  <CheckCircle2 class="h-4 w-4 text-[#10b981]" />
                  Admin default
                </span>
                <span class="text-[#6680a7]">superadmin@kawani.test</span>
              </div>

              <div v-if="serverError" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {{ serverError }}
              </div>

              <UiAppButton type="submit" class="h-12 w-full rounded-lg bg-gradient-to-r from-[#0d6dff] to-[#004ed3] text-base shadow-[0_12px_26px_rgba(0,95,220,0.25)] hover:from-[#005fe8] hover:to-[#003ca7]" :disabled="auth.loading">
                {{ auth.loading ? 'Memproses...' : 'Masuk Dashboard' }}
              </UiAppButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
