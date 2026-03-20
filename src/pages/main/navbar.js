const Navbar = {
    render() {
        return `
        <header class="main-header bg-white h-14 flex items-center justify-between px-6 sticky top-0 z-40 shrink-0 shadow-sm">
            <div class="flex items-center gap-4 text-gray-500">
                <button class="hover:text-gray-800" onclick="console.log('Toggle Sidebar')">☰</button>
                <span class="text-sm font-medium">Home</span>
            </div>
            <div class="flex items-center gap-3">
                <div class="text-right hidden sm:block">
                    <p class="text-xs font-bold text-gray-800 leading-none">Admin User</p>
                    <p class="text-[10px] text-green-500 font-medium">Online</p>
                </div>
                <div class="w-8 h-8 bg-blue-100 rounded-full border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-xs">
                    AD
                </div>
            </div>
        </header>
        `;
    }
};