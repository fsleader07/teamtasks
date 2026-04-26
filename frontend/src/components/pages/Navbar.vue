<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// ใช้ Relative Path ที่เจ้านายมั่นใจว่าถูก
import defaultImg from '../../assets/profile/tiya.jpg';

const router = useRouter();
const userName = ref("Loading...");
const profileImg = ref(defaultImg);

// ลองหุ้ม Glob ไว้ในกรณีที่ Path มีปัญหา Script จะได้ไม่พังทั้งหน้า
let profileImages = {};
try {
  profileImages = import.meta.glob('@/assets/profile/*.{png,jpg,jpeg,webp}', { 
    eager: true, 
    import: 'default' 
  });
} catch (e) {
  console.error("Glob Import Error:", e);
}

const fetchUserProfile = async () => {
  console.log("1. Starting fetchUserProfile...");
  
  const personId = localStorage.getItem("person_id");
  console.log("2. person_id from localStorage:", personId);

  // เช็คทั้ง null, undefined และ string "null"
  if (!personId || personId === "null" || personId === "undefined") {
    console.log("3. No personId found, setting to Administrator");
    userName.value = "Administrator";
    profileImg.value = defaultImg;
    return;
  }

  try {
    console.log("4. Fetching from API...");
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/personnel/${personId}`);
    
    if (!response.ok) throw new Error("API Response not ok");

    const data = await response.json();
    console.log("5. API Data received:", data);

    if (data && data.firstname) {
      userName.value = `${data.firstname} ${data.lastname || ""}`.trim();
      
      // ค้นหา Path แบบยืดหยุ่น (EndsWith) เพื่อป้องกัน Path Key ของ Vite เพี้ยน
      const allKeys = Object.keys(profileImages);
      const matchedKey = allKeys.find(key => key.endsWith(`${personId}.jpg`) || key.endsWith(`${personId}.png`));

      if (matchedKey) {
        profileImg.value = profileImages[matchedKey];
      } else {
        console.warn("6. Image file not found in assets, using default");
        profileImg.value = defaultImg;
      }
    }
  } catch (error) {
    console.error("Fetch profile error:", error);
    userName.value = "User"; // ถ้า API พัง อย่างน้อยชื่อต้องเปลี่ยนเป็น User
    profileImg.value = defaultImg;
  }
};

const handleImageError = () => {
  console.log("Image load failed, switching to default");
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