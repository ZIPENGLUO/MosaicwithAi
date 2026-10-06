/**
 * 统一 API 客户端（axios 版）
 *
 * 与后端的约定：
 *   - 成功：HTTP 200 + { code, message, data }  → 响应拦截器自动剥出 data
 *   - 未认证：HTTP 401 → 清 token 并跳登录页（后端返回 JSON，不重定向）
 *   - 失败：4xx/5xx → 抛 ApiError，调用方 try/catch 拿 message 显示
 */

import axios, { AxiosError } from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'

const TOKEN_KEY = 'mosaic_token'
const USER_KEY = 'mosaic_user'

/** 开发环境走 vite 代理（/api → 后端 8000），生产用 VITE_API_BASE_URL */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export interface ApiEnvelope<T = any> {
    code: number
    message: string
    data: T
}

/** 把后端各种错误格式统一成一句可读文案（422 校验错误优先取第一条） */
function extractErrorMessage(status: number, body: any): string {
    if (body?.errors && typeof body.errors === 'object') {
        const first = Object.values(body.errors)[0]
        if (Array.isArray(first) && first.length) return String(first[0])
    }
    if (typeof body?.message === 'string' && body.message) return body.message
    if (status === 401) return '登录已过期，请重新登录'
    if (status === 403) return '没有权限'
    if (status === 404) return '资源不存在'
    if (status === 422) return '提交的内容不合法'
    if (status >= 500) return '服务器出错了，请稍后重试'
    return `请求失败（${status}）`
}

export class ApiError extends Error {
    status: number
    data: any
    constructor(status: number, message: string, data?: any) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.data = data
    }
}

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null) {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
}

export function getStoredUser<T = any>(): T | null {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    try {
        return JSON.parse(raw) as T
    } catch {
        return null
    }
}

export function setStoredUser(user: any | null) {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
}

/** 401 时统一跳登录页，并记住来路 */
function redirectToLogin() {
    setToken(null)
    setStoredUser(null)
    const current = window.location.pathname + window.location.search
    if (!current.startsWith('/login')) {
        window.location.href = `/login?redirect=${encodeURIComponent(current)}`
    }
}

/** 每个请求都能单独关掉自动跳转（登录接口自己处理 401） */
interface RequestOptions extends AxiosRequestConfig {
    autoRedirect?: boolean
}

const http: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 20000,
    headers: { Accept: 'application/json' }
})

/** 语言：后端按 Accept-Language 决定校验消息语言（zh_CN / en / ja） */
const LOCALE_KEY = 'mosaic_locale'

export function getLocale(): string {
    return localStorage.getItem(LOCALE_KEY) || 'zh-CN'
}

export function setLocale(locale: string) {
    localStorage.setItem(LOCALE_KEY, locale)
}

// ===== 请求拦截器：自动带上 JWT 与语言 =====
http.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    // 语言头：后端 SetLocale 中间件据此切换校验消息语言
    config.headers['Accept-Language'] = getLocale()
    return config
})

// ===== 响应拦截器：剥信封 + 统一错误 =====
http.interceptors.response.use(
    (response) => {
        const payload = response.data
        // 后端成功统一 { code, message, data }：只把 data 交给业务代码
        if (payload && typeof payload === 'object' && 'data' in payload) {
            return payload.data
        }
        return payload
    },
    (error: AxiosError) => {
        const status = error.response?.status ?? 0
        const body: any = error.response?.data

        if (status === 401) {
            const autoRedirect = (error.config as RequestOptions | undefined)?.autoRedirect !== false
            if (autoRedirect) redirectToLogin()
            return Promise.reject(new ApiError(401, extractErrorMessage(401, body), body))
        }

        // status === 0：请求根本没发出去（后端没启动、断网、跨域）
        const message = status === 0
            ? '无法连接服务器，请确认后端已启动'
            : extractErrorMessage(status, body)

        return Promise.reject(new ApiError(status, message, body))
    }
)

export const api = {
    get: <T = any>(url: string, params?: Record<string, any>, autoRedirect = true) =>
        http.get(url, { params, autoRedirect } as RequestOptions) as unknown as Promise<T>,
    post: <T = any>(url: string, body?: any, autoRedirect = true) =>
        http.post(url, body, { autoRedirect } as RequestOptions) as unknown as Promise<T>,
    put: <T = any>(url: string, body?: any, autoRedirect = true) =>
        http.put(url, body, { autoRedirect } as RequestOptions) as unknown as Promise<T>,
    delete: <T = any>(url: string, body?: any, autoRedirect = true) =>
        http.delete(url, { data: body, autoRedirect } as RequestOptions) as unknown as Promise<T>
}