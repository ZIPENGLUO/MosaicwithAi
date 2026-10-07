/**
 * 支付账户接口（属于个人，跨账本复用）
 * 对应后端 routes/api/account.php
 */

import { api } from './client'
import type { Account, AccountPayload, AccountUpdatePayload } from '../interfaces'

export const accountApi = {
  /** 我的全部支付账户 */
  list: () => api.get<Account[]>('/accounts'),

  create: (payload: AccountPayload) => api.post<Account>('/accounts', payload),

  update: (id: number, payload: AccountUpdatePayload) =>
    api.put<Account>(`/accounts/${id}`, payload),

  /**
   * 删除账户
   * 后端策略（决策 B）：未被流水引用可直接删；
   * 已被引用时需 confirm: true，否则 422 并返回引用数量。
   */
  remove: (id: number, confirm = true) => api.delete(`/accounts/${id}`, { confirm }),

  /** 先探一下删除会影响多少条流水（不传 confirm 会拿到 422 + 统计） */
  deletionPreview: (id: number) => api.delete(`/accounts/${id}`, undefined, false)
}
