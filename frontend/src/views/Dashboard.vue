<template>
  <div class="space-y-6 relative min-h-screen p-4 bg-gray-50">
    <div id="toast-container" class="fixed top-4 right-4 z-[1000] flex flex-col gap-2 pointer-events-none">
      <div v-for="toast in toasts" :key="toast.id" :class="['text-white px-4 py-3 rounded shadow-lg transition-all duration-300 flex items-center justify-between min-w-[250px]', toast.type === 'success' ? 'bg-green-600' : 'bg-red-600']">
        <div class="flex items-center gap-2">
          <span>{{ toast.type === 'success' ? '✅' : '❌' }}</span>
          <span class="text-sm font-medium">{{ toast.message }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(stat, key) in statConfig" :key="key" class="bg-white rounded shadow-sm flex border border-gray-200 overflow-hidden">
        <div :class="['w-1/3 flex items-center justify-center text-white text-2xl', stat.color]">{{ stat.icon }}</div>
        <div class="p-3">
          <p class="text-[10px] text-gray-500 uppercase font-bold">{{ stat.label }}</p>
          <p class="text-xl font-bold text-gray-800">{{ stats[key] }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <div class="lg:col-span-8 space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-bold text-gray-700">รายการงานปัจจุบัน</h2>
        </div>

        <div class="bg-white rounded shadow-sm p-4 border border-gray-200">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="relative">
              <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">🔍</span>
              <input v-model="filters.search" type="text" placeholder="ค้นหาชื่องาน..." class="w-full bg-white border border-gray-300 text-gray-800 text-sm rounded py-2 pl-9 pr-4 focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
            <select v-model="filters.project" class="bg-white border border-gray-300 text-sm rounded py-2 px-3 outline-none focus:ring-1 focus:ring-blue-500">
              <option value="">ทุกโครงการ</option>
              <option v-for="proj in allProjects" :key="proj.project_name" :value="proj.project_name">{{ proj.project_name }}</option>
            </select>
            <div class="flex items-center gap-3">
              <select v-model="filters.assignee" class="flex-1 bg-white border border-gray-300 text-sm rounded py-2 px-3 outline-none focus:ring-1 focus:ring-blue-500">
                <option value="">ผู้รับผิดชอบทั้งหมด</option>
                <option v-for="user in allPersonnel" :key="user.person_id" :value="user.nickname || user.firstname">{{ user.nickname || user.firstname }}</option>
              </select>
              <button @click="resetFilters" class="text-blue-600 hover:text-blue-800 text-sm font-medium">🔄</button>
            </div>
          </div>
        </div>

        <div class="bg-white rounded shadow-sm overflow-hidden border border-gray-200">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-gray-50 text-gray-600 font-bold uppercase text-[11px] border-b">
                <tr>
                  <th class="px-4 py-3 text-center border-r">No.</th>
                  <th class="px-4 py-3 border-r cursor-pointer" @click="sortBy('project')">Project</th>
                  <th class="px-4 py-3 border-r cursor-pointer" @click="sortBy('task_name')">Task</th>
                  <th class="px-4 py-3 border-r text-center">Status</th>
                  <th class="px-4 py-3 text-center">Manage</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(task, index) in filteredTasks" :key="task.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3 text-center text-gray-500 text-xs border-r">{{ index + 1 }}</td>
                  <td class="px-4 py-3 border-r font-bold text-[#007bff] text-[10px]">{{ task.project || '-' }}</td>
                  <td class="px-4 py-3 border-r">
                    <div class="font-semibold text-gray-800">{{ task.task_name }}</div>
                    <div v-if="task.deadline" class="text-[9px] text-gray-400">📅 {{ formatDate(task.deadline) }}</div>
                  </td>
                  <td class="px-4 py-3 text-center border-r">
                    <span :class="['inline-block px-2 py-0.5 rounded text-[10px] font-bold shadow-sm', getStatusClass(task.status)]">{{ task.status?.toUpperCase() }}</span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <div class="flex gap-2 justify-center">
                      <button @click="handleEdit(task)" class="text-blue-500 hover:bg-blue-50 p-1 rounded">✎</button>
                      <button @click="handleDelete(task.id)" class="text-red-500 hover:bg-red-50 p-1 rounded">✖</button>
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
      </div>

      <div class="lg:col-span-4 space-y-4">
        <h2 class="text-lg font-bold text-gray-700">ปฏิทินแผนงาน</h2>
        <div class="bg-white rounded shadow-sm border border-gray-200 p-2 overflow-hidden sticky top-4">
          <TaskCalendar :tasks="allTasks" @select-task="handleEdit" />
          
          <div class="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
            <div class="flex items-center gap-2 text-[10px] text-gray-500">
              <span class="w-2 h-2 rounded-full bg-red-500"></span> High Priority
            </div>
            <div class="flex items-center gap-2 text-[10px] text-gray-500">
              <span class="w-2 h-2 rounded-full bg-green-500"></span> Completed
            </div>
          </div>
        </div>
      </div>

    </div>

    <div v-if="taskToDelete" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/30" @click="taskToDelete = null"></div>
      <div class="relative z-[120] bg-white p-6 rounded shadow-lg max-w-sm w-full border-t-4 border-red-500">
        <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">⚠️ ยืนยันการลบ?</h3>
        <p class="text-gray-600 text-sm mb-6">คุณแน่ใจหรือไม่ที่จะลบรายการนี้?</p>
        <div class="flex gap-2 justify-end">
          <button @click="taskToDelete = null" class="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm font-medium">ยกเลิก</button>
          <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded text-sm font-bold shadow-md">ลบรายการ</button>
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
import TaskCalendar from './Task/TaskCalendar.vue';

// State
const allTasks = ref([]);
const allProjects = ref([]);
const allPersonnel = ref([]);
const taskModalRef = ref(null);
const taskToDelete = ref(null);
const toasts = ref([]);
let toastIdCount = 0;

// Config สำหรับสรุป Dashboard
const statConfig = {
  opened: { label: 'งานใหม่', icon: '📩', color: 'bg-[#17a2b8]' },
  pending: { label: 'รอดำเนินการ', icon: '⏳', color: 'bg-[#ffc107]' },
  progress: { label: 'กำลังดำเนินการ', icon: '🏃', color: 'bg-[#007bff]' },
  success: { label: 'เสร็จแล้ว', icon: '✅', color: 'bg-[#28a745]' }
};

const filters = reactive({ search: '', project: '', assignee: '' });
const sortConfig = reactive({ key: 'id', direction: 'asc' });

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

const filteredTasks = computed(() => {
  let result = allTasks.value.filter(task => {
    const matchSearch = task.task_name?.toLowerCase().includes(filters.search.toLowerCase());
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

// UI Helpers
const getStatusClass = (status) => {
  const s = String(status || '').toLowerCase();
  if (s === "success") return "bg-[#28a745] text-white";
  if (s === "pending") return "bg-[#ffc107] text-[#212529]";
  if (s === "opened") return "bg-[#17a2b8] text-white";
  return "bg-gray-400 text-white";
};
const formatDate = (d) => d ? new Date(d).toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit" }) : "-";

const showToast = ({ message, type }) => {
  const id = toastIdCount++;
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }, 3000);
};
</script>