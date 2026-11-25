<template>
  <div class="settings-page">
    <header class="page-heading"><span class="eyebrow">YOUR SPACE</span><h1>个人设置</h1><p>管理你的账号、支付方式与账本。</p></header>
    <div class="settings-grid">
      <aside class="settings-nav">
        <div class="identity"><button class="avatar" aria-label="修改头像" @click="openProfile"><img :src="auth.user?.avatar || '/avatars/user-lin.png'" alt="我的头像" style="width:56px;height:56px;object-fit:cover;border-radius:20px" /></button><strong>{{ auth.displayName || '我的账号' }}</strong><span>{{ auth.user?.email }}</span></div>
        <button v-for="tab in tabs" :key="tab.id" :class="{ active: active === tab.id }" @click="active = tab.id"><span class="material-symbols-outlined">{{ tab.icon }}</span>{{ tab.label }}<span class="material-symbols-outlined arrow">chevron_right</span></button>
      </aside>
      <main class="settings-content">
        <section v-if="active === 'profile'" class="panel">
          <div class="panel-heading"><h2>账号信息</h2><p>当前登录账号的基本资料</p></div>
          <dl><div><dt>用户名</dt><dd>{{ auth.displayName || '—' }}</dd></div><div><dt>邮箱</dt><dd>{{ auth.user?.email || '—' }}</dd></div><div><dt>账号状态</dt><dd><span class="status">已登录</span></dd></div></dl>
          <button class="action" @click="openProfile">修改个人资料<span class="material-symbols-outlined">edit</span></button>
        </section>
        <div v-if="active === 'accounts'"><PaymentAccounts /></div>
        <section v-if="active === 'ledger'" class="panel">
          <div class="panel-heading"><h2>账本与协作</h2><p>账本资料、成员与邀请统一在账本设置中管理。</p></div>
          <dl><div><dt>当前账本</dt><dd>{{ ledger.currentLedger || '尚未选择' }}</dd></div><div><dt>成员数量</dt><dd>{{ ledger.currentMembers.length }} 人</dd></div></dl>
          <router-link to="/family" class="action">前往账本设置<span class="material-symbols-outlined">arrow_forward</span></router-link>
        </section>
        <section v-if="active === 'security'" class="panel">
          <div class="panel-heading"><h2>登录与安全</h2><p>在公共设备使用完毕后，记得退出账号。</p></div>
          <div class="logout-row"><div><strong>退出当前账号</strong><p>退出后需要重新登录才能访问账本。</p></div><button class="logout" :disabled="loggingOut" @click="logout">{{ loggingOut ? '正在退出…' : '退出登录' }}</button></div>
        </section>
      </main>
    </div>
    <v-dialog v-model="profileOpen" max-width="460" :persistent="savingProfile">
      <v-card rounded="xl">
        <form @submit.prevent="saveProfile">
          <v-card-title class="px-6 pt-5">修改个人资料</v-card-title>
          <v-card-text>
            <p v-if="profileError" role="alert" class="text-red-600 text-sm mb-4">{{ profileError }}</p>
            <div class="profile-avatar-row">
              <img :src="profileAvatar" alt="当前选择的头像" />
              <div><strong>个人头像</strong><button type="button" :disabled="savingProfile" @click="avatarDraft = profileAvatar; avatarPickerOpen = true">更换头像<span class="material-symbols-outlined">chevron_right</span></button></div>
            </div>
            <v-text-field v-model="profileName" label="用户名" maxlength="255" required :disabled="savingProfile" variant="outlined" />
            <v-text-field v-model="profileEmail" label="邮箱" type="email" maxlength="255" required :disabled="savingProfile" variant="outlined" />
            <v-text-field v-if="profileEmail !== auth.user?.email" v-model="currentPassword" label="当前密码" type="password" autocomplete="current-password" hint="修改登录邮箱需要验证当前密码" persistent-hint :disabled="savingProfile" variant="outlined" />
          </v-card-text>
          <v-card-actions class="px-6 pb-5"><v-spacer /><v-btn :disabled="savingProfile" @click="profileOpen = false">取消</v-btn><v-btn type="submit" color="primary" variant="flat" :loading="savingProfile" :disabled="!profileName.trim() || !profileEmail.trim()">保存</v-btn></v-card-actions>
        </form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="avatarPickerOpen" max-width="760">
      <v-card rounded="xl" class="avatar-picker">
        <header class="avatar-picker-heading"><div><h2>挑一个喜欢的头像</h2><p>让你的账本多一点个人风格</p></div><button type="button" aria-label="关闭头像选择" @click="avatarPickerOpen = false"><span class="material-symbols-outlined">close</span></button></header>
        <div class="avatar-picker-grid">
          <button v-for="(avatar, index) in avatars" :key="avatar" type="button" :aria-label="`头像 ${index + 1}`" :aria-pressed="avatarDraft === avatar" class="avatar-choice" :class="{ selected: avatarDraft === avatar }" @click="avatarDraft = avatar">
            <img :src="avatar" alt="" /><span v-if="avatarDraft === avatar" class="avatar-check material-symbols-outlined">check</span>
          </button>
        </div>
        <footer class="avatar-picker-footer"><span>选择后，在个人资料中保存生效</span><v-btn variant="text" @click="avatarPickerOpen = false">取消</v-btn><v-btn color="primary" variant="flat" rounded="lg" @click="profileAvatar = avatarDraft; avatarPickerOpen = false">使用这个头像</v-btn></footer>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useLedgerStore } from '../stores/ledger'
import PaymentAccounts from '../components/PaymentAccounts.vue'
import { updateProfile } from '../api/auth'
const auth = useAuthStore(), ledger = useLedgerStore(), router = useRouter()
const active = ref('profile'), loggingOut = ref(false)
const profileOpen = ref(false), savingProfile = ref(false), profileError = ref('')
const profileName = ref(''), profileEmail = ref(''), currentPassword = ref('')
const profileAvatar = ref('/avatars/user-lin.png')
const avatarPickerOpen = ref(false), avatarDraft = ref('/avatars/user-lin.png')
const avatars = ['user-lin', 'member-chen', '白发老奶奶', '白发老爷爷', '白发眼镜男士', '棒球帽男孩', '短发男孩', '短发女士', '发髻女士_2', '发髻女士', '卷发眼镜男士', '刘海女孩', '双丸子头女孩', '眼镜男士', '运动男孩', '长发女士_2'].map(name => `/avatars/${name}.png`)
function openProfile() {
  profileName.value = auth.displayName; profileEmail.value = auth.user?.email ?? ''
  profileAvatar.value = auth.user?.avatar || '/avatars/user-lin.png'
  currentPassword.value = ''; profileError.value = ''; profileOpen.value = true
}
async function saveProfile() {
  if (savingProfile.value) return
  savingProfile.value = true; profileError.value = ''
  try {
    const user = await updateProfile({ name: profileName.value.trim(), email: profileEmail.value.trim(), avatar: profileAvatar.value, current_password: currentPassword.value || undefined })
    auth.setUser(user)
    const member = ledger.currentMembers.find(m => m.id === user.id)
    if (member) { member.name = user.name; member.avatar = user.avatar || '/avatars/user-lin.png' }
    currentPassword.value = ''; profileOpen.value = false
  } catch (e) { profileError.value = e instanceof Error ? e.message : '保存失败，请重试' }
  finally { savingProfile.value = false }
}
const tabs = [{ id: 'profile', label: '账号信息', icon: 'person' }, { id: 'accounts', label: '支付方式', icon: 'account_balance_wallet' }, { id: 'ledger', label: '账本与协作', icon: 'group' }, { id: 'security', label: '登录与安全', icon: 'shield' }]
async function logout() {
  if (!window.confirm('确定退出当前账号吗？')) return
  loggingOut.value = true
  try { await auth.logout() } finally { loggingOut.value = false; await router.replace('/login') }
}
</script>
<style scoped>
.profile-avatar-row{display:flex;align-items:center;gap:18px;margin:0 0 28px;padding:16px;background:#f5f6f0;border-radius:16px}.profile-avatar-row>img{width:72px;height:72px;object-fit:contain;border-radius:16px;background:#fff}.profile-avatar-row strong{font-size:14px}.profile-avatar-row button{display:flex;align-items:center;margin-top:8px;color:#596b48;font-size:13px;cursor:pointer}.profile-avatar-row button span{font-size:18px}.avatar-picker{padding:28px;background:#fcfcf8!important}.avatar-picker-heading{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px}.avatar-picker-heading h2{font-size:22px;font-weight:700;color:#30382c}.avatar-picker-heading p{font-size:13px;color:#838a7b;margin-top:6px}.avatar-picker-heading button{display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:#eef0e8;cursor:pointer}.avatar-picker-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px;max-height:60vh;overflow-y:auto;padding:4px}.avatar-choice{position:relative;display:flex;align-items:center;justify-content:center;aspect-ratio:1;min-width:0;padding:8px;border:2px solid transparent;border-radius:18px;background:#f0f1e9;cursor:pointer;transition:background .15s,border-color .15s}.avatar-choice:hover{background:#e6ebdc}.avatar-choice.selected{border-color:#63764e;background:#e7eedc}.avatar-choice img{display:block;width:100%;height:100%;min-height:0;object-fit:contain;border-radius:10px}.avatar-check{position:absolute;bottom:3px;right:3px;display:grid;place-items:center;width:22px;height:22px;background:#63764e;color:white;border-radius:50%;font-size:16px}.avatar-picker-footer{display:flex;align-items:center;gap:8px;margin-top:24px;padding-top:18px;border-top:1px solid #e6e9de}.avatar-picker-footer>span{flex:1;font-size:12px;color:#858c7d}.identity .avatar{padding:0;width:56px;height:56px;display:block;overflow:hidden}.identity .avatar img{object-fit:contain!important}@media(max-width:600px){.avatar-picker{padding:20px}.avatar-picker-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.avatar-picker-heading h2{font-size:19px}.avatar-picker-footer{flex-wrap:wrap}.avatar-picker-footer>span{flex-basis:100%;margin-bottom:8px}}
.settings-page{max-width:1120px;margin:0 auto;padding:36px 28px 64px;color:#30342e}.eyebrow{font-size:11px;letter-spacing:2px;color:#79836c;font-weight:700}.page-heading h1{font-size:28px;font-weight:700;margin:8px 0}.page-heading p,.panel-heading p,.section-intro p{color:#7b8076;font-size:14px;line-height:1.7}.settings-grid{display:grid;grid-template-columns:240px minmax(0,1fr);gap:32px;margin-top:32px}.settings-nav{align-self:start}.identity{padding:24px 16px 28px;display:flex;flex-direction:column;align-items:center;gap:8px}.identity>span{font-size:12px;color:#7b8076;word-break:break-all}.avatar{width:56px;height:56px;background:#e7ecd9;color:#566142;border-radius:20px;display:grid;place-items:center;font-size:24px;margin-bottom:6px}.settings-nav button{display:flex;align-items:center;gap:12px;width:100%;padding:14px 16px;margin-bottom:6px;border-radius:12px;font-size:14px;text-align:left;color:#73796c;cursor:pointer}.settings-nav button.active{background:#e9eedf;color:#435333;font-weight:600}.settings-nav button:hover{background:#edf0e7}.settings-nav .material-symbols-outlined{font-size:21px}.arrow{margin-left:auto;opacity:.5}.panel{background:white;border:1px solid #e7e9e1;border-radius:20px;padding:28px}.panel-heading{padding-bottom:24px;border-bottom:1px solid #eff0eb}.panel h2,.section-intro h2{font-size:18px;font-weight:700;margin-bottom:6px}dl>div{display:flex;justify-content:space-between;gap:24px;padding:20px 0;border-bottom:1px solid #f1f2ed;font-size:14px}dt{color:#7b8076}dd{overflow-wrap:anywhere;text-align:right}.status{background:#eef4e6;color:#5a7546;padding:4px 10px;border-radius:20px;font-size:12px}.note{font-size:12px;color:#92978b;margin-top:24px}.section-intro{margin:0 0 20px 4px}.action{display:inline-flex;align-items:center;gap:12px;background:#596b48;color:white;border-radius:10px;padding:11px 16px;margin-top:24px;font-size:13px}.action span{font-size:18px}.logout-row{display:flex;align-items:center;justify-content:space-between;gap:20px;padding-top:24px}.logout-row strong{font-size:14px}.logout-row p{font-size:12px;color:#858a7e;margin-top:8px}.logout{border:1px solid #e7d7d2;color:#a35748;padding:10px 16px;border-radius:10px;white-space:nowrap;cursor:pointer}@media(max-width:700px){.settings-page{padding:24px 16px}.settings-grid{grid-template-columns:1fr;gap:20px;margin-top:20px}.identity{display:none}.settings-nav{display:flex;flex-wrap:wrap;gap:6px}.settings-nav button{width:auto;font-size:12px;padding:10px}.arrow{display:none}.panel{padding:20px}.logout-row{align-items:flex-start;flex-direction:column}}
</style>

