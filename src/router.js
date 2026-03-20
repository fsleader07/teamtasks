const checkAuth = () => {
    const token = localStorage.getItem('token');
    const isLoginPage = window.location.pathname.includes('login.html');

    if (!token && !isLoginPage) {
        window.location.href = '/src/pages/login.html';
        return false;
    }
    
    if (token && isLoginPage) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
};

checkAuth();

const TaskAPI = {
  async init(callback) {
    if (window.dataSdk) {
      return await window.dataSdk.init({ onDataChanged: callback });
    }
  },
  async save(taskData, id = null) {
    if (id) {
      const existing = allTasks.find((t) => t.__backendId === id);
      return await window.dataSdk.update({ ...existing, ...taskData });
    }
    return await window.dataSdk.create(taskData);
  },
  async updateStatus(task, newStatus) {
    return await window.dataSdk.update({ ...task, status: newStatus });
  },
  async delete(task) {
    return await window.dataSdk.delete(task);
  },
};
