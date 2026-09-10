<template>
  <div class="w-full max-w-[1560px] mx-auto p-4 md:p-6 flex flex-col gap-4 min-h-full" style="background-color: #fcf9f6">
    <!-- 1. 顶部操作与欢迎卡片 (Vuetify v-card + v-btn + v-chip) -->
    <v-card class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-xs flex items-center justify-between flex-wrap gap-3">
      <div>
        <div class="flex items-center gap-2">
          <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-lg">calendar_month</span>
          </span>
          <h2 class="text-xl font-bold font-headline-md text-on-surface">财务日历</h2>
          <v-chip color="primary" variant="tonal" size="small" class="font-bold ml-1">Vuetify 智能驱动</v-chip>
        </div>
        <p class="text-xs text-on-surface-variant mt-1">把每日收支流水、周期账单和重要日程统筹在同一张高密度月历上</p>
      </div>

      <!-- 顶栏汇总微标与操作组 -->
      <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
        <v-chip size="small" color="primary" variant="flat" class="font-amount-table text-xs font-bold">
          <span class="w-1.5 h-1.5 rounded-full bg-white mr-1"></span>
          本月支出 ¥ 12,480.50
        </v-chip>

        <v-chip size="small" color="secondary" variant="flat" class="font-amount-table text-xs font-bold">
          <span class="w-1.5 h-1.5 rounded-full bg-white mr-1"></span>
          本月收入 ¥ 28,500.00
        </v-chip>

        <v-btn
          color="primary"
          variant="flat"
          size="small"
          class="rounded-lg text-xs font-bold px-3 shadow-xs"
          @click="openAddDialog"
        >
          <span class="material-symbols-outlined text-sm mr-1 font-bold">add</span>
          新增日程 / 记账
        </v-btn>
      </div>
    </v-card>

    <!-- 2. 核心 16:9 双栏日历工作台 -->
    <div class="grid grid-cols-12 gap-4 flex-1 min-h-0">
      <!-- 左侧 8 列：Vuetify 主月历面板 (v-card + v-date-picker) -->
      <div class="col-span-12 lg:col-span-8 flex flex-col gap-3">
        <v-card class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-xs flex flex-col flex-1 overflow-hidden">
          <!-- 日历头部控制器 (月份导航、农历年份、快速回到今天) -->
          <div class="flex items-center justify-between pb-3 mb-2 border-b border-surface-container-low flex-wrap gap-2">
            <div class="flex items-center gap-2">
              <v-btn
                icon
                variant="text"
                size="small"
                density="comfortable"
                color="on-surface-variant"
                title="上一月"
                @click="prevMonth"
              >
                <span class="material-symbols-outlined text-sm">chevron_left</span>
              </v-btn>

              <div class="flex items-baseline gap-1.5 px-1 select-none">
                <span class="text-base font-bold text-on-surface font-headline-sm">{{ displayYearMonth }}</span>
                <span class="text-xs text-on-surface-variant font-medium">{{ displayLunarMonth }}</span>
              </div>

              <v-btn
                icon
                variant="text"
                size="small"
                density="comfortable"
                color="on-surface-variant"
                title="下一月"
                @click="nextMonth"
              >
                <span class="material-symbols-outlined text-sm">chevron_right</span>
              </v-btn>

              <v-btn
                variant="tonal"
                color="primary"
                size="x-small"
                class="rounded-lg text-[11px] font-medium ml-1"
                @click="goToday"
              >
                今天
              </v-btn>
            </div>

            <!-- 收支类型微指标 -->
            <div class="flex items-center gap-3 text-xs text-on-surface-variant">
              <div class="flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-primary"></span>
                <span class="text-[11px]">日常消费</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-secondary"></span>
                <span class="text-[11px]">收入结余</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-tertiary"></span>
                <span class="text-[11px]">重点大额</span>
              </div>
            </div>
          </div>

          <!-- Vuetify 原生 v-date-picker 日历组件 -->
          <div class="w-full flex-1 min-h-0 overflow-hidden">
            <v-date-picker
              v-model="pickerDate"
              :first-day-of-week="1"
              show-adjacent-months
              hide-header
              elevation="0"
              color="primary"
              class="w-full vuetify-financial-datepicker"
            >
              <!-- 自定义每日单元格插槽 -->
              <template #day="{ props, item }">
                <div
                  class="calendar-day-tile rounded-lg p-1.5 flex flex-col justify-between cursor-pointer transition-all border select-none"
                  :class="getDayTileClass(item)"
                  @click="onDayClick(props, item)"
                >
                  <!-- 顶部：阳历日期 + 节气节日/农历 -->
                  <div class="flex items-baseline justify-between w-full pointer-events-none">
                    <span
                      class="font-amount-table text-xs font-bold leading-none"
                      :class="!item.isAdjacent
                        ? (item.isToday ? 'text-primary' : 'text-on-surface')
                        : 'text-on-surface-variant/40'"
                    >
                      {{ item.localized }}
                    </span>
                    <span
                      class="font-label-sm text-[10px] leading-none"
                      :class="getHolidayColorClass(item.isoDate) || (item.isToday ? 'text-primary font-bold' : 'text-on-surface-variant/70')"
                    >
                      {{ getHolidayOrLunar(item.isoDate, item.localized) }}
                    </span>
                  </div>

                  <!-- 底部：收支金额 + 状态指示点 -->
                  <div v-if="getDayTransactionSummary(item.isoDate)" class="flex items-center justify-between w-full mt-1 pointer-events-none">
                    <span
                      class="font-amount-table text-[10px] font-bold tracking-tight"
                      :class="getDayTransactionSummary(item.isoDate)?.isIncome ? 'text-secondary' : 'text-primary'"
                    >
                      {{ getDayTransactionSummary(item.isoDate)?.text }}
                    </span>
                    <span
                      class="w-1.5 h-1.5 rounded-full shrink-0"
                      :class="getDayTransactionSummary(item.isoDate)?.dotClass"
                    ></span>
                  </div>
                  <div v-else-if="!item.isAdjacent" class="text-right pointer-events-none">
                    <span class="font-amount-table text-[10px] text-on-surface-variant/30 leading-none">-</span>
                  </div>

                  <!-- 今天角标指示 -->
                  <span
                    v-if="item.isToday"
                    class="absolute -top-1 -right-1 w-3 h-3 bg-primary text-white rounded-full flex items-center justify-center text-[7px] font-bold shadow-xs pointer-events-none"
                  >
                    ✓
                  </span>
                </div>
              </template>
            </v-date-picker>
          </div>

          <!-- 底部月度预算进度条 (Vuetify v-progress-linear) -->
          <div class="mt-3 pt-2.5 border-t border-surface-container-low flex flex-col gap-1.5">
            <div class="flex items-center justify-between text-xs">
              <span class="text-on-surface-variant font-medium">10月总预算进度 (已用 62.4%)</span>
              <span class="text-secondary font-bold font-amount-table">剩余可用 ¥ 7,519.50</span>
            </div>
            <v-progress-linear
              model-value="62.4"
              color="primary"
              height="6"
              rounded
              class="bg-surface-container-high rounded-full overflow-hidden"
            />
            <div class="flex items-center justify-between text-[11px] text-on-surface-variant">
              <span>当月额度 ¥ 20,000.00</span>
              <span class="text-secondary">结余充裕 · 处于健康生活区间</span>
            </div>
          </div>
        </v-card>
      </div>

      <!-- 右侧 4 列：选定日期流水抽屉 (Vuetify v-card + 流水列表) -->
      <div class="col-span-12 lg:col-span-4 flex flex-col gap-3">
        <v-card class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-xs flex flex-col flex-1">
          <!-- 选定日期标头 -->
          <div class="flex items-start justify-between pb-2 border-b border-surface-container-low">
            <div class="flex flex-col">
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-primary"></span>
                <h3 class="text-sm font-bold text-on-surface font-headline-sm">{{ formattedSelectedDate }}</h3>
              </div>
              <span class="text-[11px] text-on-surface-variant mt-0.5">账目明细 ({{ activeDayTransactions.length }} 笔流水)</span>
            </div>
            <v-chip color="primary" variant="tonal" size="x-small" class="font-bold">实时同步</v-chip>
          </div>

          <!-- 当日收支小卡片 -->
          <div class="grid grid-cols-2 gap-2 my-2.5 p-2 bg-surface-container-low rounded-lg border border-outline-variant/20">
            <div class="flex flex-col">
              <span class="text-[10px] text-on-surface-variant">当日支出</span>
              <span class="font-amount-table text-sm text-primary font-bold mt-0.5">¥ {{ activeDayExpense.toFixed(2) }}</span>
            </div>
            <div class="flex flex-col border-l border-surface-container-high pl-2">
              <span class="text-[10px] text-on-surface-variant">当日收入</span>
              <span class="font-amount-table text-sm text-secondary font-bold mt-0.5">¥ {{ activeDayIncome.toFixed(2) }}</span>
            </div>
          </div>

          <!-- 流水列表 -->
          <div class="flex-1 min-h-0 overflow-y-auto flex flex-col gap-1.5 pr-0.5">
            <div
              v-for="(bill, idx) in activeDayTransactions"
              :key="idx"
              class="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container-low/70 transition-colors group cursor-pointer border border-transparent hover:border-outline-variant/20"
              @click="showBillDetail(bill)"
            >
              <div class="flex items-center gap-2 min-w-0">
                <div
                  class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-xs"
                  :class="bill.type === '收入' ? 'bg-secondary-fixed text-secondary' : 'bg-primary-fixed text-primary'"
                >
                  <span class="material-symbols-outlined text-sm">{{ bill.icon }}</span>
                </div>
                <div class="flex flex-col min-w-0">
                  <span class="text-xs font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                    {{ bill.title }}
                  </span>
                  <div class="flex items-center gap-1 text-[10px] text-on-surface-variant">
                    <span>{{ bill.time }}</span>
                    <span>· {{ bill.category }}</span>
                    <span v-if="bill.isOcr" class="material-symbols-outlined text-[10px] text-primary" title="AI视觉核验">document_scanner</span>
                  </div>
                </div>
              </div>
              <span
                class="font-amount-table text-xs font-bold shrink-0 ml-2"
                :class="bill.type === '收入' ? 'text-secondary' : 'text-primary'"
              >
                {{ bill.type === '收入' ? '+' : '-' }}¥{{ bill.amount.toFixed(2) }}
              </span>
            </div>

            <!-- 电子凭证挂接预览卡片 -->
            <div class="p-2 rounded-lg bg-surface-container-low/80 flex items-center gap-2.5 mt-1 border border-outline-variant/15">
              <div class="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span class="material-symbols-outlined text-base">receipt_long</span>
              </div>
              <div class="flex flex-col min-w-0 flex-1">
                <span class="text-[11px] text-on-surface font-semibold truncate">挂接盒马生鲜电子水单</span>
                <span class="text-[10px] text-on-surface-variant truncate">大西洋鲑鱼、巴氏鲜奶等 4 项要素</span>
              </div>
              <v-btn
                icon
                variant="text"
                size="x-small"
                density="comfortable"
                color="primary"
                title="核验票据"
                @click="showToast('已核验对应电子票据凭证要素')"
              >
                <span class="material-symbols-outlined text-xs">visibility</span>
              </v-btn>
            </div>
          </div>

          <!-- 快速录入框 (Vuetify v-text-field) -->
          <div class="pt-2.5 mt-auto border-t border-surface-container-low">
            <v-text-field
              v-model="quickInput"
              placeholder="为本日记一笔 (如: 晚餐 68)..."
              density="compact"
              variant="outlined"
              color="primary"
              hide-details
              class="text-xs rounded-lg"
              @keyup.enter="handleQuickSubmit"
            >
              <template #prepend-inner>
                <span class="material-symbols-outlined text-xs text-on-surface-variant">add_circle_outline</span>
              </template>
              <template #append-inner>
                <v-btn
                  size="x-small"
                  color="primary"
                  variant="flat"
                  class="rounded text-[10px] font-bold px-2"
                  @click="handleQuickSubmit"
                >
                  录入
                </v-btn>
              </template>
            </v-text-field>
          </div>
        </v-card>

        <!-- 知栖智能财务提示卡片 -->
        <v-card class="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/30 shadow-xs flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-lg">spa</span>
          </div>
          <div class="flex flex-col min-w-0">
            <span class="text-xs font-bold text-on-surface font-headline-sm">知栖智能财务提示</span>
            <p class="text-[11px] text-on-surface-variant line-clamp-2 mt-0.5 leading-tight">
              本日餐饮与生活日用支出处于理想规划线内，储蓄健康指数达到 96 分。
            </p>
          </div>
        </v-card>
      </div>
    </div>

    <!-- 3. 新增日程/记账弹窗 (Vuetify v-dialog) -->
    <v-dialog v-model="addDialogOpen" max-width="480">
      <v-card class="rounded-xl p-4 bg-surface-container-lowest border border-outline-variant/30">
        <v-card-title class="px-1 pt-0 pb-2 text-base font-bold text-on-surface flex items-center justify-between border-b border-outline-variant/20">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-primary">calendar_today</span>
            <span>新增记账与日程</span>
          </div>
          <v-btn icon variant="text" size="small" density="comfortable" @click="addDialogOpen = false">
            <span class="material-symbols-outlined text-xs">close</span>
          </v-btn>
        </v-card-title>

        <v-card-text class="px-1 py-3 flex flex-col gap-3">
          <v-btn-toggle
            v-model="modalType"
            mandatory
            color="primary"
            variant="outlined"
            density="compact"
            class="w-full rounded-lg"
          >
            <v-btn value="支出" class="w-1/2 text-xs font-bold">支出记账</v-btn>
            <v-btn value="收入" class="w-1/2 text-xs font-bold">收入入账</v-btn>
          </v-btn-toggle>

          <v-text-field
            v-model="modalAmount"
            type="number"
            step="0.01"
            label="金额 *"
            prefix="¥"
            placeholder="0.00"
            variant="outlined"
            density="compact"
            color="primary"
            hide-details
            class="font-amount-display"
          />

          <v-text-field
            v-model="modalTitle"
            label="商户或用途说明 *"
            placeholder="例如：早市水果采买、咖啡简餐"
            variant="outlined"
            density="compact"
            color="primary"
            hide-details
          />

          <div class="grid grid-cols-2 gap-2">
            <v-select
              v-model="modalCategory"
              :items="['餐饮美食', '生鲜食品', '居家生活', '交通出行', '休闲娱乐', '医疗健康', '工资收入']"
              label="分类"
              variant="outlined"
              density="compact"
              color="primary"
              hide-details
            />
            <v-select
              v-model="modalMember"
              :items="memberOptions"
              :label="ledgerStore.hasMultipleMembers ? '家庭成员' : '记账人'"
              variant="outlined"
              density="compact"
              color="primary"
              hide-details
            />
          </div>
        </v-card-text>

        <v-card-actions class="px-1 pb-0 pt-2 border-t border-outline-variant/20 flex items-center justify-end gap-2">
          <v-btn variant="text" size="small" class="rounded-lg text-xs" @click="addDialogOpen = false">取消</v-btn>
          <v-btn color="primary" variant="flat" size="small" class="rounded-lg text-xs font-bold px-4" @click="submitModal">
            确认记入
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 4. 轻量提示 Toast (v-snackbar) -->
    <v-snackbar
      v-model="toastVisible"
      :timeout="2200"
      color="inverse-surface"
      location="bottom right"
      rounded="lg"
    >
      <div class="flex items-center gap-2 text-xs">
        <span class="material-symbols-outlined text-sm text-primary">check_circle</span>
        <span>{{ toastText }}</span>
      </div>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useLedgerStore } from '../stores/ledger'

const ledgerStore = useLedgerStore()
const memberOptions = computed(() => ledgerStore.currentMembers.map(m => m.name))

interface CalendarBill {
  id: string
  title: string
  time: string
  category: string
  amount: number
  type: '支出' | '收入'
  icon: string
  isOcr?: boolean
}

// 选中的日期 (Vuetify v-date-picker 绑定)
const pickerDate = ref<any>(new Date(2024, 9, 28)) // 默认 2024年10月28日

const displayYearMonth = ref('2024年 10月')
const displayLunarMonth = ref('甲辰年 · 菊月')

const prevMonth = () => {
  displayYearMonth.value = '2024年 9月'
  displayLunarMonth.value = '甲辰年 · 桂月'
  pickerDate.value = new Date(2024, 8, 28)
  showToast('已切换至 2024年 9月')
}

const nextMonth = () => {
  displayYearMonth.value = '2024年 11月'
  displayLunarMonth.value = '甲辰年 · 阳月'
  pickerDate.value = new Date(2024, 10, 28)
  showToast('已切换至 2024年 11月')
}

const goToday = () => {
  pickerDate.value = new Date(2024, 9, 28)
  displayYearMonth.value = '2024年 10月'
  displayLunarMonth.value = '甲辰年 · 菊月'
  showToast('已定位至今天 (10月28日)')
}

// 格式化当前选中的日期文字
const formattedSelectedDate = computed(() => {
  const d = pickerDate.value ? new Date(pickerDate.value) : new Date(2024, 9, 28)
  const month = d.getMonth() + 1
  const day = d.getDate()
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return `${month}月${day}日 ${weekdays[d.getDay()] || ''}`
})

// 节日与农历字典
const holidayMap: Record<string, string> = {
  '2024-10-01': '国庆',
  '2024-10-08': '寒露',
  '2024-10-10': '发薪',
  '2024-10-11': '重阳',
  '2024-10-23': '霜降',
  '2024-10-28': '今天'
}

const lunarMap: Record<string, string> = {
  '1': '初一', '2': '初二', '3': '初三', '4': '初四', '5': '初五',
  '6': '初六', '7': '初七', '8': '初八', '9': '初九', '10': '初十',
  '11': '十一', '12': '十二', '13': '十三', '14': '十四', '15': '十五',
  '16': '十六', '17': '十七', '18': '十八', '19': '十九', '20': '二十',
  '21': '廿一', '22': '廿二', '23': '廿三', '24': '廿四', '25': '廿五',
  '26': '廿六', '27': '廿七', '28': '廿八', '29': '廿九', '30': '三十', '31': '初一'
}

const getHolidayOrLunar = (isoDate: string, localized: string) => {
  if (holidayMap[isoDate]) return holidayMap[isoDate]
  return lunarMap[localized] || ''
}

const getHolidayColorClass = (isoDate: string) => {
  if (isoDate === '2024-10-01' || isoDate === '2024-10-11') return 'text-tertiary font-bold'
  if (isoDate === '2024-10-10') return 'text-secondary font-bold'
  if (isoDate === '2024-10-08' || isoDate === '2024-10-23') return 'text-primary font-medium'
  return ''
}

// 每日流水数据模拟字典
const daySummaryMap: Record<string, { text: string; isIncome: boolean; dotClass: string }> = {
  '2024-10-01': { text: '-1.2k', isIncome: false, dotClass: 'bg-tertiary' },
  '2024-10-02': { text: '-¥460', isIncome: false, dotClass: 'bg-primary-container' },
  '2024-10-03': { text: '-¥89', isIncome: false, dotClass: 'bg-outline-variant' },
  '2024-10-04': { text: '-¥312', isIncome: false, dotClass: 'bg-secondary' },
  '2024-10-05': { text: '+2.0k', isIncome: true, dotClass: 'bg-secondary' },
  '2024-10-06': { text: '-¥120', isIncome: false, dotClass: 'bg-outline' },
  '2024-10-07': { text: '-¥68', isIncome: false, dotClass: 'bg-primary-container' },
  '2024-10-08': { text: '-¥420', isIncome: false, dotClass: 'bg-secondary' },
  '2024-10-09': { text: '-¥56', isIncome: false, dotClass: 'bg-primary-container' },
  '2024-10-10': { text: '+24k', isIncome: true, dotClass: 'bg-secondary' },
  '2024-10-11': { text: '-¥530', isIncome: false, dotClass: 'bg-tertiary' },
  '2024-10-12': { text: '-¥210', isIncome: false, dotClass: 'bg-outline-variant' },
  '2024-10-13': { text: '-¥88', isIncome: false, dotClass: 'bg-primary-container' },
  '2024-10-14': { text: '-¥45', isIncome: false, dotClass: 'bg-primary-container' },
  '2024-10-15': { text: '-¥610', isIncome: false, dotClass: 'bg-primary-container' },
  '2024-10-16': { text: '-¥78', isIncome: false, dotClass: 'bg-primary-container' },
  '2024-10-17': { text: '-¥135', isIncome: false, dotClass: 'bg-secondary' },
  '2024-10-18': { text: '-¥420', isIncome: false, dotClass: 'bg-outline' },
  '2024-10-19': { text: '-¥890', isIncome: false, dotClass: 'bg-primary-container' },
  '2024-10-20': { text: '+2.5k', isIncome: true, dotClass: 'bg-secondary' },
  '2024-10-21': { text: '-¥92', isIncome: false, dotClass: 'bg-primary-container' },
  '2024-10-22': { text: '-¥146', isIncome: false, dotClass: 'bg-outline' },
  '2024-10-23': { text: '-¥298', isIncome: false, dotClass: 'bg-secondary' },
  '2024-10-24': { text: '-¥54', isIncome: false, dotClass: 'bg-primary-container' },
  '2024-10-25': { text: '-¥540', isIncome: false, dotClass: 'bg-primary-container' },
  '2024-10-26': { text: '-¥180', isIncome: false, dotClass: 'bg-outline-variant' },
  '2024-10-27': { text: '-¥72', isIncome: false, dotClass: 'bg-primary-container' },
  '2024-10-28': { text: '-¥388.6', isIncome: false, dotClass: 'bg-primary' }
}

const getDayTransactionSummary = (isoDate: string) => {
  return daySummaryMap[isoDate]
}

const getDayTileClass = (item: any) => {
  const isSelected = item.isSelected
  if (isSelected) {
    return 'bg-primary-fixed/60 shadow-xs border-primary border-2 cursor-pointer'
  }
  if (item.isToday) {
    return 'bg-primary-fixed/20 border-primary/40 border-2 relative hover:bg-primary-fixed/30 cursor-pointer'
  }
  if (item.isAdjacent) {
    return 'bg-surface-container-low/40 opacity-45 hover:opacity-80 transition-all border-transparent cursor-pointer'
  }
  return 'bg-surface-container-low hover:bg-surface-container border-transparent cursor-pointer'
}

const onDayClick = (props: any, item: any) => {
  if (props?.onClick) props.onClick()
  if (item.isoDate) {
    const d = new Date(item.isoDate)
    pickerDate.value = d
    showToast(`已切换至 ${item.isoDate}`)
  }
}

// 选定日期的流水列表数据
const dailyBillsStore = reactive<Record<string, CalendarBill[]>>({
  '2024-10-28': [
    { id: '1', title: '早餐咖啡配燕麦奶', time: '08:30', category: '餐饮美食', amount: 28.00, type: '支出', icon: 'coffee' },
    { id: '2', title: '商务工作日简餐', time: '12:45', category: '餐饮美食', amount: 32.00, type: '支出', icon: 'restaurant' },
    { id: '3', title: '盒马鲜生生鲜与日用', time: '18:42', category: '居家生活', amount: 328.60, type: '支出', icon: 'shopping_basket', isOcr: true }
  ],
  '2024-10-10': [
    { id: '4', title: '月度基本薪酬与季度绩效奖', time: '10:00', category: '工资收入', amount: 24000.00, type: '收入', icon: 'payments' }
  ],
  '2024-10-01': [
    { id: '5', title: '节假日聚餐采买与生鲜水果', time: '17:30', category: '生鲜食品', amount: 1200.00, type: '支出', icon: 'celebration' }
  ]
})

const activeDayTransactions = computed(() => {
  const d = pickerDate.value ? new Date(pickerDate.value) : new Date(2024, 9, 28)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dateStr = `${y}-${m}-${String(d.getDate()).padStart(2, '0')}`
  return dailyBillsStore[dateStr] || [
    { id: 'def-1', title: '全家便利店日用采买', time: '14:20', category: '日常生活', amount: 42.50, type: '支出', icon: 'storefront' }
  ]
})

const activeDayExpense = computed(() => {
  return activeDayTransactions.value
    .filter(b => b.type === '支出')
    .reduce((acc, b) => acc + b.amount, 0)
})

const activeDayIncome = computed(() => {
  return activeDayTransactions.value
    .filter(b => b.type === '收入')
    .reduce((acc, b) => acc + b.amount, 0)
})

// 快速添加单笔
const quickInput = ref('')
const handleQuickSubmit = () => {
  const txt = quickInput.value.trim()
  if (!txt) return

  const match = txt.match(/\d+(\.\d+)?/)
  const amt = match ? parseFloat(match[0]) : 25.00
  const title = txt.replace(/\d+(\.\d+)?/, '').trim() || '日常消费'

  const d = pickerDate.value ? new Date(pickerDate.value) : new Date(2024, 9, 28)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dateStr = `${y}-${m}-${String(d.getDate()).padStart(2, '0')}`

  if (!dailyBillsStore[dateStr]) dailyBillsStore[dateStr] = []
  dailyBillsStore[dateStr].push({
    id: `b-${Date.now()}`,
    title,
    time: new Date().toTimeString().slice(0, 5),
    category: '日常生活',
    amount: amt,
    type: '支出',
    icon: 'shopping_cart'
  })

  quickInput.value = ''
  showToast(`已录入「${title}」¥${amt.toFixed(2)}`)
}

// 弹窗
const addDialogOpen = ref(false)
const modalType = ref<'支出' | '收入'>('支出')
const modalAmount = ref('')
const modalTitle = ref('')
const modalCategory = ref('餐饮美食')
const modalMember = ref('林知栖')

const openAddDialog = () => {
  modalAmount.value = ''
  modalTitle.value = ''
  modalType.value = '支出'
  addDialogOpen.value = true
}

const submitModal = () => {
  const amt = parseFloat(modalAmount.value)
  if (!amt || !modalTitle.value) {
    alert('请填写完整金额与用途')
    return
  }

  const d = pickerDate.value ? new Date(pickerDate.value) : new Date(2024, 9, 28)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dateStr = `${y}-${m}-${String(d.getDate()).padStart(2, '0')}`

  if (!dailyBillsStore[dateStr]) dailyBillsStore[dateStr] = []
  dailyBillsStore[dateStr].unshift({
    id: `b-${Date.now()}`,
    title: modalTitle.value,
    time: new Date().toTimeString().slice(0, 5),
    category: modalCategory.value,
    amount: amt,
    type: modalType.value,
    icon: 'restaurant'
  })

  addDialogOpen.value = false
  showToast(`已成功为 ${dateStr} 记入 ¥${amt.toFixed(2)}`)
}

const showBillDetail = (bill: CalendarBill) => {
  showToast(`查看流水: ${bill.title} ¥${bill.amount.toFixed(2)}`)
}

// Toast
const toastVisible = ref(false)
const toastText = ref('')
const showToast = (msg: string) => {
  toastText.value = msg
  toastVisible.value = true
}
</script>

<style scoped>
/* Vuetify v-date-picker 宽屏金融月历定制 */
.vuetify-financial-datepicker {
  width: 100% !important;
  max-width: 100% !important;
  background: transparent !important;
}

.vuetify-financial-datepicker :deep(.v-date-picker-month) {
  padding: 0 !important;
  width: 100% !important;
}

.vuetify-financial-datepicker :deep(.v-date-picker-month__weeks) {
  width: 100% !important;
}

.vuetify-financial-datepicker :deep(.v-date-picker-month__weekday) {
  font-size: 11px !important;
  font-weight: 700 !important;
  color: var(--color-on-surface-variant) !important;
  padding-bottom: 6px !important;
}

.vuetify-financial-datepicker :deep(.v-date-picker-month__days) {
  width: 100% !important;
  display: grid !important;
  grid-template-columns: repeat(7, minmax(0, 1fr)) !important;
  column-gap: 6px !important;
  row-gap: 6px !important;
  justify-content: stretch !important;
}

.vuetify-financial-datepicker :deep(.v-date-picker-month__day) {
  width: 100% !important;
  height: 56px !important;
  min-height: 56px !important;
  display: flex !important;
  align-items: stretch !important;
  justify-content: stretch !important;
}

.calendar-day-tile {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer !important;
  transition: all 0.18s ease;
}

.calendar-day-tile:hover {
  cursor: pointer !important;
  transform: translateY(-1px);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.vuetify-financial-datepicker :deep(.v-date-picker-month__day) {
  cursor: pointer !important;
}

.vuetify-financial-datepicker :deep(.v-date-picker-month__day-btn) {
  cursor: pointer !important;
}
</style>
