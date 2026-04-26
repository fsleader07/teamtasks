<template>
  <div class="calendar-wrapper">
    <div v-if="isLoading" class="flex justify-center items-center h-[650px] bg-gray-50/50">
      <span class="text-sm text-gray-500">กำลังดึงข้อมูลงาน...</span>
    </div>
    <FullCalendar v-else :options="calendarOptions" />
  </div>

  <div v-if="isModalOpen" class="fixed inset-0 z-[9999] overflow-y-auto">
    <div class="fixed inset-0 bg-black/50 transition-opacity" @click="isModalOpen = false"></div>

    <div class="flex min-h-full items-center justify-center p-4">
      <div
        class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-md"
      >
        <div class="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">รายละเอียดงาน</h3>
          <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600">
            <span class="text-2xl">&times;</span>
          </button>
        </div>

        <div class="bg-white px-6 py-4">
          <div class="space-y-4">
            <div>
              <label class="text-xs text-gray-500 uppercase tracking-wider">ชื่องาน</label>
              <p class="text-md font-medium text-gray-800">{{ selectedTask?.task_name }}</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs text-gray-500 uppercase tracking-wider">สถานะ</label>
                <div class="mt-1">
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-full text-xs font-semibold',
                      selectedTask?.status === 'เสร็จแล้ว'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800',
                    ]"
                  >
                    {{ selectedTask?.status }}
                  </span>
                </div>
              </div>
              <div>
                <label class="text-xs text-gray-500 uppercase tracking-wider">กำหนดส่ง</label>
                <p class="text-sm text-gray-700">{{ selectedTask?.deadline }}</p>
              </div>
            </div>

            <div>
              <label class="text-xs text-gray-500 uppercase tracking-wider">ผู้รับผิดชอบ</label>
              <p class="text-sm text-gray-700">{{ selectedTask?.assignee || 'ยังไม่ได้ระบุ' }}</p>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 px-4 py-3 border-t flex justify-end">
          <button
            @click="isModalOpen = false"
            class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineEmits } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'

import { fetchMyAllTasks } from '@/views/Task/TaskService'

const tasks = ref([])
const isLoading = ref(true)
const emit = defineEmits(['event-click'])

const loadTasks = async () => {
  try {
    isLoading.value = true
    const response = await fetchMyAllTasks()
    tasks.value = response || []
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadTasks()
})

const isModalOpen = ref(false)
const selectedTask = ref(null)

const calendarEvents = computed(() => {
  return tasks.value.map((task) => {
    let bgColor = '#007bff'
    const status = String(task.status || '').toLowerCase()

    if (status === 'เสร็จแล้ว' || status === 'success') {
      bgColor = '#28a745'
    } else if (status === 'รอดำเนินการ' || status === 'pending') {
      bgColor = '#ffc107'
    } else if (status === 'งานใหม่' || status === 'new') {
      bgColor = '#17a2b8'
    } else if (status === 'ยกเลิก' || status === 'cancelled' || status === 'break') {
      bgColor = '#dc3545'
    }

    return {
      id: task.id || task.task_id,
      title: task.task_name,
      start: task.deadline,
      backgroundColor: bgColor,
      borderColor: 'transparent',
      textColor: bgColor === '#ffc107' ? '#333' : '#fff',
      extendedProps: {
        status: task.status || 'ไม่มีสถานะ',
        priority: task.priority || 'ไม่ระบุ',
        assignee: task.assignee,
      },
    }
  })
})

const handleEventClick = (info) => {
  const taskId = info.event.id
  const task = tasks.value.find((t) => (t.id || t.task_id) == taskId)

  if (task) {
    selectedTask.value = task
    isModalOpen.value = true
  }

  emit('event-click', taskId)
}

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
  initialView: 'dayGridMonth',
  locale: 'th',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,listWeek',
  },
  buttonText: {
    today: 'วันนี้',
    month: 'เดือน',
    week: 'สัปดาห์',
    list: 'รายการ',
  },
  height: 'auto',
  contentHeight: 'auto',
  aspectRatio: 1.35,
  fixedWeekCount: false,
  expandRows: true,
  handleWindowResize: true,

  headerToolbar: {
    left: 'prev,next',
    center: 'title',
    right: 'dayGridMonth,listWeek',
  },

  events: calendarEvents.value,

  eventContent: function (arg) {
    const title = arg.event.title
    const status = arg.event.extendedProps.status
    const priority = arg.event.extendedProps.priority

    return {
      html: `
        <div class="w-full overflow-hidden p-0.5 cursor-pointer">
          <div class="font-bold text-[11px] truncate leading-tight">${title}</div>
          <div class="flex flex-wrap items-center gap-1 mt-1 text-[8px] opacity-90">
            <span class="bg-black/10 px-1 rounded leading-none py-0.5">🔥${priority}</span>
            <span class="bg-black/10 px-1 rounded leading-none py-0.5">📌${status}</span>
          </div>
        </div>
      `,
    }
  },

  eventClick: handleEventClick,
}))
</script>

<style scoped>
/* ลดขนาด Header (ชื่อเดือนและปุ่ม) */
:deep(.fc .fc-toolbar-title) {
  font-size: 16px !important;
  font-weight: bold;
}

:deep(.fc .fc-button) {
  padding: 2px 6px !important;
  font-size: 11px !important;
}

/* ลดขนาดชื่อวัน (อา. จ. อ. ...) */
:deep(.fc .fc-col-header-cell-cushion) {
  font-size: 11px !important;
  padding: 4px 0 !important;
}

/* ลดขนาดตัวเลขวันที่ */
:deep(.fc .fc-daygrid-day-number) {
  font-size: 12.5px !important;
  padding: 2px 4px !important;
}

/* ลดความสูงของแต่ละแถววันที่ */
:deep(.fc .fc-daygrid-day-frame) {
  min-height: 50px !important; /* ปรับค่านี้เพื่อควบคุมความสูงขั้นต่ำ */
}

/* จัดการ Event ให้นอนเต็มพื้นที่และตัวอักษรเล็ก */
:deep(.fc-event) {
  margin-top: 1px !important;
  margin-bottom: 1px !important;
  border-radius: 3px !important;
}

/* ปรับแต่ง Scrollbar ของเครื่อง (กรณีที่ Layout รวมยาวกว่าหน้าจอ) */
.calendar-wrapper {
  max-width: 100%;
  overflow: hidden; /* ป้องกันการเลื่อนซ้ายขวา */
}
</style>
