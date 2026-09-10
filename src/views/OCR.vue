<template>
  <div class="w-full max-w-[1520px] mx-auto p-4 md:p-6 flex flex-col gap-4">
    <!-- Top Batch Stats & Insight Indicator Bar -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <!-- 本月智能入账 -->
      <div class="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40 shadow-sm flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-lg">receipt_long</span>
          </div>
          <div class="flex flex-col">
            <span class="text-[11px] text-on-surface-variant font-label-sm">本月智能入账</span>
            <span class="text-base font-bold font-amount-table text-on-surface leading-tight">
              42 <span class="text-xs font-normal text-on-surface-variant">笔</span>
            </span>
          </div>
        </div>
        <div class="text-right flex flex-col items-end">
          <span class="text-[10px] text-secondary font-mono flex items-center gap-0.5 font-bold">
            <span class="material-symbols-outlined text-[10px]">trending_up</span>+18%
          </span>
          <span class="text-[10px] text-on-surface-variant">环比增长</span>
        </div>
      </div>

      <!-- OCR 自动校验率 -->
      <div class="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40 shadow-sm flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-md bg-secondary-container/50 text-secondary flex items-center justify-center">
            <span class="material-symbols-outlined text-lg">verified</span>
          </div>
          <div class="flex flex-col">
            <span class="text-[11px] text-on-surface-variant font-label-sm">OCR 自动校验率</span>
            <span class="text-base font-bold font-amount-table text-secondary leading-tight">99.4%</span>
          </div>
        </div>
        <div class="text-right flex flex-col items-end">
          <span class="text-[10px] text-secondary font-mono font-semibold">Vision-LLM 4.0</span>
          <span class="text-[10px] text-on-surface-variant">免手动纠偏</span>
        </div>
      </div>

      <!-- 公用开支占比 -->
      <div class="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40 shadow-sm flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-md bg-primary-container/15 text-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-lg">diversity_3</span>
          </div>
          <div class="flex flex-col">
            <span class="text-[11px] text-on-surface-variant font-label-sm">公用开支占比</span>
            <span class="text-base font-bold font-amount-table text-on-surface leading-tight">68%</span>
          </div>
        </div>
        <div class="w-16 flex flex-col gap-1 items-end">
          <div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div class="bg-primary-container h-full rounded-full w-[68%]"></div>
          </div>
          <span class="text-[10px] text-on-surface-variant">公用结余充裕</span>
        </div>
      </div>

      <!-- 待复核票据 -->
      <div class="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40 shadow-sm flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-md bg-tertiary-fixed text-tertiary flex items-center justify-center">
            <span class="material-symbols-outlined text-lg">pending_actions</span>
          </div>
          <div class="flex flex-col">
            <span class="text-[11px] text-on-surface-variant font-label-sm">待复核票据</span>
            <span class="text-base font-bold font-amount-table text-tertiary leading-tight">
              {{ tickets.length }} <span class="text-xs font-normal text-on-surface-variant">笔 (连拍中)</span>
            </span>
          </div>
        </div>
        <button
          type="button"
          class="px-2 py-1 rounded-md bg-surface-container-low hover:bg-surface-container-high text-[11px] text-on-surface font-medium border border-outline-variant/30 transition-colors cursor-pointer"
          @click="batchVerify"
        >
          批量核验
        </button>
      </div>
    </div>

    <!-- 隐藏文件上传 input (由点击卡片或按钮触发) -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*,.pdf"
      class="hidden"
      style="display: none;"
      @change="handleFileInputChange"
    />

    <!-- Dual-pane content grid (拉长高度，视野更开阔) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch flex-1">
      <!-- Left Widescreen Optical Inspection Workspace (5 cols) -->
      <div class="lg:col-span-5 flex flex-col bg-surface-container-lowest rounded-lg p-4 border border-outline-variant/40 shadow-sm justify-between gap-3.5 min-h-[620px]">
        <div class="flex items-center justify-between pb-2 border-b border-outline-variant/20 px-1">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-primary text-sm">center_focus_strong</span>
            <span class="font-label-md text-xs text-on-surface font-semibold">票据透视与光学检测 (真实渲染采样)</span>
          </div>
          <div class="flex items-center gap-1 text-[11px]">
            <span class="text-on-surface-variant font-mono text-[10px]">CONF: 99.8%</span>
          </div>
        </div>

        <!-- High-Fidelity Ticket Viewport / Upload Zone (单层高质感虚线卡片，全区域支持点击与拖拽) -->
        <div
          class="relative w-full h-[410px] rounded-lg overflow-hidden flex flex-col items-center justify-center p-6 border-2 border-dashed transition-all select-none cursor-pointer group"
          :class="isDragging ? 'border-primary bg-primary/10 shadow-inner' : 'border-outline-variant/60 bg-surface-container-high/20 hover:border-primary/80 hover:bg-surface-container-high/40'"
          @click="triggerUpload"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <!-- Scanning Status Floating Overlay (上传解析时浮层显示) -->
          <div
            v-if="isScanning"
            class="absolute top-2 left-2 right-2 z-30 flex items-center justify-between p-2.5 rounded-md bg-surface-container-lowest/95 backdrop-blur-md shadow-sm border border-outline-variant/40 animate-pulse"
          >
            <div class="flex items-center gap-2">
              <div class="relative flex items-center justify-center w-3 h-3">
                <span class="radar-dot absolute w-3 h-3 rounded-full bg-primary-container/40"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(217,119,87,0.9)]"></span>
              </div>
              <div class="flex items-center gap-1">
                <span class="font-label-md text-xs font-semibold text-on-surface">Vision-LLM 4.0 正在多模态智能解析...</span>
                <span class="text-[10px] text-primary font-mono font-medium">(提取要素中)</span>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <span class="material-symbols-outlined text-xs text-primary animate-spin">progress_activity</span>
            </div>
          </div>

          <!-- Upload Content Body -->
          <div class="flex flex-col items-center justify-center text-center max-w-md pointer-events-none">
            <div class="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3.5 shadow-xs group-hover:scale-110 group-hover:bg-primary/15 transition-all">
              <span class="material-symbols-outlined text-3xl">upload_file</span>
            </div>
            <h3 class="text-base font-semibold text-on-surface mb-1.5 group-hover:text-primary transition-colors">
              拖拽票据至此，或点击本地上传
            </h3>
            <p class="text-xs text-on-surface-variant leading-relaxed">
              支持发票、机打小票、收据照片及电子 PDF (最大 20MB)
            </p>
          </div>
        </div>

        <!-- Multi-ticket batch processing carousel & thumbnail queue (精炼适中圆角) -->
        <div class="flex flex-col gap-2 p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-on-surface flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm text-primary">collections</span>
              连拍待处理队列 ({{ tickets.length }}张)
            </span>
            <div class="flex items-center gap-1.5">
              <button
                type="button"
                class="text-xs text-primary hover:underline flex items-center gap-0.5 cursor-pointer font-medium"
                @click="toggleCorrectionMode"
              >
                <span class="material-symbols-outlined text-xs">tune</span>
                <span>{{ isCorrectionMode ? '退出纠偏' : '纠偏模式' }}</span>
              </button>
              <span class="text-outline-variant">|</span>
              <button
                type="button"
                class="text-xs text-on-surface-variant hover:text-on-surface cursor-pointer"
                @click="resetBatch"
              >
                重置批次
              </button>
            </div>
          </div>

          <div class="grid grid-cols-4 gap-2">
            <div
              v-for="(t, idx) in tickets"
              :key="t.id"
              class="relative p-1.5 rounded-md bg-surface-container-lowest flex flex-col gap-1 cursor-pointer transition-all h-[94px] justify-between"
              :class="currentTicketIndex === idx
                ? 'border-2 border-primary-container shadow-sm'
                : 'border border-outline-variant/40 hover:border-primary'"
              @click="selectTicket(idx)"
            >
              <div
                class="h-14 rounded flex items-center justify-center text-on-surface-variant overflow-hidden relative"
                :class="currentTicketIndex === idx ? 'bg-primary-fixed/25 text-primary' : 'bg-neutral-100'"
              >
                <span class="material-symbols-outlined text-2xl">{{ t.icon }}</span>
                <span
                  class="absolute bottom-0 right-0 text-white text-[9px] px-1.5 py-0.2 rounded-tl font-mono font-bold"
                  :class="currentTicketIndex === idx ? 'bg-primary' : 'bg-secondary'"
                >
                  {{ currentTicketIndex === idx ? '当前' : '已验' }}
                </span>
              </div>
              <span
                class="text-[11px] truncate text-center leading-tight pb-0.5"
                :class="currentTicketIndex === idx ? 'font-bold text-primary' : 'font-medium text-on-surface'"
              >
                {{ idx + 1 }}. {{ t.shortName }}
              </span>
            </div>

            <!-- 继续拍入口 (精练圆角 rounded-md) -->
            <div
              class="relative p-1.5 rounded-md bg-surface-container-lowest/70 border-2 border-dashed border-outline-variant/60 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-surface-container-low hover:border-primary transition-all h-[94px]"
              @click="triggerUpload"
            >
              <span class="material-symbols-outlined text-2xl text-primary">add_a_photo</span>
              <span class="text-[11px] font-medium text-on-surface-variant">继续拍</span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between text-on-surface-variant px-1 text-xs">
          <span class="text-[11px]">源文件: {{ activeTicket.fileName }}</span>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="text-[11px] text-on-surface-variant hover:text-on-surface flex items-center gap-0.5 cursor-pointer"
              @click="toggleFilter"
            >
              <span class="material-symbols-outlined text-xs">tune</span>滤镜增强
            </button>
            <button
              type="button"
              class="text-[11px] text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
              @click="downloadOriginal"
            >
              <span class="material-symbols-outlined text-xs">download</span>下载原图
            </button>
          </div>
        </div>
      </div>

      <!-- Right Widescreen Structured Data Validation Form (7 cols) (拉长增高，空间充裕) -->
      <div class="lg:col-span-7 flex flex-col bg-surface-container-lowest rounded-lg p-4 border border-outline-variant/40 shadow-sm justify-between gap-3.5 min-h-[620px]">
        <!-- Top AI Status Bar -->
        <div class="flex items-center justify-between bg-secondary-container/30 px-3.5 py-2.5 rounded-md">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-secondary"></div>
            <div class="flex flex-col">
              <span class="font-label-md text-xs font-semibold text-on-surface">AI 多模态智能识别成功 (高精度自动校验)</span>
              <span class="text-[11px] text-on-surface-variant">
                字段要素已全量映射，提取 {{ activeTicket.items.length }} 项商品明细，置信度 99.8%。已准备入账到当前账本。
              </span>
            </div>
          </div>
          <span class="bg-secondary-fixed text-on-secondary-fixed-variant px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap">
            自动核验率 100%
          </span>
        </div>

        <!-- Vuetify Structured Data Validation Form -->
        <v-form class="w-full my-2">
          <div class="ocr-form-grid">
            <!-- 消费商户 / 交易对象 -->
            <v-text-field
              v-model="activeTicket.merchant"
              label="消费商户 / 交易对象 *"
              variant="outlined"
              color="primary"
              hide-details
              class="ocr-v-field"
            >
              <template #prepend-inner>
                <span class="material-symbols-outlined text-xl text-on-surface-variant">store</span>
              </template>
            </v-text-field>

            <!-- 交易实付总金额 -->
            <v-text-field
              v-model="activeTicket.total"
              label="交易实付总金额 *"
              prefix="¥"
              suffix="CNY"
              variant="outlined"
              color="primary"
              hide-details
              class="ocr-v-field font-amount-display"
            />

            <!-- 交易时间 -->
            <v-text-field
              v-model="activeTicket.dateTime"
              label="交易时间 *"
              variant="outlined"
              color="primary"
              hide-details
              class="ocr-v-field"
            >
              <template #prepend-inner>
                <span class="material-symbols-outlined text-xl text-on-surface-variant">schedule</span>
              </template>
            </v-text-field>

            <!-- 支出分类 -->
            <v-select
              v-model="activeTicket.category"
              :items="categoryOptions"
              label="支出分类 *"
              variant="outlined"
              color="primary"
              hide-details
              class="ocr-v-field"
              @update:model-value="onCategoryChange"
            >
              <template #prepend-inner>
                <span class="material-symbols-outlined text-xl text-secondary">{{ activeTicket.categoryIcon }}</span>
              </template>
            </v-select>

            <!-- 支付账户 / 结算方式 -->
            <v-select
              v-model="activeTicket.account"
              :items="accountOptions"
              label="支付账户 / 结算方式 *"
              variant="outlined"
              color="primary"
              hide-details
              class="ocr-v-field"
            >
              <template #prepend-inner>
                <span class="material-symbols-outlined text-xl text-on-surface-variant">credit_card</span>
              </template>
            </v-select>

            <!-- 账目备注 -->
            <v-text-field
              v-model="activeTicket.remark"
              label="账目备注 (选填)"
              placeholder="例如：采购生鲜、周末采买"
              variant="outlined"
              color="primary"
              hide-details
              class="ocr-v-field"
            >
              <template #prepend-inner>
                <span class="material-symbols-outlined text-xl text-on-surface-variant">edit_note</span>
              </template>
            </v-text-field>
          </div>
        </v-form>

        <!-- Family Member Allocation (Single Line) -->
        <div class="flex items-center gap-3 min-h-[56px] py-1">
          <div class="flex items-center gap-2.5">
            <!-- 林知栖 (本人) -->
            <button
              type="button"
              class="member-chip flex items-center justify-center gap-2 min-h-[50px] px-4 py-3 rounded-md transition-all text-sm border cursor-pointer font-medium"
              :class="activeTicket.member === '林知栖 (本人)'
                ? 'bg-primary-container text-on-primary font-semibold shadow-sm border-primary/40'
                : 'bg-surface-container-high text-on-surface border-transparent hover:bg-surface-container-highest'"
              @click="activeTicket.member = '林知栖 (本人)'"
            >
              <img alt="林知栖" class="w-6 h-6 rounded-full object-cover" src="/avatars/user-lin.png" />
              <span>林知栖 (本人)</span>
            </button>

            <!-- 公用主账户 -->
            <button
              type="button"
              class="member-chip flex items-center justify-center gap-2 min-h-[50px] px-4 py-3 rounded-md transition-all text-sm border cursor-pointer font-medium"
              :class="activeTicket.member === '公用主账户'
                ? 'bg-primary-container text-on-primary font-semibold shadow-sm border-primary/40'
                : 'bg-surface-container-high text-on-surface border-transparent hover:bg-surface-container-highest'"
              @click="activeTicket.member = '公用主账户'"
            >
              <span class="w-6 h-6 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shadow-xs">
                <span class="material-symbols-outlined text-sm">home</span>
              </span>
              <span>公用主账户</span>
            </button>
          </div>
        </div>

        <!-- Expanded OCR Items Breakdown Table List (拉高至 max-h-[200px]) -->
        <div class="flex flex-col rounded-md bg-surface-container-low p-2.5 gap-1.5 border border-outline-variant/20">
          <div class="flex items-center justify-between px-0.5">
            <div class="flex items-center gap-1 text-xs">
              <span class="material-symbols-outlined text-secondary text-sm">format_list_bulleted</span>
              <span class="font-semibold text-on-surface">
                OCR 识别商品逐项明细 ({{ activeTicket.items.length }}项已自动核准)
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] text-on-surface-variant font-mono">{{ activeTicket.items.length }} items</span>
              <button
                type="button"
                class="text-[10px] text-primary hover:underline flex items-center gap-0.5 cursor-pointer font-medium"
                @click="addItem"
              >
                <span class="material-symbols-outlined text-xs">add</span>新增单项
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto pr-1">
            <div
              v-for="(item, itemIndex) in activeTicket.items"
              :key="itemIndex"
              class="flex items-center justify-between px-2.5 py-1.5 rounded bg-surface-container-lowest text-xs border border-outline-variant/20 hover:border-primary-container/60 transition-colors"
            >
              <div class="flex items-center gap-1.5 min-w-0">
                <span class="w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></span>
                <input
                  v-if="item.editing"
                  v-model="item.name"
                  class="text-xs bg-surface-container-low px-1 rounded border border-outline-variant/40"
                  @blur="item.editing = false"
                />
                <span v-else class="font-medium text-on-surface truncate">{{ item.name }}</span>
              </div>

              <div class="flex items-center gap-3 shrink-0">
                <span class="text-on-surface-variant font-mono text-[11px]">x{{ item.count }}</span>
                <span class="font-amount-table font-semibold text-on-surface">¥{{ Number(item.price).toFixed(2) }}</span>
                <button
                  type="button"
                  class="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  title="编辑"
                  @click="item.editing = !item.editing"
                >
                  <span class="material-symbols-outlined text-xs">edit</span>
                </button>
                <button
                  type="button"
                  class="text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                  title="删除"
                  @click="removeItem(itemIndex)"
                >
                  <span class="material-symbols-outlined text-xs">delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Budget Impact & Compliance Banner -->
        <div class="flex items-center justify-between px-3 py-2 rounded-md bg-surface-container-low border border-secondary-container">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-md bg-secondary-container/60 text-secondary flex items-center justify-center">
              <span class="material-symbols-outlined text-sm">account_balance_wallet</span>
            </div>
            <div class="flex flex-col">
              <span class="text-[11px] font-semibold text-on-surface">此笔生鲜采购已自动关联「居家生活 · 本月生鲜预算」</span>
              <span class="text-[10px] text-on-surface-variant">入账后本月该分类已支出 ¥1,350 / 剩余充裕 ¥1,850 (未超支)</span>
            </div>
          </div>
          <div class="flex items-center gap-1 text-[11px] font-mono text-secondary font-semibold">
            <span class="material-symbols-outlined text-xs">task_alt</span>健康预算
          </div>
        </div>

        <!-- Bottom Actions Toolbar in 16:9 -->
        <div class="flex items-center justify-between pt-1 border-t border-outline-variant/20">
          <div class="flex items-center gap-1">
            <button
              class="flex items-center gap-1 px-3 py-1.5 rounded-md bg-surface-container-low hover:bg-surface-container-high text-on-surface text-xs transition-colors cursor-pointer"
              type="button"
              @click="reScan"
            >
              <span class="material-symbols-outlined text-xs">replay</span>
              <span>重新识别</span>
            </button>
            <button
              class="flex items-center gap-1 px-3 py-1.5 rounded-md bg-surface-container-low hover:bg-surface-container-high text-on-surface text-xs transition-colors cursor-pointer"
              type="button"
              @click="saveDraft"
            >
              <span class="material-symbols-outlined text-xs">bookmark</span>
              <span>暂存草稿</span>
            </button>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="px-2.5 py-1.5 text-on-surface-variant hover:text-error text-xs transition-colors cursor-pointer"
              type="button"
              @click="discardTicket"
            >
              放弃此单
            </button>
            <button
              class="relative overflow-hidden group flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-md bg-primary-container hover:bg-primary text-on-primary text-xs font-semibold transition-all shadow-sm cursor-pointer"
              type="button"
              @click="confirmAndRecord"
            >
              <span class="material-symbols-outlined text-sm">check_circle</span>
              <span>确认无误，入账到当前账本</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification (Floating bottom-right) -->
    <div
      class="fixed bottom-6 right-6 z-50 transition-all duration-300 flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-lg shadow-xl border border-outline/20"
      :class="toastVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-24 opacity-0 pointer-events-none'"
    >
      <div class="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-on-secondary shrink-0">
        <span class="material-symbols-outlined text-sm">check</span>
      </div>
      <div class="flex flex-col">
        <span class="font-label-md text-xs font-semibold text-inverse-on-surface">{{ toastTitle }}</span>
        <span class="font-body-sm text-[11px] text-surface-dim">{{ toastMessage }}</span>
      </div>
      <button
        class="ml-2 text-surface-dim hover:text-inverse-on-surface cursor-pointer"
        type="button"
        @click="toastVisible = false"
      >
        <span class="material-symbols-outlined text-xs">close</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface TicketItem {
  name: string
  count: number
  price: number
  editing?: boolean
}

interface Ticket {
  id: string
  shortName: string
  merchant: string
  merchantTag: string
  merchantConfidence?: string
  dateTime: string
  ticketNo?: string
  total: string
  category: string
  categoryIcon: string
  account: string
  remark: string
  member: string
  fileName: string
  icon: string
  items: TicketItem[]
}

const fileInputRef = ref<HTMLInputElement | null>(null)
const uploadedFiles = ref<File[] | File | undefined>()
const isScanning = ref(false)
const isDragging = ref(false)
const isCorrectionMode = ref(false)
const toastVisible = ref(false)
const toastTitle = ref('入账成功！')
const toastMessage = ref('已同步更新当前预算，并扣除相应额度')

const processUploadedFile = (file: File) => {
  if (!file) return
  uploadedFiles.value = [file]
  isScanning.value = true
  showToast('正在解析票据', `已接收文件「${file.name || '票据'}」，AI 视觉多模态引擎开始解析要素...`)

  setTimeout(() => {
    isScanning.value = false
    const newTicket: Ticket = {
      id: `t-${Date.now()}`,
      shortName: file.name ? file.name.slice(0, 4) : '新票据',
      merchant: '山姆会员商店 (前海旗舰店)',
      merchantTag: '连锁会员制商超',
      merchantConfidence: '99.9%',
      dateTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      ticketNo: `SAM-${Math.floor(100000 + Math.random() * 900000)}`,
      total: '428.50',
      category: '居家生活 > 生鲜食品',
      categoryIcon: 'shopping_basket',
      account: '微信支付 (招商银行信用卡 · 5542)',
      remark: '周末生活物资大采购 (AI识别自动导入)',
      member: '公用主账户',
      fileName: file.name ? `${file.name} (${((file.size || 2048000) / (1024 * 1024)).toFixed(1)} MB)` : 'RECEIPT_SCAN.JPG (2.1 MB)',
      icon: 'receipt_long',
      items: [
        { name: '澳洲进口谷饲牛小排 1kg', count: 1, price: 178.00 },
        { name: 'Member\'s Mark 鲜牛奶 2L*2', count: 1, price: 42.90 },
        { name: '瑞士卷 16片装', count: 1, price: 68.00 },
        { name: '三文鱼刺身拼盘 400g', count: 1, price: 139.60 },
      ]
    }
    tickets.value.push(newTicket)
    currentTicketIndex.value = tickets.value.length - 1
    showToast('解析完成！', `已成功提取 4 项商品明细，置信度 99.9%，并自动入账`)
  }, 1200)
}

const handleFileInputChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    processUploadedFile(file)
  }
  input.value = ''
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) {
    processUploadedFile(file)
  }
}

const onFileUploadChange = (files: any) => {
  if (!files) return
  const file = Array.isArray(files) ? files[0] : files
  if (file) {
    processUploadedFile(file)
  }
}

const tickets = ref<Ticket[]>([
  {
    id: 't-1',
    shortName: '永辉生鲜',
    merchant: '永辉超市 (中环绿地店)',
    merchantTag: '连锁综合生鲜',
    merchantConfidence: '99.5%',
    dateTime: '2024-10-27 14:15',
    ticketNo: '772183',
    total: '156.40',
    category: '居家生活 > 生鲜食品',
    categoryIcon: 'shopping_basket',
    account: '支付宝 (常用账户)',
    remark: '周末蔬菜鸡蛋日杂补货',
    member: '林知栖 (本人)',
    fileName: 'IMG_20241027_141600.JPG (2.8 MB)',
    icon: 'receipt',
    items: [
      { name: '崇明生态草鸡蛋 30枚装', count: 1, price: 39.90 },
      { name: '智利进口车厘子 JJ 1kg', count: 1, price: 88.00 },
      { name: '精品五花肉 500g', count: 1, price: 28.50 },
    ]
  },
  {
    id: 't-2',
    shortName: '滴滴出行',
    merchant: '滴滴出行 · 商务特惠快车',
    merchantTag: '网约车专车出行',
    merchantConfidence: '99.9%',
    dateTime: '2024-10-28 08:30',
    ticketNo: 'DD-881920',
    total: '32.80',
    category: '交通出行 > 网约出租',
    categoryIcon: 'directions_car',
    account: '招商银行借记卡 (林知栖 · 8891)',
    remark: '送孩子课外英语早班接送',
    member: '林知栖 (本人)',
    fileName: 'E_INVOICE_DD_20241028.PDF (410 KB)',
    icon: 'local_taxi',
    items: [
      { name: '行程费 (从知栖雅苑至国际少儿培训中心)', count: 1, price: 32.80 },
    ]
  },
  {
    id: 't-3',
    shortName: '盒马鲜生',
    merchant: '盒马鲜生 (世纪汇店)',
    merchantTag: '连锁生鲜超市',
    merchantConfidence: '99.8%',
    dateTime: '2024-10-28 18:42',
    ticketNo: '994012',
    total: '328.60',
    category: '居家生活 > 生鲜食品',
    categoryIcon: 'shopping_basket',
    account: '微信支付 (招商银行信用卡 · 5542)',
    remark: '周末亲友共进晚餐生鲜采买',
    member: '公用主账户',
    fileName: 'IMG_20241028_184302.JPG (3.4 MB)',
    icon: 'storefront',
    items: [
      { name: '澳洲冰鲜眼肉牛排 250g', count: 1, price: 89.00 },
      { name: '日日鲜全脂巴氏杀菌乳 2L', count: 1, price: 26.80 },
      { name: '泰国无核金枕头榴莲肉 400g', count: 1, price: 128.00 },
      { name: '有机水果番茄礼盒 1.5kg', count: 1, price: 45.90 },
      { name: '法式海盐黄油可颂 (4只装)', count: 1, price: 38.90 },
    ]
  }
])

const categoryOptions = [
  '居家生活 > 生鲜食品',
  '餐饮美食 > 外卖正餐',
  '居家日用 > 个人洗护',
  '交通出行 > 网约出租',
  '休闲娱乐 > 电影聚会',
]

const accountOptions = [
  '微信支付 (招商银行信用卡 · 5542)',
  '支付宝 (常用账户)',
  '招商银行借记卡 (林知栖 · 8891)',
  '中国银行储蓄卡 (陈先生 · 3021)',
]

const onCategoryChange = (val: string) => {
  if (val.includes('生鲜食品')) activeTicket.value.categoryIcon = 'shopping_basket'
  else if (val.includes('餐饮美食')) activeTicket.value.categoryIcon = 'restaurant'
  else if (val.includes('个人洗护')) activeTicket.value.categoryIcon = 'local_laundry_service'
  else if (val.includes('网约出租')) activeTicket.value.categoryIcon = 'directions_car'
  else if (val.includes('电影聚会')) activeTicket.value.categoryIcon = 'movie'
}

const currentTicketIndex = ref(2) // 默认选中第3张：盒马鲜生
const activeTicket = computed(() => tickets.value[currentTicketIndex.value] || tickets.value[0])

const computedTotalAmount = computed(() => {
  const sum = activeTicket.value.items.reduce((acc, it) => acc + (Number(it.price) || 0) * (it.count || 1), 0)
  return sum.toFixed(2)
})

const selectTicket = (index: number) => {
  currentTicketIndex.value = index
}

const prevTicket = () => {
  if (currentTicketIndex.value > 0) {
    currentTicketIndex.value--
  }
}

const nextTicket = () => {
  if (currentTicketIndex.value < tickets.value.length - 1) {
    currentTicketIndex.value++
  }
}

const triggerUpload = () => {
  fileInputRef.value?.click()
}

const handleFileUpload = (e: Event) => {
  handleFileInputChange(e)
}

const reScan = () => {
  isScanning.value = true
  setTimeout(() => {
    isScanning.value = false
    showToast('重新解析完成', `已基于 Vision-LLM 4.0 重新校验「${activeTicket.value.merchant}」全部要素`)
  }, 2200)
}

const batchVerify = () => {
  showToast('批量核验启动', `正在全量并行核验 ${tickets.value.length} 笔票据，准确率 99.6%`)
}

const toggleCorrectionMode = () => {
  isCorrectionMode.value = !isCorrectionMode.value
  showToast(
    isCorrectionMode.value ? '已开启纠偏模式' : '已退出纠偏模式',
    isCorrectionMode.value ? '可自由拖拽调整票据 OCR 锚定框' : '所有锚定框已固化保存'
  )
}

const resetBatch = () => {
  showToast('已重置批次', '恢复为初始待处理连拍队列')
}

const toggleFilter = () => {
  showToast('滤镜增强已应用', '已提升票据对比度并自动去除阴影折痕')
}

const downloadOriginal = () => {
  showToast('正在导出原图', `源文件 ${activeTicket.value.fileName} 正在打包下载`)
}

const addItem = () => {
  activeTicket.value.items.push({
    name: '新增消费品类',
    count: 1,
    price: 10.00,
    editing: true
  })
}

const removeItem = (idx: number) => {
  if (activeTicket.value.items.length <= 1) {
    showToast('无法删除', '票据需至少保留 1 项商品明细')
    return
  }
  activeTicket.value.items.splice(idx, 1)
}

const saveDraft = () => {
  showToast('已暂存草稿', `票据「${activeTicket.value.merchant}」已妥善保存在待处理草稿箱`)
}

const discardTicket = () => {
  if (tickets.value.length <= 1) {
    showToast('无法删除', '队列中仅剩此唯一票据')
    return
  }
  const name = activeTicket.value.merchant
  tickets.value.splice(currentTicketIndex.value, 1)
  if (currentTicketIndex.value >= tickets.value.length) {
    currentTicketIndex.value = tickets.value.length - 1
  }
  showToast('已放弃此单', `票据「${name}」已从批次中移除`)
}

const confirmAndRecord = () => {
  activeTicket.value.total = computedTotalAmount.value
  showToast(
    '入账成功！',
    `已成功录入「${activeTicket.value.merchant}」¥${activeTicket.value.total}，并同步更新账本与对应预算！`
  )
}

let toastTimer: any = null
const showToast = (title: string, msg: string) => {
  toastTitle.value = title
  toastMessage.value = msg
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastVisible.value = false
  }, 4000)
}
</script>

<style scoped>
/* Grid container for form fields */
.ocr-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 16px;
  row-gap: 16px;
  width: 100%;
}

@media (max-width: 768px) {
  .ocr-form-grid {
    grid-template-columns: 1fr;
    row-gap: 14px;
  }
}

/* Vuetify Form Fields Customization */
.ocr-v-field {
  margin: 0;
}

.ocr-v-field :deep(.v-field) {
  border-radius: 6px !important;
  background-color: var(--color-surface-container-low, #f6f3f1) !important;
  min-height: 52px !important;
  font-size: 15px !important;
  transition: all 0.2s ease;
}

.ocr-v-field :deep(.v-field__outline) {
  --v-field-border-opacity: 0.35;
  color: var(--color-outline-variant, #dbc1b9) !important;
}

.ocr-v-field :deep(.v-field--focused .v-field__outline) {
  --v-field-border-opacity: 1;
  color: var(--color-primary, #99462a) !important;
}

.ocr-v-field :deep(.v-label) {
  font-size: 14px !important;
  color: var(--color-on-surface-variant, #55433d) !important;
  opacity: 0.9;
}

.ocr-v-field :deep(.v-field__input) {
  min-height: 52px !important;
  padding-top: 12px !important;
  padding-bottom: 12px !important;
  font-size: 15px !important;
  color: var(--color-on-surface, #1c1c1a) !important;
}

.ocr-v-field :deep(.v-field__prepend-inner) {
  padding-top: 14px !important;
}

.ocr-v-field :deep(.v-field__append-inner) {
  padding-top: 14px !important;
}

/* Vuetify File Upload Styling */
.ocr-v-fileupload {
  width: 100% !important;
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  background-color: var(--color-surface-container-lowest, #ffffff) !important;
  border-radius: 8px !important;
  border: 2px dashed var(--color-outline-variant, #dbc1b9) !important;
  transition: all 0.2s ease !important;
}

.ocr-v-fileupload:hover {
  border-color: var(--color-primary, #99462a) !important;
  background-color: var(--color-surface-container-low, #fcf8f6) !important;
}

.ocr-v-fileupload :deep(.v-file-upload-title) {
  font-size: 14px !important;
  font-weight: 600 !important;
  color: var(--color-on-surface, #1c1c1a) !important;
  margin-top: 6px !important;
}

.ocr-v-fileupload :deep(.v-file-upload-subtitle) {
  font-size: 12px !important;
  color: var(--color-on-surface-variant, #55433d) !important;
  margin-top: 4px !important;
}

/* Ticket Animations & Edge */
@keyframes laser-sweep {
  0% {
    top: 5%;
    opacity: 0.2;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    top: 92%;
    opacity: 0.2;
  }
}

@keyframes pulse-bounding {
  0% {
    box-shadow: 0 0 0 0 rgba(217, 119, 87, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(217, 119, 87, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(217, 119, 87, 0);
  }
}

@keyframes radar-ping {
  0% {
    transform: scale(0.9);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.4);
    opacity: 0.2;
  }
  100% {
    transform: scale(0.9);
    opacity: 0.8;
  }
}

.animate-laser {
  animation: laser-sweep 2.6s cubic-bezier(0.45, 0, 0.55, 1) infinite alternate;
}

.pulsing-box {
  animation: pulse-bounding 2s ease-in-out infinite;
}

.radar-dot {
  animation: radar-ping 1.8s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

/* 锯齿纸张撕裂纹理效果 */
.receipt-serrated-edge {
  position: relative;
}
.receipt-serrated-edge::after {
  content: "";
  position: absolute;
  bottom: -6px;
  left: 0;
  right: 0;
  height: 6px;
  background: radial-gradient(circle, transparent, transparent 50%, #ffffff 50%, #ffffff 100%);
  background-size: 10px 10px;
}

/* 锚角标记辅助样式 */
.corner-anchor::before, .corner-anchor::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  border-color: #d97757;
  border-style: solid;
}
.corner-tl-br::before { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
.corner-tl-br::after { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }
</style>
