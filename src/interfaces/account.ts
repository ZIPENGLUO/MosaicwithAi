/**
 * 支付账户类型（属于**个人**，跨账本复用）
 * 对应后端：GET/POST /api/accounts、PUT/DELETE /api/accounts/{id}
 */

export interface Account {
  id: number
  /** 归属用户；后端填，前端只读 */
  user_id: number
  name: string
  /** 支付方式类型：cash / wechat / alipay / debit_card / credit_card / medical ... */
  type: string
  /** 保留字段，本期不做余额功能 */
  opening_balance?: string
  created_at?: string
  updated_at?: string
}

/** 新增账户入参 */
export interface AccountPayload {
  name: string
  type?: string
}

/** 修改账户入参（局部更新） */
export type AccountUpdatePayload = Partial<AccountPayload>
