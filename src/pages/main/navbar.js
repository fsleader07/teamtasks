const Navbar = {
  async fetchUserProfile() {
    const personId = localStorage.getItem("person_id");
    const nameElem = document.getElementById("nav-username");
    const initialElem = document.getElementById("nav-initial");

    if (!initialElem) return;

    // 1. กรณีเป็น Admin (ไม่มี person_id)
    if (!personId) {
      if (nameElem) nameElem.textContent = "Administrator"; // หรือค่า default ที่ต้องการ

      this.setProfileImage(initialElem, "Admin", null);
      return;
    }

    // 2. กรณีมี person_id (ดึงข้อมูลจาก API)
    try {
      const response = await fetch(
        `http://192.168.1.180:8000/api/personnel/${personId}`,
      );
      if (!response.ok) throw new Error("User not found");

      const data = await response.json();
      if (data && data.firstname) {
        const fullName = `${data.firstname} ${data.lastname || ""}`.trim();
        if (nameElem) nameElem.textContent = fullName;

        this.setProfileImage(initialElem, data.firstname, personId);
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
      this.setProfileImage(initialElem, "User", null); // Fallback เมื่อ API พัง
    }
  },

  // ฟังก์ชันกลางสำหรับจัดการรูปภาพ (ช่วยลดความซ้ำซ้อนของโค้ด)
  setProfileImage(container, name, id) {
    container.innerHTML = "";
    const img = document.createElement("img");
    img.className = "w-full h-full rounded-full object-cover bg-gray-100"; // ใส่พื้นหลังสีเทาอ่อนเผื่อรูปโหลดไม่ได้

    // 1. รูปภาพพนักงานจาก API (ใช้ ID เป็นชื่อไฟล์)
    const personalImg = id ? `/src/components/profile/${id}.jpg` : null;

    // 2. รูป "ภาพว่างๆ" หรือ Placeholder กรณี 404
    // คุณสามารถใช้รูปโปรไฟล์เปล่าๆ หรือใส่เป็นสีเทาไปเลยก็ได้
    const emptyImg = `/src/components/profile/tiya.jpg`; // หรือใช้ 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' สำหรับภาพใสว่างเปล่า

    if (id && personalImg) {
      img.src = personalImg;
      img.onerror = () => {
        console.log(
          `Profile image for ID ${id} not found (404). Showing empty state.`,
        );
        img.src = emptyImg;
        // หากต้องการให้เป็นช่องว่างจริงๆ ให้ใช้:
        // img.style.opacity = '0'; // หรือ img.remove(); แล้วใส่ icon แทน
      };
    } else {
      // กรณีเป็น Admin หรือไม่มี ID ให้แสดงรูปว่างตั้งแต่แรก
      img.src = emptyImg;
    }

    container.appendChild(img);
    container.classList.remove("bg-gray-50", "bg-blue-100");
  },

  handleLogout() {
    if (confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      localStorage.clear();
      window.location.href = "/src/pages/login.html";
    }
  },

  render() {
    setTimeout(() => this.fetchUserProfile(), 0);
    return `
      <header class="main-header bg-white h-14 flex items-center justify-between px-6 sticky top-0 z-40 shrink-0 shadow-sm border-b">
          <div class="flex items-center gap-4 text-gray-500">
              <button class="hover:text-gray-800 text-xl">☰</button>
              <span class="text-sm font-medium">Home / Dashboard</span>
          </div>
          
          <div class="flex items-center gap-6">
              <div class="flex items-center gap-3">
                  <div class="text-right hidden sm:block">
                      <p id="nav-username" class="text-xs font-bold text-gray-800 leading-none">Loading...</p>
                      <p class="text-[10px] text-green-500 font-medium">Online</p>
                  </div>
                  <div id="nav-initial" class="w-8 h-8 rounded-full border border-blue-200 flex items-center justify-center overflow-hidden bg-gray-50">
                      </div>
              </div>

              <button onclick="Navbar.handleLogout()" class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors border border-red-100">
                  <i class="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
              </button>
          </div>
      </header>
    `;
  },
};
