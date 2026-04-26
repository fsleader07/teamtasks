const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchMyAllTasks = async (status = "all") => {
  try {
    const url = new URL(`${BASE_URL}/tasks`);
    const myPersonId = localStorage.getItem("person_id");

    if (myPersonId) url.searchParams.append("person_id", myPersonId);
    if (status !== "all") url.searchParams.append("status", status);

    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    return data.filter((task) => !!task.status);
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
};

export const fetchMyTasks = async (status = "all") => {
  try {
    const url = new URL(`${BASE_URL}/tasks`);
    const myPersonId = localStorage.getItem("person_id");

    if (myPersonId) url.searchParams.append("person_id", myPersonId);
    if (status !== "all") url.searchParams.append("status", status);

    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    return data.filter((task) => task.status?.toLowerCase() !== "success");
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
};

export const fetchStatusCounts = async () => {
  try {
    const myPersonId = localStorage.getItem("person_id");
    const myRole = localStorage.getItem("role") || "user";
    
    const url = new URL(`${BASE_URL}/tasks/status_counts`);
    
    if (myPersonId) url.searchParams.append("person_id", myPersonId);
    url.searchParams.append("role", myRole);

    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");

    return await response.json();
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) throw new Error("บันทึกข้อมูลไม่สำเร็จ");
  return await response.json();
};

export const updateTask = async (id, taskData) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
  return await response.json();
};

export const deleteTask = async (id) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("ไม่สามารถลบข้อมูลได้");
  return await response.json();
};

export const loadPersonnel = async () => {
  const res = await fetch(`${BASE_URL}/personnel/all`);
  if (!res.ok) throw new Error("ไม่สามารถโหลดรายชื่อพนักงานได้");
  return await res.json();
};

export const loadProjects = async () => {
  const res = await fetch(`${BASE_URL}/projects/all`);
  if (!res.ok) throw new Error("ไม่สามารถโหลดรายชื่อโครงการได้");
  return await res.json();
};

export const TaskService = {
  fetchMyTasks,
  fetchMyAllTasks,
  fetchStatusCounts,
  createTask,
  updateTask,
  deleteTask,
  loadPersonnel,
  loadProjects
};