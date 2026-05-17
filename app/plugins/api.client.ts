import axios, { AxiosError, type AxiosInstance } from 'axios'
import { defineNuxtPlugin, navigateTo, useCookie, useRuntimeConfig } from '#imports'
import type { ApiErrorEnvelope } from '~/types/api'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('kawani_token', {
    sameSite: 'lax',
    secure: false
  })

  const api = axios.create({
    baseURL: String(config.public.apiBaseUrl),
    headers: {
      Accept: 'application/json'
    }
  })

  api.interceptors.request.use((request) => {
    if (token.value) {
      request.headers.Authorization = `Bearer ${token.value}`
    }

    return request
  })

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorEnvelope>) => {
      if (error.response?.status === 401) {
        token.value = null
        navigateTo('/login')
      }

      return Promise.reject(error)
    }
  )

  return {
    provide: {
      api
    }
  }
})

declare module '#app' {
  interface NuxtApp {
    $api: AxiosInstance
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: AxiosInstance
  }
}
