const AddTaskModal = {
  render() {
    return `
        <div id="task-modal" class="fixed inset-0 z-[100] hidden">
            <div class="modal-backdrop absolute inset-0 bg-black/50 backdrop-blur-[1px]" onclick="App.closeModal()"></div>
            
            <div class="flex items-center justify-center min-h-full p-4">
                <div class="modal-content relative bg-white rounded-lg shadow-xl w-full max-w-2xl border-t-[5px] border-blue-600 flex flex-col max-h-[90vh] overflow-hidden">
                    
                    <div class="p-4 border-b border-gray-200 flex justify-between items-center bg-white shrink-0">
                        <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <span>📝</span> <span id="modal-title-text">จัดการข้อมูลงาน</span>
                        </h2>
                        <button onclick="App.closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl transition-colors">&times;</button>
                    </div>

                    <div class="p-6 overflow-y-auto custom-scrollbar bg-[#f8f9fa]">
                        <form id="task-form" class="space-y-4" onsubmit="App.handleFormSubmit(event)">
                            <input type="hidden" id="edit-task-id">
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-600 uppercase mb-1">โครงการ (Project)</label>
                                    <input type="text" id="task-project" name="project" placeholder="กรุณาเลือกโครงการ"
                                        class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:border-blue-500 outline-none transition-all shadow-sm">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-600 uppercase mb-1">ชื่อรายการงาน *</label>
                                    <input type="text" id="task-name" name="task_name" required placeholder="หัวข้อหลักของงาน"
                                        class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:border-blue-500 outline-none transition-all shadow-sm">
                                </div>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-gray-600 uppercase mb-1">📝 รายละเอียดงานอย่างละเอียด *</label>
                                <textarea 
                                    id="task-description" 
                                    name="description" 
                                    required 
                                    rows="3" 
                                    placeholder="ระบุสิ่งที่ต้องทำ..."
                                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:border-blue-500 outline-none resize-none transition-all shadow-sm"
                                ></textarea>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-600 uppercase mb-1">ผู้รับผิดชอบ (Assignee) *</label>
                                    <input type="text" id="task-assignee" name="assignee" required
                                        class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:border-blue-500 outline-none shadow-sm">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-600 uppercase mb-1">ผู้มอบหมาย (Author)</label>
                                    <input type="text" id="task-author" name="author"
                                        class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:border-blue-500 outline-none shadow-sm">
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-600 uppercase mb-1">สถานะ</label>
                                    <select id="task-status" name="status" 
                                        class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:border-blue-500 outline-none shadow-sm cursor-pointer">
                                        <option value="Opened">Opened</option>
                                        <option value="Pending" selected>Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Break">Break</option>
                                        <option value="Success">Success</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-600 uppercase mb-1">ความสำคัญ</label>
                                    <select id="task-priority" name="priority" 
                                        class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:border-blue-500 outline-none shadow-sm cursor-pointer">
                                        <option value="Low" selected>🟢 Low</option>
                                        <option value="Normal">🟡 Normal</option>
                                        <option value="High">🟠 High</option>
                                        <option value="Urgent">🔴 Urgent</option>
                                    </select>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-600 uppercase mb-1">📅 กำหนดส่ง</label>
                                    <input type="date" id="task-deadline" name="deadline" 
                                        class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:border-blue-500 outline-none shadow-sm">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-600 uppercase mb-1">✅ วันที่เสร็จจริง</label>
                                    <input type="date" id="task-completed-at" name="completed_at" 
                                        class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:border-blue-500 outline-none shadow-sm">
                                </div>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-gray-600 uppercase mb-1">หมายเหตุ (Notes)</label>
                                <textarea id="task-note" name="note" rows="2" placeholder="ข้อมูลเพิ่มเติม..."
                                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:border-blue-500 outline-none resize-none shadow-sm"></textarea>
                            </div>
                        </form>
                    </div>

                    <div class="p-4 border-t border-gray-200 bg-gray-50 shrink-0 flex gap-2 justify-end">
                        <button type="button" onclick="App.closeModal()" 
                            class="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm font-medium transition-colors shadow-sm">
                            ยกเลิก
                        </button>
                        <button type="submit" form="task-form"
                            class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-bold transition-all shadow-md active:scale-95">
                            💾 บันทึกข้อมูล
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div id="delete-modal" class="fixed inset-0 z-[110] hidden">
            <div class="modal-backdrop absolute inset-0 bg-black/30" onclick="App.closeDeleteModal()"></div>
            
            <div class="flex items-center justify-center min-h-full p-4">
                <div class="modal-content relative z-[120] bg-white p-6 rounded shadow-lg max-w-sm w-full border-t-4 border-red-500">
                    <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <span class="text-red-500">⚠️</span> ยืนยันการลบ?
                    </h3>
                    <p class="text-gray-600 text-sm mb-6">คุณแน่ใจหรือไม่ที่จะลบรายการนี้? ข้อมูลนี้จะไม่สามารถกู้คืนได้</p>
                    <div class="flex gap-2 justify-end">
                        <button onclick="App.closeDeleteModal()" class="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300">ยกเลิก</button>
                        <button onclick="App.confirmDelete()" class="px-4 py-2 bg-red-600 text-white rounded text-sm font-bold hover:bg-red-700 shadow-md">ลบรายการ</button>
                    </div>
                </div>
            </div>
        </div>`;
  },
};
