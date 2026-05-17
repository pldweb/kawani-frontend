import { useAuthStore } from '~/stores/auth'

export function useCan() {
  const auth = useAuthStore()

  function can(permission: string | string[]): boolean {
    if (!auth.user || !auth.user.all_permissions) return false

    const userPerms = auth.user.all_permissions

    // If super-admin or has a wildcard, we can allow it (optional depending on your business logic)
    // if (userPerms.includes('*')) return true

    if (Array.isArray(permission)) {
      // Return true if user has ANY of the required permissions
      return permission.some(p => userPerms.includes(p))
    }

    return userPerms.includes(permission)
  }

  return { can }
}
