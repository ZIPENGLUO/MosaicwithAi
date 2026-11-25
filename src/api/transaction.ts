import { api } from './client'
export interface TransactionPayload {
  type: 'income' | 'expense'
  amount: string | number
  account_id: number
  category_id: number
  occurred_at: string
  merchant?: string
  note?: string
  source?: 'manual' | 'ocr'
}
export interface TransactionRecord extends TransactionPayload {
  id: number
  created_by: number
  account: { id: number; name: string } | null
  category: { id: number; name: string; parent_id: number } | null
  creator: { id: number; name: string } | null
}
export const transactionApi = {
  create: (ledgerId: number, payload: TransactionPayload) => api.post<TransactionRecord>(`/ledgers/${ledgerId}/transactions`, payload),
  list: (ledgerId: number, page = 1) => api.get<{ data: TransactionRecord[]; last_page: number }>(`/ledgers/${ledgerId}/transactions`, { page, per_page: 100 }),
  remove: (ledgerId: number, id: number) => api.delete(`/ledgers/${ledgerId}/transactions/${id}`),
  batchRemove: (ledgerId: number, ids: number[]) => api.post(`/ledgers/${ledgerId}/transactions/batch-delete`, { ids })
}
export function localDateTime(date = new Date()) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}
