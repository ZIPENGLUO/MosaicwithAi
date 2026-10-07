/**
 * 账本相关类型
 * 对应后端：GET/POST /api/ledgers、GET/PUT/DELETE /api/ledgers/{id}
 */

/** 后端返回的账本结构（ledgers 表） */
export interface Ledger {
  id: number
  name: string
  currency: string
  owner_id: number
  /** 家庭账本才有；NULL = 个人账本 */
  family_id: number | null
  created_at?: string
  updated_at?: string
}

/** 创建账本入参 */
export interface LedgerPayload {
  name: string
  currency?: string
  /** 传了就是家庭账本（后端会校验你是否该家庭成员），不传为个人账本 */
  family_id?: number | null
}

/** 前端使用的账本视图（在后端结构上补充前端推导出来的字段） */
export interface LedgerConfig extends Ledger {
  /** 前端按 family_id 推导：有 family_id = family，否则 personal */
  type: 'family' | 'personal' | 'fund'
  description: string
  /** 家庭成员；后端接口 /api/families/{id}/members 提供，暂未接入 */
  members: LedgerMember[]
}

export interface LedgerMember {
  /**
   * ⚠️ 暂用 string：现有页面（Analytics / Settings）用字符串成员标识
   * （'all' / 'lin' / 'chen'，对应头像素材文件名）。
   * 等接入 GET /api/families/{id}/members（返回数字 user_id）时，
   * 需要把这些页面一起改成数字 id，再统一类型。
   */
  id: string
  name: string
  role: string
  avatar?: string
  color?: string
}
