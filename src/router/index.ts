import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import Home from '../views/Home.vue'
import Bills from '../views/Bills.vue'
import Calendar from '../views/Calendar.vue'
import Analytics from '../views/Analytics.vue'
import Family from '../views/Family.vue'
import OCR from '../views/OCR.vue'
import Settings from '../views/Settings.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 登录页：独立布局（没有侧栏）
    { path: '/login', name: 'login', component: Login },
    // 注册页：同样独立布局
    { path: '/register', name: 'register', component: Register },
    {
      path: '/',
      component: AppLayout,
      children: [
        { path: '', redirect: '/home' },
        { path: 'home', component: Home },
        { path: 'ocr', component: OCR },
        { path: 'calendar', component: Calendar },
        { path: 'bills', component: Bills },
        { path: 'analytics', component: Analytics },
        { path: 'family', component: Family },
        { path: 'settings', component: Settings }
      ]
    }
  ]
})

/**
 * 全局前置守卫：没登录就跳登录页
 * 注意：守卫里不能用 useAuthStore() 之外的东西做副作用，
 *       Pinia 实例在 main.ts 里已注册，这里可直接用
 */
// 登录 / 注册页：未登录时放行
const PUBLIC_PATHS = ['/login', '/register']

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // 登录、注册页
  if (PUBLIC_PATHS.includes(to.path)) {
    // 已经登录了还去登录/注册页 → 直接送回首页
    if (await authStore.fetchMe()) {
      return { path: '/home' }
    }
    return true
  }

  // 其他页面：先确认登录态（刷新页面时用 token 换 user）
  const loggedIn = await authStore.fetchMe()
  if (!loggedIn) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  return true
})

export default router