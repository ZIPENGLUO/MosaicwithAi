export interface BillItem {
  title: string
  category: string
  date: string
  member: string
  amount: number
  type: '收入' | '支出'
}

export const bills: BillItem[] = [
  {
    title: '盒马鲜生生鲜购物',
    category: '居家日用',
    date: '2026-09-03',
    member: '林知栖',
    amount: 328.6,
    type: '支出'
  },
  {
    title: '九毛九太二酸菜鱼',
    category: '餐饮美食',
    date: '2026-09-02',
    member: '陈先生',
    amount: 188.0,
    type: '支出'
  },
  {
    title: '工资到账',
    category: '工资收入',
    date: '2026-09-01',
    member: '陈先生',
    amount: 25000.0,
    type: '收入'
  },
  {
    title: '南方电网 9月扣缴',
    category: '居家生活',
    date: '2026-08-30',
    member: '林知栖',
    amount: 245.8,
    type: '支出'
  }
]
