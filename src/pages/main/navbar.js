const Navbar = {
    handleLogout() {
        if (confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
            localStorage.clear();
            window.location.href = "/src/pages/login.html";
        }
    },

    render() {
        const username = localStorage.getItem('username') || 'Admin User';
        const initial = username.charAt(0).toUpperCase();

        return `
        <header class="main-header bg-white h-14 flex items-center justify-between px-6 sticky top-0 z-40 shrink-0 shadow-sm border-b">
            <div class="flex items-center gap-4 text-gray-500">
                <button class="hover:text-gray-800 text-xl" onclick="console.log('Toggle Sidebar')">☰</button>
                <span class="text-sm font-medium">Home / Dashboard</span>
            </div>
            
            <div class="flex items-center gap-6">
                <div class="flex items-center gap-3">
                    <div class="text-right hidden sm:block">
                        <p class="text-xs font-bold text-gray-800 leading-none">${username}</p>
                        <p class="text-[10px] text-green-500 font-medium">Online</p>
                    </div>
                    <div class="w-8 h-8 bg-blue-100 rounded-full border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-xs">
                        ${initial}
                    </div>
                </div>

                <button 
                    onclick="Navbar.handleLogout()" 
                    class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors border border-red-100"
                    title="Logout"
                >
                    <i class="fas fa-sign-out-alt"></i>
                    <span>ออกจากระบบ</span>
                </button>
            </div>
        </header>
        `;
    }
};