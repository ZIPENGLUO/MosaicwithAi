import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../api/client'

/**
 * 账本 store
 *
 * 数据来源：后端 GET /api/ledgers（返回"我创建的 + 我加入家庭的"账本）
 * 说明：后端目前只返回 { id, name, currency, owner_id, family_id }，
 *       还没有 type / description / members，这里按现有字段映射，
 *       缺失的用前端规则兜底（family_id 为空 = 个人账本）。
 *       等阶段 7 做家庭协同后，members 会从 /api/families 那边接进来。
 */

export interface LedgerMember {
  id: string
  name: string
  role: string
  avatar: string
  color: string
}

export interface LedgerConfig {
  id: number
  name: string
  type: 'family' | 'personal' | 'fund'
  description: string
  currency: string
  /** 家庭账本才有 family_id */
  familyId: number | null
  members: LedgerMember[]
}

/** 后端返回的账本结构 */
interface LedgerApiItem {
  id: number
  name: string
  currency?: string
  owner_id: number
  family_id: number | null
}

export const useLedgerStore = defineStore('ledger', () => {
  // ===== state =====
  const ledgers = ref<LedgerConfig[]>([])
  /** 当前选中的账本**名称**（AppLayout 的切换器按名字显示/比对） */
  const currentLedger = ref('')
  const loading = ref(false)
  /** 真实的当前账本对象（按 id 找，比名字可靠） */
  const currentLedgerId = ref<number | null>(null)

  // ===== getters =====
  const currentLedgerConfig = computed<LedgerConfig | undefined>(
    () => ledgers.value.find(l => l.id === currentLedgerId.value) || ledgers.value[0]
  )

  /** 家庭成员：目前后端未提供，先返回空数组（hasMultipleMembers 会退化为 false） */
  const currentMembers = computed<LedgerMember[]>(() => currentLedgerConfig.value?.members ?? [])
  const hasMultipleMembers = computed(() => currentMembers.value.length > 1)

  const isPersonalLedger = computed(() => currentLedgerConfig.value?.type === 'personal')
  const isFamilyLedger = computed(() => currentLedgerConfig.value?.type === 'family')

  // ===== actions =====

  /** 拉取我的账本列表（登录后调用一次即可） */
  async function loadLedgers() {
    loading.value = true
    try {
      const list = await api.get<LedgerApiItem[]>('/ledgers')

      ledgers.value = (list ?? []).map((item): LedgerConfig => ({
        id: item.id,
        name: item.name,
        // 个人账本的 family_id 为 null
        type: item.family_id ? 'family' : 'personal',
        description: item.family_id ? '全家收支大盘与多人协同' : '个人独立支配与私密流水',
        currency: item.currency ?? 'CNY',
        familyId: item.family_id ?? null,
        members: []
      }))

      // 初始化当前账本：优先保留已经选中的那个
      const stillExists = ledgers.value.find(l => l.id === currentLedgerId.value)
      const target = stillExists ?? ledgers.value[0]
      if (target) {
        currentLedgerId.value = target.id
        currentLedger.value = target.name
      } else {
        currentLedgerId.value = null
        currentLedger.value = ''
      }
    } catch {
      // 拉取失败（后端没起 / 网络断）：保持空列表，页面显示"暂无账本"即可，
      // 不要抛出去让整个布局崩掉
      ledgers.value = []
    } finally {
      loading.value = false
    }
  }

  /** 切换账本：按名字找到对应 id */
  function setLedger(name: string) {
    const found = ledgers.value.find(l => l.name === name)
    if (found) {
      currentLedgerId.value = found.id
      currentLedger.value = found.name
    }
  }

  return {
    ledgers,
    currentLedger,
    currentLedgerId,
    currentLedgerConfig,
    currentMembers,
    hasMultipleMembers,
    isPersonalLedger,
    isFamilyLedger,
    loading,
    loadLedgers,
    setLedger
  }
})
