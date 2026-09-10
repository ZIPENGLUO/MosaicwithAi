<template>
  <div class="flex h-screen w-screen overflow-hidden text-on-surface font-body-md" style="background-color: #FCF9F6;">
    <!-- 侧边导航栏：纯文字排版与温暖极简质感 -->
    <aside class="w-64 h-full bg-surface-container-lowest flex flex-col justify-between shrink-0 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-outline-variant/30 z-20 select-none">
      <div class="flex flex-col">
        <!-- 侧栏顶部标题：纯文字排版（无Logo图标） -->
        <div class="h-16 px-4 flex items-center">
          <div class="flex flex-col justify-center">
            <span class="font-headline-md text-xl text-on-surface tracking-tight font-bold leading-none">Mosic</span>
            <span class="font-label-sm text-[10px] text-on-surface-variant leading-none mt-1 tracking-wider uppercase">智能财务管家</span>
          </div>
        </div>

        <!-- 账本切换器（支持交互下拉） -->
        <div class="px-4 mt-1 relative">
          <div
            class="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors"
            @click="ledgerDropdownOpen = !ledgerDropdownOpen"
          >
            <div class="flex items-center gap-1.5 min-w-0">
              <span class="material-symbols-outlined text-secondary text-sm">folder_shared</span>
              <span class="font-label-md text-xs text-on-surface font-medium truncate">{{ currentLedger }}</span>
            </div>
            <span class="material-symbols-outlined text-on-surface-variant text-xs transition-transform" :class="{ 'rotate-180': ledgerDropdownOpen }">unfold_more</span>
          </div>

          <!-- 账本下拉面板 -->
          <div
            v-if="ledgerDropdownOpen"
            class="absolute left-4 right-4 top-10 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 p-1.5 z-50 flex flex-col gap-0.5"
          >
            <button
              v-for="l in ledgers"
              :key="l.name"
              class="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs transition-colors"
              :class="currentLedger === l.name ? 'bg-primary/10 text-primary font-semibold' : 'text-on-surface hover:bg-surface-container-low'"
              type="button"
              @click="currentLedger = l.name; ledgerDropdownOpen = false"
            >
              <span class="truncate">{{ l.name }}</span>
              <span v-if="currentLedger === l.name" class="material-symbols-outlined text-xs text-primary">check</span>
            </button>
          </div>
        </div>

        <!-- 导航菜单列表 -->
        <nav class="flex flex-col gap-1 px-4 mt-3">
          <router-link
            v-for="m in navItems"
            :key="m.to"
            :to="m.to"
            class="flex items-center gap-2 px-3 py-2 rounded-lg font-body-md text-xs transition-all no-underline"
            :class="isActive(m.to)
              ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'"
          >
            <span class="material-symbols-outlined text-base">{{ m.icon }}</span>
            <span>{{ m.title }}</span>
          </router-link>
        </nav>
      </div>

      <!-- 侧栏底部：平和度与林知栖真人头像资料卡 -->
      <div class="p-3">
        <!-- 本月财务平和度 -->
        <div class="p-2 rounded-lg bg-surface-container-low flex flex-col gap-1 mb-2 border border-outline-variant/20">
          <div class="flex items-center justify-between text-secondary">
            <div class="flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">spa</span>
              <span class="font-label-sm text-[11px] font-semibold">本月财务平和度</span>
            </div>
            <span class="font-label-sm text-[10px] text-on-surface-variant">88% · 恬适</span>
          </div>
          <div class="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
            <div class="bg-secondary h-full rounded-full" style="width: 88%;"></div>
          </div>
        </div>

        <!-- 个人资料卡入口（接入真实人物头像） -->
        <router-link
          to="/settings"
          class="flex items-center justify-between p-2 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 transition-colors cursor-pointer text-inherit no-underline group"
        >
          <div class="flex items-center gap-2 min-w-0">
            <div class="relative shrink-0">
              <img
                src="/avatars/user-lin.png"
                alt="林知栖"
                class="w-8 h-8 rounded-full object-cover border border-outline-variant/30 shadow-sm"
              />
              <span class="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-secondary border border-white"></span>
            </div>
            <div class="flex flex-col min-w-0">
              <div class="flex items-center gap-1">
                <span class="font-label-md text-xs text-on-surface font-semibold truncate leading-tight">林知栖</span>
                <span class="px-1 py-0.2 rounded bg-primary/10 text-primary text-[9px] font-mono leading-tight">户主</span>
              </div>
              <span class="font-label-sm text-[10px] text-on-surface-variant truncate leading-none mt-0.5">账本主理人 · 共享中</span>
              <span class="font-label-sm text-[9px] text-secondary leading-none mt-0.5">隐私隔离保护中</span>
            </div>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant text-xs group-hover:text-primary transition-colors">chevron_right</span>
        </router-link>
      </div>
    </aside>

    <!-- 右侧主工作区：紧凑顶栏 + 页面内容 -->
    <div class="flex-1 h-full flex flex-col overflow-hidden min-w-0" style="background-color: #FCF9F6;">
      <!-- 紧凑顶栏规范 -->
      <header class="h-16 px-6 border-b border-surface-container-high/60 flex items-center justify-between shrink-0 z-30" style="background-color: #FCF9F6;">
        <!-- 页面标题与动态问候语 -->
        <div class="flex items-center gap-3">
          <h1 class="font-headline-md text-xl font-bold text-on-surface leading-tight">
            {{ currentTitle }}
          </h1>
          <span class="text-xs text-on-surface-variant hidden sm:inline">
            {{ currentSubtitle }}
          </span>
        </div>

        <!-- 顶栏快捷操作组 -->
        <div class="flex items-center gap-2 relative">
          <!-- 快速记账 -->
          <button
            class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-md text-xs font-semibold hover:bg-primary shadow-sm transition-colors cursor-pointer"
            type="button"
            @click="dialog = true"
          >
            <span class="material-symbols-outlined text-sm">add</span>
            <span>快速记账</span>
          </button>

          <!-- 拍照识别 -->
          <router-link
            to="/ocr"
            class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-xs font-medium hover:bg-surface-container-high shadow-sm border border-outline-variant/30 transition-colors no-underline"
          >
            <span class="material-symbols-outlined text-sm text-primary">photo_camera</span>
            <span>拍照识别</span>
          </router-link>

          <!-- 导出报表 -->
          <button
            class="p-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface shadow-sm border border-outline-variant/30 cursor-pointer transition-colors"
            title="导出财务报表"
            type="button"
            @click="handleExport"
          >
            <span class="material-symbols-outlined text-sm">download</span>
          </button>

          <!-- 消息通知 -->
          <div
            class="relative flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-outline-variant/30 transition-colors shadow-sm"
          >
            <span class="material-symbols-outlined text-base">notifications</span>
            <span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-tertiary"></span>
          </div>
        </div>
      </header>

      <!-- 主视图渲染区域（自适应可滚动） -->
      <main class="flex-1 min-h-0 overflow-y-auto" style="background-color: #FCF9F6;">
        <router-view />
      </main>
    </div>

    <!-- 快速记账弹窗 -->
    <v-dialog v-model="dialog" max-width="480">
      <v-card class="rounded-2xl pa-4 bg-surface-container-lowest border border-outline-variant/30">
        <v-card-title class="font-headline-sm text-lg font-bold text-on-surface px-0 pt-0 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span class="material-symbols-outlined text-base">add_card</span>
            </span>
            <span>新增收支账目</span>
          </div>
          <span class="text-xs text-on-surface-variant font-normal">{{ currentLedger }}</span>
        </v-card-title>
        <v-card-text class="px-0 pt-3">
          <v-text-field
            v-model="quickBill.amount"
            label="记账金额"
            prefix="¥"
            placeholder="0.00"
            variant="outlined"
            density="comfortable"
            class="mb-3 font-amount-table"
          />
          <v-select
            v-model="quickBill.category"
            label="归属品类"
            :items="['餐饮美食', '居家生活', '教育学习', '休闲出行', '医疗保健', '工资收益', '理财分红']"
            variant="outlined"
            density="comfortable"
            class="mb-3"
          />
          <v-text-field
            v-model="quickBill.remark"
            label="商户或用途备注"
            placeholder="例如：生鲜超市、交通通勤、早餐等"
            variant="outlined"
            density="comfortable"
            class="mb-3"
          />
          <v-select
            v-model="quickBill.member"
            label="账目承担方"
            :items="['账本主账户', '林知栖 (本人)', '陈先生']"
            variant="outlined"
            density="comfortable"
          />
        </v-card-text>
        <v-card-actions class="px-0 pb-0 flex justify-end gap-2">
          <button
            class="px-3.5 py-1.5 rounded-lg text-xs font-medium text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
            type="button"
            @click="dialog = false"
          >
            取消
          </button>
          <button
            class="px-4 py-1.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            type="button"
            @click="saveQuickBill"
          >
            确认记账
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useLedgerStore } from '../stores/ledger'

interface NavItem {
  title: string
  to: string
  icon: string
}

const route = useRoute()
const ledgerStore = useLedgerStore()
const dialog = ref(false)
const ledgerDropdownOpen = ref(false)
const currentLedger = computed({
  get: () => ledgerStore.currentLedger,
  set: (val) => ledgerStore.setLedger(val)
})

const ledgers = ledgerStore.ledgers

const quickBill = ref({
  amount: '',
  category: '餐饮美食',
  remark: '',
  member: '账本主账户'
})

const navItems = computed<NavItem[]>(() => [
  { title: '首页概览', to: '/home', icon: 'dashboard' },
  { title: '智能票据识别', to: '/ocr', icon: 'document_scanner' },
  { title: '财务日历', to: '/calendar', icon: 'calendar_month' },
  { title: '账目明细', to: '/bills', icon: 'receipt_long' },
  { title: '统计分析', to: '/analytics', icon: 'pie_chart' },
  { title: ledgerStore.hasMultipleMembers ? '家庭协同' : '协同共享', to: '/family', icon: 'diversity_3' }
])

const isActive = (path: string) => {
  return route.path === path
}

const currentTitle = computed(() => {
  if (route.path === '/home') return '早安，知栖！'
  const match = navItems.value.find(item => item.to === route.path)
  if (match) return match.title
  if (route.path === '/settings') return '个人中心设置'
  return '财务管理'
})

const currentSubtitle = computed(() => {
  if (route.path === '/home') return '今天也把财务安排得井井有条'
  if (route.path === '/ocr') return 'Vision-LLM 4.0 智能凭证光学解析与自动入账'
  if (route.path === '/calendar') return '按日期审阅现金流波峰与支出明细'
  if (route.path === '/bills') return '多维收支明细与分类账目流水'
  if (route.path === '/analytics') return '财富资产负债与消费结构全景分析'
  if (route.path === '/family') {
    return ledgerStore.hasMultipleMembers
      ? '家庭成员分摊协作、共同资金池与账本权限管理'
      : '账本协同共享、授权访问与权限管理'
  }
  if (route.path === '/settings') return '账本偏好与账户安全隐私设置'
  return ''
})

const saveQuickBill = () => {
  if (!quickBill.value.amount) {
    alert('请输入记账金额')
    return
  }
  dialog.value = false
  alert(`记账成功！已为「${currentLedger.value}」记录 ¥${quickBill.value.amount} (${quickBill.value.category})`)
  quickBill.value.amount = ''
  quickBill.value.remark = ''
}

const handleExport = () => {
  alert('财务流水报表导出就绪，正在生成 Excel / PDF 格式...')
}
</script>
