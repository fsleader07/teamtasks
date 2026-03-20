const Navbar = {
  // ฟังก์ชันสำหรับดึงชื่อจาก API
  async fetchUserProfile() {
    const personId = localStorage.getItem("person_id");
    if (!personId) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/personnel/${personId}`,
      );
      const data = await response.json();

      if (data && data.firstname) {
        const fullName = `${data.firstname} ${data.lastname || ""}`.trim();
        const initial = data.firstname.charAt(0).toUpperCase();

        // อัปเดตชื่อเต็มในหน้าจอ
        const nameElem = document.getElementById("nav-username");
        const initialElem = document.getElementById("nav-initial");

        if (nameElem) nameElem.textContent = fullName;
        if (initialElem) initialElem.textContent = initial;
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
    }
  },

  handleLogout() {
    if (confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      localStorage.clear();
      window.location.href = "/src/pages/login.html";
    }
  },

  render() {
    // เรียก API หลังจาก render เสร็จ (ใช้ setTimeout เพื่อให้ DOM ถูกสร้างก่อน)
    setTimeout(() => this.fetchUserProfile(), 0);

    const defaultName = "Loading...";

    return `
        <header class="main-header bg-white h-14 flex items-center justify-between px-6 sticky top-0 z-40 shrink-0 shadow-sm border-b">
            <div class="flex items-center gap-4 text-gray-500">
                <button class="hover:text-gray-800 text-xl">☰</button>
                <span class="text-sm font-medium">Home / Dashboard</span>
            </div>
            
            <div class="flex items-center gap-6">
                <div class="flex items-center gap-3">
                    <div class="text-right hidden sm:block">
                        <p id="nav-username" class="text-xs font-bold text-gray-800 leading-none">${defaultName}</p>
                        <p class="text-[10px] text-green-500 font-medium">Online</p>
                    </div>
                    <div id="nav-initial" class="w-8 h-8 bg-blue-100 rounded-full border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-xs">
                        ?
                    </div>
                </div>

                <button 
                    onclick="Navbar.handleLogout()" 
                    class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors border border-red-100"
                >
                    <i class="fas fa-sign-out-alt"></i>
                    <span>ออกจากระบบ</span>
                </button>
            </div>
        </header>
        `;
  },
};
