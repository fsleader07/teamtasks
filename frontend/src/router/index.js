import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: 'เข้าสู่ระบบ', showInMenu: false, requiresAuth: false },
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Dashboard.vue'),
      meta: { title: 'หน้าแรก', showInMenu: true, requiresAuth: true },
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('../views/ProjectTaskDashboard.vue'),
      meta: { title: 'จัดการงาน', showInMenu: true, requiresAuth: true },
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('../views/ProjectManagement.vue'),
      meta: { title: 'จัดการโครงการ', showInMenu: true, requiresAuth: true },
    },
    {
      path: '/personnel',
      name: 'personnel',
      component: () => import('../views/PersonnelManagement.vue'),
      meta: { title: 'จัดการบุคลากร', showInMenu: true, requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
})

router.beforeEach((to, from) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    return { name: 'login' } 
  }

  if (to.name === 'login' && token) {
    return { name: 'home' }
  }

})

export default router