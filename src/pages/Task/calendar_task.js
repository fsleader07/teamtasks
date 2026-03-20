// เก็บตัวแปร calendar ไว้ข้างนอกเพื่อให้เรียกใช้หรืออัปเดตซ้ำได้
let calendarInstance = null;

const CalendarTask = {
    init() {
        const calendarEl = document.getElementById('calendar');
        
        // ถ้าเคยสร้างปฏิทินไปแล้ว ให้สั่ง render ใหม่อย่างเดียว
        if (calendarInstance) {
            calendarInstance.refetchEvents();
            calendarInstance.render();
            return;
        }

        // ตั้งค่าและสร้างปฏิทิน
        calendarInstance = new FullCalendar.Calendar(calendarEl, {
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

            // 👇👇👇 เพิ่มส่วนนี้เข้าไปเพื่อจัดหน้าตาในกล่องงาน 👇👇👇
            eventContent: function(arg) {
                // ดึงข้อมูลที่ซ่อนไว้ใน extendedProps มาใช้งาน
                let title = arg.event.title;
                let status = arg.event.extendedProps.status || 'ไม่มีสถานะ';
                let priority = arg.event.extendedProps.priority || 'ไม่ระบุ';

                // คืนค่าเป็น HTML เพื่อวาดลงในกรอบของแต่ละงาน
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
            // 👆👆👆 จบส่วนที่เพิ่ม 👆👆👆

            events: async function(fetchInfo, successCallback, failureCallback) {
                try {
                    // เรียกใช้งาน API จาก TaskService
                    const tasks = await TaskService.fetchMyTasks();

                    const mappedEvents = tasks.map(task => {
                        let bgColor = '#007bff'; 
                        if (task.status === 'เสร็จแล้ว' || task.status === 'Completed') {
                            bgColor = '#28a745';
                        } else if (task.status === 'รอดำเนินการ' || task.status === 'Pending') {
                            bgColor = '#ffc107'; 
                        } else if (task.status === 'งานใหม่' || task.status === 'New') {
                            bgColor = '#17a2b8'; 
                        } else if (task.status === 'ยกเลิก' || task.status === 'Cancelled') {
                            bgColor = '#dc3545';
                        }

                        return {
                            id: task.id || task.task_id,
                            title: task.task_name,
                            start: task.deadline,
                            backgroundColor: bgColor,
                            borderColor: 'transparent',
                            textColor: (bgColor === '#ffc107') ? '#333' : '#fff', // สีเหลืองใช้ตัวอักษรสีเข้ม
                            extendedProps: { 
                                status: task.status,
                                priority: task.priority,
                                assignee: task.assignee
                            }
                        };
                    });

                    successCallback(mappedEvents);

                } catch (error) {
                    console.error("โหลดข้อมูลปฏิทินผิดพลาด:", error);
                    failureCallback(error); 
                }
            },

            eventClick: function(info) {
                const taskId = info.event.id;
                const taskName = info.event.title;
                const status = info.event.extendedProps.status || 'ไม่ระบุ';
                const priority = info.event.extendedProps.priority || 'ไม่ระบุ';
                
                console.log('เปิดรายละเอียดงาน ID:', taskId);
                alert(`📌 ชื่องาน: ${taskName}\n📈 สถานะ: ${status}\n🔥 ความสำคัญ: ${priority}`);
            }
        });

        calendarInstance.render();
    }
};