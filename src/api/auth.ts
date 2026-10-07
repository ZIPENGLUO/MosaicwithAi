/**
 * 认证接口
 * 对应后端 routes/api/auth.php
 *
 * 这一层只负责"调接口 + 存 token"，不含跳转/提示等 UI 逻辑
 * （跳转在路由守卫里，提示在页面里）
 */

import { api, setToken, setStoredUser } from './client'
import type { AuthResult, LoginPayload, RegisterPayload, User } from '../interfaces'

/**
 * 登录
 * 邮箱或密码错误时后端返回 401 —— 这是"正常业务失败"，
 * 所以 autoRedirect 传 false，避免 401 被当成"登录过期"跳走（我们本来就在登录页）
 */
export async function login(email: string, password: string): Promise<AuthResult> {
  const payload: LoginPayload = { email, password }
  const data = await api.post<AuthResult>('/auth/login', payload, false)
  setToken(data.token)
  setStoredUser(data.user)
  return data
}

/** 注册（成功后后端直接发 token，等于已登录） */
export async function register(payload: RegisterPayload): Promise<AuthResult> {
  const data = await api.post<AuthResult>('/auth/register', payload, false)
  setToken(data.token)
  setStoredUser(data.user)
  return data
}

/** 当前登录用户（校验 token 是否还有效） */
export async function me(): Promise<User> {
  return api.get<User>('/auth/me')
}

/** 退出登录：即使后端失败也要清本地登录态，否则用户会卡住 */
export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout', undefined, false)
  } catch {
    // 忽略：后端作废失败不影响前端登出
  } finally {
    setToken(null)
    setStoredUser(null)
  }
}

/** 刷新 token（旧 token 作废，返回新 token） */
export async function refresh(): Promise<string> {
  const data = await api.post<{ token: string }>('/auth/refresh', undefined, false)
  setToken(data.token)
  return data.token
}
