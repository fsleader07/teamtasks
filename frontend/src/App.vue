<template>
  <div v-if="$route.name === 'login'" class="auth-wrapper">
    <RouterView />
  </div>

  <div v-else class="flex h-screen bg-[#f8fafc]">
    <Sidebar />

    <div class="flex-1 flex flex-col overflow-hidden">
      <Navbar />

      <main class="flex-1 overflow-x-hidden overflow-y-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/pages/Navbar.vue'
import Sidebar from '@/components/pages/Sidebar.vue'
</script>