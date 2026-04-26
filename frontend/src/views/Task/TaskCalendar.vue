<template>
  <div class="calendar-wrapper">
    <div v-if="isLoading" class="flex justify-center items-center h-[650px] bg-gray-50/50">
       <span class="text-sm text-gray-500">กำลังดึงข้อมูลงาน...</span>
    </div>
    <FullCalendar v-else :options="calendarOptions" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineEmits } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

import { fetchMyAllTasks } from '@/views/Task/TaskService'; 

const tasks = ref([]);
const isLoading = ref(true);
const emit = defineEmits(['event-click']);

const loadTasks = async () => {
  try {
    isLoading.value = true;
    const response = await fetchMyAllTasks(); 
    tasks.value = response || [];
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadTasks();
});

const calendarEvents = computed(() => {
  return tasks.value.map(task => {
    let bgColor = '#007bff';
    const status = String(task.status || '').toLowerCase();
    
    if (status === 'เสร็จแล้ว' || status === 'success') {
      bgColor = '#28a745';
    } else if (status === 'รอดำเนินการ' || status === 'pending') {
      bgColor = '#ffc107'; 
    } else if (status === 'งานใหม่' || status === 'new') {
      bgColor = '#17a2b8'; 
    } else if (status === 'ยกเลิก' || status === 'cancelled' || status === 'break') {
      bgColor = '#dc3545';
    }

    return {
      id: task.id || task.task_id,
      title: task.task_name,
      start: task.deadline,
      backgroundColor: bgColor,
      borderColor: 'transparent',
      textColor: (bgColor === '#ffc107') ? '#333' : '#fff',
      extendedProps: { 
        status: task.status || 'ไม่มีสถานะ',
        priority: task.priority || 'ไม่ระบุ',
        assignee: task.assignee
      }
    };
  });
});

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
  initialView: 'dayGridMonth',
  locale: 'th',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,listWeek'
  },
  buttonText: {
    today: 'วันนี้',
    month: 'เดือน',
    week: 'สัปดาห์',
    list: 'รายการ'
  },
  height: 450,
  events: calendarEvents.value, 
  
  eventContent: function(arg) {
    const title = arg.event.title;
    const status = arg.event.extendedProps.status;
    const priority = arg.event.extendedProps.priority;

    return {
      html: `
        <div class="w-full overflow-hidden p-0.5 cursor-pointer">
          <div class="font-bold text-[11px] truncate leading-tight">${title}</div>
          <div class="flex flex-wrap items-center gap-1 mt-1 text-[9px] opacity-90">
            <span class="bg-black/10 px-1 rounded leading-none py-0.5">🔥 ${priority}</span>
            <span class="bg-black/10 px-1 rounded leading-none py-0.5">📌 ${status}</span>
          </div>
        </div>
      `
    };
  },

  eventClick: function(info) {
    emit('event-click', info.event.id);
  }
}));
</script>

<style>
.calendar-wrapper .fc-event {
  border: none !important;
}
.calendar-wrapper .fc-event-main {
  padding: 2px !important;
}
</style>