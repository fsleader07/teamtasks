var PersonnelApp = PersonnelApp || {
  allPersonnel: [],
  filteredPersonnel: [],

  async init() {
    console.log("PersonnelApp: Initializing...");
    const form = document.getElementById("personnel-form");
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
      const response = await fetch("http://127.0.0.1:8000/api/personnel/all");
      if (!response.ok) throw new Error("Load failed");
      const data = await response.json();
      this.allPersonnel = data || [];
      this.applyFilters();
    } catch (error) {
      console.error("Load Data Error:", error);
      this.showToast("ไม่สามารถโหลดข้อมูลบุคลากรได้", "error");
    }
  },

  applyFilters() {
    const searchInput = document.getElementById("personnel-search");
    const searchText = searchInput ? searchInput.value.toLowerCase() : "";

    this.filteredPersonnel = this.allPersonnel.filter(
      (p) =>
        p.firstname.toLowerCase().includes(searchText) ||
        p.lastname.toLowerCase().includes(searchText) ||
        p.nickname.toLowerCase().includes(searchText),
    );
    this.render();
  },

  render() {
    const list = document.getElementById("personnel-list");
    const emptyState = document.getElementById("personnel-empty-state");
    if (!list) return;

    list.innerHTML = "";

    if (this.filteredPersonnel.length === 0) {
      emptyState?.classList.remove("hidden");
    } else {
      emptyState?.classList.add("hidden");
      this.filteredPersonnel.forEach((person, index) => {
        const row = `
          <tr class="hover:bg-gray-50 border-b border-gray-100">
            <td class="px-4 py-3 text-center border-r text-gray-500 font-mono text-xs">${index + 1}</td>
            <td class="px-4 py-3 border-r font-medium text-gray-800">${person.firstname} ${person.lastname}</td>
            <td class="px-4 py-3 border-r text-gray-600">${person.nickname || "-"}</td>
            <td class="px-4 py-3 border-r text-gray-600">${person.position || "-"}</td>
            <td class="px-4 py-3 text-center space-x-3">
              <button onclick="PersonnelApp.openModal(${person.personnel_id})" class="text-blue-600 hover:text-blue-800 font-bold text-xs">แก้ไข</button>
              <button onclick="PersonnelApp.handleDelete(${person.personnel_id})" class="text-red-600 hover:text-red-800 font-bold text-xs">ลบ</button>
            </td>
          </tr>
        `;
        list.insertAdjacentHTML("beforeend", row);
      });
    }
  },

  openModal(id = null) {
    const modal = document.getElementById("personnel-modal");
    const title = document.getElementById("p-modal-title");
    const form = document.getElementById("personnel-form");

    form.reset();
    document.getElementById("edit-personnel-id").value = id || "";

    if (id) {
      title.innerText = "แก้ไขข้อมูลบุคลากร";
      const person = this.allPersonnel.find((p) => p.personnel_id === id);
      if (person) {
        document.getElementById("personnel-full-name").value = person.full_name;
        document.getElementById("personnel-position").value =
          person.position || "";
        document.getElementById("personnel-email").value = person.email || "";
        document.getElementById("personnel-phone").value = person.phone || "";
      }
    } else {
      title.innerText = "เพิ่มบุคลากรใหม่";
    }
    modal.classList.remove("hidden");
  },

  closeModal() {
    document.getElementById("personnel-modal").classList.add("hidden");
  },

  async handleFormSubmit() {
    const id = document.getElementById("edit-personnel-id").value;
    const personnelData = {
      full_name: document.getElementById("personnel-full-name").value,
      position: document.getElementById("personnel-position").value,
      email: document.getElementById("personnel-email").value,
      phone: document.getElementById("personnel-phone").value,
    };

    const url = id
      ? `http://127.0.0.1:8000/api/personnel/${id}`
      : "http://127.0.0.1:8000/api/personnel";
    const method = id ? "PUT" : "POST";

    try {
      const resp = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(personnelData),
      });

      if (resp.ok) {
        this.closeModal();
        this.showToast(
          id ? "อัปเดตข้อมูลสำเร็จ" : "เพิ่มบุคลากรสำเร็จ",
          "success",
        );
        await this.loadData();
      } else {
        throw new Error("Save failed");
      }
    } catch (error) {
      this.showToast("เกิดข้อผิดพลาด: " + error.message, "error");
    }
  },

  async handleDelete(id) {
    if (!confirm("ลบข้อมูลบุคลากรนี้?")) return;
    try {
      const resp = await fetch(`http://127.0.0.1:8000/api/personnel/${id}`, {
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
    const container = document.getElementById("toast-container");
    if (!container) return alert(message);
    const toast = document.createElement("div");
    toast.className = `${type === "success" ? "bg-green-600" : "bg-red-600"} text-white px-4 py-3 rounded shadow-lg mb-2 transition-all duration-300 flex items-center gap-2 min-w-[250px] z-[1000]`;
    toast.innerHTML = `<span>${type === "success" ? "✅" : "❌"}</span><span class="text-sm font-medium">${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },
};

// Start initialization
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  PersonnelApp.init();
} else {
  document.addEventListener("DOMContentLoaded", () => PersonnelApp.init());
}
