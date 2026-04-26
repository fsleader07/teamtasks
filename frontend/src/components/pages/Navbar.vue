<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import defaultImg from '@/assets/profile/tiya.jpg';

const router = useRouter();
const userName = ref("Loading...");
const profileImg = ref(defaultImg); // เริ่มต้นด้วยรูป Default

const fetchUserProfile = async () => {
  const personId = localStorage.getItem("person_id");

  // 1. กรณีเป็น Admin (ไม่มี person_id)
  if (!personId) {
    userName.value = "Administrator";
    profileImg.value = defaultImg;
    return;
  }

  // 2. กรณีมี person_id (ดึงข้อมูลจาก API)
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/personnel/${personId}`);
    if (!response.ok) throw new Error("User not found");

    const data = await response.json();
    if (data && data.firstname) {
      userName.value = `${data.firstname} ${data.lastname || ""}`.trim();
      
      // จัดการ Dynamic Path สำหรับรูปพนักงาน
      try {
        const dynamicImg = new URL(`../../assets/profile/${personId}.jpg`, import.meta.url).href;
        profileImg.value = dynamicImg;
      } catch (e) {
        profileImg.value = defaultImg;
      }
    }
  } catch (error) {
    console.error("Fetch profile error:", error);
    userName.value = "User";
    profileImg.value = defaultImg;
  }
};

const handleImageError = () => {
  profileImg.value = defaultImg;
};

const handleLogout = () => {
  if (confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
    localStorage.clear();
    router.push('/login');
  }
};

onMounted(() => {
  fetchUserProfile();
});
</script>

<template>
  <header class="bg-white h-14 flex items-center justify-between px-6 shadow-sm border-b sticky top-0 z-40">
    <div class="flex items-center gap-4 text-gray-500">
      <span class="text-sm font-medium">Home / {{ $route.meta.title || 'Dashboard' }}</span>
    </div>
    
    <div class="flex items-center gap-6">
      <div class="flex items-center gap-3">
        <div class="text-right hidden sm:block">
          <p class="text-xs font-bold text-gray-800 leading-none">{{ userName }}</p>
          <p class="text-[10px] text-green-500 font-medium">Online</p>
        </div>
        
        <div class="w-8 h-8 rounded-full border border-blue-200 flex items-center justify-center overflow-hidden bg-gray-50">
          <img 
            :src="profileImg" 
            @error="handleImageError"
            class="w-full h-full rounded-full object-cover bg-gray-100" 
            alt="Profile"
          />
        </div>
      </div>

      <button 
        @click="handleLogout" 
        class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors border border-red-100"
      >
        <span>Logout</span>
      </button>
    </div>
  </header>
</template>