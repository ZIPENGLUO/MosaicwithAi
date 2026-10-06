/**
 * 认证相关接口（对应后端 routes/api/auth.php）
 *
 * 设计约定：这一层只负责"调接口 + 存 token"，不含跳转/提示等 UI 逻辑
 * （跳转在 router 守卫里，提示在页面里）
 */

import { api, setToken, setStoredUser } from './client'

export interface User {
    id: number
    name: string
    email: string
    email_verified_at?: string | null
    created_at?: string
    updated_at?: string
}

/** 登录/注册返回：token + 用户信息 */
export interface AuthResult {
    token: string
    user: User
}

/**
 * 登录
 * 邮箱或密码错误时后端返回 401 —— 这是"正常业务失败"，
 * 所以 autoRedirect 传 false，避免 401 被当成"登录过期"跳走（我们本来就在登录页）
 */
export async function login(email: string, password: string): Promise<AuthResult> {
    const data = await api.post<AuthResult>('/auth/login', { email, password }, false)
    // token 与用户信息落到 localStorage（client.ts 提供的统一入口）
    setToken(data.token)
    setStoredUser(data.user)
    return data
}

/** 注册（成功后后端直接发 token，等于已登录） */
export async function register(payload: {
    name: string
    email: string
    password: string
    /** 后端用 confirmed 规则，需要重复密码字段 */
    password_confirmation: string
}): Promise<AuthResult> {
    const data = await api.post<AuthResult>('/auth/register', payload, false)
    setToken(data.token)
    setStoredUser(data.user)
    return data
}

/** 当前登录用户（校验 token 是否还有效） */
export async function me(): Promise<User> {
    return api.get<User>('/auth/me')
}

/**
 * 退出登录
 * 要点：即使后端调用失败（token 已过期/网络断了），也要清掉本地登录态，
 * 否则用户会卡在"点退出没反应"的状态
 */
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

/** 刷新 token（旧 token 会作废，返回新 token） */
export async function refresh(): Promise<string> {
    const data = await api.post<{ token: string }>('/auth/refresh', undefined, false)
    setToken(data.token)
    return data.token
}