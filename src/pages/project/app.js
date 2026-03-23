// ใช้ var และเช็ค Object เดิมเพื่อป้องกัน Redeclaration error
var ProjectApp = ProjectApp || {
  allProjects: [],
  filteredProjects: [],

  async init() {
    console.log("ProjectApp: Initializing...");
    // รีเซ็ตข้อมูล
    this.allProjects = [];
    this.filteredProjects = [];

    // ผูกเหตุการณ์ Submit ฟอร์ม (ใช้ onsubmit เพื่อไม่ให้ Event ผูกซ้ำซ้อน)
    const form = document.getElementById("project-form");
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        this.handleFormSubmit();
      };
    }

    await this.loadData();
  },

  async loadData() {
    try {
      // เรียก API (ควรระบุ URL เต็มหากรันคนละ Port)
      const response = await fetch("http://192.168.1.180:8000/api/projects/all");
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      console.log("ProjectApp: Data loaded", data);

      this.allProjects = data || [];
      this.applyFilters();
    } catch (error) {
      console.error("Load Data Error:", error);
      this.showToast("ไม่สามารถโหลดข้อมูลโครงการได้", "error");
    }
  },

  applyFilters() {
    const searchInput = document.getElementById("project-search");
    const searchText = searchInput ? searchInput.value.toLowerCase() : "";

    this.filteredProjects = this.allProjects.filter((p) =>
      p.project_name.toLowerCase().includes(searchText),
    );

    this.render();
  },

  render() {
    const list = document.getElementById("project-list");
    const emptyState = document.getElementById("project-empty-state");
    if (!list) return;

    list.innerHTML = "";

    if (this.filteredProjects.length === 0) {
      emptyState?.classList.remove("hidden");
    } else {
      emptyState?.classList.add("hidden");
      this.filteredProjects.forEach((project) => {
        const row = `
          <tr class="hover:bg-gray-50 border-b border-gray-100">
            <td class="px-4 py-3 text-center border-r text-gray-500 font-mono text-xs">${project.project_id}</td>
            <td class="px-4 py-3 border-r font-medium text-gray-800">${project.project_name}</td>
            <td class="px-4 py-3 border-r text-gray-600">${project.description || "-"}</td>
            <td class="px-4 py-3 border-r text-gray-600">${project.start_date || "-"}</td>
            <td class="px-4 py-3 border-r text-gray-600">${project.end_date || "-"}</td>
            <td class="px-4 py-3 text-center space-x-3">
              <button onclick="ProjectApp.openModal(${project.project_id})" class="text-blue-600 hover:text-blue-800 font-bold text-xs">แก้ไข</button>
              <button onclick="ProjectApp.handleDelete(${project.project_id})" class="text-red-600 hover:text-red-800 font-bold text-xs">ลบ</button>
            </td>
          </tr>
        `;
        list.insertAdjacentHTML("beforeend", row);
      });
    }
  },

  openModal(id = null) {
    const modal = document.getElementById("project-modal");
    const title = document.getElementById("modal-title");
    const form = document.getElementById("project-form");

    form.reset();
    document.getElementById("edit-project-id").value = id || "";

    if (id) {
      title.innerText = "แก้ไขข้อมูลโครงการ";
      const project = this.allProjects.find((p) => p.project_id === id);
      if (project) {
        document.getElementById("project-name").value = project.project_name;
        document.getElementById("project-description").value =
          project.description || "";
      }
    } else {
      title.innerText = "เพิ่มโครงการใหม่";
    }

    modal.classList.remove("hidden");
  },

  closeModal() {
    document.getElementById("project-modal").classList.add("hidden");
  },

  async handleFormSubmit() {
    const id = document.getElementById("edit-project-id").value;
    const projectData = {
      project_name: document.getElementById("project-name").value,
      description: document.getElementById("project-description").value,
    };

    const url = id
      ? `http://192.168.1.180:8000/api/projects/${id}`
      : "http://192.168.1.180:8000/api/projects";
    const method = id ? "PUT" : "POST";

    try {
      const resp = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (resp.ok) {
        this.closeModal();
        this.showToast(
          id ? "อัปเดตข้อมูลสำเร็จ" : "เพิ่มโครงการสำเร็จ",
          "success",
        );
        await this.loadData();
      } else {
        const err = await resp.json();
        throw new Error(err.detail || "Save failed");
      }
    } catch (error) {
      this.showToast("เกิดข้อผิดพลาด: " + error.message, "error");
    }
  },

  async handleDelete(id) {
    if (!confirm("คุณมั่นใจหรือไม่ที่จะลบโครงการนี้?")) return;

    try {
      const resp = await fetch(`http://192.168.1.180:8000/api/projects/${id}`, {
        method: "DELETE",
      });
      if (resp.ok) {
        this.showToast("ลบข้อมูลเรียบร้อยแล้ว", "success");
        await this.loadData();
      }
    } catch (error) {
      this.showToast("ไม่สามารถลบข้อมูลได้", "error");
    }
  },

  showToast(message, type = "success") {
    // ใช้สไตล์เดียวกับ Task App ของคุณ
    const container = document.getElementById("toast-container");
    if (!container) {
      alert(message); // fallback กรณีไม่มี container
      return;
    }
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

// สั่งให้เริ่มทำงานทันทีเมื่อไฟล์ถูกโหลด
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  ProjectApp.init();
} else {
  document.addEventListener("DOMContentLoaded", () => ProjectApp.init());
}
