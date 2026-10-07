/**
 * 账本相关类型
 * 对应后端：GET/POST /api/ledgers、GET/PUT/DELETE /api/ledgers/{id}
 *
 * 成员模型（2026-10 重构后）：**每个账本自带成员**（ledger_members），
 * 不再有"家庭分组"概念 —— 一家人共享一个账本、室友共享另一个账本，互不干扰。
 */

/** 后端返回的账本结构（ledgers 表） */
export interface Ledger {
  id: number
  name: string
  currency: string
  owner_id: number
  /** 列表接口用 withCount('members') 附带 */
  members_count?: number
  created_at?: string
  updated_at?: string
}

/** 创建账本入参（新账本默认只有自己一个成员） */
export interface LedgerPayload {
  name: string
  currency?: string
}

/** 前端使用的账本视图（在后端结构上补充前端推导出来的字段） */
export interface LedgerConfig extends Ledger {
  /**
   * 前端推导：成员数 > 1 → shared（协作账本），否则 personal（个人账本）
   */
  type: 'personal' | 'shared'
  description: string
  /** 账本成员；由 GET /api/ledgers/{id}/members 拉取并映射成 LedgerMemberView */
  members: LedgerMemberView[]
}

/** 账本成员（ledger_members 表，后端原样返回的结构） */
export interface LedgerMember {
  id: number
  ledger_id: number
  user_id: number
  /** owner = 账本所有者（唯一能改删账本）；admin = 可改删任何人的流水；member = 只能改删自己的 */
  role: 'owner' | 'admin' | 'member'
  /** 关联查询带出来的用户信息 */
  user?: {
    id: number
    name: string
  }
  created_at?: string
  updated_at?: string
}

/**
 * 前端页面用的成员形状
 *
 * ⚠️ 与后端 `LedgerMember`（原样返回的结构）区分开：
 * 后端给的是 { id, ledger_id, user_id, role, user:{id,name} }，
 * 页面需要的是"id + 名字 + 头像"这种展示友好的形状，
 * 由 stores/ledger.ts 做映射（避免每个页面各自处理嵌套的 user 字段）。
 *
 * id 用**数字 user_id**：这是真实用户 id，能直接用于接口筛选（如 created_by）。
 */
export interface LedgerMemberView {
  /** 用户 id（数字）；页面里做成员筛选时用它 */
  id: number
  name: string
  /** 展示用角色文案：账本所有者 / 管理员 / 成员 */
  roleLabel: string
  role: 'owner' | 'admin' | 'member'
  avatar: string
}
