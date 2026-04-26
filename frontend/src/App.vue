<template>
  <div v-if="$route.name === 'login'" class="auth-wrapper">
    <RouterView />
  </div>

  <div v-else class="flex h-screen bg-[#f8fafc]">
    <aside class="sidebar-dark w-64 h-full flex-shrink-0 flex flex-col shadow-xl z-50 bg-[#1e293b]">
      <div class="p-4 flex items-center gap-3 border-b border-gray-700">
        <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">T</div>
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

    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-white h-14 flex items-center justify-between px-6 shadow-sm border-b sticky top-0 z-40">
        <div class="flex items-center gap-4 text-gray-500">
          <span class="text-sm font-medium">Home / {{ $route.meta.title }}</span>
        </div>
        
        <div class="flex items-center gap-4">
          <button @click="handleLogout" class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md border border-red-100 transition">
             <span>Logout</span>
          </button>
        </div>
      </header>

      <main class="flex-1 overflow-x-hidden overflow-y-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'

const router = useRouter()
// ดึงค่าสิทธิ์ผู้ใช้งานจาก LocalStorage
const userRole = ref(localStorage.getItem("role") || "user")

// 1. กรองเฉพาะเมนูสำหรับพนักงานทั่วไป
const mainMenu = computed(() => {
  return router.options.routes.filter(route => 
    route.meta && 
    route.meta.showInMenu && 
    !['projects', 'personnel'].includes(route.name)
  )
})

// 2. กรองเฉพาะเมนูสำหรับ Admin (สอดคล้องกับไฟล์ menu.js เดิม)
const adminMenu = computed(() => {
  return router.options.routes.filter(route => 
    route.meta && 
    route.meta.showInMenu && 
    ['projects', 'personnel'].includes(route.name)
  )
})

const getIcon = (name) => {
  const icons = { 'home': '🏠', 'tasks': '📋', 'projects': '📁', 'personnel': '👤' }
  return icons[name] || '•'
}

const handleLogout = () => {
  // ยืนยันก่อนออกจากระบบตามมาตรฐานเดิม
  if (confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
    localStorage.clear()
    router.push('/login')
  }
}
</script>