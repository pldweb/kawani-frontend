import { defineNuxtPlugin } from '#app'
import { useCan } from '~/composables/useCan'

export default defineNuxtPlugin((nuxtApp) => {
  const { can } = useCan()

  // Provide globally for Options API or template usage like $can('edit')
  nuxtApp.provide('can', can)

  // Register v-can directive
  nuxtApp.vueApp.directive('can', {
    mounted(el, binding) {
      if (!can(binding.value)) {
        el.style.display = 'none'
      }
    },
    updated(el, binding) {
      if (!can(binding.value)) {
        el.style.display = 'none'
      } else {
        el.style.display = ''
      }
    }
  })
})
