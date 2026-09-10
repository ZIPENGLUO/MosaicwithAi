import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface LedgerMember {
  id: string
  name: string
  role: string
  avatar: string
  color: string
}

export interface LedgerConfig {
  id: string
  name: string
  type: 'family' | 'personal' | 'fund'
  description: string
  members: LedgerMember[]
}

export const useLedgerStore = defineStore('ledger', () => {
  const ledgers: LedgerConfig[] = [
    {
      id: 'family',
      name: '林氏一家 账本',
      type: 'family',
      description: '全家收支大盘与多人协同',
      members: [
        { id: 'lin', name: '林知栖', role: '户主 · 主理人', avatar: '/avatars/user-lin.png', color: '#d97757' },
        { id: 'chen', name: '陈先生', role: '配偶 · 协同人', avatar: '/avatars/member-chen.png', color: '#41674c' },
        { id: 'child', name: '林小满', role: '孩子 · 萌芽期', avatar: '/avatars/刘海女孩.png', color: '#e29578' },
        { id: 'elder', name: '苏外婆', role: '长辈 · 照料协同', avatar: '/avatars/白发老奶奶.png', color: '#88726c' }
      ]
    },
    {
      id: 'personal',
      name: '个人私密账本',
      type: 'personal',
      description: '知栖个人独立支配与私密流水',
      members: [
        { id: 'lin', name: '林知栖', role: '账本专属人', avatar: '/avatars/user-lin.png', color: '#d97757' }
      ]
    },
    {
      id: 'fund',
      name: '海岛游专项基金',
      type: 'fund',
      description: '年度海岛度假专项储蓄',
      members: [
        { id: 'lin', name: '林知栖', role: '主理人', avatar: '/avatars/user-lin.png', color: '#d97757' },
        { id: 'chen', name: '陈先生', role: '协同人', avatar: '/avatars/member-chen.png', color: '#41674c' }
      ]
    }
  ]

  const currentLedger = ref('林氏一家 账本')

  const currentLedgerConfig = computed(() => {
    return ledgers.find(l => l.name === currentLedger.value) || ledgers[0]
  })

  const currentMembers = computed(() => currentLedgerConfig.value.members)
  const hasMultipleMembers = computed(() => currentMembers.value.length > 1)

  const isPersonalLedger = computed(() => currentLedgerConfig.value.type === 'personal')
  const isFamilyLedger = computed(() => currentLedgerConfig.value.type === 'family')

  function setLedger(name: string) {
    currentLedger.value = name
  }

  return {
    ledgers,
    currentLedger,
    currentLedgerConfig,
    currentMembers,
    hasMultipleMembers,
    isPersonalLedger,
    isFamilyLedger,
    setLedger
  }
})
