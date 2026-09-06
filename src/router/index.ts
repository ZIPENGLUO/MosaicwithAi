import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import Home from '../views/Home.vue'
import Bills from '../views/Bills.vue'
import Calendar from '../views/Calendar.vue'
import Analytics from '../views/Analytics.vue'
import Family from '../views/Family.vue'
import OCR from '../views/OCR.vue'
import Settings from '../views/Settings.vue'

// 登录页源文件保留，按需挂载
const router = createRouter({
  history: createWebHistory(),
  routes: [
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

export default router
