<template>
  <div class="w-full max-w-[1640px] mx-auto p-6 flex flex-col gap-6 min-h-full justify-between" style="background-color: #fcf9f6">
    <!-- 顶部 3 项核心财务健康度指标 (水平卡片平铺，高度扩充，字体全面加大) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 shrink-0">
      <!-- 本月总支出 -->
      <div
        class="bg-surface-container-lowest rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-outline-variant/30 min-h-[148px] hover:shadow-md transition-shadow relative overflow-hidden"
      >
        <div class="flex items-center justify-between">
          <span class="font-label-md text-sm text-on-surface-variant font-medium">本月总支出</span>
          <span
            class="inline-flex items-center px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-semibold"
          >
            -8.2% 较上月
          </span>
        </div>
        <div class="my-2 flex items-baseline">
          <span class="font-amount-display text-4xl lg:text-[42px] text-on-surface font-extrabold leading-none">¥ 12,480</span>
          <span class="font-amount-table text-base text-on-surface-variant ml-0.5">.50</span>
        </div>
        <div class="flex items-center justify-between text-xs text-on-surface-variant pt-1 border-t border-surface-container-low">
          <span>结余可支配度高 · 较上月省 ¥1,114</span>
          <span class="font-semibold text-primary">已用 69.3%</span>
        </div>
      </div>

      <!-- 本月总收入 -->
      <div
        class="bg-surface-container-lowest rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-outline-variant/30 min-h-[148px] hover:shadow-md transition-shadow relative overflow-hidden"
      >
        <div class="flex items-center justify-between">
          <span class="font-label-md text-sm text-on-surface-variant font-medium">本月总收入</span>
          <span
            class="inline-flex items-center px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-xs font-semibold"
          >
            入账充盈
          </span>
        </div>
        <div class="my-2 flex items-baseline">
          <span class="font-amount-display text-4xl lg:text-[42px] text-on-surface font-extrabold leading-none">¥ 28,500</span>
          <span class="font-amount-table text-base text-on-surface-variant ml-0.5">.00</span>
        </div>
        <div class="flex items-center justify-between text-xs text-on-surface-variant pt-1 border-t border-surface-container-low">
          <span>工资薪酬到账 + 稳健理财分红</span>
          <span class="font-semibold text-secondary">达成率 100%</span>
        </div>
      </div>

      <!-- 本月净结余 -->
      <div
        class="bg-surface-container-lowest rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-outline-variant/30 min-h-[148px] hover:shadow-md transition-shadow relative overflow-hidden"
      >
        <div class="flex items-center justify-between">
          <span class="font-label-md text-sm text-on-surface-variant font-medium">本月净结余</span>
          <span
            class="inline-flex items-center px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface text-xs font-semibold"
          >
            达成率 112%
          </span>
        </div>
        <div class="my-2 flex items-baseline gap-1">
          <span class="font-amount-display text-4xl lg:text-[42px] text-secondary font-extrabold leading-none">¥ 16,019</span>
          <span class="font-amount-table text-base text-secondary font-semibold">.50</span>
        </div>
        <div class="flex items-center justify-between text-xs text-secondary font-medium pt-1 border-t border-surface-container-low">
          <span>应急储备充足 · 储蓄无忧</span>
          <span class="font-bold">储蓄率 56.2%</span>
        </div>
      </div>
    </div>

    <!-- 中间主体：左 8 列 (ECharts趋势走势 + 预算/构成) + 右 4 列 (近期流水 + AI管家洞察) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
      <!-- 左侧主展示区 (8列) -->
      <div class="lg:col-span-8 flex flex-col gap-6 justify-between">
        <!-- 上半部：宽幅近30天收支动态趋势 (ECharts 交互曲线，支持近30天/14天/7天维度切换) -->
        <div
          class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between"
        >
          <div class="flex items-center justify-between mb-3 shrink-0">
            <div>
              <div class="flex items-center gap-2.5">
                <h3 class="font-headline-sm text-base lg:text-lg font-bold text-on-surface">家庭收支动态走势</h3>
                <span class="text-xs px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono"
                  >Vision Analytics</span
                >
              </div>
              <span class="font-label-sm text-xs text-on-surface-variant mt-0.5 block"
                >每日现金流波峰预测 · ECharts 曲线动态推演</span
              >
            </div>

            <div class="flex items-center gap-4">
              <!-- 时间维度切换胶囊 -->
              <div class="flex items-center bg-surface-container-low p-1 rounded-xl border border-outline-variant/20">
                <button
                  v-for="range in rangeOptions"
                  :key="range.key"
                  class="px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  :class="
                    activeRange === range.key
                      ? 'bg-primary-container text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  "
                  type="button"
                  @click="switchRange(range.key)"
                >
                  {{ range.label }}
                </button>
              </div>

              <!-- 图例 (点击可自由切换开启/关闭折线) -->
              <div class="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer select-none text-xs"
                  :class="showNet ? 'bg-secondary-container/50 border-secondary/40 text-secondary font-bold' : 'bg-surface-container-low border-outline-variant/30 text-outline opacity-50 line-through'"
                  title="点击切换净收入折线与渐变投影"
                  @click="toggleSeries('净收入')"
                >
                  <span class="w-3 h-1 rounded" :class="showNet ? 'bg-secondary' : 'bg-outline'"></span>
                  <span>净收入</span>
                </button>
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer select-none text-xs"
                  :class="showExpense ? 'bg-primary-fixed/40 border-primary/30 text-primary font-bold' : 'bg-surface-container-low border-outline-variant/30 text-outline opacity-50 line-through'"
                  title="点击切换支出折线"
                  @click="toggleSeries('支出')"
                >
                  <span class="w-3 h-1 rounded" :class="showExpense ? 'bg-primary' : 'bg-outline'"></span>
                  <span>支出</span>
                </button>
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer select-none text-xs"
                  :class="showIncome ? 'bg-surface-container-high border-outline-variant/40 text-on-surface font-bold' : 'bg-surface-container-low border-outline-variant/30 text-outline opacity-50 line-through'"
                  title="点击切换收入折线"
                  @click="toggleSeries('收入')"
                >
                  <span class="w-3 h-1 border-b-2 border-dashed" :style="{ borderColor: showIncome ? '#55433d' : '#88726c' }"></span>
                  <span>收入</span>
                </button>
              </div>
            </div>
          </div>

          <!-- ECharts 折线面积图容器 (高度扩充至 360px，充满视野) -->
          <div ref="trendChartRef" style="width: 100%; height: 360px; min-height: 360px"></div>
        </div>

        <!-- 下半部：同级并列的“家庭预算执行监控”与“分类支出构成 (ECharts 环形图)” -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          <!-- 预算监控卡片 -->
          <div
            class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between h-full"
          >
            <div class="flex items-center justify-between shrink-0 mb-2">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-lg">track_changes</span>
                <h3 class="font-headline-sm text-base font-bold text-on-surface">家庭预算执行监控</h3>
              </div>
              <span class="font-label-md text-xs text-on-surface-variant font-medium">4月 (余 9 天)</span>
            </div>

            <!-- 宏观总额度条 -->
            <div
              class="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-2 my-2 border border-outline-variant/20"
            >
              <div class="flex items-center justify-between text-sm">
                <span class="text-on-surface-variant">月度总预算额度</span>
                <span class="font-amount-table font-bold text-on-surface text-base">¥18,000.00</span>
              </div>
              <div class="relative w-full h-2.5 rounded-full bg-surface-container-highest overflow-hidden">
                <div
                  class="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-primary-fixed-dim via-primary-container to-primary"
                  style="width: 69.3%"
                ></div>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-on-surface-variant">已用 <strong class="text-on-surface font-bold">69.3%</strong></span>
                <span class="text-primary font-bold">剩余可用 ¥5,519.50</span>
              </div>
            </div>

            <!-- 核心分类进度列表 (6项全面覆盖) -->
            <div class="flex flex-col gap-3 my-auto">
              <div v-for="b in budgetItems" :key="b.name" class="flex items-center justify-between gap-3 text-sm">
                <span class="text-xs font-semibold text-on-surface w-20 truncate">{{ b.name }}</span>
                <div class="flex-1 bg-surface-container-highest h-2 rounded-full overflow-hidden">
                  <div class="h-full rounded-full" :style="{ width: b.percent + '%', backgroundColor: b.color }"></div>
                </div>
                <div class="flex items-center gap-1.5 w-24 justify-end shrink-0">
                  <span class="font-amount-table text-xs font-bold" :style="{ color: b.color }">{{ b.percent }}%</span>
                  <span class="font-amount-table text-[11px] text-on-surface-variant">({{ b.spent }})</span>
                </div>
              </div>
            </div>

            <div class="p-2.5 rounded-xl bg-surface-container text-center mt-3">
              <span class="font-label-sm text-xs text-on-surface-variant">💡 提示：餐饮美食支出达上限 78%，其余各项均在稳健安全区</span>
            </div>
          </div>

          <!-- 分类支出构成卡片 (ECharts 环形图 + 明细) -->
          <div
            class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between h-full"
          >
            <div class="flex items-center justify-between mb-2 shrink-0">
              <h3 class="font-headline-sm text-base font-bold text-on-surface">分类支出构成</h3>
              <span class="font-label-md text-xs text-on-surface-variant font-medium">总支出 ¥12,480.50</span>
            </div>

            <div class="flex items-center justify-between gap-4 my-auto">
              <!-- ECharts 饼图容器与中间指示器 (放大至 160px) -->
              <div class="relative flex items-center justify-center shrink-0" style="width: 160px; height: 160px">
                <div ref="pieChartRef" style="width: 160px; height: 160px"></div>
                <!-- 环形中间动态响应指示 -->
                <div
                  class="absolute flex flex-col items-center justify-center text-center leading-tight pointer-events-none select-none"
                >
                  <span class="text-xs text-on-surface-variant font-medium">{{ activeCategory.tag }}</span>
                  <span class="text-base font-bold text-on-surface truncate max-w-[68px] mt-0.5">{{ activeCategory.name }}</span>
                  <span class="text-sm font-bold font-amount-table text-primary mt-0.5">{{
                    activeCategory.percent
                  }}</span>
                </div>
              </div>

              <!-- 分类统计明细 (字体与间距全面增大) -->
              <div class="flex flex-col gap-2 w-full text-xs">
                <div
                  v-for="cat in categoryList"
                  :key="cat.name"
                  class="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
                  @mouseenter="focusCategory(cat)"
                  @mouseleave="resetCategory"
                >
                  <span class="flex items-center gap-2 min-w-0">
                    <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: cat.color }"></span>
                    <span class="truncate font-medium text-xs">{{ cat.name }}</span>
                  </span>
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="font-amount-table font-bold text-xs">{{ cat.amount }}</span>
                    <span class="font-amount-table text-xs text-on-surface-variant w-8 text-right font-medium">{{
                      cat.percent
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-2.5 rounded-xl bg-surface-container text-center mt-3">
              <span class="font-label-sm text-xs text-on-surface-variant">🌱 本月储蓄率维持在 56.2% · 非必要开销保持温和控制</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧辅助区 (4列)：近期流水记录 + 知栖 AI 智能管家洞察 (撑满整个右侧高度) -->
      <div class="lg:col-span-4 flex flex-col gap-6 justify-between h-full">
        <!-- 近期收支流水卡片 (6 笔真实家庭收支，更大文字与间距) -->
        <div
          class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-on-surface text-lg">receipt_long</span>
              <h3 class="font-headline-sm text-base font-bold text-on-surface">近期收支流水</h3>
            </div>
            <router-link
              to="/bills"
              class="font-label-md text-xs text-primary hover:underline flex items-center gap-1 no-underline font-medium"
            >
              <span>全部明细</span>
              <span class="material-symbols-outlined text-xs">arrow_forward</span>
            </router-link>
          </div>

          <div class="flex flex-col gap-2.5">
            <div
              v-for="tx in recentTransactions"
              :key="tx.title"
              class="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div
                  class="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center shrink-0"
                  :class="tx.iconColor"
                >
                  <span class="material-symbols-outlined text-base">{{ tx.icon }}</span>
                </div>
                <div class="flex flex-col min-w-0">
                  <span class="font-body-md text-xs font-bold text-on-surface truncate">{{ tx.title }}</span>
                  <span class="font-label-sm text-[11px] text-on-surface-variant mt-0.5">{{ tx.subtitle }}</span>
                </div>
              </div>
              <div class="font-amount-table text-sm font-bold text-on-surface text-right shrink-0">
                {{ tx.amount }}
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-3 mt-1 border-t border-surface-container-low text-xs text-on-surface-variant">
            <span>今日已发生 2 笔开销 · 累计 ¥706.40</span>
            <span class="text-secondary font-semibold">记账规范率 100%</span>
          </div>
        </div>

        <!-- 知栖 AI 智能管家洞察卡片 (撑满下半部高度，字体全面放大) -->
        <div
          class="bg-primary-fixed/20 rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between relative overflow-hidden flex-1"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm">
                <span class="material-symbols-outlined text-sm">psychology</span>
              </span>
              <span class="font-headline-sm text-base text-on-surface font-bold">知栖 AI 智能财务伴侣</span>
            </div>
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold"
              >刚刚更新</span
            >
          </div>

          <div
            class="p-4 rounded-xl bg-surface-container-lowest/95 backdrop-blur-sm shadow-sm flex flex-col gap-3 text-xs leading-relaxed border border-outline-variant/20 my-auto"
          >
            <p class="text-on-surface">💡 <strong>餐饮预警：</strong> 聚会与大宗食材支出达上限 78%，周末建议尝试温馨家庭烘焙，健康又省心。</p>
            <p class="text-on-surface pt-2 border-t border-surface-container-high/60">
              🌿 <strong>目标结余：</strong> 储蓄状态充盈，完全可达成
              <strong class="text-primary font-bold">¥15,000</strong> 海岛游定投专项！
            </p>
            <p class="text-on-surface pt-2 border-t border-surface-container-high/60">
              📈 <strong>现金流预测：</strong> 预计本月净结余将超预期 12%，家庭 6 个月抗风险储备金极充沛。
            </p>
            <p class="text-on-surface pt-2 border-t border-surface-container-high/60">
              🔒 <strong>家庭隐私屏障：</strong> 端侧账本多层脱敏隔离，仅林知栖与苏晓具备家庭主理权限。
            </p>
          </div>

          <div class="flex items-center justify-between pt-3 mt-1 border-t border-surface-container-low text-xs">
            <span class="text-on-surface-variant font-medium">家庭财务平和度 88% · 恬适健康</span>
            <span class="text-primary font-bold">AI 实时守护中</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import * as echarts from "echarts";

const trendChartRef = ref<HTMLDivElement | null>(null);
const pieChartRef = ref<HTMLDivElement | null>(null);

let trendChart: echarts.ECharts | null = null;
let pieChart: echarts.ECharts | null = null;
let resizeObserver: ResizeObserver | null = null;

// 时间范围切换
const rangeOptions: { key: "30d" | "14d" | "7d"; label: string }[] = [
  { key: "30d", label: "近30天" },
  { key: "14d", label: "近14天" },
  { key: "7d", label: "近7天" },
];
const activeRange = ref<"30d" | "14d" | "7d">("30d");

// 环形图当前激活项目指示
const activeCategory = ref({
  name: "餐饮",
  percent: "42%",
  tag: "最大",
});

const budgetItems = [
  { name: "餐饮美食", percent: 78, color: "#d97757", spent: "¥3,900" },
  { name: "居家生活", percent: 54, color: "#41674c", spent: "¥2,700" },
  { name: "孩子教育", percent: 62, color: "#88726c", spent: "¥2,480" },
  { name: "休闲出行", percent: 41, color: "#a7d1b0", spent: "¥820" },
  { name: "医疗保健", percent: 35, color: "#d97757", spent: "¥350" },
  { name: "数码订阅", percent: 50, color: "#99462a", spent: "¥500" },
];

const categoryList = [
  { name: "餐饮美食", amount: "¥5,241", percent: "42%", color: "#99462a", value: 5241 },
  { name: "居家生活", amount: "¥2,745", percent: "22%", color: "#d97757", value: 2745 },
  { name: "孩子教育", amount: "¥2,246", percent: "18%", color: "#ffb59e", value: 2246 },
  { name: "休闲出行", amount: "¥998", percent: "8%", color: "#41674c", value: 998 },
  { name: "医疗健康", amount: "¥750", percent: "6%", color: "#a7d1b0", value: 750 },
  { name: "订阅杂费", amount: "¥500", percent: "4%", color: "#88726c", value: 500 },
];

const recentTransactions = [
  {
    title: "山姆会员商店 · 周末大宗采购",
    subtitle: "今日 11:20 · 林知栖",
    amount: "- ¥ 638.40",
    icon: "shopping_cart",
    iconColor: "text-primary",
  },
  {
    title: "星巴克甄选 · 家庭下午茶",
    subtitle: "昨天 15:45 · 苏晓",
    amount: "- ¥ 68.00",
    icon: "local_cafe",
    iconColor: "text-primary",
  },
  {
    title: "国家电网与公用燃气费",
    subtitle: "4月18日 · 公共自动代扣",
    amount: "- ¥ 324.50",
    icon: "bolt",
    iconColor: "text-secondary",
  },
  {
    title: "盒马鲜生 · 每日日日鲜与海鲜",
    subtitle: "4月17日 18:30 · 林知栖",
    amount: "- ¥ 186.20",
    icon: "restaurant",
    iconColor: "text-primary",
  },
  {
    title: "滴滴出行 · 孩子课外接送",
    subtitle: "4月16日 08:15 · 苏晓",
    amount: "- ¥ 32.80",
    icon: "directions_car",
    iconColor: "text-outline",
  },
  {
    title: "Apple 订阅 · iCloud+ 家庭共享",
    subtitle: "4月15日 00:00 · 周期自动扣款",
    amount: "- ¥ 68.00",
    icon: "cloud",
    iconColor: "text-secondary",
  },
];

// 3 套丰富逼真的每日生活流水假数据
const mockDatasets = {
  "30d": {
    dates: [
      "04-01",
      "04-02",
      "04-03",
      "04-04",
      "04-05",
      "04-06",
      "04-07",
      "04-08",
      "04-09",
      "04-10",
      "04-11",
      "04-12",
      "04-13",
      "04-14",
      "04-15",
      "04-16",
      "04-17",
      "04-18",
      "04-19",
      "04-20",
      "04-21",
      "04-22",
      "04-23",
      "04-24",
      "04-25",
      "04-26",
      "04-27",
      "04-28",
      "04-29",
      "04-30",
    ],
    expenses: [
      220, 185, 310, 160, 780, 620, 190, 240, 175, 520, 360, 890, 420, 210, 1280, 180, 290, 324.5, 68, 890, 388.6, 260,
      310, 450, 520, 740, 620, 310, 280, 410,
    ],
    incomes: [
      950, 950, 950, 950, 950, 850, 850,
      950, 950, 1100, 950, 950, 850, 850,
      1200, 950, 950, 950, 950, 1050, 950,
      850, 850, 950, 950, 950, 950, 1150, 850, 850,
    ],
  },
  "14d": {
    dates: [
      "04-14",
      "04-15",
      "04-16",
      "04-17",
      "04-18",
      "04-19",
      "04-20",
      "04-21",
      "04-22",
      "04-23",
      "04-24",
      "04-25",
      "04-26",
      "04-27",
    ],
    expenses: [210, 1280, 180, 290, 324.5, 68, 890, 388.6, 260, 310, 450, 520, 740, 620],
    incomes: [950, 1200, 950, 950, 950, 950, 1050, 950, 850, 850, 950, 950, 950, 950],
  },
  "7d": {
    dates: ["04-15", "04-16", "04-17", "04-18", "04-19", "04-20", "04-21"],
    expenses: [1280, 180, 290, 324.5, 68, 890, 388.6],
    incomes: [1200, 950, 950, 950, 950, 1050, 950],
  },
};

const switchRange = (range: "30d" | "14d" | "7d") => {
  activeRange.value = range;
  updateTrendChart();
};

const focusCategory = (cat: (typeof categoryList)[0]) => {
  activeCategory.value = {
    name: cat.name.slice(0, 2),
    percent: cat.percent,
    tag: "聚焦",
  };
  pieChart?.dispatchAction({
    type: "highlight",
    name: cat.name,
  });
};

const resetCategory = () => {
  activeCategory.value = {
    name: "餐饮",
    percent: "42%",
    tag: "最大",
  };
  pieChart?.dispatchAction({
    type: "downplay",
  });
};

// 控制净收入、支出与收入折线显示/隐藏 (调用 ECharts 原生 action)
const showNet = ref(true);
const showExpense = ref(true);
const showIncome = ref(true);

const toggleSeries = (name: "净收入" | "支出" | "收入") => {
  if (name === "净收入") {
    if (showNet.value && !showExpense.value && !showIncome.value) return;
    showNet.value = !showNet.value;
  } else if (name === "支出") {
    if (showExpense.value && !showNet.value && !showIncome.value) return;
    showExpense.value = !showExpense.value;
  } else {
    if (showIncome.value && !showNet.value && !showExpense.value) return;
    showIncome.value = !showIncome.value;
  }
  trendChart?.dispatchAction({ type: "legendToggleSelect", name });
};

// 更新近30天/14天/7天走势图数据
const updateTrendChart = () => {
  if (!trendChart) return;
  const currentData = mockDatasets[activeRange.value];
  const netIncomes = currentData.incomes.map((inc, i) => Math.round((inc - currentData.expenses[i]) * 10) / 10);

  trendChart.setOption(
    {
      backgroundColor: "transparent",
      legend: {
        show: false,
        selected: {
          净收入: showNet.value,
          支出: showExpense.value,
          收入: showIncome.value,
        },
      },
      grid: {
        top: 30,
        right: 20,
        bottom: 28,
        left: 54,
        containLabel: false,
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "#ffffff",
        borderColor: "#dbc1b9",
        borderWidth: 1,
        borderRadius: 8,
        padding: [8, 12],
        textStyle: {
          color: "#1c1c1a",
          fontSize: 12,
          fontFamily: "'Manrope', sans-serif",
        },
        formatter: (params: any) => {
          const date = params[0]?.axisValue || "";
          let html = `<div style="font-weight:700;margin-bottom:4px;font-size:13px;color:#1c1c1a;">${date}</div>`;
          params.forEach((item: any) => {
            let color = "#55433d";
            let prefix = "";
            if (item.seriesName === "净收入") {
              color = item.value >= 0 ? "#2e6945" : "#ba1a1a";
              prefix = item.value >= 0 ? "+" : "";
            } else if (item.seriesName === "支出") {
              color = "#99462a";
              prefix = "-";
            } else if (item.seriesName === "收入") {
              color = "#55433d";
              prefix = "+";
            }
            html += `<div style="display:flex;justify-content:space-between;gap:16px;font-size:12px;margin-top:3px;">
            <span><span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${color};margin-right:5px;"></span>${item.seriesName}</span>
            <strong style="font-family:'JetBrains Mono';color:${color};font-weight:700;">${prefix}¥ ${Number(item.value).toLocaleString()}</strong>
          </div>`;
          });
          return html;
        },
      },
      xAxis: {
        type: "category",
        data: currentData.dates,
        boundaryGap: false,
        axisLine: { lineStyle: { color: "#f0edeb" } },
        axisTick: { show: false },
        axisLabel: {
          fontSize: 12,
          fontFamily: "'Manrope', sans-serif",
          color: (val: string) => (val.includes("04-21") ? "#99462a" : "#88726c"),
          fontWeight: (val: string) => (val.includes("04-21") ? "bold" : "normal"),
        },
      },
      yAxis: {
        type: "value",
        splitLine: {
          lineStyle: {
            color: "#f0edeb",
            type: "dashed",
          },
        },
        axisLabel: {
          formatter: "¥{value}",
          color: "#88726c",
          fontSize: 11,
          fontFamily: "'JetBrains Mono', monospace",
        },
      },
      series: [
        {
          name: "净收入",
          type: "line",
          smooth: 0.45,
          showSymbol: false,
          symbolSize: 7,
          itemStyle: { color: "#2e6945" },
          lineStyle: { width: 3, color: "#2e6945" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(46, 105, 69, 0.32)" },
              { offset: 0.65, color: "rgba(46, 105, 69, 0.08)" },
              { offset: 1, color: "rgba(46, 105, 69, 0.0)" },
            ]),
          },
          data: netIncomes,
          z: 2,
        },
        {
          name: "支出",
          type: "line",
          smooth: 0.45,
          showSymbol: false,
          symbolSize: 7,
          itemStyle: { color: "#99462a" },
          lineStyle: { width: 2.6, color: "#99462a" },
          data: currentData.expenses,
          z: 3,
        },
        {
          name: "收入",
          type: "line",
          smooth: 0.45,
          showSymbol: false,
          itemStyle: { color: "#55433d" },
          lineStyle: {
            width: 2.2,
            color: "#55433d",
            type: "dashed",
          },
          data: currentData.incomes,
          z: 3,
        },
      ],
    },
    true,
  );
};

// 初始化 ECharts 图表
const initCharts = () => {
  // 1. 收支走势平滑双曲线面积图
  if (trendChartRef.value) {
    if (trendChart) {
      trendChart.dispose();
    }
    trendChart = echarts.init(trendChartRef.value);
    updateTrendChart();
  }

  // 2. 分类支出构成 Donut 环形图
  if (pieChartRef.value) {
    if (pieChart) {
      pieChart.dispose();
    }
    pieChart = echarts.init(pieChartRef.value);

    pieChart.setOption({
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        backgroundColor: "#ffffff",
        borderColor: "#dbc1b9",
        borderWidth: 1,
        borderRadius: 8,
        padding: [8, 12],
        textStyle: {
          color: "#1c1c1a",
          fontSize: 12,
          fontFamily: "'Manrope', sans-serif",
        },
        formatter: (params: any) => {
          return `<b>${params.name}</b><br/>金额: ¥ ${params.value.toLocaleString()} (${params.percent}%)`;
        },
      },
      series: [
        {
          name: "支出品类",
          type: "pie",
          radius: ["56%", "82%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 3,
            borderColor: "#ffffff",
            borderWidth: 2,
          },
          label: {
            show: false,
          },
          emphasis: {
            scale: true,
            scaleSize: 4,
          },
          data: categoryList.map((c) => ({
            name: c.name,
            value: c.value,
            itemStyle: { color: c.color },
          })),
        },
      ],
    });

    // 鼠标悬停环形扇区时联动中心指示
    pieChart.on("mouseover", (params: any) => {
      const match = categoryList.find((c) => c.name === params.name);
      if (match) {
        focusCategory(match);
      }
    });
    pieChart.on("mouseout", () => {
      resetCategory();
    });
  }
};

const handleResize = () => {
  trendChart?.resize();
  pieChart?.resize();
};

onMounted(() => {
  nextTick(() => {
    initCharts();
    setTimeout(() => {
      trendChart?.resize();
      pieChart?.resize();
    }, 80);

    if (window.ResizeObserver && trendChartRef.value) {
      resizeObserver = new ResizeObserver(() => {
        trendChart?.resize();
        pieChart?.resize();
      });
      resizeObserver.observe(trendChartRef.value);
    }
  });
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  trendChart?.dispose();
  pieChart?.dispose();
});
</script>
