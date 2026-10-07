/**
 * 认证相关类型
 * 对应后端：routes/api/auth.php、AuthController
 */

/** 登录用户（后端 users 表；password 不会返回） */
export interface User {
  id: number
  name: string
  email: string
  email_verified_at?: string | null
  created_at?: string
  updated_at?: string
}

/** 登录/注册成功后的返回：token + 用户 */
export interface AuthResult {
  token: string
  user: User
}

/** 登录入参 */
export interface LoginPayload {
  email: string
  password: string
}

/** 注册入参（后端用 confirmed 规则，需要重复密码字段） */
export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
}
