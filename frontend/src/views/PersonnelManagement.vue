<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold text-gray-800">จัดการบุคลากร (Personnel)</h2>
      <button
        @click="openModal()"
        class="bg-[#28a745] hover:bg-[#218838] text-white px-4 py-2 rounded text-sm font-bold shadow transition active:scale-95"
      >
        + เพิ่มบุคลากรใหม่
      </button>
    </div>

    <div class="bg-white rounded shadow-sm p-4 border border-gray-200">
      <div class="relative max-w-sm">
        <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหาชื่อ หรือตำแหน่ง..."
          class="w-full bg-white border border-gray-300 text-gray-800 text-sm rounded py-2 pl-9 pr-4 focus:ring-1 focus:ring-green-500 outline-none"
        />
      </div>
    </div>

    <div class="bg-white rounded shadow-sm overflow-hidden border border-gray-200">
      <div class="px-4 py-3 border-b border-gray-100 font-bold text-gray-700 text-sm">
        รายชื่อบุคลากรทั้งหมด
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50 text-gray-600 font-bold uppercase text-[11px] border-b">
            <tr>
              <th class="px-4 py-3 text-center border-r w-16">ID</th>
              <th class="px-4 py-3 border-r">ชื่อ-นามสกุล</th>
              <th class="px-4 py-3 border-r">ชื่อเล่น</th>
              <th class="px-4 py-3 border-r">ตำแหน่ง</th>
              <th class="px-4 py-3 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="(person, index) in filteredPersonnel" :key="person.personnel_id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-center border-r text-gray-500 font-mono text-xs">{{ index + 1 }}</td>
              <td class="px-4 py-3 border-r font-medium text-gray-800">
                {{ person.firstname }} {{ person.lastname }}
              </td>
              <td class="px-4 py-3 border-r text-gray-600">{{ person.nickname || "-" }}</td>
              <td class="px-4 py-3 border-r text-gray-600">{{ person.position || "-" }}</td>
              <td class="px-4 py-3 text-center space-x-3">
                <button @click="openModal(person)" class="text-blue-600 hover:text-blue-800 font-bold text-xs">แก้ไข</button>
                <button @click="handleDelete(person.personnel_id)" class="text-red-600 hover:text-red-800 font-bold text-xs">ลบ</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredPersonnel.length === 0" class="py-12 text-center text-gray-400 bg-white">
        <p class="text-3xl mb-1">👤</p>
        <p class="text-sm">ไม่พบข้อมูลบุคลากร</p>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        <div class="px-4 py-3 border-b flex justify-between items-center bg-gray-50">
          <h3 class="font-bold text-gray-700">{{ editId ? 'แก้ไขข้อมูลบุคลากร' : 'เพิ่มบุคลากรใหม่' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <form @submit.prevent="handleFormSubmit" class="p-4 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-600 mb-1">ชื่อ *</label>
              <input v-model="form.firstname" type="text" required class="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-600 mb-1">นามสกุล *</label>
              <input v-model="form.lastname" type="text" required class="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-600 mb-1">ชื่อเล่น</label>
            <input v-model="form.nickname" type="text" class="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-600 mb-1">ตำแหน่ง (Position)</label>
            <input v-model="form.position" type="text" class="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div class="flex justify-end space-x-2 pt-2">
            <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded">ยกเลิก</button>
            <button type="submit" class="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded shadow">บันทึกข้อมูล</button>
          </div>
        </form>
      </div>
    </div>

    <div id="toast-container" class="fixed bottom-4 right-4 z-[1000]"></div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';

// --- Config ---
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/personnel`;

// --- State ---
const allPersonnel = ref([]);
const searchQuery = ref('');
const isModalOpen = ref(false);
const editId = ref(null);

const form = reactive({
  firstname: '',
  lastname: '',
  nickname: '',
  position: ''
});

// --- Computed ---
const filteredPersonnel = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return allPersonnel.value.filter(p => 
    p.firstname.toLowerCase().includes(query) ||
    p.lastname.toLowerCase().includes(query) ||
    (p.nickname && p.nickname.toLowerCase().includes(query)) ||
    (p.position && p.position.toLowerCase().includes(query))
  );
});

// --- Actions ---
const loadData = async () => {
  try {
    const response = await fetch(`${API_URL}/all`);
    if (!response.ok) throw new Error("Load failed");
    allPersonnel.value = await response.json();
  } catch (error) {
    showToast("ไม่สามารถโหลดข้อมูลบุคลากรได้", "error");
  }
};

const openModal = (person = null) => {
  if (person) {
    editId.value = person.personnel_id;
    form.firstname = person.firstname;
    form.lastname = person.lastname;
    form.nickname = person.nickname || '';
    form.position = person.position || '';
  } else {
    editId.value = null;
    resetForm();
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
};

const resetForm = () => {
  form.firstname = '';
  form.lastname = '';
  form.nickname = '';
  form.position = '';
};

const handleFormSubmit = async () => {
  const url = editId.value ? `${API_URL}/${editId.value}` : API_URL;
  const method = editId.value ? "PUT" : "POST";

  try {
    const resp = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form }),
    });

    if (resp.ok) {
      showToast(editId.value ? "อัปเดตข้อมูลสำเร็จ" : "เพิ่มบุคลากรสำเร็จ", "success");
      closeModal();
      await loadData();
    } else {
      throw new Error("Save failed");
    }
  } catch (error) {
    showToast("เกิดข้อผิดพลาด: " + error.message, "error");
  }
};

const handleDelete = async (id) => {
  if (!confirm("ลบข้อมูลบุคลากรนี้?")) return;
  try {
    const resp = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (resp.ok) {
      showToast("ลบข้อมูลเรียบร้อยแล้ว", "success");
      await loadData();
    }
  } catch (error) {
    showToast("ไม่สามารถลบข้อมูลได้", "error");
  }
};

const showToast = (message, type = "success") => {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `${type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white px-4 py-3 rounded shadow-lg mb-2 transition-all duration-300 flex items-center gap-2 min-w-[250px]`;
  toast.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span><span class="text-sm font-medium">${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

onMounted(loadData);
</script>