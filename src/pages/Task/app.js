const App = {
  // เก็บข้อมูลไว้ภายใน Object เพื่อความเป็นอิสระในแต่ละหน้า
  allTasks: [],
  filteredTasks: [],
  currentFilter: "all",
  sortConfig: { key: "id", direction: "asc" },
  taskToDelete: null,

  async init() {
    // รีเซ็ตข้อมูลทุกครั้งที่ Init หน้าใหม่
    this.allTasks = [];
    this.filteredTasks = [];

    const placeholder = document.getElementById("modal-placeholder");
    if (placeholder && typeof AddTaskModal !== "undefined") {
      placeholder.innerHTML = AddTaskModal.render();
    }
    await this.loadData();
  },

  async loadData() {
    try {
      // ดึงข้อมูลใหม่จาก Service
      this.allTasks = await TaskService.fetchMyTasks(this.currentFilter);
      this.updateFilterOptions();
      this.applyFilters();
    } catch (error) {
      console.error("Load Data Error:", error);
    }
  },

  updateFilterOptions() {
    const projects = [...new Set(this.allTasks.map((t) => t.project))].filter(
      Boolean,
    );
    const assignees = [...new Set(this.allTasks.map((t) => t.assignee))].filter(
      Boolean,
    );

    const pSelect = document.getElementById("filter-project");
    const aSelect = document.getElementById("filter-assignee");

    if (pSelect) {
      pSelect.innerHTML =
        '<option value="">โครงการทั้งหมด</option>' +
        projects.map((p) => `<option value="${p}">${p}</option>`).join("");
    }
    if (aSelect) {
      aSelect.innerHTML =
        '<option value="">ผู้รับผิดชอบทั้งหมด</option>' +
        assignees.map((a) => `<option value="${a}">${a}</option>`).join("");
    }
  },

  applyFilters() {
    const searchText =
      document.getElementById("search-input")?.value.toLowerCase() || "";
    const projectFilter =
      document.getElementById("filter-project")?.value || "";
    const assigneeFilter =
      document.getElementById("filter-assignee")?.value || "";

    this.filteredTasks = this.allTasks.filter((task) => {
      const matchSearch = task.task_name.toLowerCase().includes(searchText);
      const matchProject =
        projectFilter === "" || task.project === projectFilter;
      const matchAssignee =
        assigneeFilter === "" || task.assignee === assigneeFilter;
      return matchSearch && matchProject && matchAssignee;
    });

    this.render();
    this.updateStats();
  },

  handleFilterChange() {
    this.applyFilters();
  },

  resetFilters() {
    const sInput = document.getElementById("search-input");
    const pFilter = document.getElementById("filter-project");
    const aFilter = document.getElementById("filter-assignee");

    if (sInput) sInput.value = "";
    if (pFilter) pFilter.value = "";
    if (aFilter) aFilter.value = "";
    this.applyFilters();
  },

  handleEdit(id) {
    const task = this.allTasks.find((t) => String(t.id) === String(id));
    if (!task) return;

    document.getElementById("modal-title-text").textContent = "แก้ไขข้อมูลงาน";
    document.getElementById("edit-task-id").value = task.id;

    document.getElementById("task-project").value = task.project || "";
    document.getElementById("task-name").value = task.task_name || "";
    document.getElementById("task-description").value =
      task.description || task.task_name || "";
    document.getElementById("task-assignee").value = task.assignee || "";
    document.getElementById("task-author").value = task.author || "";
    document.getElementById("task-status").value = task.status || "Pending";
    document.getElementById("task-priority").value = task.priority || "Normal";

    if (task.deadline)
      document.getElementById("task-deadline").value =
        task.deadline.split("T")[0];
    if (task.completed_at)
      document.getElementById("task-completed-at").value =
        task.completed_at.split("T")[0];

    document.getElementById("task-note").value = task.note || "";
    document.getElementById("task-modal").classList.remove("hidden");
  },

  async confirmDelete() {
    if (!this.taskToDelete) return;
    try {
      await TaskService.deleteTask(this.taskToDelete);
      this.showToast("ลบข้อมูลเรียบร้อยแล้ว", "success");
      this.closeDeleteModal();
      await this.loadData(); // โหลดใหม่หลังลบ
    } catch (error) {
      this.showToast("เกิดข้อผิดพลาดในการลบ: " + error.message, "error");
    }
  },

  async handleFormSubmit(event) {
    // 1. ป้องกันเบราว์เซอร์รีเฟรชหน้าจอ
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const taskId = document.getElementById("edit-task-id").value;

    // 2. รวบรวมข้อมูลจากฟอร์ม
    const taskData = {
      project: formData.get("project") || null,
      task_name: formData.get("task_name"),
      assignee: formData.get("assignee") || null,
      author: formData.get("author") || null,
      status: formData.get("status") || "Pending",
      priority: formData.get("priority") || "Normal",
      deadline: formData.get("deadline") || null,
      completed_at: formData.get("completed_at") || null,
      note: formData.get("note") || null,
    };

    try {
      if (taskId) {
        // กรณีแก้ไขข้อมูล
        await TaskService.updateTask(taskId, taskData);
        this.showToast("อัปเดตข้อมูลเรียบร้อยแล้ว", "success");
      } else {
        // กรณีเพิ่มงานใหม่
        await TaskService.createTask(taskData);
        this.showToast("บันทึกข้อมูลเรียบร้อยแล้ว", "success");
      }

      // 3. ปิดหน้าต่าง Modal และโหลดข้อมูลใหม่
      this.closeModal();
      await this.loadData();
    } catch (error) {
      console.error("Submit Error:", error);
      this.showToast("เกิดข้อผิดพลาด: " + error.message, "error");
    }
  },

  sortBy(key) {
    if (this.sortConfig.key === key) {
      this.sortConfig.direction =
        this.sortConfig.direction === "asc" ? "desc" : "asc";
    } else {
      this.sortConfig.key = key;
      this.sortConfig.direction = "asc";
    }

    this.filteredTasks.sort((a, b) => {
      const valA = String(a[key] || "").toLowerCase();
      const valB = String(b[key] || "").toLowerCase();
      if (valA < valB) return this.sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return this.sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    this.render();
  },

  render() {
    const list = document.getElementById("task-list");
    const emptyState = document.getElementById("empty-state");
    if (!list) return;

    list.innerHTML = "";

    if (this.filteredTasks.length === 0) {
      emptyState?.classList.remove("hidden");
    } else {
      emptyState?.classList.add("hidden");
      this.filteredTasks.forEach((task, index) => {
        const row = UI.createTaskRow(task, index);
        list.appendChild(row);
      });
    }
  },

  updateStats() {
    const elements = {
      opened: document.getElementById("opened-tasks"),
      pending: document.getElementById("pending-tasks"),
      progress: document.getElementById("in-progress-tasks"),
      success: document.getElementById("completed-tasks"),
    };

    if (elements.opened)
      elements.opened.textContent = this.allTasks.filter(
        (t) => t.status?.toLowerCase() === "opened",
      ).length;
    if (elements.pending)
      elements.pending.textContent = this.allTasks.filter(
        (t) => t.status?.toLowerCase() === "pending",
      ).length;
    if (elements.progress)
      elements.progress.textContent = this.allTasks.filter(
        (t) => t.status?.toLowerCase() === "in progress",
      ).length;
    if (elements.success)
      elements.success.textContent = this.allTasks.filter(
        (t) => t.status?.toLowerCase() === "success",
      ).length;
  },

  // ... (ฟังก์ชันอื่นๆ เช่น openAddModal, closeModal, handleDelete คงเดิมแต่เรียกใช้ this ถ้าจำเป็น)
  openAddModal() {
    const title = document.getElementById("modal-title-text");
    const editId = document.getElementById("edit-task-id");
    const form = document.getElementById("task-form");

    if (title) title.textContent = "เพิ่มงานใหม่";
    if (editId) editId.value = "";
    if (form) form.reset();
    document.getElementById("task-modal")?.classList.remove("hidden");
  },

  closeModal() {
    document.getElementById("task-modal")?.classList.add("hidden");
  },

  handleDelete(id) {
    this.taskToDelete = id;
    document.getElementById("delete-modal")?.classList.remove("hidden");
  },

  closeDeleteModal() {
    document.getElementById("delete-modal")?.classList.add("hidden");
    this.taskToDelete = null;
  },

  showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";
    toast.className = `${bgColor} text-white px-4 py-3 rounded shadow-lg mb-2 transition-all duration-300 flex items-center justify-between min-w-[250px] z-[1000]`;
    toast.innerHTML = `<div class="flex items-center gap-2"><span>${type === "success" ? "✅" : "❌"}</span><span class="text-sm font-medium">${message}</span></div>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },
};
