<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-[1px]" @click="closeModal"></div>
    
    <div class="relative bg-white rounded-lg shadow-xl w-full max-w-2xl border-t-[5px] border-blue-600 flex flex-col max-h-[90vh] overflow-hidden">
      <div class="p-4 border-b border-gray-200 flex justify-between items-center bg-white shrink-0">
        <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span>📝</span> <span>{{ isEdit ? 'แก้ไขข้อมูลงาน' : 'เพิ่มงานใหม่' }}</span>
        </h2>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-2xl transition-colors">&times;</button>
      </div>

      <div class="p-6 overflow-y-auto custom-scrollbar bg-[#f8f9fa]">
        <form @submit.prevent="handleFormSubmit" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-600 uppercase mb-1">โครงการ (Project)</label>
              <select v-model="form.project" required class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer">
                <option value="" disabled>เลือกโครงการ...</option>
                <option v-for="proj in projects" :key="proj.project_name" :value="proj.project_name">
                  {{ proj.project_name }}
                </option>
              </select>                                
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-600 uppercase mb-1">ชื่อรายการงาน *</label>
              <input v-model="form.task_name" type="text" required placeholder="หัวข้อหลักของงาน" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:border-blue-500 outline-none transition-all shadow-sm">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-600 uppercase mb-1">📝 รายละเอียดงานอย่างละเอียด</label>
            <textarea v-model="form.description" rows="3" placeholder="ระบุสิ่งที่ต้องทำ..." class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:border-blue-500 outline-none resize-none transition-all shadow-sm"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-600 uppercase mb-1">ผู้รับผิดชอบ (Assignee) *</label>
              <div class="relative">
                <div @click="toggleAssignee" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 cursor-pointer flex justify-between items-center">
                  <span class="truncate">{{ assigneeSelectedText }}</span>
                  <span class="text-xs">▼</span>
                </div>
                <div v-if="showAssigneeDropdown" class="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-40 overflow-y-auto">
                  <label v-for="person in personnel" :key="person.person_id" class="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer">
                    <input type="checkbox" :value="person.person_id" v-model="form.assignee">
                    <span>{{ person.nickname || person.firstname }}</span>
                  </label>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-600 uppercase mb-1">ผู้มอบหมาย (Author)</label>
              <input v-model="form.author" type="text" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:border-blue-500 outline-none shadow-sm">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-600 uppercase mb-1">สถานะ</label>
              <select v-model="form.status" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:border-blue-500 outline-none shadow-sm cursor-pointer">
                <option value="Opened">Opened</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Break">Break</option>
                <option value="Success">Success</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-600 uppercase mb-1">ความสำคัญ</label>
              <select v-model="form.priority" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:border-blue-500 outline-none shadow-sm cursor-pointer">
                <option value="Low">🟢 Low</option>
                <option value="Normal">🟡 Normal</option>
                <option value="High">🟠 High</option>
                <option value="Urgent">🔴 Urgent</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-600 uppercase mb-1">📅 กำหนดส่ง</label>
              <input v-model="form.deadline" type="date" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:border-blue-500 outline-none shadow-sm">
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-600 uppercase mb-1">✅ วันที่เสร็จจริง</label>
              <input v-model="form.completed_at" type="date" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:border-blue-500 outline-none shadow-sm">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-600 uppercase mb-1">หมายเหตุ (Notes)</label>
            <textarea v-model="form.note" rows="2" placeholder="ข้อมูลเพิ่มเติม..." class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:border-blue-500 outline-none resize-none shadow-sm"></textarea>
          </div>
        </form>
      </div>

      <div class="p-4 border-t border-gray-200 bg-gray-50 shrink-0 flex gap-2 justify-end">
        <button type="button" @click="closeModal" class="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm font-medium transition-colors shadow-sm">ยกเลิก</button>
        <button type="button" @click="handleFormSubmit" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-bold transition-all shadow-md active:scale-95">💾 บันทึกข้อมูล</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, defineExpose, defineEmits } from 'vue';
import { TaskService } from './TaskService';

const emit = defineEmits(['saved', 'show-toast']);
const isOpen = ref(false);
const isEdit = ref(false);
const showAssigneeDropdown = ref(false);
const projects = ref([]);
const personnel = ref([]);

const form = reactive({
  id: null,
  project: '',
  task_name: '',
  description: '',
  assignee: [],
  author: '',
  status: 'Pending',
  priority: 'Low',
  deadline: '',
  completed_at: '',
  note: ''
});

const assigneeSelectedText = computed(() => {
  if (form.assignee.length === 0) return 'เลือกผู้รับผิดชอบ';
  const names = form.assignee.map(id => {
    const person = personnel.value.find(p => p.person_id === id);
    return person ? (person.nickname || person.firstname) : id;
  });
  return names.join(', ');
});

const toggleAssignee = () => {
  showAssigneeDropdown.value = !showAssigneeDropdown.value;
};

const open = async (task = null) => {
  try {
    const [projs, persons] = await Promise.all([
      TaskService.loadProjects(),
      TaskService.loadPersonnel()
    ]);
    projects.value = projs || [];
    personnel.value = persons || [];
  } catch (error) {
    emit('show-toast', { message: 'โหลดข้อมูลตัวเลือกไม่สำเร็จ', type: 'error' });
  }

  if (task) {
    isEdit.value = true;
    Object.assign(form, {
      ...task,
      assignee: Array.isArray(task.assignee) ? task.assignee.map(Number) : 
               (typeof task.assignee === 'string' && task.assignee.trim() !== '' ? task.assignee.split(',').map(Number) : [])
    });
  } else {
    isEdit.value = false;
    resetForm();
  }
  showAssigneeDropdown.value = false;
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
};

const resetForm = () => {
  Object.assign(form, {
    id: null, project: '', task_name: '', description: '', assignee: [],
    author: '', status: 'Pending', priority: 'Low', deadline: '', completed_at: '', note: ''
  });
};

const handleFormSubmit = async () => {
  try {
    if (isEdit.value) {
      await TaskService.updateTask(form.id, form);
      emit('show-toast', { message: 'อัปเดตข้อมูลเรียบร้อยแล้ว', type: 'success' });
    } else {
      await TaskService.createTask(form);
      emit('show-toast', { message: 'บันทึกข้อมูลเรียบร้อยแล้ว', type: 'success' });
    }
    emit('saved');
    closeModal();
  } catch (error) {
    emit('show-toast', { message: 'เกิดข้อผิดพลาด: ' + error.message, type: 'error' });
  }
};

defineExpose({ open });
</script>