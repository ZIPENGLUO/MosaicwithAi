/**
 * 登录态 store
 *
 * 设计要点：
 *   ① 登录状态分两层：localStorage 里的 token（"钥匙"）+ 内存里的 user（"人"）
 *   ② 页面刷新后 user 会丢，但 token 还在 → 用 token 调 /auth/me 把 user "捞"回来
 *   ③ 这个接口请求会自动带上 token（靠 client.ts 的请求拦截器），所以这里一行 token 代码都不用写
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authApi from '../api/auth'
import type { User } from '../api/auth'
import { getToken, getStoredUser, ApiError } from '../api/client'

export const useAuthStore = defineStore('auth', () => {
    // ===== state =====
    /** 当前用户；null 表示未登录（或还没从后端拿回来） */
    const user = ref<User | null>(getStoredUser<User>())
    /** 是否正在验证登录态（路由守卫等它，避免刷新页面时误跳登录页） */
    const initializing = ref(false)
    /** 是否已经向后端确认过一次登录态 */
    const checked = ref(false)

    // ===== getters =====
    /** 是否已登录 = 有 token 且已确认过用户身份 */
    const isLoggedIn = computed(() => !!getToken() && !!user.value)
    const displayName = computed(() => user.value?.name ?? '')

    // ===== actions =====

    /** 登录成功后写入 token 和用户（authApi.login 里已经存了，这里只更新内存状态） */
    function setUser(nextUser: User | null) {
        user.value = nextUser
    }

    async function login(email: string, password: string) {
        const result = await authApi.login(email, password)
        user.value = result.user
        checked.value = true
        return result.user
    }

    async function register(payload: {
        name: string
        email: string
        password: string
        password_confirmation: string
    }) {
        const result = await authApi.register(payload)
        user.value = result.user
        checked.value = true
        return result.user
    }

    function logout() {
        return authApi.logout().finally(() => {
            user.value = null
        })
    }

    /**
     * 用本地 token 向后端确认登录态（页面刷新、进入受保护路由时调用）
     * 返回是否已登录
     */
    async function fetchMe(force = false): Promise<boolean> {
        if (!getToken()) {
            user.value = null
            checked.value = true
            return false
        }
        // 已经确认过且不强制刷新，直接用内存里的用户
        if (checked.value && user.value && !force) return true

        initializing.value = true
        try {
            user.value = await authApi.me()
            return true
        } catch (e: any) {
            // 401：token 过期已失效（client.ts 会顺手清 localStorage）→ 当作未登录
            if (e instanceof ApiError && e.status === 401) {
                user.value = null
                return false
            }
            // 其他错误（后端没启动 / 网络断）→ 先当作已登录，避免把用户踢出去
            // 真正的鉴权失败会在后续接口调用时通过 401 拦截器处理
            return !!user.value
        } finally {
            initializing.value = false
            checked.value = true
        }
    }

    return {
        user,
        initializing,
        checked,
        isLoggedIn,
        displayName,
        setUser,
        login,
        register,
        logout,
        fetchMe
    }
})