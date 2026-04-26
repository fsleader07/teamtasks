<template>
  <aside class="sidebar-dark w-64 h-full flex-shrink-0 flex flex-col shadow-xl z-50 bg-[#1e293b]">
    <div class="p-4 flex items-center gap-3 border-b border-gray-700">
      <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
        T
      </div>
      <span class="text-white text-lg font-semibold tracking-tight">Admin Task Lite</span>
    </div>

    <div class="flex-1 p-3 space-y-1">
      <div class="text-gray-500 text-[10px] uppercase font-bold px-3 py-2">MAIN NAVIGATION</div>

      <RouterLink
        v-for="route in mainMenu"
        :key="route.path"
        :to="route.path"
        class="flex items-center gap-3 py-2 px-3 rounded transition text-gray-400 hover:bg-gray-700 hover:text-white"
        active-class="bg-blue-600 text-white shadow-md"
      >
        <span class="text-sm">{{ getIcon(route.name) }}</span> {{ route.meta.title }}
      </RouterLink>

      <template v-if="userRole === 'admin'">
        <div class="text-gray-500 text-[10px] uppercase font-bold px-3 py-2 mt-4">ADMIN ONLY</div>

        <RouterLink
          v-for="route in adminMenu"
          :key="route.path"
          :to="route.path"
          class="flex items-center gap-3 py-2 px-3 rounded transition text-gray-400 hover:bg-gray-700 hover:text-white"
          active-class="bg-blue-600 text-white shadow-md"
        >
          <span class="text-sm">{{ getIcon(route.name) }}</span> {{ route.meta.title }}
        </RouterLink>
      </template>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'

const router = useRouter()
const userRole = ref(localStorage.getItem('role') || 'user')

// Logic การกรองเมนูย้ายมาไว้ที่นี่เพื่อให้ Sidebar จัดการตัวเองได้
const mainMenu = computed(() => {
  return router.options.routes.filter(
    (route) =>
      route.meta && route.meta.showInMenu && !['projects', 'personnel'].includes(route.name),
  )
})

const adminMenu = computed(() => {
  return router.options.routes.filter(
    (route) =>
      route.meta && route.meta.showInMenu && ['projects', 'personnel'].includes(route.name),
  )
})

const getIcon = (name) => {
  const icons = { home: '🏠', tasks: '📋', projects: '📁', personnel: '👤' }
  return icons[name] || '•'
}
</script>