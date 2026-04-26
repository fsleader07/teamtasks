<template>
  <div class="bg-gray-100 flex items-center justify-center h-screen">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">เข้าสู่ระบบ</h1>
        <p class="text-gray-500">กรุณากรอกข้อมูลเพื่อเข้าใช้งาน</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">ชื่อผู้ใช้งาน</label>
          <div class="mt-1 relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <i class="fas fa-user"></i>
            </span>
            <input
              v-model="form.username"
              type="text"
              required
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Username"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
          <div class="mt-1 relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <i class="fas fa-lock"></i>
            </span>
            <input
              v-model="form.password"
              type="password"
              required
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div v-if="errorStatus.show" class="text-red-500 text-sm text-center">
          {{ errorStatus.message }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <span v-if="loading">กำลังเข้าสู่ระบบ...</span>
          <span v-else>Sign in</span>
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          ยังไม่มีบัญชี?
          <router-link
            to="/register"
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            สมัครสมาชิก
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// State Management
const loading = ref(false);
const form = reactive({
  username: '',
  password: ''
});

const errorStatus = reactive({
  show: false,
  message: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง'
});

// Authentication Logic
const handleLogin = async () => {
  loading.value = true;
  errorStatus.show = false;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (response.ok) {
      // Persistence storage
      if (data.access_token) localStorage.setItem("token", data.access_token);
      if (data.person_id) localStorage.setItem("person_id", data.person_id);
      if (data.role) localStorage.setItem("role", data.role);
      
      router.push('/'); 
    } else {
      errorStatus.show = true;
      errorStatus.message = data.detail || "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง";
    }
  } catch (error) {
    console.error("Error:", error);
    errorStatus.show = true;
    errorStatus.message = "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้";
  } finally {
    loading.value = false;
  }
};
</script>