import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ledgerApi } from '../api/ledger'
import type { Ledger, LedgerConfig, LedgerMember, LedgerMemberView } from '../interfaces'

/** 角色展示文案 */
const ROLE_LABELS: Record<string, string> = {
  owner: '账本所有者',
  admin: '管理员',
  member: '成员'
}

/** 头像素材（放在 public/avatars/ 下），按用户 id 取，取不到就用默认 */
const AVATARS: Record<number, string> = {
  1: '/avatars/user-lin.png',
  2: '/avatars/member-chen.png'
}
const DEFAULT_AVATAR = '/avatars/默认头像.png'

/** 把后端成员结构映射成页面用的展示结构 */
function toMemberView(m: LedgerMember): LedgerMemberView {
  const userId = m.user_id
  return {
    id: userId,
    name: m.user?.name ?? `用户${userId}`,
    role: m.role,
    roleLabel: ROLE_LABELS[m.role] ?? m.role,
    avatar: AVATARS[userId] ?? DEFAULT_AVATAR
  }
}

/**
 * 账本 store
 *
 * 数据来源：
 *   账本列表  GET /api/ledgers            （我拥有的 + 我被加入为成员的）
 *   账本成员  GET /api/ledgers/{id}/members
 *
 * 成员模型：每个账本自带成员（后端 ledger_members），不再有"家庭分组"。
 * 成员数 > 1 的账本在前端视为"协作账本"（UI 上会显示成员相关功能）。
 */

export const useLedgerStore = defineStore('ledger', () => {
  // ===== state =====
  const ledgers = ref<LedgerConfig[]>([])
  /** 当前选中的账本**名称**（AppLayout 的切换器按名字显示/比对） */
  const currentLedger = ref('')
  const loading = ref(false)
  /** 真实的当前账本 id（比名字可靠） */
  const currentLedgerId = ref<number | null>(null)
  /** 当前账本的成员（从后端拉取并映射成展示结构） */
  const members = ref<LedgerMemberView[]>([])

  // ===== getters =====
  const currentLedgerConfig = computed<LedgerConfig | undefined>(
    () => ledgers.value.find(l => l.id === currentLedgerId.value) || ledgers.value[0]
  )

  /** 兼容旧代码：页面里用的是 currentMembers / hasMultipleMembers */
  const currentMembers = computed<LedgerMemberView[]>(() => members.value)
  const hasMultipleMembers = computed(() => members.value.length > 1)

  const isPersonalLedger = computed(() => currentLedgerConfig.value?.type === 'personal')
  /** 协作账本（多人）；名字沿用 isFamilyLedger 以避免改一堆页面 */
  const isSharedLedger = computed(() => currentLedgerConfig.value?.type === 'shared')

  // ===== actions =====

  /** 把后端结构映射成前端视图结构 */
  function toConfig(item: Ledger): LedgerConfig {
    const memberCount = item.members_count ?? 0
    const shared = memberCount > 1
    return {
      ...item,
      type: shared ? 'shared' : 'personal',
      description: shared ? '多人协作收支大盘与共同资金' : '个人独立支配与私密流水',
      members: []
    }
  }

  /** 拉取我的账本列表（登录后调用一次即可） */
  async function loadLedgers() {
    loading.value = true
    try {
      const list = await ledgerApi.list()
      const previousId = currentLedgerId.value
      ledgers.value = (list ?? []).map(toConfig)

      // 初始化当前账本：优先保留已经选中的那个
      const stillExists = ledgers.value.find(l => l.id === previousId)
      const target = stillExists ?? ledgers.value[0]
      if (target) {
        currentLedgerId.value = target.id
        currentLedger.value = target.name
      } else {
        currentLedgerId.value = null
        currentLedger.value = ''
      }

      // 账本列表就绪后，拉当前账本的成员
      await loadMembers()
    } catch {
      // 拉取失败（后端没起 / 网络断）：保持空列表，页面显示"暂无账本"即可，
      // 不抛出去让整个布局崩掉
      ledgers.value = []
      members.value = []
    } finally {
      loading.value = false
    }
  }

  /** 拉当前账本的成员列表 */
  async function loadMembers() {
    const id = currentLedgerId.value
    if (! id) {
      members.value = []
      return
    }
    try {
      const list = await ledgerApi.members(id)
      members.value = (list ?? []).map(toMemberView)
    } catch {
      members.value = []
    }
  }

  /** 切换账本：按名字找到对应 id，并重新拉成员 */
  async function setLedger(name: string) {
    const found = ledgers.value.find(l => l.name === name)
    if (! found) return

    currentLedgerId.value = found.id
    currentLedger.value = found.name
    await loadMembers()
  }

  return {
    ledgers,
    currentLedger,
    currentLedgerId,
    currentLedgerConfig,
    currentMembers,
    hasMultipleMembers,
    isPersonalLedger,
    isSharedLedger,
    loading,
    loadLedgers,
    loadMembers,
    setLedger
  }
})
