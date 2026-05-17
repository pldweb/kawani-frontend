import { defineStore } from 'pinia'
import { computed, navigateTo, ref, useCookie, useNuxtApp, useState } from '#imports'
import type { ApiEnvelope, LoginResponse, User } from '~/types/api'

interface LoginPayload {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  const { $api } = useNuxtApp()
  const token = useCookie<string | null>('kawani_token', {
    sameSite: 'lax',
    secure: false
  })
  const user = useState<User | null>('auth_user', () => null)
  const loading = ref(false)

  const isAuthenticated = computed(() => Boolean(token.value))

  async function login(payload: LoginPayload) {
    loading.value = true

    try {
      const response = await $api.post<ApiEnvelope<LoginResponse>>('/auth/login', {
        ...payload,
        device_name: 'nuxt-dashboard'
      })

      token.value = response.data.data.token
      user.value = response.data.data.user

      return response.data.data
    } finally {
      loading.value = false
    }
  }

  async function fetchMe() {
    if (!token.value) {
      user.value = null
      return null
    }

    const response = await $api.get<ApiEnvelope<User>>('/auth/me')
    user.value = response.data.data

    return user.value
  }

  async function logout() {
    if (token.value) {
      await $api.post('/auth/logout').catch(() => null)
    }

    token.value = null
    user.value = null
    await navigateTo('/login')
  }

  return {
    token,
    user,
    loading,
    isAuthenticated,
    login,
    fetchMe,
    logout
  }
})
