/**
 * 类型统一出口
 *
 * 页面里一行导入即可：
 *   import type { Ledger, Account, Category } from '../interfaces'
 *
 * 按后端模块分文件，和后端 routes/api/*.php 一一对应。
 */

export type { User, AuthResult, LoginPayload, RegisterPayload } from './auth'
export type { Ledger, LedgerPayload, LedgerConfig, LedgerMember } from './ledger'
export type { Account, AccountPayload, AccountUpdatePayload } from './account'
export type { Category, CategoryGroup, CategoryType } from './category'
