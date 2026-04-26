<template>
  <div class="space-y-6 relative min-h-screen">
    <div id="toast-container" class="fixed top-4 right-4 z-[1000] flex flex-col gap-2 pointer-events-none">
      <div v-for="toast in toasts" :key="toast.id" :class="['text-white px-4 py-3 rounded shadow-lg transition-all duration-300 flex items-center justify-between min-w-[250px]', toast.type === 'success' ? 'bg-green-600' : 'bg-red-600']">
        <div class="flex items-center gap-2">
          <span>{{ toast.type === 'success' ? '✅' : '❌' }}</span>
          <span class="text-sm font-medium">{{ toast.message }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded shadow-sm flex border border-gray-200 overflow-hidden">
        <div class="w-1/3 bg-[#17a2b8] flex items-center justify-center text-white text-2xl">📩</div>
        <div class="p-3">
          <p class="text-[10px] text-gray-500 uppercase font-bold">งานใหม่</p>
          <p class="text-xl font-bold text-gray-800">{{ stats.opened }}</p>
        </div>
      </div>
      <div class="bg-white rounded shadow-sm flex border border-gray-200 overflow-hidden">
        <div class="w-1/3 bg-[#ffc107] flex items-center justify-center text-white text-2xl">⏳</div>
        <div class="p-3">
          <p class="text-[10px] text-gray-500 uppercase font-bold">รอดำเนินการ</p>
          <p class="text-xl font-bold text-gray-800">{{ stats.pending }}</p>
        </div>
      </div>
      <div class="bg-white rounded shadow-sm flex border border-gray-200 overflow-hidden">
        <div class="w-1/3 bg-[#007bff] flex items-center justify-center text-white text-2xl">🏃</div>
        <div class="p-3">
          <p class="text-[10px] text-gray-500 uppercase font-bold">กำลังดำเนินการ</p>
          <p class="text-xl font-bold text-gray-800">{{ stats.progress }}</p>
        </div>
      </div>
      <div class="bg-white rounded shadow-sm flex border border-gray-200 overflow-hidden">
        <div class="w-1/3 bg-[#28a745] flex items-center justify-center text-white text-2xl">✅</div>
        <div class="p-3">
          <p class="text-[10px] text-gray-500 uppercase font-bold">เสร็จแล้ว</p>
          <p class="text-xl font-bold text-gray-800">{{ stats.success }}</p>
        </div>
      </div>
    </div>

    <div class="text-right">
      <button @click="openAddModal" class="bg-[#007bff] hover:bg-[#0069d9] text-white px-4 py-2 rounded text-sm font-bold shadow transition active:scale-95">
        + เพิ่มงานใหม่
      </button>
    </div>

    <div class="bg-white rounded shadow-sm p-4 border border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div class="relative">
          <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">🔍</span>
          <input v-model="filters.search" type="text" placeholder="ค้นหาชื่องาน..." class="w-full bg-white border border-gray-300 text-gray-800 text-sm rounded py-2 pl-9 pr-4 focus:ring-1 focus:ring-blue-500 outline-none" />
        </div>
        <select v-model="filters.project" class="bg-white border border-gray-300 text-sm rounded py-2 px-3 outline-none focus:ring-1 focus:ring-blue-500">
          <option value="">โครงการทั้งหมด</option>
          <option v-for="proj in allProjects" :key="proj.project_name" :value="proj.project_name">{{ proj.project_name }}</option>
        </select>
        <select v-model="filters.assignee" class="bg-white border border-gray-300 text-sm rounded py-2 px-3 outline-none focus:ring-1 focus:ring-blue-500">
          <option value="">ผู้รับผิดชอบทั้งหมด</option>
          <option v-for="user in allPersonnel" :key="user.person_id" :value="user.nickname || user.firstname">{{ user.nickname || user.firstname }}</option>
        </select>
        <button @click="resetFilters" class="text-blue-600 hover:text-blue-800 text-sm font-medium">🔄 ล้างค่า</button>
      </div>
    </div>

    <div class="bg-white rounded shadow-sm overflow-hidden border border-gray-200">
      <div class="px-4 py-3 border-b border-gray-100 font-bold text-gray-700 text-sm">รายการงานปัจจุบัน</div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50 text-gray-600 font-bold uppercase text-[11px] border-b">
            <tr>
              <th class="px-4 py-3 text-center border-r">No.</th>
              <th class="px-4 py-3 border-r cursor-pointer hover:bg-gray-100" @click="sortBy('project')">Project</th>
              <th class="px-4 py-3 border-r cursor-pointer hover:bg-gray-100" @click="sortBy('task_name')">ชื่องาน</th>
              <th class="px-4 py-3 border-r cursor-pointer hover:bg-gray-100" @click="sortBy('assignee')">ผู้รับผิดชอบ</th>
              <th class="px-4 py-3 border-r text-center cursor-pointer hover:bg-gray-100" @click="sortBy('status')">สถานะ</th>
              <th class="px-4 py-3 border-r text-center cursor-pointer hover:bg-gray-100" @click="sortBy('priority')">Priority</th>
              <th class="px-4 py-3 border-r text-center cursor-pointer hover:bg-gray-100" @click="sortBy('author')">ผู้มอบหมาย</th>
              <th class="px-4 py-3 border-r cursor-pointer hover:bg-gray-100" @click="sortBy('deadline')">กำหนดส่ง</th>
              <th class="px-4 py-3 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="(task, index) in filteredTasks" :key="task.id" :class="['border-b border-gray-200 hover:bg-gray-50 transition-colors', index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30']">
              <td class="px-4 py-3 text-center text-gray-500 text-xs font-medium border-r border-gray-100">{{ index + 1 }}</td>
              <td class="px-4 py-3 border-r border-gray-100">
                <span class="text-[#007bff] font-bold text-[11px] uppercase tracking-wider">{{ task.project || '-' }}</span>
              </td>
              <td class="px-4 py-3 border-r border-gray-100">
                <div class="text-gray-800 font-semibold text-sm">{{ task.task_name }}</div>
                <div v-if="task.note" class="text-[10px] text-gray-400 mt-0.5 italic">Note: {{ task.note }}</div>
              </td>
              <td class="px-4 py-3 text-gray-700 text-sm border-r border-gray-100 font-medium">
                {{ task.assignee_names?.length ? task.assignee_names.join(", ") : "-" }}
              </td>
              <td class="px-4 py-3 text-center border-r border-gray-100">
                <span :class="['inline-block px-2 py-0.5 rounded text-[10px] font-bold shadow-sm', getStatusClass(task.status)]">{{ task.status?.toUpperCase() }}</span>
              </td>
              <td class="px-4 py-3 text-center border-r border-gray-100">
                <span :class="['text-[10px] font-black tracking-tighter', getUrgencyTextColor(task.priority)]">{{ getUrgencyLabel(task.priority) }}</span>
              </td>
              <td class="px-4 py-3 text-gray-500 text-xs border-r border-gray-100">{{ task.author || '-' }}</td>
              <td class="px-4 py-3 text-gray-600 text-[12px] whitespace-nowrap border-r border-gray-100">📅 {{ formatDate(task.deadline) }}</td>
              <td class="px-4 py-3 text-center">
                <div class="flex gap-3 justify-center">
                  <button @click="handleEdit(task)" class="text-blue-500 hover:text-blue-700 transition-colors p-1 hover:bg-blue-50 rounded" title="แก้ไข">✎</button>
                  <button @click="handleDelete(task.id)" class="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded" title="ลบ">✖</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="filteredTasks.length === 0" class="py-12 text-center text-gray-400 bg-white">
        <p class="text-3xl mb-1">📭</p>
        <p class="text-sm">ไม่พบข้อมูลงาน</p>
      </div>
    </div>

    <div v-if="taskToDelete" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/30" @click="taskToDelete = null"></div>
      <div class="relative z-[120] bg-white p-6 rounded shadow-lg max-w-sm w-full border-t-4 border-red-500">
        <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2"><span class="text-red-500">⚠️</span> ยืนยันการลบ?</h3>
        <p class="text-gray-600 text-sm mb-6">คุณแน่ใจหรือไม่ที่จะลบรายการนี้? ข้อมูลนี้จะไม่สามารถกู้คืนได้</p>
        <div class="flex gap-2 justify-end">
          <button @click="taskToDelete = null" class="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300">ยกเลิก</button>
          <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded text-sm font-bold hover:bg-red-700 shadow-md">ลบรายการ</button>
        </div>
      </div>
    </div>

    <TaskModal ref="taskModalRef" @saved="loadData" @show-toast="showToast" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { TaskService } from './Task/TaskService';
import TaskModal from './Task/TaskModal.vue';

// State
const allTasks = ref([]);
const allProjects = ref([]);
const allPersonnel = ref([]);
const taskModalRef = ref(null);
const taskToDelete = ref(null);
const toasts = ref([]);
let toastIdCount = 0;

const filters = reactive({ search: '', project: '', assignee: '' });
const sortConfig = reactive({ key: 'id', direction: 'asc' });

// Load Data (เหมือน app.loadData)
const loadData = async () => {
  try {
    const [tasks, projects, personnel] = await Promise.all([
      TaskService.fetchMyTasks('all'),
      TaskService.loadProjects(),
      TaskService.loadPersonnel(),
    ]);
    allTasks.value = tasks || [];
    allProjects.value = projects || [];
    allPersonnel.value = personnel || [];
  } catch (error) {
    showToast({ message: "ไม่สามารถโหลดข้อมูลได้", type: "error" });
  }
};

onMounted(loadData);

// Computed: Filters & Sorting & Stats
const filteredTasks = computed(() => {
  let result = allTasks.value.filter(task => {
    const matchSearch = task.task_name.toLowerCase().includes(filters.search.toLowerCase());
    const matchProject = filters.project === '' || task.project === filters.project;
    const matchAssignee = filters.assignee === '' || (task.assignee_names && task.assignee_names.includes(filters.assignee));
    return matchSearch && matchProject && matchAssignee;
  });

  if (sortConfig.key) {
    result.sort((a, b) => {
      const valA = String(a[sortConfig.key] || '').toLowerCase();
      const valB = String(b[sortConfig.key] || '').toLowerCase();
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }
  return result;
});

const stats = computed(() => ({
  opened: allTasks.value.filter(t => t.status?.toLowerCase() === 'opened').length,
  pending: allTasks.value.filter(t => t.status?.toLowerCase() === 'pending').length,
  progress: allTasks.value.filter(t => t.status?.toLowerCase() === 'in progress').length,
  success: allTasks.value.filter(t => t.status?.toLowerCase() === 'success').length,
}));

// Actions
const sortBy = (key) => {
  if (sortConfig.key === key) {
    sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
  } else {
    sortConfig.key = key;
    sortConfig.direction = 'asc';
  }
};

const resetFilters = () => {
  filters.search = ''; filters.project = ''; filters.assignee = '';
};

const openAddModal = () => taskModalRef.value.open();
const handleEdit = (task) => taskModalRef.value.open(task);

const handleDelete = (id) => { taskToDelete.value = id; };
const confirmDelete = async () => {
  try {
    await TaskService.deleteTask(taskToDelete.value);
    showToast({ message: "ลบข้อมูลเรียบร้อยแล้ว", type: "success" });
    taskToDelete.value = null;
    loadData();
  } catch (error) {
    showToast({ message: "เกิดข้อผิดพลาดในการลบ", type: "error" });
  }
};

// UI Helpers (จาก table_task.js)
const getStatusClass = (status) => {
  const s = String(status || '').toLowerCase();
  if (s === "success") return "bg-[#28a745] text-white";
  if (s === "pending") return "bg-[#ffc107] text-[#212529]";
  if (s === "break") return "bg-[#dc3545] text-white";
  if (s === "opened") return "bg-[#17a2b8] text-white";
  return "bg-gray-400 text-white";
};
const getUrgencyLabel = (p) => ({ high: "🔴 HIGH", normal: "🟡 NORMAL", low: "🟢 LOW" }[String(p || '').toLowerCase()] || p);
const getUrgencyTextColor = (p) => ({ high: "text-red-600", normal: "text-orange-500", low: "text-green-600" }[String(p || '').toLowerCase()] || "text-gray-500");
const formatDate = (d) => d ? new Date(d).toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "2-digit" }) : "-";

// Toast Logic
const showToast = ({ message, type }) => {
  const id = toastIdCount++;
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }, 3000);
};
</script>

<style scoped>
/* ใส่ Custom CSS (ถ้ามี) สำหรับ Scrollbar หรืออื่นๆ ได้ที่นี่ */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #aaa; }
</style>