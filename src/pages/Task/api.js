const TaskService = {
  BASE_URL: "http://127.0.0.1:8000/api/tasks",

  async fetchAllTasks(status = "all") {
    try {
      const url = new URL(this.BASE_URL);
      if (status !== "all") {
        url.searchParams.append("status", status);
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Fetch Error:", error);
      UI.showToast("ไม่สามารถโหลดข้อมูลจาก Server ได้", "error");
      return [];
    }
  },

  async fetchMyTasks(status = "all") {
    try {
      const url = new URL(this.BASE_URL);

      // 1. ดึง person_id จาก localStorage
      const myPersonId = localStorage.getItem("person_id");

      // 2. ถ้ามี ID ให้ส่งไปเป็น Query Parameter (?person_id=1)
      if (myPersonId) {
        url.searchParams.append("person_id", myPersonId);
      }

      if (status !== "all") {
        url.searchParams.append("status", status);
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      // 3. กรอง Success ออก (เหมือนเดิม)
      return data.filter((task) => task.status?.toLowerCase() !== "success");
    } catch (error) {
      console.error("Fetch Error:", error);
      return [];
    }
  },

  async createTask(taskData) {
    try {
      const response = await fetch(this.BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error("บันทึกข้อมูลไม่สำเร็จ");
      return await response.json();
    } catch (error) {
      console.error("Create Error:", error);
      throw error;
    }
  },

  async updateTask(id, taskData) {
    const response = await fetch(`${this.BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
    return await response.json();
  },

  async deleteTask(id) {
    const response = await fetch(`${this.BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("ไม่สามารถลบข้อมูลได้");
    return await response.json();
  },
};
