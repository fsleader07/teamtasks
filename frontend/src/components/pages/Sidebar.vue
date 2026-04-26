<template>
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
</template>

<script setup>
import { ref } from 'vue';
// ดึง Role จาก LocalStorage ตาม Logic เดิมของเจ้านาย
const userRole = ref(localStorage.getItem("role") || "user");
</script>

<style scoped>
.nav-item {
  @apply flex items-center gap-3 py-2 px-3 rounded transition text-gray-400 hover:bg-gray-700 hover:text-white;
}
.active {
  @apply bg-blue-600 text-white shadow-md;
}
</style>