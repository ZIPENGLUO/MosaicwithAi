<template>
  <div class="relative">
    <button type="button" aria-label="通知" class="relative w-8 h-8 rounded-full bg-white border border-outline-variant/30" @click="toggle">
      <span class="material-symbols-outlined text-base">notifications</span>
      <span v-if="items.length" class="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
    </button>
    <section v-if="open" class="absolute right-0 top-11 w-80 max-h-96 overflow-y-auto bg-white border border-outline-variant/30 rounded-xl shadow-lg p-4 z-50">
      <div class="flex justify-between mb-3"><strong>待处理通知</strong><button type="button" aria-label="关闭通知" @click="open = false">关闭</button></div>
      <p v-if="error" role="alert" class="text-red-600 text-xs mb-2">{{ error }}</p>
      <p v-if="!items.length && !error" class="text-xs text-on-surface-variant">暂无待处理通知</p>
      <div v-for="item in items" :key="item.id" class="py-3 border-t border-outline-variant/30 text-sm">
        <p>{{ item.data.title || item.data.message || '新通知' }}</p>
        <div class="flex gap-3 mt-2">
          <template v-if="item.invitation_id">
            <button :disabled="busy !== null" class="text-primary" @click="respond(item, 'accept')">接受</button>
            <button :disabled="busy !== null" @click="respond(item, 'reject')">拒绝</button>
          </template>
          <button v-else :disabled="busy !== null" @click="respond(item)">知道了</button>
        </div>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { notificationApi, type Notice } from '../api/notification'
import { useLedgerStore } from '../stores/ledger'
const store = useLedgerStore()
const items = ref<Notice[]>([])
const open = ref(false)
const busy = ref<number | null>(null)
const error = ref('')
let timer: ReturnType<typeof setInterval>
async function load() {
  try { items.value = await notificationApi.list(); error.value = '' }
  catch (e) { error.value = e instanceof Error ? e.message : '通知加载失败' }
}
function toggle() { open.value = !open.value; if (open.value) void load() }
async function respond(item: Notice, action?: 'accept' | 'reject') {
  if (busy.value !== null) return
  busy.value = item.id
  try {
    if (item.invitation_id && action) await notificationApi.respond(item.invitation_id, action)
    else await notificationApi.handle(item.id)
    await load()
    if (action === 'accept') await store.loadLedgers()
  } catch (e) { error.value = e instanceof Error ? e.message : '处理失败' }
  finally { busy.value = null }
}
onMounted(() => { void load(); timer = setInterval(() => { void load() }, 30000) })
onUnmounted(() => clearInterval(timer))
</script>
