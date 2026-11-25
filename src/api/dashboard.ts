import { api } from './client'
export interface Dashboard {
  currency: string
  summary: { income: number; expense: number; net: number }
  trend: { date: string; income: number; expense: number }[]
  categories: { name: string; value: number }[]
  recent: { id: number; merchant: string | null; note: string | null; type: string; amount: string; occurred_at: string; creator: { name: string } | null }[]
}
export const dashboardApi = {
  get: (id: number, days: number) => api.get<Dashboard>(`/ledgers/${id}/dashboard`, { days })
}
