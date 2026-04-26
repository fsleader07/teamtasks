const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const TaskService = {
  async fetchMyTasks(status = "all") {
    try {
      const url = new URL(`${BASE_URL}/tasks`);
      const myPersonId = localStorage.getItem("person_id");

      if (myPersonId) url.searchParams.append("person_id", myPersonId);
      if (status !== "all") url.searchParams.append("status", status);

      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      // กรอง Success ออกตาม Logic เดิม
      return data.filter((task) => task.status?.toLowerCase() !== "success");
    } catch (error) {
      console.error("Fetch Error:", error);
      throw error;
    }
  },

  async createTask(taskData) {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error("บันทึกข้อมูลไม่สำเร็จ");
    return await response.json();
  },

  async updateTask(id, taskData) {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
    return await response.json();
  },

  async deleteTask(id) {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("ไม่สามารถลบข้อมูลได้");
    return await response.json();
  },

  async loadPersonnel() {
    const res = await fetch(`${BASE_URL}/personnel/all`);
    if (!res.ok) throw new Error("ไม่สามารถโหลดรายชื่อพนักงานได้");
    return await res.json();
  },

  async loadProjects() {
    const res = await fetch(`${BASE_URL}/projects/all`);
    if (!res.ok) throw new Error("ไม่สามารถโหลดรายชื่อโครงการได้");
    return await res.json();
  }
};