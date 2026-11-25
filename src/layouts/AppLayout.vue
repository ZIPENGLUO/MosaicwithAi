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
              <span class="font-label-md text-xs text-on-surface font-medium truncate">{{ currentLedger || '暂无账本' }}</span>
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
              :key="l.id"
              class="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs transition-colors"
              :class="currentLedger === l.name ? 'bg-primary/10 text-primary font-semibold' : 'text-on-surface hover:bg-surface-container-low'"
              type="button"
              @click="currentLedger = l.name; ledgerDropdownOpen = false"
            >
              <span class="truncate">{{ l.name }}</span>
              <span v-if="currentLedger === l.name" class="material-symbols-outlined text-xs text-primary">check</span>
            </button>
            <div class="border-t border-outline-variant/30 my-1"></div>
            <button type="button" class="w-full flex items-center gap-1.5 px-2 py-2 rounded-lg text-left text-xs text-primary hover:bg-primary/10 transition-colors" @click="openCreateLedger">
              <span class="material-symbols-outlined text-sm">add</span>
              新增账本
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

        <!-- 个人资料卡（真实登录用户 + 退出登录） -->
        <div
          class="flex items-center justify-between p-2 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 transition-colors group"
        >
          <router-link
            to="/settings"
            class="flex items-center gap-2 min-w-0 cursor-pointer text-inherit no-underline"
          >
            <div class="relative shrink-0">
              <img
                :src="authStore.user?.avatar || '/avatars/user-lin.png'"
                :alt="displayName"
                class="w-8 h-8 rounded-full object-cover border border-outline-variant/30 shadow-sm"
              />
              <span class="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-secondary border border-white"></span>
            </div>
            <div class="flex flex-col min-w-0">
              <div class="flex items-center gap-1">
                <span class="font-label-md text-xs text-on-surface font-semibold truncate leading-tight">{{ displayName }}</span>
                <span class="px-1 py-0.2 rounded bg-primary/10 text-primary text-[9px] font-mono leading-tight">户主</span>
              </div>
              <span class="font-label-sm text-[10px] text-on-surface-variant truncate leading-none mt-0.5">{{ userEmail }}</span>
              <span class="font-label-sm text-[9px] text-secondary leading-none mt-0.5">隐私隔离保护中</span>
            </div>
          </router-link>
          <button
            class="material-symbols-outlined text-on-surface-variant text-xs hover:text-primary transition-colors cursor-pointer bg-transparent border-0 p-1"
            type="button"
            title="退出登录"
            @click="handleLogout"
          >
            logout
          </button>
        </div>
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
          <NotificationBell />
        </div>
      </header>

      <!-- 主视图渲染区域（自适应可滚动） -->
      <main class="flex-1 min-h-0 overflow-y-auto" style="background-color: #FCF9F6;">
        <router-view />
      </main>
    </div>

    <!-- 快速记账弹窗 -->
    <v-dialog :persistent="savingQuickBill" v-model="dialog" max-width="480">
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
          <!-- 支出 / 收入：决定下面能选哪些分类 -->
          <div class="flex rounded-xl overflow-hidden mb-3 border border-outline-variant/40">
            <button
              v-for="opt in billTypeOptions"
              :key="opt.value"
              type="button"
              class="flex-1 py-2 text-xs font-semibold transition-colors cursor-pointer"
              :class="quickBill.type === opt.value
                ? 'bg-primary-container text-on-primary'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'"
              @click="switchBillType(opt.value)"
            >
              {{ opt.title }}
            </button>
          </div>

          <v-text-field
            v-model="quickBill.amount"
            label="记账金额"
            prefix="¥"
            placeholder="0.00"
            variant="outlined"
            density="comfortable"
            class="mb-3 font-amount-table"
          />

          <!-- 分类：来自后端全局分类树（两级，这里展示子类并标注所属大类） -->
          <v-select
            v-model="quickBill.categoryId"
            :items="categoryOptions"
            item-title="label"
            item-value="value"
            :label="`归属分类（${quickBill.type === 'expense' ? '支出' : '收入'}）`"
            :loading="loadingCategories"
            :no-data-text="categoryOptions.length ? '没有可选分类' : '分类加载中或后端未启动'"
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

          <!-- 支付账户：来自后端 /api/accounts（属于个人，跨账本复用） -->
          <v-select
            v-model="quickBill.accountId"
            :items="accountOptions"
            item-title="label"
            item-value="value"
            label="支付方式"
            :loading="loadingAccounts"
            :no-data-text="loadingAccounts ? '正在加载支付方式' : '暂无可用支付方式，请前往设置添加'"
            variant="outlined"
            density="comfortable"
          />
          <button v-if="!loadingAccounts && !accountOptions.length" type="button" class="text-primary text-sm" @click="dialog = false; router.push('/settings?setup=1')">前往设置添加支付方式</button>
        </v-card-text>
        <p v-if="quickBillError" role="alert" class="text-red-600 text-sm">{{ quickBillError }}</p>
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
            :disabled="savingQuickBill"
            @click="saveQuickBill"
          >
            {{ savingQuickBill ? '保存中…' : '确认记账' }}
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="createLedgerDialog" max-width="420" :persistent="creatingLedger">
      <v-card rounded="xl">
        <form @submit.prevent="submitCreateLedger">
          <v-card-title class="pt-5 px-6">新增账本</v-card-title>
          <v-card-text>
            <v-text-field v-model="newLedgerName" label="账本名称" placeholder="例如：日常生活、旅行计划" maxlength="100" counter variant="outlined" autofocus :disabled="creatingLedger" :error-messages="createLedgerError" @update:model-value="createLedgerError = ''" />
          </v-card-text>
          <v-card-actions class="px-6 pb-5">
            <v-spacer />
            <v-btn :disabled="creatingLedger" @click="createLedgerDialog = false">取消</v-btn>
            <v-btn type="submit" color="primary" variant="flat" :loading="creatingLedger" :disabled="!newLedgerName.trim()">创建账本</v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useLedgerStore } from '../stores/ledger'
import NotificationBell from '../components/NotificationBell.vue'
import { useAuthStore } from '../stores/auth'
import { categoryApi, flattenLeaves } from '../api/category'
import { accountApi } from '../api/account'
import { transactionApi, localDateTime } from '../api/transaction'
import type { CategoryGroup, CategoryType } from '../interfaces'

interface NavItem {
  title: string
  to: string
  icon: string
}

const route = useRoute()
const router = useRouter()
const ledgerStore = useLedgerStore()
const authStore = useAuthStore()
const dialog = ref(false)
const ledgerDropdownOpen = ref(false)
const createLedgerDialog = ref(false)
const newLedgerName = ref('')
const creatingLedger = ref(false)
const createLedgerError = ref('')

function openCreateLedger() {
  ledgerDropdownOpen.value = false
  newLedgerName.value = ''
  createLedgerError.value = ''
  createLedgerDialog.value = true
}

async function submitCreateLedger() {
  if (creatingLedger.value) return
  const name = newLedgerName.value.trim()
  if (!name || Array.from(name).length > 100) {
    createLedgerError.value = '请输入不超过 100 个字符的账本名称'
    return
  }
  creatingLedger.value = true
  createLedgerError.value = ''
  try {
    await ledgerStore.createLedger(name)
    createLedgerDialog.value = false
  } catch (error) {
    createLedgerError.value = error instanceof Error ? error.message : '创建失败，请稍后重试'
  } finally {
    creatingLedger.value = false
  }
}

// ===== 当前登录用户（真实数据） =====
const displayName = computed(() => authStore.displayName || '未登录')
const userEmail = computed(() => authStore.user?.email ?? '')

/** 退出登录：清 token 后回登录页 */
const handleLogout = async () => {
  await authStore.logout()
  router.replace('/login')
}

// 布局挂载时拉取真实账本列表（登录后才有数据）
onMounted(() => {
  ledgerStore.loadLedgers()
  loadCategories()
  loadAccounts()
  window.addEventListener('payment-accounts-updated', loadAccounts)
})
onUnmounted(() => window.removeEventListener('payment-accounts-updated', loadAccounts))

const currentLedger = computed({
  get: () => ledgerStore.currentLedger,
  // setLedger 是异步的（切换账本后要重新拉成员），这里 fire-and-forget 即可
  set: (val) => { void ledgerStore.setLedger(val) }
})

const ledgers = computed(() => ledgerStore.ledgers)

// ===== 快速记账：分类与账户都来自后端 =====
const billTypeOptions: Array<{ title: string; value: CategoryType }> = [
  { title: '支出', value: 'expense' },
  { title: '收入', value: 'income' }
]

/** 后端返回的分类树（顶层含 children） */
const categoryGroups = ref<CategoryGroup[]>([])
const loadingCategories = ref(false)

/** 后端返回的支付账户 */
const accountOptions = ref<Array<{ label: string; value: number }>>([])
const loadingAccounts = ref(false)

const quickBill = ref({
  type: 'expense' as CategoryType,
  amount: '',
  categoryId: null as number | null,
  accountId: null as number | null,
  remark: ''
})

/** 当前收支类型下可选的分类（拍平成"大类 · 子类"标签） */
const categoryOptions = computed(() => {
  const groups = categoryGroups.value.filter(g => g.type === quickBill.value.type)
  return flattenLeaves(groups).map(leaf => ({
    label: `${leaf.parentName} · ${leaf.name}`,
    value: leaf.id
  }))
})

/** 切换支出/收入时清掉已选分类，避免选到另一类型的分类 */
function switchBillType(type: CategoryType) {
  if (quickBill.value.type === type) return
  quickBill.value.type = type
  quickBill.value.categoryId = null
}

async function loadCategories() {
  loadingCategories.value = true
  try {
    categoryGroups.value = await categoryApi.tree()
  } catch {
    categoryGroups.value = []
  } finally {
    loadingCategories.value = false
  }
}

async function loadAccounts() {
  loadingAccounts.value = true
  try {
    const list = await accountApi.list()
    accountOptions.value = (list ?? []).map(a => ({ label: a.name, value: a.id }))
    // 默认选中第一个账户，省一次点击
    if (!accountOptions.value.some(a => a.value === quickBill.value.accountId)) {
      quickBill.value.accountId = accountOptions.value[0]?.value ?? null
    }
  } catch {
    accountOptions.value = []
    quickBill.value.accountId = null
  } finally {
    loadingAccounts.value = false
  }
}

const navItems = computed<NavItem[]>(() => [
  { title: '首页概览', to: '/home', icon: 'dashboard' },
  { title: '智能票据识别', to: '/ocr', icon: 'document_scanner' },
  { title: '财务日历', to: '/calendar', icon: 'calendar_month' },
  { title: '账目明细', to: '/bills', icon: 'receipt_long' },
  { title: '统计分析', to: '/analytics', icon: 'pie_chart' },
  { title: ledgerStore.hasMultipleMembers ? '协作共享' : '账本设置', to: '/family', icon: 'diversity_3' }
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
      ? '账本成员协作、共同资金池与权限管理'
      : '账本基本信息与协作设置'
  }
  if (route.path === '/settings') return '账本偏好与账户安全隐私设置'
  return ''
})

const savingQuickBill = ref(false)
const quickBillError = ref('')
const saveQuickBill = async () => {
  if (savingQuickBill.value) return
  quickBillError.value = ''
  const ledgerId = ledgerStore.currentLedgerId
  if (!ledgerId) { quickBillError.value = '请先选择账本'; return }
  if (!Number.isFinite(Number(quickBill.value.amount)) || Number(quickBill.value.amount) < 0.01) { quickBillError.value = '请输入有效金额（至少 0.01）'; return }
  if (!quickBill.value.categoryId || !quickBill.value.accountId) { quickBillError.value = '请选择分类和支付方式'; return }
  savingQuickBill.value = true
  try {
    await transactionApi.create(ledgerId, {
      type: quickBill.value.type, amount: quickBill.value.amount,
      category_id: quickBill.value.categoryId, account_id: quickBill.value.accountId,
      occurred_at: localDateTime(), note: quickBill.value.remark, source: 'manual'
    })
    dialog.value = false
    quickBill.value.amount = ''; quickBill.value.remark = ''; quickBill.value.categoryId = null
    window.dispatchEvent(new Event('transactions-updated'))
  } catch (e) { quickBillError.value = e instanceof Error ? e.message : '记账失败，请重试' }
  finally { savingQuickBill.value = false }
}

const handleExport = () => {
  alert('财务流水报表导出就绪，正在生成 Excel / PDF 格式...')
}
</script>
