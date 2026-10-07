/**
 * 收支分类接口（**全局公共目录，定死，只读**）
 * 对应后端 routes/api/category.php
 *
 * 后端返回的是**两级树**：顶层大类数组，每项含 children（子类）。
 * 记账时只能选子类；统计可按大类汇总。
 */

import { api } from './client'
import type { Category, CategoryGroup, CategoryType } from '../interfaces'

export const categoryApi = {
  /** 全部分类树（支出在前、收入在后） */
  tree: () => api.get<CategoryGroup[]>('/categories'),

  /** 只看某一类：type = 'expense' | 'income' */
  treeByType: (type: CategoryType) =>
    api.get<CategoryGroup[]>('/categories', { type })
}

/** 把两级树拍平成"子类"列表（记账选择器用；带所属大类名便于分组显示） */
export function flattenLeaves(groups: Category[]): Array<Category & { parentName: string }> {
  return groups.flatMap((group) =>
    (group.children ?? []).map((child) => ({ ...child, parentName: group.name }))
  )
}
