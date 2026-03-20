const Menu = {
  render(currentPath = "home") {
    // ดึงค่า role จาก LocalStorage (ถ้าไม่มีค่า ให้ default เป็น 'user')
    const userRole = localStorage.getItem("role") || "user";

    const isDashboard = currentPath === "home" || currentPath === "";
    const isTasks = currentPath === "tasks";
    const isProject = currentPath === "project";
    const isPerson = currentPath === "person";

    return `
        <aside class="sidebar-dark w-64 h-full flex-shrink-0 flex flex-col shadow-xl z-50">
            <div class="p-4 flex items-center gap-3 border-b border-gray-700">
                <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    T
                </div>
                <span class="text-white text-lg font-semibold tracking-tight">Admin Task Lite</span>
            </div>
            
            <div class="flex-1 p-3 space-y-1">
                <div class="text-gray-500 text-[10px] uppercase font-bold px-3 py-2">
                    MAIN NAVIGATION
                </div>
                
                <a href="#home" class="flex items-center gap-3 py-2 px-3 rounded transition ${isDashboard ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:bg-gray-700 hover:text-white"}">
                    <span class="text-sm">🏠</span> Dashboard
                </a>
                
                <a href="#tasks" class="flex items-center gap-3 py-2 px-3 rounded transition ${isTasks ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:bg-gray-700 hover:text-white"}">
                    <span class="text-sm">📋</span> Tasks List
                </a>

                ${userRole === "admin" ? `
                    <div class="text-gray-500 text-[10px] uppercase font-bold px-3 py-2 mt-4">
                        ADMIN ONLY
                    </div>
                    
                    <a href="#project" class="flex items-center gap-3 py-2 px-3 rounded transition ${isProject ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:bg-gray-700 hover:text-white"}">
                        <span class="text-sm">📁</span> Project
                    </a>

                    <a href="#person" class="flex items-center gap-3 py-2 px-3 rounded transition ${isPerson ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:bg-gray-700 hover:text-white"}">
                        <span class="text-sm">👤</span> Person
                    </a>
                ` : ""}
            </div>

            <div class="p-4 border-t border-gray-700">
                <p class="text-[10px] text-gray-500 text-center">Version 1.0.0</p>
            </div>
        </aside>
        `;
  },
};