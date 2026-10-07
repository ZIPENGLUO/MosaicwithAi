/**
 * 账本接口
 * 对应后端 routes/api/ledger.php
 */

import { api } from './client'
import type { Ledger, LedgerPayload } from '../interfaces'

export const ledgerApi = {
  /** 我创建的 + 我加入家庭的账本 */
  list: () => api.get<Ledger[]>('/ledgers'),

  detail: (id: number) => api.get<Ledger>(`/ledgers/${id}`),

  create: (payload: LedgerPayload) => api.post<Ledger>('/ledgers', payload),

  /** 局部更新：只传要改的字段 */
  update: (id: number, payload: Partial<LedgerPayload>) =>
    api.put<Ledger>(`/ledgers/${id}`, payload),

  /**
   * 删除账本（会级联删除该账本的流水/分类/附件，**不动账户**）
   * 后端要求 confirm: true，否则返回 422 并附带"会删掉多少"的统计
   */
  remove: (id: number) => api.delete(`/ledgers/${id}`, { confirm: true })
}
