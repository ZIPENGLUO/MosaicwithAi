<template>
  <div class="login-canvas">
    <main class="login-shell">
      <div class="ambient ambient-1"></div>
      <div class="ambient ambient-2"></div>

      <!-- 顶部细条 -->
      <header class="login-header">
        <div class="flex items-baseline gap-3">
          <span class="wordmark">Mosic</span>
          <div class="header-divider"></div>
          <span class="text-xs tracking-wider uppercase font-semibold text-primary">家庭智能财务管家</span>
          <span class="badge-mono">AI FIN 2.4</span>
        </div>
        <div class="flex items-center gap-6 text-xs text-on-surface-variant">
          <div class="flex items-center gap-1.5 font-medium">
            <span class="material-symbols-outlined" style="font-size: 15px; color: var(--color-primary)">verified_user</span>
            <span>银行级本地零知识数据隔离</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="dot-online"></span>
            <span class="font-mono" style="font-size: 11px">系统正常运行</span>
          </div>
        </div>
      </header>

      <!-- 中间：左文案 + 右注册卡 -->
      <div class="login-body lg:grid-cols-12">
        <section class="lg:col-span-7 hero">
          <h1 class="hero-title">
            创建家庭账本，<br />
            <span class="text-primary" style="display: block; margin-top: 4px">让每笔收支都有归处。</span>
          </h1>
          <p class="hero-desc">
            一个账号即可开启家庭协同记账：多人共享账本、按成员统计支出、智能票据识别入账。所有数据仅属于你的家庭。
          </p>
        </section>

        <section class="lg:col-span-5 flex justify-center">
          <div class="auth-card">
            <div style="margin-bottom: 24px">
              <div class="flex items-center justify-between" style="margin-bottom: 6px">
                <h2 class="wordmark" style="font-size: 24px">注册 Mosic</h2>
                <span class="badge-security">Create Account</span>
              </div>
              <p class="text-xs text-on-surface-variant">填写以下信息，立即创建你的家庭账本</p>
            </div>

            <form class="form-stack" @submit.prevent="handleSubmit">
              <div>
                <label class="field-label" for="reg-name">你的称呼</label>
                <div class="field-wrap">
                  <span class="material-symbols-outlined field-icon">badge</span>
                  <input
                    id="reg-name"
                    v-model.trim="form.name"
                    class="field-input"
                    type="text"
                    placeholder="例如：林知栖"
                    autocomplete="name"
                  />
                </div>
              </div>

              <div>
                <label class="field-label" for="reg-email">邮箱</label>
                <div class="field-wrap">
                  <span class="material-symbols-outlined field-icon">mail</span>
                  <input
                    id="reg-email"
                    v-model.trim="form.email"
                    class="field-input"
                    type="email"
                    placeholder="用于登录与找回密码"
                    autocomplete="email"
                  />
                </div>
              </div>

              <div>
                <label class="field-label" for="reg-pass">登录密码</label>
                <div class="field-wrap">
                  <span class="material-symbols-outlined field-icon">lock</span>
                  <input
                    id="reg-pass"
                    v-model="form.password"
                    class="field-input"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="至少 6 位字符"
                    autocomplete="new-password"
                  />
                  <button type="button" class="field-action" @click="showPassword = !showPassword">
                    <span class="material-symbols-outlined" style="font-size: 18px">
                      {{ showPassword ? 'visibility' : 'visibility_off' }}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label class="field-label" for="reg-pass2">确认密码</label>
                <div class="field-wrap">
                  <span class="material-symbols-outlined field-icon">lock_reset</span>
                  <input
                    id="reg-pass2"
                    v-model="form.passwordConfirmation"
                    class="field-input"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="再输入一次密码"
                    autocomplete="new-password"
                  />
                </div>
              </div>

              <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

              <button type="submit" class="btn-primary" :disabled="loading">
                <span>{{ loading ? '创建中…' : '立即创建账本' }}</span>
                <span class="material-symbols-outlined" style="font-size: 16px">arrow_forward</span>
              </button>
            </form>

            <div class="register-line">
              <span>已经有 Mosic 账号？</span>
              <span class="link-primary" style="margin-left: 4px" @click="goLogin">返回登录</span>
            </div>

            <p class="disclaimer">
              继续操作即代表您已阅读并同意
              <span class="link-subtle" style="text-decoration: underline">用户服务协议</span>
              与
              <span class="link-subtle" style="text-decoration: underline">家庭财务隐私保护政策</span>
            </p>
          </div>
        </section>
      </div>

      <footer class="login-footer">
        <div class="flex items-center" style="gap: 16px">
          <span>© 2024 Mosic Financial Labs. 保留所有权利</span>
        </div>
        <div class="flex items-center" style="gap: 20px">
          <span>数据自主可控倡议</span>
          <span>SOC2 Type II 审计标准</span>
          <span>联系支持</span>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ApiError } from '../api/client'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: ''
})

const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

/** 前端先做一轮校验，减少无意义的请求（后端仍会再校验一次） */
function validate(): string {
  if (!form.name) return '请填写你的称呼'
  if (!form.email) return '请填写邮箱'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) return '邮箱格式不正确'
  if (form.password.length < 6) return '密码至少 6 位字符'
  if (form.password !== form.passwordConfirmation) return '两次输入的密码不一致'
  return ''
}

async function handleSubmit() {
  errorMessage.value = ''

  const invalid = validate()
  if (invalid) {
    errorMessage.value = invalid
    return
  }

  loading.value = true
  try {
    await authStore.register({
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.passwordConfirmation
    })
    // 后端注册成功即发 token（等于已登录）→ 直接进首页
    router.replace('/home')
  } catch (e: any) {
    // 422 的字段错误（如邮箱已存在）在 client.ts 里已提取成可读文案
    errorMessage.value = e instanceof ApiError ? e.message : '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

function goLogin() {
  router.push('/login')
}
</script>

<style scoped>
.login-canvas {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: #fcf9f6;
}

.login-shell {
  position: relative;
  width: 100%;
  max-width: 1440px;
  min-height: 760px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  border-radius: 28px;
  border: 1px solid rgba(231, 226, 220, 0.6);
  background-color: #fcf9f6;
  box-shadow: 0 20px 60px -15px rgba(217, 119, 87, 0.08), 0 8px 24px -6px rgba(20, 20, 19, 0.04);
}

.ambient {
  position: absolute;
  border-radius: 9999px;
  pointer-events: none;
  filter: blur(120px);
}
.ambient-1 {
  top: -160px;
  left: -80px;
  width: 540px;
  height: 540px;
  background: rgba(217, 119, 87, 0.18);
}
.ambient-2 {
  bottom: -60px;
  right: 0;
  width: 420px;
  height: 420px;
  background: rgba(229, 224, 218, 0.5);
  filter: blur(100px);
}

.login-header {
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  border-bottom: 1px solid rgba(231, 226, 220, 0.4);
}

.wordmark {
  font-weight: 700;
  letter-spacing: -0.045em;
  color: var(--color-on-surface);
}
.login-header .wordmark {
  font-size: 26px;
}

.header-divider {
  width: 1px;
  height: 14px;
  background: var(--color-outline-variant);
}

.badge-mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 9999px;
  border: 1px solid rgba(231, 226, 220, 0.7);
  background: var(--color-surface-container-low);
  color: var(--color-on-surface-variant);
}

.dot-online {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: rgba(5, 150, 105, 0.7);
}

.login-body {
  position: relative;
  z-index: 10;
  flex: 1;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 32px;
  /* 两栏都在垂直方向居中：align-content 管整行，align-items 管行内各项 */
  align-content: center;
  align-items: center;
  padding: 32px;
}

/* 左右两栏各自居中，避免一边贴顶、一边居中 */
.hero {
  align-self: center;
}
.auth-card {
  align-self: center;
}

.hero-title {
  font-size: 40px;
  font-weight: 700;
  line-height: 1.35;
  color: var(--color-on-surface);
  margin: 0 0 24px;
}
.hero-desc {
  max-width: 520px;
  font-size: 16px;
  line-height: 1.8;
  color: var(--color-on-surface-variant);
  margin: 0;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  padding: 32px;
  border-radius: 24px;
  border: 1px solid rgba(231, 226, 220, 0.7);
  background: #ffffff;
  box-shadow: 0 16px 40px -12px rgba(45, 35, 30, 0.07), 0 2px 8px -2px rgba(20, 20, 19, 0.03);
}

.badge-security {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(153, 70, 42, 0.1);
  color: var(--color-primary);
}

.form-stack > * + * {
  margin-top: 16px;
}

.field-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-on-surface);
  margin-bottom: 6px;
}

.field-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.field-icon {
  position: absolute;
  left: 14px;
  font-size: 18px;
  color: var(--color-outline);
  pointer-events: none;
}
.field-input {
  width: 100%;
  height: 44px;
  padding-left: 40px;
  padding-right: 40px;
  font-size: 12px;
  border-radius: 12px;
  border: 1px solid rgba(231, 226, 220, 0.8);
  background: #fcf9f6;
  color: var(--color-on-surface);
  transition: all 0.15s;
  outline: none;
  font-family: inherit;
}
.field-input::placeholder {
  color: var(--color-outline);
}
.field-input:focus {
  border-color: var(--color-primary-container);
  box-shadow: 0 0 0 3px rgba(217, 119, 87, 0.14);
}
.field-action {
  position: absolute;
  right: 12px;
  padding: 4px;
  border: 0;
  background: transparent;
  color: var(--color-outline);
  cursor: pointer;
}
.field-action:hover {
  color: var(--color-on-surface);
}

.error-text {
  margin: 0;
  font-size: 12px;
  color: #ba1a1a;
}

.btn-primary {
  width: 100%;
  height: 44px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 0;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #ffffff;
  cursor: pointer;
  font-family: inherit;
  background: linear-gradient(to right, var(--color-primary-container), #b85d3f);
  transition: all 0.15s;
}
.btn-primary:hover:not(:disabled) {
  filter: brightness(0.95);
}
.btn-primary:active:not(:disabled) {
  transform: scale(0.99);
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.register-line {
  margin-top: 16px;
  text-align: center;
  font-size: 12px;
  color: var(--color-on-surface-variant);
}
.link-primary {
  font-weight: 600;
  color: var(--color-primary);
  cursor: pointer;
}
.link-subtle {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-primary);
  cursor: pointer;
}

.disclaimer {
  margin: 20px 0 0;
  text-align: center;
  font-size: 11px;
  line-height: 1.6;
  color: var(--color-outline);
}

.login-footer {
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  border-top: 1px solid rgba(231, 226, 220, 0.4);
  font-size: 11px;
  color: var(--color-outline);
}

/* 中等宽度（≥768px）就分栏：左 7 列文案 / 右 5 列注册卡 */
@media (min-width: 768px) {
  .login-body {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 32px;
  }
  .login-body .hero {
    grid-column: span 7 / span 7;
  }
  .login-body .auth-card {
    grid-column: span 5 / span 5;
    justify-self: end;
    max-width: 440px;
    width: 100%;
  }
}

/* 宽屏：内边距与标题字号加大 */
@media (min-width: 1024px) {
  .login-header,
  .login-footer {
    padding-left: 56px;
    padding-right: 56px;
  }
  .login-body {
    padding: 40px 56px;
    gap: 48px;
    align-content: center;
  }
  .hero,
  .auth-card {
    align-self: center;
  }
  .hero-title {
    font-size: 48px;
  }
}
</style>
