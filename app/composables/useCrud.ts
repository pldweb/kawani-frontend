import { ref, type Ref } from 'vue'
import { useNuxtApp } from '#imports'
import type { ApiEnvelope } from '~/types/api'

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface UseCrudOptions {
  resource: string
  perPage?: number
}

export function useCrud<T = Record<string, unknown>>(opts: UseCrudOptions) {
  const { $api } = useNuxtApp()
  const items: Ref<T[]> = ref([])
  const loading = ref(false)
  const saving = ref(false)
  const pagination = ref<PaginationMeta>({ current_page: 1, last_page: 1, per_page: opts.perPage || 15, total: 0 })
  const error = ref('')

  async function fetchItems(page = 1, params: Record<string, unknown> = {}) {
    loading.value = true
    error.value = ''
    try {
      const res = await $api.get<ApiEnvelope<T[]>>(`/${opts.resource}`, {
        params: { page, per_page: pagination.value.per_page, ...params }
      })
      items.value = res.data.data as T[]
      const p = res.data.meta?.pagination as Record<string, number> | undefined
      if (p) {
        pagination.value = {
          current_page: p.current_page || 1,
          last_page: p.last_page || 1,
          per_page: p.per_page || 15,
          total: p.total || 0
        }
      }
    } catch (e: unknown) {
      error.value = (e as Error).message || 'Gagal memuat data.'
    } finally {
      loading.value = false
    }
  }

  async function createItem(data: Partial<T>) {
    saving.value = true
    error.value = ''
    try {
      const res = await $api.post<ApiEnvelope<T>>(`/${opts.resource}`, data)
      return res.data.data
    } catch (e: unknown) {
      error.value = (e as Error).message || 'Gagal menyimpan data.'
      throw e
    } finally {
      saving.value = false
    }
  }

  async function updateItem(id: number | string, data: Partial<T>) {
    saving.value = true
    error.value = ''
    try {
      const res = await $api.patch<ApiEnvelope<T>>(`/${opts.resource}/${id}`, data)
      return res.data.data
    } catch (e: unknown) {
      error.value = (e as Error).message || 'Gagal memperbarui data.'
      throw e
    } finally {
      saving.value = false
    }
  }

  async function deleteItem(id: number | string) {
    saving.value = true
    error.value = ''
    try {
      await $api.delete(`/${opts.resource}/${id}`)
    } catch (e: unknown) {
      error.value = (e as Error).message || 'Gagal menghapus data.'
      throw e
    } finally {
      saving.value = false
    }
  }

  return { items, loading, saving, pagination, error, fetchItems, createItem, updateItem, deleteItem }
}
