<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold text-gray-800">จัดการโครงการ (Projects)</h2>
      <button
        @click="openModal()"
        class="bg-[#28a745] hover:bg-[#218838] text-white px-4 py-2 rounded text-sm font-bold shadow transition active:scale-95"
      >
        + เพิ่มโครงการใหม่
      </button>
    </div>

    <div class="bg-white rounded shadow-sm p-4 border border-gray-200">
      <div class="relative max-w-sm">
        <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหาชื่อโครงการ..."
          class="w-full bg-white border border-gray-300 text-gray-800 text-sm rounded py-2 pl-9 pr-4 focus:ring-1 focus:ring-green-500 outline-none"
        />
      </div>
    </div>

    <div class="bg-white rounded shadow-sm overflow-hidden border border-gray-200">
      <div class="px-4 py-3 border-b border-gray-100 font-bold text-gray-700 text-sm">
        รายชื่อโครงการทั้งหมด
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50 text-gray-600 font-bold uppercase text-[11px] border-b">
            <tr>
              <th class="px-4 py-3 text-center border-r w-16">ID</th>
              <th class="px-4 py-3 border-r">ชื่อโครงการ</th>
              <th class="px-4 py-3 border-r">รายละเอียด</th>
              <th class="px-4 py-3 border-r w-32">วันที่เริ่มต้น</th>
              <th class="px-4 py-3 border-r w-32">วันที่สิ้นสุด</th>
              <th class="px-4 py-3 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="project in filteredProjects" :key="project.project_id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-center border-r font-mono text-xs">{{ project.project_id }}</td>
              <td class="px-4 py-3 border-r font-medium text-gray-800">{{ project.project_name }}</td>
              <td class="px-4 py-3 border-r text-gray-600">{{ project.description || "-" }}</td>
              <td class="px-4 py-3 border-r text-gray-600">{{ project.start_date || "-" }}</td>
              <td class="px-4 py-3 border-r text-gray-600">{{ project.end_date || "-" }}</td>
              <td class="px-4 py-3 text-center space-x-3">
                <button @click="openModal(project)" class="text-blue-600 hover:text-blue-800 font-bold text-xs">แก้ไข</button>
                <button @click="handleDelete(project.project_id)" class="text-red-600 hover:text-red-800 font-bold text-xs">ลบ</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredProjects.length === 0" class="py-12 text-center text-gray-400 bg-white">
        <p class="text-3xl mb-1">📁</p>
        <p class="text-sm">ไม่พบข้อมูลโครงการ</p>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        <div class="px-4 py-3 border-b flex justify-between items-center bg-gray-50">
          <h3 class="font-bold text-gray-700">{{ editId ? 'แก้ไขข้อมูลโครงการ' : 'เพิ่มโครงการใหม่' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <form @submit.prevent="handleFormSubmit" class="p-4 space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-600 mb-1">ชื่อโครงการ *</label>
            <input v-model="form.project_name" type="text" required class="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-600 mb-1">รายละเอียด</label>
            <textarea v-model="form.description" rows="3" class="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"></textarea>
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
import { ref, onMounted, computed, reactive } from 'vue';

// --- Configuration ---
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/projects`;

// --- States ---
const allProjects = ref([]);
const searchQuery = ref('');
const isModalOpen = ref(false);
const editId = ref(null);
const form = reactive({
  project_name: '',
  description: ''
});

// --- Computed ---
const filteredProjects = computed(() => {
  return allProjects.value.filter(p => 
    p.project_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// --- Methods ---
const loadData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/all`);
    if (!response.ok) throw new Error("Load failed");
    allProjects.value = await response.json();
  } catch (error) {
    showToast("ไม่สามารถโหลดข้อมูลโครงการได้", "error");
  }
};

const openModal = (project = null) => {
  if (project) {
    editId.value = project.project_id;
    form.project_name = project.project_name;
    form.description = project.description || '';
  } else {
    editId.value = null;
    form.project_name = '';
    form.description = '';
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleFormSubmit = async () => {
  const url = editId.value ? `${API_BASE_URL}/${editId.value}` : API_BASE_URL;
  const method = editId.value ? "PUT" : "POST";

  try {
    const resp = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form }),
    });

    if (resp.ok) {
      showToast(editId.value ? "อัปเดตข้อมูลสำเร็จ" : "เพิ่มโครงการสำเร็จ", "success");
      closeModal();
      await loadData();
    } else {
      const err = await resp.json();
      throw new Error(err.detail || "Save failed");
    }
  } catch (error) {
    showToast("เกิดข้อผิดพลาด: " + error.message, "error");
  }
};

const handleDelete = async (id) => {
  if (!confirm("คุณมั่นใจหรือไม่ที่จะลบโครงการนี้?")) return;
  try {
    const resp = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
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
  const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";
  toast.className = `${bgColor} text-white px-4 py-3 rounded shadow-lg mb-2 transition-all duration-300 flex items-center justify-between min-w-[250px]`;
  toast.innerHTML = `<div class="flex items-center gap-2"><span>${type === "success" ? "✅" : "❌"}</span><span class="text-sm font-medium">${message}</span></div>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// --- Lifecycle ---
onMounted(() => {
  loadData();
});
</script>