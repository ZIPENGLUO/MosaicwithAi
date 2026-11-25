import { api } from './client'
export interface Notice {
  id: number
  invitation_id: number | null
  type: string
  data: { title?: string; message?: string }
}
export const notificationApi = {
  list: () => api.get<Notice[]>('/notifications'),
  invite: (id: number, email: string) => api.post(`/ledgers/${id}/invitations`, { email }),
  respond: (id: number, action: 'accept' | 'reject') => api.post(`/invitations/${id}/respond`, { action }),
  handle: (id: number) => api.post(`/notifications/${id}/handle`),
  role: (id: number, memberId: number, role: 'admin' | 'member') => api.put(`/ledgers/${id}/members/${memberId}/role`, { role })
}
