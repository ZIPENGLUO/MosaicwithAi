<template>
  <div class="w-full max-w-[1560px] mx-auto px-6 py-5 flex flex-col gap-5">
    <!-- 1. 顶部工具栏与协同控制 (Header Toolbar & Context Control) -->
    <section class="flex flex-wrap items-center justify-between gap-3 bg-surface-container-lowest px-5 py-3 rounded-xl shadow-sm">
      <div class="flex flex-wrap items-center gap-3">
        <!-- 走势维度切换 -->
        <div class="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
          <button
            v-for="tab in timeTabs"
            :key="tab.id"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
            :class="activeTab === tab.id
              ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'"
            type="button"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="h-4 w-px bg-outline-variant/60 hidden sm:block"></div>

        <!-- 成员协同筛选 -->
        <div class="flex items-center gap-1.5 text-xs">
          <span class="text-on-surface-variant text-label-sm font-medium">成员协同:</span>
          <button
            v-for="m in memberFilters"
            :key="m.id"
            class="px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1"
            :class="activeMember === m.id
              ? 'bg-primary-fixed text-on-primary-fixed-variant font-semibold'
              : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'"
            type="button"
            @click="activeMember = m.id"
          >
            <span v-if="activeMember === m.id" class="w-1.5 h-1.5 rounded-full bg-primary"></span>
            {{ m.label }}
          </button>
        </div>
      </div>

      <!-- 右侧日期与PDF导出 -->
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low text-on-surface text-xs font-medium">
          <span class="material-symbols-outlined text-sm text-on-surface-variant">date_range</span>
          <span>2024年 1月 - 10月</span>
          <span class="material-symbols-outlined text-xs text-on-surface-variant">expand_more</span>
        </div>

        <button
          class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary-container text-on-primary text-xs font-semibold hover:bg-primary transition-colors shadow-sm cursor-pointer disabled:opacity-75"
          :disabled="isExporting"
          type="button"
          @click="triggerExport"
        >
          <span class="material-symbols-outlined text-sm" :class="{ 'animate-spin': isExporting }">
            {{ exportIcon }}
          </span>
          <span>{{ exportText }}</span>
        </button>
      </div>
    </section>

    <!-- 2. 核心 KPI 卡片组 (4 维度指标) -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- KPI 1 -->
      <div class="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
        <div class="flex items-center justify-between mb-1">
          <span class="text-label-md text-xs text-on-surface-variant">月均家庭支出</span>
          <div class="w-7 h-7 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary">
            <span class="material-symbols-outlined text-sm">trending_down</span>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex items-baseline gap-1">
            <span class="font-headline-sm text-sm text-on-surface-variant">¥</span>
            <span class="font-amount-display text-2xl font-bold text-on-surface tracking-tight">11,850</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] bg-secondary-container text-secondary font-semibold">
              ↓ 4.3% 环比优于上季
            </span>
            <span class="text-on-surface-variant text-[11px]">均态维稳</span>
          </div>
        </div>
      </div>

      <!-- KPI 2 -->
      <div class="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
        <div class="flex items-center justify-between mb-1">
          <span class="text-label-md text-xs text-on-surface-variant">实际家庭储蓄率</span>
          <div class="w-7 h-7 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
            <span class="material-symbols-outlined text-sm">savings</span>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex items-baseline gap-1">
            <span class="font-amount-display text-2xl font-bold text-on-surface tracking-tight">58.6</span>
            <span class="text-headline-sm text-primary font-semibold">%</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] bg-secondary-fixed text-on-secondary-fixed font-semibold">
              极优级
            </span>
            <span class="text-on-surface-variant text-[11px]">安全边界宽裕 (月存 ¥20.9k)</span>
          </div>
        </div>
      </div>

      <!-- KPI 3 -->
      <div class="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
        <div class="flex items-center justify-between mb-1">
          <span class="text-label-md text-xs text-on-surface-variant">最大单项支出分类</span>
          <div class="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
            <span class="material-symbols-outlined text-sm">restaurant</span>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex items-baseline justify-between">
            <span class="text-base font-semibold text-on-surface truncate">餐饮与生鲜食品</span>
            <span class="font-amount-table text-xs text-on-primary-container bg-primary-fixed px-2 py-0.5 rounded-full font-semibold">34.2%</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-on-surface-variant text-[11px]">月均 ¥4,052</span>
            <span class="text-[11px] text-secondary font-medium">主要为有机食材采购</span>
          </div>
        </div>
      </div>

      <!-- KPI 4 -->
      <div class="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
        <div class="flex items-center justify-between mb-1">
          <span class="text-label-md text-xs text-on-surface-variant">预算执行健康指数</span>
          <div class="w-7 h-7 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary">
            <span class="material-symbols-outlined text-sm">verified</span>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex items-baseline gap-1">
            <span class="font-amount-display text-2xl font-bold text-secondary tracking-tight">91.5</span>
            <span class="text-headline-sm text-secondary font-semibold">%</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-16 bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
              <div class="bg-secondary h-full rounded-full w-[91.5%]"></div>
            </div>
            <span class="text-on-surface-variant text-[11px]">未现超支预警</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. 年度收支走势与储蓄复合可视化 (Primary Trend Complex Visualization) -->
    <section class="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-surface-container-high/60">
        <div>
          <h2 class="font-headline-sm text-base text-on-surface font-bold tracking-tight">2024年度收支沉淀与储蓄走势</h2>
          <p class="text-xs text-on-surface-variant mt-0.5">柱状反映家庭总流入与总支出，折线反映各期实际转存留存余额</p>
        </div>
        <div class="flex items-center gap-4 flex-wrap text-xs text-on-surface-variant">
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-sm bg-secondary"></span>
            <span>总流入 (收入)</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-sm bg-primary-container"></span>
            <span>总支出</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-0.5 bg-primary"></span>
            <span class="w-2 h-2 rounded-full bg-primary -ml-2.5"></span>
            <span>当月净结余 (储蓄)</span>
          </div>
        </div>
      </div>

      <!-- 响应式复合走势图表 SVG -->
      <div class="w-full relative overflow-x-auto">
        <div class="min-w-[760px] h-[280px] relative flex flex-col justify-end pt-4">
          <svg class="w-full h-full" viewBox="0 0 860 260" preserveAspectRatio="none">
            <defs>
              <!-- 收入渐变 -->
              <linearGradient id="barIncomeGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="#41674c" stop-opacity="0.95"></stop>
                <stop offset="100%" stop-color="#41674c" stop-opacity="0.65"></stop>
              </linearGradient>
              <!-- 支出渐变 -->
              <linearGradient id="barExpenseGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="#d97757" stop-opacity="0.95"></stop>
                <stop offset="100%" stop-color="#d97757" stop-opacity="0.7"></stop>
              </linearGradient>
              <!-- 结余留存面积阴影 -->
              <linearGradient id="savingsArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="#99462a" stop-opacity="0.18"></stop>
                <stop offset="100%" stop-color="#99462a" stop-opacity="0.0"></stop>
              </linearGradient>
            </defs>

            <!-- 水平刻度网格线 -->
            <g opacity="0.45">
              <line stroke="#dbc1b9" stroke-dasharray="3 3" x1="40" x2="840" y1="20" y2="20"></line>
              <line stroke="#dbc1b9" stroke-dasharray="3 3" x1="40" x2="840" y1="75" y2="75"></line>
              <line stroke="#dbc1b9" stroke-dasharray="3 3" x1="40" x2="840" y1="130" y2="130"></line>
              <line stroke="#dbc1b9" stroke-dasharray="3 3" x1="40" x2="840" y1="185" y2="185"></line>
              <line stroke="#88726c" stroke-width="1" x1="40" x2="840" y1="230" y2="230"></line>
            </g>

            <!-- Y 轴刻度文本 -->
            <text fill="#88726c" font-family="'JetBrains Mono', monospace" font-size="11" text-anchor="end" x="32" y="24">¥35k</text>
            <text fill="#88726c" font-family="'JetBrains Mono', monospace" font-size="11" text-anchor="end" x="32" y="79">¥25k</text>
            <text fill="#88726c" font-family="'JetBrains Mono', monospace" font-size="11" text-anchor="end" x="32" y="134">¥15k</text>
            <text fill="#88726c" font-family="'JetBrains Mono', monospace" font-size="11" text-anchor="end" x="32" y="189">¥5k</text>

            <!-- 10 个月度双柱状图（收入与支出） -->
            <!-- 1月 -->
            <rect fill="url(#barIncomeGrad)" height="170" rx="3" width="16" x="75" y="60"></rect>
            <rect fill="url(#barExpenseGrad)" height="80" rx="3" width="16" x="94" y="150"></rect>
            <!-- 2月 -->
            <rect fill="url(#barIncomeGrad)" height="162" rx="3" width="16" x="155" y="68"></rect>
            <rect fill="url(#barExpenseGrad)" height="92" rx="3" width="16" x="174" y="138"></rect>
            <!-- 3月 -->
            <rect fill="url(#barIncomeGrad)" height="176" rx="3" width="16" x="235" y="54"></rect>
            <rect fill="url(#barExpenseGrad)" height="76" rx="3" width="16" x="254" y="154"></rect>
            <!-- 4月 -->
            <rect fill="url(#barIncomeGrad)" height="172" rx="3" width="16" x="315" y="58"></rect>
            <rect fill="url(#barExpenseGrad)" height="78" rx="3" width="16" x="334" y="152"></rect>
            <!-- 5月 -->
            <rect fill="url(#barIncomeGrad)" height="182" rx="3" width="16" x="395" y="48"></rect>
            <rect fill="url(#barExpenseGrad)" height="86" rx="3" width="16" x="414" y="144"></rect>
            <!-- 6月 -->
            <rect fill="url(#barIncomeGrad)" height="194" rx="3" width="16" x="475" y="36"></rect>
            <rect fill="url(#barExpenseGrad)" height="80" rx="3" width="16" x="494" y="150"></rect>
            <!-- 7月 -->
            <rect fill="url(#barIncomeGrad)" height="170" rx="3" width="16" x="555" y="60"></rect>
            <rect fill="url(#barExpenseGrad)" height="72" rx="3" width="16" x="574" y="158"></rect>
            <!-- 8月 -->
            <rect fill="url(#barIncomeGrad)" height="180" rx="3" width="16" x="635" y="50"></rect>
            <rect fill="url(#barExpenseGrad)" height="74" rx="3" width="16" x="654" y="156"></rect>
            <!-- 9月 -->
            <rect fill="url(#barIncomeGrad)" height="188" rx="3" width="16" x="715" y="42"></rect>
            <rect fill="url(#barExpenseGrad)" height="75" rx="3" width="16" x="734" y="155"></rect>
            <!-- 10月 -->
            <rect fill="url(#barIncomeGrad)" height="204" rx="3" width="16" x="795" y="26"></rect>
            <rect fill="url(#barExpenseGrad)" height="82" rx="3" width="16" x="814" y="148"></rect>

            <!-- 净结余留存平滑面积阴影与折线 -->
            <path d="M 92 128 L 172 144 L 252 118 L 332 122 L 412 120 L 492 104 L 572 122 L 652 114 L 732 106 L 812 96 L 812 230 L 92 230 Z" fill="url(#savingsArea)"></path>
            <polyline fill="none" points="92,128 172,144 252,118 332,122 412,120 492,104 572,122 652,114 732,106 812,96" stroke="#99462a" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></polyline>

            <!-- 折线节点圆点 -->
            <circle cx="92" cy="128" fill="#ffffff" r="3.5" stroke="#99462a" stroke-width="2"></circle>
            <circle cx="172" cy="144" fill="#ffffff" r="3.5" stroke="#99462a" stroke-width="2"></circle>
            <circle cx="252" cy="118" fill="#ffffff" r="3.5" stroke="#99462a" stroke-width="2"></circle>
            <circle cx="332" cy="122" fill="#ffffff" r="3.5" stroke="#99462a" stroke-width="2"></circle>
            <circle cx="412" cy="120" fill="#ffffff" r="3.5" stroke="#99462a" stroke-width="2"></circle>
            <circle cx="492" cy="104" fill="#ffffff" r="3.5" stroke="#99462a" stroke-width="2"></circle>
            <circle cx="572" cy="122" fill="#ffffff" r="3.5" stroke="#99462a" stroke-width="2"></circle>
            <circle cx="652" cy="114" fill="#ffffff" r="3.5" stroke="#99462a" stroke-width="2"></circle>
            <circle cx="732" cy="106" fill="#ffffff" r="3.5" stroke="#99462a" stroke-width="2"></circle>
            <circle cx="812" cy="96" fill="#99462a" r="4.5" stroke="#ffffff" stroke-width="2"></circle>

            <!-- 10月当前结余悬浮标注气泡 -->
            <g transform="translate(760, 58)">
              <rect fill="#1c1c1a" height="26" rx="5" width="94" x="0" y="0"></rect>
              <text fill="#fcf9f6" font-family="'Manrope', sans-serif" font-size="11" font-weight="600" text-anchor="middle" x="47" y="17">结余 ¥20,900</text>
              <polygon fill="#1c1c1a" points="47,30 42,26 52,26"></polygon>
            </g>

            <!-- X 轴月份标签 -->
            <text fill="#55433d" font-family="'Manrope', sans-serif" font-size="12" text-anchor="middle" x="92" y="248">1月</text>
            <text fill="#55433d" font-family="'Manrope', sans-serif" font-size="12" text-anchor="middle" x="172" y="248">2月</text>
            <text fill="#55433d" font-family="'Manrope', sans-serif" font-size="12" text-anchor="middle" x="252" y="248">3月</text>
            <text fill="#55433d" font-family="'Manrope', sans-serif" font-size="12" text-anchor="middle" x="332" y="248">4月</text>
            <text fill="#55433d" font-family="'Manrope', sans-serif" font-size="12" text-anchor="middle" x="412" y="248">5月</text>
            <text fill="#55433d" font-family="'Manrope', sans-serif" font-size="12" text-anchor="middle" x="492" y="248">6月</text>
            <text fill="#55433d" font-family="'Manrope', sans-serif" font-size="12" text-anchor="middle" x="572" y="248">7月</text>
            <text fill="#55433d" font-family="'Manrope', sans-serif" font-size="12" text-anchor="middle" x="652" y="248">8月</text>
            <text fill="#55433d" font-family="'Manrope', sans-serif" font-size="12" text-anchor="middle" x="732" y="248">9月</text>
            <text fill="#1c1c1a" font-family="'Manrope', sans-serif" font-size="12" font-weight="700" text-anchor="middle" x="812" y="248">10月(现)</text>
          </svg>
        </div>
      </div>
    </section>

    <!-- 4. 深度穿透双栏分析：支出构成 vs 成员分工 -->
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      <!-- 左栏 (7列)：家庭多层级支出构成 -->
      <div class="lg:col-span-7 bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4">
        <div class="flex items-center justify-between pb-2 border-b border-surface-container-high/60">
          <div>
            <h3 class="font-headline-sm text-base text-on-surface font-bold">家庭多层级支出构成</h3>
            <p class="text-xs text-on-surface-variant mt-0.5">10月当前统计周期消费层级穿透分析</p>
          </div>
          <span class="text-xs px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-medium">
            共计 8 类子项目
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <!-- 环形圆环图 (Donut) -->
          <div class="sm:col-span-5 flex flex-col items-center justify-center relative py-2">
            <svg class="w-40 h-40 -rotate-90 transform" viewBox="0 0 160 160">
              <circle cx="80" cy="80" fill="transparent" r="60" stroke="#f0edeb" stroke-width="16"></circle>
              <circle cx="80" cy="80" fill="transparent" r="60" stroke="#d97757" stroke-dasharray="129 377" stroke-dashoffset="0" stroke-width="16"></circle>
              <circle cx="80" cy="80" fill="transparent" r="60" stroke="#99462a" stroke-dasharray="85 377" stroke-dashoffset="-129" stroke-width="16"></circle>
              <circle cx="80" cy="80" fill="transparent" r="60" stroke="#41674c" stroke-dasharray="68 377" stroke-dashoffset="-214" stroke-width="16"></circle>
              <circle cx="80" cy="80" fill="transparent" r="60" stroke="#c2edcb" stroke-dasharray="52 377" stroke-dashoffset="-282" stroke-width="16"></circle>
              <circle cx="80" cy="80" fill="transparent" r="60" stroke="#88726c" stroke-dasharray="43 377" stroke-dashoffset="-334" stroke-width="16"></circle>
            </svg>
            <div class="absolute flex flex-col items-center justify-center pointer-events-none text-center">
              <span class="text-xs text-on-surface-variant">当月总支出</span>
              <span class="font-amount-table text-lg text-on-surface font-bold mt-0.5">¥12,640</span>
            </div>
          </div>

          <!-- 各分类明细进度条 -->
          <div class="sm:col-span-7 flex flex-col gap-2.5">
            <div v-for="item in expenseBreakdown" :key="item.name" class="flex flex-col gap-1">
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: item.dotColor }"></span>
                  <span class="font-medium text-on-surface text-xs">{{ item.name }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-amount-table text-xs text-on-surface font-semibold">{{ item.amount }}</span>
                  <span class="text-on-surface-variant text-[11px]">{{ item.percent }}%</span>
                </div>
              </div>
              <div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                <div class="h-full rounded-full" :style="{ width: item.percent + '%', backgroundColor: item.barColor }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右栏 (5列)：家庭成员支出分工与责任 -->
      <div class="lg:col-span-5 bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4">
        <div class="flex items-center justify-between pb-2 border-b border-surface-container-high/60">
          <div>
            <h3 class="font-headline-sm text-base text-on-surface font-bold">家庭成员支出分工</h3>
            <p class="text-xs text-on-surface-variant mt-0.5">协同账本权责分布与共同开支对账</p>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant">diversity_3</span>
        </div>

        <!-- 成员对比条 -->
        <div class="flex flex-col gap-1.5 bg-surface-container-low p-3 rounded-xl">
          <div class="flex items-center justify-between text-xs font-semibold">
            <span class="text-primary">林知栖 · 45.2%</span>
            <span class="text-secondary">陈先生 · 54.8%</span>
          </div>
          <div class="w-full h-3 rounded-full flex overflow-hidden bg-surface-container-highest">
            <div class="h-full bg-primary-container" style="width: 45.2%"></div>
            <div class="h-full bg-secondary" style="width: 54.8%"></div>
          </div>
          <div class="flex items-center justify-between font-amount-table text-xs text-on-surface-variant">
            <span>¥ 5,713</span>
            <span>¥ 6,927</span>
          </div>
        </div>

        <!-- 成员经办卡片 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <!-- 林知栖 -->
          <div class="p-3 rounded-xl bg-surface-container-low flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-full bg-[#f6ddd4] text-primary flex items-center justify-center font-bold text-xs shrink-0">
                知
              </div>
              <div class="flex flex-col">
                <span class="text-xs text-on-surface font-semibold leading-tight">林知栖</span>
                <span class="text-[11px] text-on-surface-variant">主导日常频次类开支</span>
              </div>
            </div>
            <div class="flex flex-col gap-1 text-xs text-on-surface-variant">
              <div class="flex justify-between"><span>生鲜食材:</span><span class="text-on-surface font-medium">78% 经办</span></div>
              <div class="flex justify-between"><span>教育幼托:</span><span class="text-on-surface font-medium">85% 经办</span></div>
              <div class="flex justify-between"><span>日用品采购:</span><span class="text-on-surface font-medium">62% 经办</span></div>
            </div>
          </div>

          <!-- 陈先生 -->
          <div class="p-3 rounded-xl bg-surface-container-low flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-full bg-[#c2edcb] text-secondary flex items-center justify-center font-bold text-xs shrink-0">
                陈
              </div>
              <div class="flex flex-col">
                <span class="text-xs text-on-surface font-semibold leading-tight">陈先生</span>
                <span class="text-[11px] text-on-surface-variant">主导周期大宗类开支</span>
              </div>
            </div>
            <div class="flex flex-col gap-1 text-xs text-on-surface-variant">
              <div class="flex justify-between"><span>住房房贷/物业:</span><span class="text-on-surface font-medium">100% 经办</span></div>
              <div class="flex justify-between"><span>车辆维护/保险:</span><span class="text-on-surface font-medium">92% 经办</span></div>
              <div class="flex justify-between"><span>大型数码家电:</span><span class="text-on-surface font-medium">70% 经办</span></div>
            </div>
          </div>
        </div>

        <!-- 结算提示 -->
        <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-high/60 text-on-surface-variant text-xs">
          <span class="material-symbols-outlined text-sm text-secondary">handshake</span>
          <span>账本结算提示：陈先生已向家庭共享储蓄金库预存本月结余</span>
        </div>
      </div>
    </section>

    <!-- 5. 知栖 AI 智能家庭财务洞察与节流规划 -->
    <section class="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 relative overflow-hidden mb-4">
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 relative z-10">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm">
            <span class="material-symbols-outlined text-lg">psychology</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-headline-sm text-base text-on-surface font-bold">知栖 AI 智能家庭财务洞察与节流规划</h3>
              <span class="px-2 py-0.5 rounded-full text-[11px] bg-primary-fixed text-on-primary-fixed-variant font-bold">深度学习模型分析</span>
            </div>
            <p class="text-xs text-on-surface-variant mt-0.5">根据过去 300 天真实流水模型，提炼出的 3 条具备实操性的家庭优化策略</p>
          </div>
        </div>
        <button class="text-xs text-primary hover:text-on-primary-fixed-variant transition-colors flex items-center gap-1 cursor-pointer" type="button" @click="refreshAdvice">
          <span>更新诊断</span>
          <span class="material-symbols-outlined text-sm">refresh</span>
        </button>
      </div>

      <!-- 3 条策略卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        <!-- 策略 1 -->
        <div class="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between gap-3">
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center gap-1.5 text-primary">
              <span class="material-symbols-outlined text-base">sunny</span>
              <span class="text-xs font-semibold">季节性消费波动释义</span>
            </div>
            <p class="text-xs text-on-surface leading-relaxed">
              10月份休闲娱乐与外食支出环比上涨 16.4%，略高于三季度月均线。模型判断主要受国庆黄金周家庭短途出游及集中聚餐影响，属合理阶段性释放，无需刻意压缩。
            </p>
          </div>
          <div class="flex items-center justify-between pt-1 text-xs text-on-surface-variant">
            <span>置信度 96%</span>
            <span class="text-secondary font-medium">符合生活预期</span>
          </div>
        </div>

        <!-- 策略 2 -->
        <div class="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between gap-3">
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center gap-1.5 text-tertiary">
              <span class="material-symbols-outlined text-base">subscriptions</span>
              <span class="text-xs font-semibold">固定支出流失预警</span>
            </div>
            <p class="text-xs text-on-surface leading-relaxed">
              检测到本年度各类自动续费及流媒体订阅累计支出达 <span class="font-amount-table font-semibold text-tertiary">¥1,420</span>。其中发现“云储存扩容”与“健身课程”已超 60 天无任何同步互动，建议审视解绑以止损。
            </p>
          </div>
          <div class="flex items-center justify-between pt-1 text-xs">
            <span class="text-on-surface-variant">预计每年省 ¥520</span>
            <router-link to="/bills" class="text-primary font-semibold hover:underline">一键查阅账目</router-link>
          </div>
        </div>

        <!-- 策略 3 -->
        <div class="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between gap-3">
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center gap-1.5 text-secondary">
              <span class="material-symbols-outlined text-base">flag_circle</span>
              <span class="text-xs font-semibold">家庭关键目标推进</span>
            </div>
            <p class="text-xs text-on-surface leading-relaxed">
              按照当前家庭综合储蓄速率（月均 ¥1.85万），年度“海岛游与教育储备基金”目标（15万元）推进概率达 91.2%，将于 12 月中旬提前宣告达成。
            </p>
          </div>
          <div class="flex items-center justify-between pt-1 text-xs text-on-surface-variant">
            <span>当前进度: 91.2%</span>
            <span class="text-secondary font-semibold">提前达标概率高</span>
          </div>
        </div>
      </div>

      <!-- 底部资金安全评级条 -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 px-4 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md relative z-10 shadow-sm border border-surface-container-high/60">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-secondary text-base">verified_user</span>
          <span class="text-xs text-on-surface">家庭资金安全评级：<b>极稳健 (AAA)</b> · 无不良透支风险</span>
        </div>
        <div class="flex items-center gap-2">
          <button class="px-3 py-1 rounded-lg bg-surface-container-high text-on-surface text-xs hover:bg-surface-container transition-colors font-medium cursor-pointer" type="button">
            调整本季目标
          </button>
          <button class="px-3 py-1 rounded-lg bg-primary-container text-on-primary text-xs font-semibold hover:bg-primary transition-colors cursor-pointer" type="button">
            配置自动定投
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const timeTabs = [
  { id: 'trend', label: '按月度走势' },
  { id: 'quarter', label: '按季度' },
  { id: 'year', label: '按年度全局' }
]
const activeTab = ref('trend')

const memberFilters = [
  { id: 'all', label: '全部家庭' },
  { id: 'lin', label: '林知栖 (日常)' },
  { id: 'chen', label: '陈先生 (大宗)' }
]
const activeMember = ref('all')

const isExporting = ref(false)
const exportText = ref('生成家庭财务体检报告 PDF')
const exportIcon = ref('health_and_safety')

const triggerExport = () => {
  if (isExporting.value) return
  isExporting.value = true
  exportIcon.value = 'progress_activity'
  exportText.value = '正在汇编体检报告...'

  setTimeout(() => {
    exportIcon.value = 'check_circle'
    exportText.value = '已生成下载！'
    setTimeout(() => {
      exportIcon.value = 'health_and_safety'
      exportText.value = '生成家庭财务体检报告 PDF'
      isExporting.value = false
    }, 2000)
  }, 1200)
}

const refreshAdvice = () => {
  alert('知栖 AI 模型已完成新一轮诊断刷新，财务状况持续优良！')
}

// 支出穿透细项数据
const expenseBreakdown = [
  {
    name: '餐饮生鲜与外食',
    amount: '¥4,320',
    percent: 34.2,
    dotColor: '#d97757',
    barColor: '#d97757'
  },
  {
    name: '住居水电与物业维护',
    amount: '¥2,844',
    percent: 22.5,
    dotColor: '#99462a',
    barColor: '#99462a'
  },
  {
    name: '儿童成长与家庭教育',
    amount: '¥2,288',
    percent: 18.1,
    dotColor: '#41674c',
    barColor: '#41674c'
  },
  {
    name: '假日出行与休闲体验',
    amount: '¥1,744',
    percent: 13.8,
    dotColor: '#a7d1b0',
    barColor: '#a7d1b0'
  },
  {
    name: '医疗健康与订阅其他',
    amount: '¥1,444',
    percent: 11.4,
    dotColor: '#88726c',
    barColor: '#88726c'
  }
]
</script>
