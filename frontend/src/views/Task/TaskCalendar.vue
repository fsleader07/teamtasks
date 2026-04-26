<template>
  <div class="calendar-wrapper">
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

// รับค่า tasks ที่ถูก Filter แล้วมาจากตัวแม่
const props = defineProps({
  tasks: {
    type: Array,
    required: true,
    default: () => []
  }
});

// ส่ง Event กลับไปบอกตัวแม่เมื่อคลิกที่งาน
const emit = defineEmits(['event-click']);

// แปลง Data ให้อยู่ใน Format ที่ FullCalendar ต้องการ (Reactive ตาม Filter)
const calendarEvents = computed(() => {
  return props.tasks.map(task => {
    let bgColor = '#007bff'; // สี Default (In Progress / Opened)
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

// ตั้งค่า Options ของ FullCalendar
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
  height: 650,
  events: calendarEvents.value, // นำข้อมูลที่ Map แล้วมาใส่
  
  // Custom HTML สำหรับการ์ดงาน (จาก calendar_task.js เดิม)
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

  // เมื่อกดคลิกที่ Event ในปฏิทิน
  eventClick: function(info) {
    // ส่ง ID งานกลับไปหาหน้า Dashboard เพื่อสั่งเปิด Modal แก้ไข
    emit('event-click', info.event.id);
  }
}));
</script>

<style>
/* อนุญาตให้ Tailwind ทำงานใน FullCalendar HTML Injection ได้ */
.calendar-wrapper .fc-event {
  border: none !important;
}
.calendar-wrapper .fc-event-main {
  padding: 2px !important;
}
</style>