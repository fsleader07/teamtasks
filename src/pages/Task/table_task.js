const UI = {
  createTaskRow(task, index) {
    const row = document.createElement("tr");
    // ใช้สไตล์แถวสลับสี (Zebra) และ hover แบบ AdminLTE
    row.className = `border-b border-gray-200 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`;

    const taskId = task.id;
    row.dataset.taskId = taskId;

    row.innerHTML = `
            <td class="px-4 py-3 text-center text-gray-500 text-xs font-medium border-r border-gray-100">
                ${index + 1}
            </td>

            <td class="px-4 py-3 border-r border-gray-100">
                <span class="text-[#007bff] font-bold text-[11px] uppercase tracking-wider">
                    ${this.escapeHtml(task.project || "-")}
                </span>
            </td>

            <td class="px-4 py-3 border-r border-gray-100">
                <div class="text-gray-800 font-semibold text-sm">
                    ${this.escapeHtml(task.task_name)}
                </div>
                ${task.note ? `<div class="text-[10px] text-gray-400 mt-0.5 italic">Note: ${this.escapeHtml(task.note)}</div>` : ""}
            </td>

            <td class="px-4 py-3 text-gray-700 text-sm border-r border-gray-100 font-medium">
                ${this.escapeHtml(
                  task.assignee_names && task.assignee_names.length > 0
                    ? task.assignee_names.join(", ")
                    : "-",
                )}
            </td>

            <td class="px-4 py-3 text-center border-r border-gray-100">
                <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold shadow-sm ${this.getStatusClass(task.status)}">
                    ${task.status.toUpperCase()}
                </span>
            </td>

            <td class="px-4 py-3 text-center border-r border-gray-100">
                <span class="text-[10px] font-black tracking-tighter ${this.getUrgencyTextColor(task.priority)}">
                    ${this.getUrgencyLabel(task.priority)}
                </span>
            </td>

            <td class="px-4 py-3 text-gray-500 text-xs border-r border-gray-100">
                ${this.escapeHtml(task.author || "-")}
            </td>

            <td class="px-4 py-3 text-gray-600 text-[12px] whitespace-nowrap border-r border-gray-100">
                📅 ${this.formatDate(task.deadline)}
            </td>

            <td class="px-4 py-3 text-center">
                <div class="flex gap-3 justify-center">
                    <button onclick="App.handleEdit('${taskId}')" 
                        class="text-blue-500 hover:text-blue-700 transition-colors p-1 hover:bg-blue-50 rounded" title="แก้ไข">
                        ✎
                    </button>
                    <button onclick="App.handleDelete('${taskId}')" 
                        class="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded" title="ลบ">
                        ✖
                    </button>
                </div>
            </td>
        `;
    return row;
  },

  // สี Status แบบ AdminLTE (Success=Green, Pending=Yellow, Break=Red)
  getStatusClass(status) {
    const s = String(status).toLowerCase();
    if (s === "success") return "bg-[#28a745] text-white";
    if (s === "pending") return "bg-[#ffc107] text-[#212529]";
    if (s === "break") return "bg-[#dc3545] text-white";
    if (s === "opened") return "bg-[#17a2b8] text-white";
    return "bg-gray-400 text-white";
  },

  getUrgencyLabel: (p) => {
    const val = String(p).toLowerCase();
    return { high: "🔴 HIGH", normal: "🟡 NORMAL", low: "🟢 LOW" }[val] || p;
  },

  getUrgencyTextColor: (p) => {
    const val = String(p).toLowerCase();
    return (
      {
        high: "text-red-600",
        normal: "text-orange-500",
        low: "text-green-600",
      }[val] || "text-gray-500"
    );
  },

  formatDate: (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  },

  escapeHtml: (str) => {
    if (!str) return "";
    const p = document.createElement("p");
    p.textContent = str;
    return p.innerHTML;
  },
};
