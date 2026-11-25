<template>
  <section class="bg-white rounded-2xl border border-outline-variant/30 p-6">
    <div class="flex items-center justify-between gap-3">
      <h2 class="font-bold text-lg">支付方式管理</h2>
      <v-btn color="primary" variant="flat" rounded="lg" prepend-icon="mdi-plus" :disabled="busy || !loaded" @click="openAdd">添加支付方式</v-btn>
    </div>
    <p v-if="error && !formOpen" role="alert" class="text-red-600 text-sm mt-3">{{ error }}</p>
    <button v-if="!loaded && !loading" type="button" class="text-primary" @click="load">重新加载</button>
    <p v-if="loading" class="text-sm mt-3">正在加载…</p>
    <ul class="mt-4 space-y-2">
      <li v-for="account in accounts" :key="account.id" class="flex items-center justify-between gap-3 border-b py-2">
        <span>{{ account.name }}</span>
        <div><button type="button" class="text-primary px-2" :disabled="busy" @click="edit(account)">修改</button><button type="button" class="text-red-600 px-2" :disabled="busy" @click="remove(account)">删除</button></div>
      </li>
    </ul>
    <p v-if="loaded && !accounts.length" class="text-sm text-on-surface-variant py-8 text-center">暂无支付方式，点击右上角添加。</p>
    <v-dialog v-model="formOpen" max-width="440" :persistent="busy">
      <v-card rounded="xl">
        <form @submit.prevent="save">
          <v-card-title class="px-6 pt-5">{{ editingId ? '修改支付方式' : '添加支付方式' }}</v-card-title>
          <v-card-text>
            <p v-if="error" role="alert" class="text-red-600 text-sm mb-4">{{ error }}</p>
            <v-text-field v-model="name" label="名称" placeholder="例如：招商银行储蓄卡" maxlength="100" required :disabled="busy" variant="outlined" autofocus />
            <v-select v-model="type" label="类型" :items="options" item-title="name" item-value="type" :disabled="busy" variant="outlined" />
          </v-card-text>
          <v-card-actions class="px-6 pb-5">
            <v-spacer />
            <v-btn :disabled="busy" @click="formOpen = false">取消</v-btn>
            <v-btn type="submit" color="primary" variant="flat" :loading="busy" :disabled="!name.trim()">保存</v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
  </section>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { accountApi } from '../api/account'
import { ApiError } from '../api/client'
import type { Account } from '../interfaces'
const accounts = ref<Account[]>([]), loaded = ref(false), loading = ref(false), busy = ref(false), error = ref('')
const name = ref(''), type = ref('cash'), editingId = ref<number | null>(null)
const formOpen = ref(false)
const options = [{ name: '现金', type: 'cash' }, { name: '微信支付', type: 'wechat' }, { name: '支付宝', type: 'alipay' }, { name: '银行卡', type: 'debit_card' }, { name: '信用卡', type: 'credit_card' }, { name: '医保账户', type: 'medical' }, { name: '其他', type: 'other' }]
function reset() { name.value = ''; type.value = 'cash'; editingId.value = null }
function openAdd() { reset(); error.value = ''; formOpen.value = true }
function edit(a: Account) { editingId.value = a.id; name.value = a.name; type.value = options.some(o => o.type === a.type) ? a.type : 'other'; error.value = ''; formOpen.value = true }
async function load() {
  loading.value = true; error.value = ''
  try { accounts.value = await accountApi.list(); loaded.value = true }
  catch(e) { loaded.value = false; error.value = e instanceof Error ? e.message : '加载失败' }
  finally { loading.value = false }
}
async function save() {
  if (busy.value || !name.value.trim()) return
  busy.value = true; error.value = ''
  try {
    const data = { name: name.value.trim(), type: type.value }
    if (editingId.value) { const a = await accountApi.update(editingId.value, data); accounts.value = accounts.value.map(item => item.id === a.id ? a : item) }
    else accounts.value.push(await accountApi.create(data))
    reset(); formOpen.value = false; window.dispatchEvent(new Event('payment-accounts-updated'))
  } catch(e) { error.value = e instanceof Error ? e.message : '保存失败' }
  finally { busy.value = false }
}
async function remove(a: Account) {
  if (busy.value || !window.confirm(`确定删除「${a.name}」吗？`)) return
  busy.value = true; error.value = ''
  try {
    try { await accountApi.remove(a.id, false) }
    catch(e) {
      if (!(e instanceof ApiError) || e.status !== 422) throw e
      if (!window.confirm(`${e.message}\n确认删除后，历史流水的支付方式将丢失。`)) return
      await accountApi.remove(a.id, true)
    }
    accounts.value = accounts.value.filter(item => item.id !== a.id)
    if (editingId.value === a.id) reset()
    window.dispatchEvent(new Event('payment-accounts-updated'))
  } catch(e) { error.value = e instanceof Error ? e.message : '删除失败' }
  finally { busy.value = false }
}
onMounted(load)
</script>
