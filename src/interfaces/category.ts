/**
 * 收支分类类型（**全局公共目录**，定死，只读）
 * 对应后端：GET /api/categories?type=expense|income
 *
 * 结构是固定两级：
 *   - 顶层大类（parent_id = null）：如"餐饮食品""交通出行"，**带 icon**
 *   - 子类（parent_id = 顶层 id）：如"生鲜食品""打车"，**icon 为空**
 *
 * 记账时只能选**子类**；统计时可按大类汇总。
 */

export type CategoryType = 'income' | 'expense'

export interface Category {
  id: number
  name: string
  type: CategoryType
  /** 顶层分类有图标；子类为 null */
  icon: string | null
  sort_order: number
  /** null = 顶层大类 */
  parent_id: number | null
  children?: Category[]
}

/** 顶层分类（必定有 children） */
export interface CategoryGroup extends Category {
  parent_id: null
  children: Category[]
}
