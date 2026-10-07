import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ledgerApi } from '../api/ledger'
import type { Ledger, LedgerConfig, LedgerMember } from '../interfaces'

/**
 * 账本 store
 *
 * 数据来源：GET /api/ledgers（我创建的 + 我加入家庭的账本）
 * 类型定义统一放在 src/interfaces/ledger.ts
 *
 * 说明：后端返回 { id, name, currency, owner_id, family_id }，
 * 没有 type/description，前端按 family_id 是否为空推导；
 * 家庭成员暂未接入（后端已有 GET /api/families/{id}/members）。
 */

export const useLedgerStore = defineStore('ledger', () => {
  // ===== state =====
  const ledgers = ref<LedgerConfig[]>([])
  /** 当前选中的账本**名称**（AppLayout 的切换器按名字显示/比对） */
  const currentLedger = ref('')
  const loading = ref(false)
  /** 真实的当前账本 id（比名字可靠） */
  const currentLedgerId = ref<number | null>(null)

  // ===== getters =====
  const currentLedgerConfig = computed<LedgerConfig | undefined>(
    () => ledgers.value.find(l => l.id === currentLedgerId.value) || ledgers.value[0]
  )

  const currentMembers = computed<LedgerMember[]>(() => currentLedgerConfig.value?.members ?? [])
  const hasMultipleMembers = computed(() => currentMembers.value.length > 1)

  const isPersonalLedger = computed(() => currentLedgerConfig.value?.type === 'personal')
  const isFamilyLedger = computed(() => currentLedgerConfig.value?.type === 'family')

  // ===== actions =====

  /** 把后端结构映射成前端视图结构 */
  function toConfig(item: Ledger): LedgerConfig {
    return {
      ...item,
      // 有 family_id 即家庭账本，否则个人账本
      type: item.family_id ? 'family' : 'personal',
      description: item.family_id ? '全家收支大盘与多人协同' : '个人独立支配与私密流水',
      members: []
    }
  }

  /** 拉取我的账本列表（登录后调用一次即可） */
  async function loadLedgers() {
    loading.value = true
    try {
      const list = await ledgerApi.list()
      ledgers.value = (list ?? []).map(toConfig)

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
      // 不抛出去让整个布局崩掉
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
