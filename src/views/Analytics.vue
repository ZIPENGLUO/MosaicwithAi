<template>
  <div class="w-full max-w-[1560px] mx-auto px-4 sm:px-6 py-5 flex flex-col gap-5">
    <!-- 1. 顶部工具栏与协同控制 (Header Toolbar & Filters) -->
    <section class="flex flex-wrap items-center justify-between gap-3 bg-surface-container-lowest px-5 py-3 rounded-xl shadow-sm border border-outline-variant/20">
      <div class="flex flex-wrap items-center gap-3">
        <!-- 走势周期维度切换 -->
        <div class="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
          <button
            v-for="tab in timeTabs"
            :key="tab.id"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
            :class="activeTab === tab.id
              ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'"
            type="button"
            @click="switchTimeTab(tab.id)"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- 成员筛选 (自适应：仅在账本有多位成员时显示，单人账本自然隐藏) -->
        <div v-if="ledgerStore.hasMultipleMembers" class="h-4 w-px bg-outline-variant/60 hidden sm:block"></div>
        <div v-if="ledgerStore.hasMultipleMembers" class="flex items-center gap-1.5 text-xs">
          <span class="text-on-surface-variant text-label-sm font-medium">家庭成员:</span>
          <button
            class="px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1"
            :class="activeMemberId === 'all'
              ? 'bg-primary-fixed text-on-primary-fixed-variant font-semibold'
              : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'"
            type="button"
            @click="switchMember('all')"
          >
            <span v-if="activeMemberId === 'all'" class="w-1.5 h-1.5 rounded-full bg-primary"></span>
            全部
          </button>
          <button
            v-for="m in ledgerStore.currentMembers"
            :key="m.id"
            class="px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1"
            :class="activeMemberId === m.id
              ? 'bg-primary-fixed text-on-primary-fixed-variant font-semibold'
              : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'"
            type="button"
            @click="switchMember(m.id)"
          >
            <span v-if="activeMemberId === m.id" class="w-1.5 h-1.5 rounded-full bg-primary"></span>
            {{ m.name }}
          </button>
        </div>
      </div>

      <!-- 右侧统计周期与PDF报表导出 -->
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low text-on-surface text-xs font-medium">
          <span class="material-symbols-outlined text-sm text-on-surface-variant">date_range</span>
          <span>{{ currentDateRangeText }}</span>
          <span class="material-symbols-outlined text-xs text-on-surface-variant">expand_more</span>
        </div>

        <button
          id="exportBtn"
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

    <!-- 2. 核心 KPI 指标卡片 (标准专业财务词条，自适应所有账本模式，0 if-else) -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- KPI 1: 月均总支出 -->
      <div class="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border border-outline-variant/20">
        <div class="flex items-center justify-between mb-1">
          <span class="text-label-md text-xs text-on-surface-variant">{{ ledgerStore.hasMultipleMembers ? '家庭月均支出' : '个人月均支出' }}</span>
          <div class="w-7 h-7 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary">
            <span class="material-symbols-outlined text-sm">trending_down</span>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex items-baseline gap-1">
            <span class="font-headline-sm text-sm text-on-surface-variant">¥</span>
            <span class="font-amount-display text-2xl font-bold text-on-surface tracking-tight">{{ currentKpi.avgExpense }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] bg-secondary-container text-secondary font-semibold">
              {{ currentKpi.expenseChange }}
            </span>
            <span class="text-on-surface-variant text-[11px]">{{ currentKpi.expenseStatus }}</span>
          </div>
        </div>
      </div>

      <!-- KPI 2: 实际储蓄率 -->
      <div class="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border border-outline-variant/20">
        <div class="flex items-center justify-between mb-1">
          <span class="text-label-md text-xs text-on-surface-variant">{{ ledgerStore.hasMultipleMembers ? '家庭实际储蓄率' : '个人实际储蓄率' }}</span>
          <div class="w-7 h-7 rounded-full bg-primary-container/40 flex items-center justify-center text-primary">
            <span class="material-symbols-outlined text-sm">savings</span>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex items-baseline gap-1">
            <span class="font-amount-display text-2xl font-bold text-on-surface tracking-tight">{{ currentKpi.savingsRate }}</span>
            <span class="text-headline-sm text-primary font-semibold">%</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] bg-secondary-fixed text-on-secondary-fixed font-semibold">
              {{ currentKpi.savingsGrade }}
            </span>
            <span class="text-on-surface-variant text-[11px]">{{ currentKpi.savingsRemark }}</span>
          </div>
        </div>
      </div>

      <!-- KPI 3: 最大单项支出分类 -->
      <div class="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border border-outline-variant/20">
        <div class="flex items-center justify-between mb-1">
          <span class="text-label-md text-xs text-on-surface-variant">最大单项支出分类</span>
          <div class="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
            <span class="material-symbols-outlined text-sm">{{ currentKpi.topCategoryIcon }}</span>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex items-baseline justify-between">
            <span class="text-base font-semibold text-on-surface truncate">{{ currentKpi.topCategoryName }}</span>
            <span class="font-amount-table text-xs text-on-primary-container bg-primary-fixed px-2 py-0.5 rounded-full font-semibold">{{ currentKpi.topCategoryPercent }}%</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-on-surface-variant text-[11px]">月均 {{ currentKpi.topCategoryAmount }}</span>
            <span class="text-[11px] text-secondary font-medium">{{ currentKpi.topCategoryRemark }}</span>
          </div>
        </div>
      </div>

      <!-- KPI 4: 预算执行健康指数 -->
      <div class="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border border-outline-variant/20">
        <div class="flex items-center justify-between mb-1">
          <span class="text-label-md text-xs text-on-surface-variant">预算执行健康指数</span>
          <div class="w-7 h-7 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary">
            <span class="material-symbols-outlined text-sm">verified</span>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex items-baseline gap-1">
            <span class="font-amount-display text-2xl font-bold text-secondary tracking-tight">{{ currentKpi.healthScore }}</span>
            <span class="text-headline-sm text-secondary font-semibold">%</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-16 bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
              <div class="bg-secondary h-full rounded-full transition-all duration-500" :style="{ width: currentKpi.healthScore + '%' }"></div>
            </div>
            <span class="text-on-surface-variant text-[11px]">{{ currentKpi.healthRemark }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. 收支走势与储蓄复合可视化 (ECharts 核心图表) -->
    <section class="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-4 border border-outline-variant/20">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-surface-container-high/60">
        <div>
          <h2 class="font-headline-sm text-base text-on-surface font-bold tracking-tight">
            {{ chartTitle }}
          </h2>
          <p class="text-xs text-on-surface-variant mt-0.5">
            柱状反映周期总流入与总支出，折线反映各期实际留存结余
          </p>
        </div>

        <!-- 可交互图例 (支持点击切换对应系列) -->
        <div class="flex items-center gap-4 flex-wrap text-xs select-none">
          <div
            class="flex items-center gap-1.5 cursor-pointer transition-opacity"
            :class="{ 'opacity-40': !showIncome }"
            @click="toggleSeries('收入')"
          >
            <span class="w-3 h-3 rounded-sm bg-[#41674c]"></span>
            <span class="text-on-surface-variant">总流入 (收入)</span>
          </div>
          <div
            class="flex items-center gap-1.5 cursor-pointer transition-opacity"
            :class="{ 'opacity-40': !showExpense }"
            @click="toggleSeries('支出')"
          >
            <span class="w-3 h-3 rounded-sm bg-[#d97757]"></span>
            <span class="text-on-surface-variant">总支出</span>
          </div>
          <div
            class="flex items-center gap-1.5 cursor-pointer transition-opacity"
            :class="{ 'opacity-40': !showSavings }"
            @click="toggleSeries('净结余')"
          >
            <span class="w-3 h-0.5 bg-[#99462a]"></span>
            <span class="w-2 h-2 rounded-full bg-[#99462a] -ml-2.5"></span>
            <span class="text-on-surface-variant">当期留存结余 (储蓄)</span>
          </div>
        </div>
      </div>

      <!-- ECharts 复合走势图表容器 -->
      <div class="w-full relative overflow-x-auto">
        <div
          ref="trendChartRef"
          style="width: 100%; min-width: 760px; height: 320px; min-height: 320px;"
        ></div>
      </div>
    </section>

    <!-- 4. 深度穿透双栏分析：支出构成 (ECharts 环形图) vs 家庭分工/个人画像 (动态判断自适应，严格等高535px) -->
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      <!-- 左栏 (7列)：多层级支出分类构成 (ECharts Donut Ring) -->
      <div class="lg:col-span-7 bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between gap-4 border border-outline-variant/20 h-full">
        <div class="flex items-center justify-between pb-2 border-b border-surface-container-high/60">
          <div>
            <h3 class="font-headline-sm text-base text-on-surface font-bold">多层级支出分类构成</h3>
            <p class="text-xs text-on-surface-variant mt-0.5">{{ currentPeriodText }}消费层级穿透分析</p>
          </div>
          <span class="text-xs px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-medium">
            共计 {{ currentExpenseBreakdown.length }} 类子项目
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <!-- ECharts 环形圆环图与中心信息指示 -->
          <div class="sm:col-span-5 flex flex-col items-center justify-center relative py-2">
            <div
              ref="pieChartRef"
              style="width: 176px; height: 176px; min-width: 176px; min-height: 176px;"
            ></div>
            <!-- 环中心动态浮层 -->
            <div class="absolute flex flex-col items-center justify-center pointer-events-none text-center select-none" style="width: 100px;">
              <span class="text-[11px] text-on-surface-variant truncate max-w-[90px]">{{ donutCenterInfo.label }}</span>
              <span class="font-amount-table text-base sm:text-lg text-on-surface font-bold mt-0.5">{{ donutCenterInfo.value }}</span>
              <span v-if="donutCenterInfo.sub" class="text-[10px] text-primary font-semibold">{{ donutCenterInfo.sub }}</span>
            </div>
          </div>

          <!-- 各分类明细进度条与交互列表 -->
          <div class="sm:col-span-7 flex flex-col gap-2.5">
            <div
              v-for="item in currentExpenseBreakdown"
              :key="item.name"
              class="flex flex-col gap-1 p-1 rounded-lg transition-colors cursor-pointer"
              :class="{ 'bg-surface-container-low': activeCategoryName === item.name }"
              @mouseenter="onCategoryHover(item)"
              @mouseleave="onCategoryLeave"
            >
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: item.color }"></span>
                  <span class="font-medium text-on-surface text-xs truncate max-w-[140px]">{{ item.name }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-amount-table text-xs text-on-surface font-semibold">¥{{ item.amount.toLocaleString() }}</span>
                  <span class="text-on-surface-variant text-[11px]">{{ item.percent }}%</span>
                </div>
              </div>
              <div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :style="{ width: item.percent + '%', backgroundColor: item.color }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右栏 (5列)：家庭成员支出分工 (多人家庭账本专享，严格等高 535px) -->
      <div v-if="ledgerStore.hasMultipleMembers" class="lg:col-span-5 bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-3.5 border border-outline-variant/20 justify-between h-full">
        <!-- 标题与家庭成员数标签 -->
        <div class="flex items-center justify-between pb-2 border-b border-surface-container-high/60">
          <div>
            <h3 class="font-headline-sm text-base text-on-surface font-bold">家庭成员支出分工</h3>
            <p class="text-xs text-on-surface-variant mt-0.5">家庭全员责任分工与开支对账</p>
          </div>
          <span class="text-xs px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-medium flex items-center gap-1">
            <span class="material-symbols-outlined text-xs text-secondary">diversity_3</span>
            <span>全家共 {{ currentDivisionList.length }} 位成员</span>
          </span>
        </div>

        <!-- 1. 全景堆叠比例条 (根据成员支出占比计算宽度) -->
        <div class="flex flex-col gap-1.5 bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/20">
          <div class="w-full h-2.5 rounded-full flex overflow-hidden bg-surface-container-highest">
            <div
              v-for="m in currentDivisionList"
              :key="m.id"
              class="h-full transition-all duration-300 cursor-pointer relative group"
              :style="{ width: m.percent + '%', backgroundColor: m.color }"
              :class="{ 'opacity-100 ring-2 ring-white z-10': activeDivisionMemberId === m.id, 'opacity-85 hover:opacity-100': activeDivisionMemberId !== m.id }"
              :title="`${m.name}: ¥${m.amount.toLocaleString()} (${m.percent}%)`"
              @click="activeDivisionMemberId = m.id"
            ></div>
          </div>
          <!-- 堆叠条下方比例微标 -->
          <div class="flex items-center justify-between text-[11px] text-on-surface-variant pt-0.5 px-0.5 flex-wrap gap-x-2">
            <div
              v-for="m in currentDivisionList"
              :key="m.id"
              class="flex items-center gap-1 cursor-pointer transition-opacity"
              :class="activeDivisionMemberId === m.id ? 'opacity-100 font-semibold text-on-surface' : 'opacity-75 hover:opacity-100'"
              @click="activeDivisionMemberId = m.id"
            >
              <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: m.color }"></span>
              <span>{{ m.name }}</span>
              <span class="font-amount-table text-[10px]">¥{{ m.amount.toLocaleString() }} ({{ m.percent }}%)</span>
            </div>
          </div>
        </div>

        <!-- 2. 家庭成员头像芯片切换条 -->
        <div class="flex items-center gap-2 overflow-x-auto py-0.5">
          <button
            v-for="m in currentDivisionList"
            :key="m.id"
            type="button"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer shrink-0 border"
            :class="activeDivisionMemberId === m.id
              ? 'bg-primary/10 border-primary text-primary font-bold shadow-sm'
              : 'bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:bg-surface-container'"
            @click="activeDivisionMemberId = m.id"
          >
            <img :src="m.avatar" :alt="m.name" class="w-5 h-5 rounded-full object-cover" />
            <span>{{ m.name }}</span>
            <span class="text-[10px] font-amount-table opacity-80">{{ m.percent }}%</span>
          </button>
        </div>

        <!-- 3. 当前聚焦家庭成员深度卡片 -->
        <div class="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-2.5 border border-outline-variant/20 transition-all">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="relative">
                <img
                  :src="focusedDivisionMember.avatar"
                  :alt="focusedDivisionMember.name"
                  class="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                />
                <span
                  class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-white"
                  :style="{ backgroundColor: focusedDivisionMember.color }"
                ></span>
              </div>
              <div class="flex flex-col">
                <div class="flex items-center gap-1.5">
                  <span class="text-sm text-on-surface font-bold">{{ focusedDivisionMember.name }}</span>
                  <span class="px-1.5 py-0.2 rounded bg-primary/10 text-primary text-[10px] font-medium">
                    {{ focusedDivisionMember.role }}
                  </span>
                </div>
                <div class="flex items-center gap-1 text-[11px] text-on-surface-variant mt-0.5">
                  <span class="material-symbols-outlined text-xs text-primary">{{ focusedDivisionMember.dutyIcon }}</span>
                  <span>{{ focusedDivisionMember.dutyTitle }}</span>
                </div>
              </div>
            </div>

            <!-- 金额与占比 -->
            <div class="flex flex-col items-end">
              <span class="font-amount-table text-base font-bold text-on-surface">¥{{ focusedDivisionMember.amount.toLocaleString() }}</span>
              <span class="text-[10px] text-secondary font-semibold">占家庭总支出 {{ focusedDivisionMember.percent }}%</span>
            </div>
          </div>

          <!-- 该成员核心负责领域进度条 -->
          <div class="grid grid-cols-3 gap-2 pt-1 border-t border-outline-variant/20">
            <div v-for="item in focusedDivisionMember.items" :key="item.label" class="flex flex-col gap-1">
              <div class="flex items-center justify-between text-[11px]">
                <span class="text-on-surface-variant truncate max-w-[65px]">{{ item.label }}</span>
                <span class="font-amount-table font-semibold text-on-surface text-[10px]">{{ item.percent }}%</span>
              </div>
              <div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :style="{ width: item.percent + '%', backgroundColor: focusedDivisionMember.color }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. 家庭结算对账状态条 -->
        <div class="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-high/50 text-on-surface-variant text-xs border border-outline-variant/20">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm text-secondary">handshake</span>
            <span class="text-[11px]">家庭对账：<b>{{ focusedDivisionMember.name }}</b> 本期出资分担已核准无误</span>
          </div>
          <button
            v-if="currentDivisionList.length > 1"
            type="button"
            class="text-[11px] text-primary hover:underline font-semibold cursor-pointer shrink-0 ml-2"
            @click="nextDivisionMember"
          >
            看下一位 →
          </button>
        </div>
      </div>

      <!-- 右栏 (5列)：个人消费习惯与画像 (单人个人账本专享，严格等高 535px) -->
      <div v-else class="lg:col-span-5 bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-3.5 border border-outline-variant/20 justify-between h-full">
        <!-- 标题与个人画像标签 -->
        <div class="flex items-center justify-between pb-2 border-b border-surface-container-high/60">
          <div>
            <h3 class="font-headline-sm text-base text-on-surface font-bold">个人消费习惯与画像</h3>
            <p class="text-xs text-on-surface-variant mt-0.5">刚需必要支出 vs 享受改善消费结构</p>
          </div>
          <span class="text-xs px-2.5 py-1 rounded-full bg-secondary/10 text-secondary font-medium flex items-center gap-1">
            <span class="material-symbols-outlined text-xs text-secondary">insights</span>
            <span>个人收支画像</span>
          </span>
        </div>

        <!-- 1. 刚需 vs 改善型支出对比进度条 -->
        <div class="flex flex-col gap-1.5 bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/20">
          <div class="flex items-center justify-between text-xs mb-0.5">
            <span class="font-medium text-on-surface">支出属性结构</span>
            <span class="text-[11px] text-on-surface-variant">刚需 64% · 改善 36%</span>
          </div>
          <div class="w-full h-2.5 rounded-full flex overflow-hidden bg-surface-container-highest">
            <div
              class="h-full bg-primary transition-all duration-300 cursor-pointer"
              style="width: 64%"
              title="刚需生存开支: ¥7,987 (64%)"
            ></div>
            <div
              class="h-full bg-secondary transition-all duration-300 cursor-pointer"
              style="width: 36%"
              title="品质改善消费: ¥4,493 (36%)"
            ></div>
          </div>
          <div class="flex items-center justify-between text-[11px] text-on-surface-variant pt-0.5">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-primary"></span>
              <span>刚需生存开支</span>
              <span class="font-amount-table font-semibold text-on-surface">¥7,987 (64%)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-secondary"></span>
              <span>品质改善消费</span>
              <span class="font-amount-table font-semibold text-on-surface">¥4,493 (36%)</span>
            </div>
          </div>
        </div>

        <!-- 2. 个人维度芯片切换条 -->
        <div class="flex items-center gap-2 overflow-x-auto py-0.5">
          <button
            v-for="dim in personalDimensionList"
            :key="dim.id"
            type="button"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer shrink-0 border"
            :class="activePersonalDimensionId === dim.id
              ? 'bg-primary/10 border-primary text-primary font-bold shadow-sm'
              : 'bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:bg-surface-container'"
            @click="activePersonalDimensionId = dim.id"
          >
            <span class="material-symbols-outlined text-sm">{{ dim.icon }}</span>
            <span>{{ dim.name }}</span>
            <span class="text-[10px] font-amount-table opacity-80">{{ dim.percent }}%</span>
          </button>
        </div>

        <!-- 3. 当前聚焦维度画像卡片 -->
        <div class="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-2.5 border border-outline-variant/20 transition-all">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm shrink-0" :style="{ color: focusedPersonalDimension.color }">
                <span class="material-symbols-outlined text-xl">{{ focusedPersonalDimension.icon }}</span>
              </div>
              <div class="flex flex-col">
                <div class="flex items-center gap-1.5">
                  <span class="text-sm text-on-surface font-bold">{{ focusedPersonalDimension.name }}</span>
                  <span class="px-1.5 py-0.2 rounded bg-primary/10 text-primary text-[10px] font-medium">
                    {{ focusedPersonalDimension.tag }}
                  </span>
                </div>
                <div class="flex items-center gap-1 text-[11px] text-on-surface-variant mt-0.5">
                  <span>{{ focusedPersonalDimension.tip }}</span>
                </div>
              </div>
            </div>

            <!-- 金额与占比 -->
            <div class="flex flex-col items-end">
              <span class="font-amount-table text-base font-bold text-on-surface">¥{{ focusedPersonalDimension.amount.toLocaleString() }}</span>
              <span class="text-[10px] text-secondary font-semibold">占个人总支出 {{ focusedPersonalDimension.percent }}%</span>
            </div>
          </div>

          <!-- 细分去向分布 -->
          <div class="grid grid-cols-3 gap-2 pt-1 border-t border-outline-variant/20">
            <div v-for="item in focusedPersonalDimension.items" :key="item.label" class="flex flex-col gap-1">
              <div class="flex items-center justify-between text-[11px]">
                <span class="text-on-surface-variant truncate max-w-[65px]">{{ item.label }}</span>
                <span class="font-amount-table font-semibold text-on-surface text-[10px]">{{ item.percent }}%</span>
              </div>
              <div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :style="{ width: item.percent + '%', backgroundColor: focusedPersonalDimension.color }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. 底部 AI 消费习惯诊断状态条 -->
        <div class="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-high/50 text-on-surface-variant text-xs border border-outline-variant/20">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm text-primary">psychology</span>
            <span class="text-[11px]">{{ focusedPersonalDimension.aiDiagnostic }}</span>
          </div>
          <span class="text-[10px] text-primary font-semibold">健康指数 92</span>
        </div>
      </div>
    </section>

    <!-- 5. 知栖 AI 财务健康与节流规划 -->
    <section class="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 relative overflow-hidden mb-4 border border-outline-variant/20">
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 relative z-10">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm shrink-0">
            <span class="material-symbols-outlined text-lg">psychology</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-headline-sm text-base text-on-surface font-bold">知栖 AI 财务健康与节流规划</h3>
              <span class="px-2 py-0.5 rounded-full text-[11px] bg-primary-fixed text-on-primary-fixed-variant font-bold">深度学习模型分析</span>
            </div>
            <p class="text-xs text-on-surface-variant mt-0.5">根据流水模型与消费行为，提炼出的 3 条具备实操性的财务优化策略</p>
          </div>
        </div>
        <button
          class="text-xs text-primary hover:text-on-primary-fixed-variant transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
          :disabled="isRefreshingAdvice"
          type="button"
          @click="refreshAdvice"
        >
          <span>{{ isRefreshingAdvice ? '模型重算中...' : '更新诊断' }}</span>
          <span class="material-symbols-outlined text-sm" :class="{ 'animate-spin': isRefreshingAdvice }">refresh</span>
        </button>
      </div>

      <!-- 3 条策略卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        <!-- 策略 1 -->
        <div class="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between gap-3 border border-outline-variant/20">
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center gap-1.5 text-primary">
              <span class="material-symbols-outlined text-base">sunny</span>
              <span class="text-xs font-semibold">季节性消费波动释义</span>
            </div>
            <p class="text-xs text-on-surface leading-relaxed">
              10月份休闲娱乐与外食餐饮支出环比上涨 16.4%，略高于三季度月均线。模型判断主要受黄金周长假出游及集中聚餐影响，属合理阶段性释放，无需刻意压缩。
            </p>
          </div>
          <div class="flex items-center justify-between pt-1 text-xs text-on-surface-variant">
            <span>置信度 96%</span>
            <span class="text-secondary font-medium">符合生活预期</span>
          </div>
        </div>

        <!-- 策略 2 -->
        <div class="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between gap-3 border border-outline-variant/20">
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center gap-1.5 text-tertiary">
              <span class="material-symbols-outlined text-base">subscriptions</span>
              <span class="text-xs font-semibold">固定支出流失预警</span>
            </div>
            <p class="text-xs text-on-surface leading-relaxed">
              检测到本年度各类自动续费及流媒体订阅累计支出达 <span class="font-amount-table font-semibold text-tertiary">¥1,420</span>。其中发现“云储存扩容”已超 60 天无任何增量互动，建议审视解绑以止损。
            </p>
          </div>
          <div class="flex items-center justify-between pt-1 text-xs">
            <span class="text-on-surface-variant">预计每年省 ¥520</span>
            <router-link to="/bills" class="text-primary font-semibold hover:underline">一键查阅账目</router-link>
          </div>
        </div>

        <!-- 策略 3 -->
        <div class="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col justify-between gap-3 border border-outline-variant/20">
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center gap-1.5 text-secondary">
              <span class="material-symbols-outlined text-base">flag_circle</span>
              <span class="text-xs font-semibold">关键财务目标推进</span>
            </div>
            <p class="text-xs text-on-surface leading-relaxed">
              按照当前综合储蓄速率（月均结余 ¥1.85万），年度“海岛游专项储备基金”目标推进概率达 91.2%，将于 12 月中旬提前宣告达成。
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
          <span class="text-xs text-on-surface">资金流动性与安全评级：<b>极稳健 (AAA)</b> · 无不良透支风险</span>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="px-3 py-1 rounded-lg bg-surface-container-high text-on-surface text-xs hover:bg-surface-container transition-colors font-medium cursor-pointer"
            type="button"
            @click="openModal('adjustGoal')"
          >
            调整本季目标
          </button>
          <button
            class="px-3 py-1 rounded-lg bg-primary-container text-on-primary text-xs font-semibold hover:bg-primary transition-colors cursor-pointer shadow-sm"
            type="button"
            @click="openModal('autoInvest')"
          >
            配置自动定投
          </button>
        </div>
      </div>
    </section>

    <!-- 弹窗提示反馈 (Modal Dialog) -->
    <div
      v-if="modalState.visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div class="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-xl border border-outline-variant/30 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-primary font-bold">
            <span class="material-symbols-outlined">{{ modalState.icon }}</span>
            <span class="text-base">{{ modalState.title }}</span>
          </div>
          <button class="text-on-surface-variant hover:text-on-surface cursor-pointer" @click="modalState.visible = false">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <p class="text-xs text-on-surface-variant leading-relaxed">
          {{ modalState.content }}
        </p>
        <div class="flex items-center justify-end gap-2 pt-2">
          <button
            class="px-3.5 py-1.5 rounded-xl bg-surface-container-high text-on-surface text-xs font-medium hover:bg-surface-container cursor-pointer"
            @click="modalState.visible = false"
          >
            关闭
          </button>
          <button
            class="px-3.5 py-1.5 rounded-xl bg-primary-container text-on-primary text-xs font-semibold hover:bg-primary cursor-pointer shadow-sm"
            @click="handleModalConfirm"
          >
            确认执行
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { useLedgerStore } from '../stores/ledger'

const ledgerStore = useLedgerStore()

// --- 1. 维度与筛选状态 ---
const timeTabs = [
  { id: 'trend' as const, label: '按月度走势' },
  { id: 'quarter' as const, label: '按季度' },
  { id: 'year' as const, label: '按年度全局' }
]
const activeTab = ref<'trend' | 'quarter' | 'year'>('trend')

// 成员筛选：默认全部
const activeMemberId = ref('all')

const currentDateRangeText = computed(() => {
  if (activeTab.value === 'trend') return '2024年 1月 - 10月'
  if (activeTab.value === 'quarter') return '2024年 Q1 - Q4'
  return '2022年 - 2024年'
})

const currentPeriodText = computed(() => {
  if (activeTab.value === 'trend') return '10月当前统计周期'
  if (activeTab.value === 'quarter') return '2024三季度累计'
  return '2024年度至今'
})

const chartTitle = computed(() => {
  const member = ledgerStore.currentMembers.find(m => m.id === activeMemberId.value)
  const memberSuffix = (ledgerStore.hasMultipleMembers && member) ? ` (${member.name}支出)` : ''
  if (activeTab.value === 'trend') return `2024年度收支沉淀与储蓄走势${memberSuffix}`
  if (activeTab.value === 'quarter') return `2024年各季度收支与储蓄走势${memberSuffix}`
  return `近三年全局年度收支与储蓄沉淀${memberSuffix}`
})

// --- 2. 导出 PDF 交互 ---
const isExporting = ref(false)
const exportText = ref('导出财务体检报告 PDF')
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
      exportText.value = '导出财务体检报告 PDF'
      isExporting.value = false
    }, 2000)
  }, 1200)
}

// --- 3. 核心 KPI 响应式数据字典 ---
interface KpiStats {
  avgExpense: string
  expenseChange: string
  expenseStatus: string
  savingsRate: string
  savingsGrade: string
  savingsRemark: string
  topCategoryName: string
  topCategoryPercent: number
  topCategoryAmount: string
  topCategoryRemark: string
  topCategoryIcon: string
  healthScore: number
  healthRemark: string
}

const kpiDictionary: Record<'all' | 'lin' | 'chen', KpiStats> = {
  all: {
    avgExpense: '11,850',
    expenseChange: '↓ 4.3% 环比优于上季',
    expenseStatus: '均态维稳',
    savingsRate: '58.6',
    savingsGrade: '极优级',
    savingsRemark: '安全边界宽裕 (月存 ¥20.9k)',
    topCategoryName: '餐饮与生鲜食品',
    topCategoryPercent: 34.2,
    topCategoryAmount: '¥4,052',
    topCategoryRemark: '主要为有机食材采购',
    topCategoryIcon: 'restaurant',
    healthScore: 91.5,
    healthRemark: '未现超支预警'
  },
  lin: {
    avgExpense: '5,355',
    expenseChange: '↓ 2.1% 日常支出精细',
    expenseStatus: '生活平稳',
    savingsRate: '63.2',
    savingsGrade: '优秀级',
    savingsRemark: '日常预算结余充分 (月存 ¥8.7k)',
    topCategoryName: '生鲜食材与外食',
    topCategoryPercent: 52.4,
    topCategoryAmount: '¥2,806',
    topCategoryRemark: '高品质餐食营养配置',
    topCategoryIcon: 'local_grocery_store',
    healthScore: 94.8,
    healthRemark: '控制极为良好'
  },
  chen: {
    avgExpense: '6,495',
    expenseChange: '↓ 5.8% 周期开支受控',
    expenseStatus: '大宗合规',
    savingsRate: '65.4',
    savingsGrade: '极优级',
    savingsRemark: '结余已转入储蓄金库',
    topCategoryName: '住居水电与物业',
    topCategoryPercent: 43.8,
    topCategoryAmount: '¥2,844',
    topCategoryRemark: '固定资产与车辆维护',
    topCategoryIcon: 'home',
    healthScore: 89.2,
    healthRemark: '符合年度大宗规划'
  }
}

const currentKpi = computed(() => {
  if (!ledgerStore.hasMultipleMembers) {
    return kpiDictionary.lin
  }
  const key = (activeMemberId.value === 'chen' || activeMemberId.value === 'lin') ? activeMemberId.value : 'all'
  return kpiDictionary[key]
})

// --- 4. 走势图复合数据源 ---
interface TrendDataset {
  categories: string[]
  incomes: number[]
  expenses: number[]
  highlightIndex: number
  highlightText: string
}

const trendDataMatrix: Record<
  'trend' | 'quarter' | 'year',
  Record<'all' | 'lin' | 'chen', TrendDataset>
> = {
  trend: {
    all: {
      categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月(现)'],
      incomes: [29500, 28600, 30400, 29800, 31000, 32800, 29200, 30600, 31800, 33540],
      expenses: [11200, 12400, 10600, 10800, 11600, 11200, 10200, 10400, 10500, 12640],
      highlightIndex: 9,
      highlightText: '留存结余 ¥20,900'
    },
    lin: {
      categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月(现)'],
      incomes: [13500, 13500, 13500, 13500, 14000, 14000, 14000, 14000, 14500, 14500],
      expenses: [5200, 5600, 4900, 5100, 5300, 5100, 4800, 4900, 5000, 5713],
      highlightIndex: 9,
      highlightText: '留存结余 ¥8,787'
    },
    chen: {
      categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月(现)'],
      incomes: [16000, 15100, 16900, 16300, 17000, 18800, 15200, 16600, 17300, 19040],
      expenses: [6000, 6800, 5700, 5700, 6300, 6100, 5400, 5500, 5500, 6927],
      highlightIndex: 9,
      highlightText: '留存结余 ¥12,113'
    }
  },
  quarter: {
    all: {
      categories: ['2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4(预)'],
      incomes: [88500, 93600, 91600, 96000],
      expenses: [34200, 33600, 31100, 35000],
      highlightIndex: 2,
      highlightText: 'Q3结余 ¥60,500'
    },
    lin: {
      categories: ['2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4(预)'],
      incomes: [40500, 41500, 42000, 43500],
      expenses: [15700, 15500, 14700, 16500],
      highlightIndex: 2,
      highlightText: 'Q3结余 ¥27,300'
    },
    chen: {
      categories: ['2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4(预)'],
      incomes: [48000, 52100, 49600, 52500],
      expenses: [18500, 18100, 16400, 18500],
      highlightIndex: 2,
      highlightText: 'Q3结余 ¥33,200'
    }
  },
  year: {
    all: {
      categories: ['2022年度', '2023年度', '2024年度(至今)'],
      incomes: [320000, 356000, 335400],
      expenses: [142000, 138000, 114100],
      highlightIndex: 2,
      highlightText: '年内结余 ¥221,300'
    },
    lin: {
      categories: ['2022年度', '2023年度', '2024年度(至今)'],
      incomes: [148000, 162000, 153000],
      expenses: [65000, 63500, 50800],
      highlightIndex: 2,
      highlightText: '年内结余 ¥102,200'
    },
    chen: {
      categories: ['2022年度', '2023年度', '2024年度(至今)'],
      incomes: [172000, 194000, 182400],
      expenses: [77000, 74500, 63300],
      highlightIndex: 2,
      highlightText: '年内结余 ¥119,100'
    }
  }
}

// --- 5. 支出分类构成明细数据 ---
interface CategoryExpenseItem {
  name: string
  amount: number
  percent: number
  color: string
}

const expenseBreakdownMatrix: Record<'all' | 'lin' | 'chen', CategoryExpenseItem[]> = {
  all: [
    { name: '餐饮生鲜与外食', amount: 4320, percent: 34.2, color: '#d97757' },
    { name: '住居水电与物业维护', amount: 2844, percent: 22.5, color: '#99462a' },
    { name: '儿童成长与教育陪伴', amount: 2288, percent: 18.1, color: '#41674c' },
    { name: '假日出行与休闲体验', amount: 1744, percent: 13.8, color: '#a7d1b0' },
    { name: '医疗健康与订阅其他', amount: 1444, percent: 11.4, color: '#88726c' }
  ],
  lin: [
    { name: '餐饮生鲜与外食', amount: 2993, percent: 52.4, color: '#d97757' },
    { name: '儿童成长与教育陪伴', amount: 1945, percent: 34.0, color: '#41674c' },
    { name: '日用消耗与美妆护理', amount: 440, percent: 7.7, color: '#ffb59e' },
    { name: '医疗健康与居家常备', amount: 335, percent: 5.9, color: '#88726c' }
  ],
  chen: [
    { name: '住居水电与物业维护', amount: 2844, percent: 41.1, color: '#99462a' },
    { name: '车辆维护与出行油费', amount: 1744, percent: 25.2, color: '#a7d1b0' },
    { name: '商务社交与大宗外食', amount: 1327, percent: 19.2, color: '#d97757' },
    { name: '数码硬件与订阅服务', amount: 1012, percent: 14.5, color: '#88726c' }
  ]
}

const currentExpenseBreakdown = computed(() => {
  if (!ledgerStore.hasMultipleMembers) {
    return expenseBreakdownMatrix.lin
  }
  const key = (activeMemberId.value === 'chen' || activeMemberId.value === 'lin') ? activeMemberId.value : 'all'
  return expenseBreakdownMatrix[key]
})

// 家庭成员支出分布数据模型
interface MemberDivision {
  id: string
  name: string
  role: string
  avatar: string
  color: string
  amount: number
  percent: number
  dutyTitle: string
  dutyIcon: string
  items: { label: string; percent: number }[]
}

const allDivisionList: MemberDivision[] = [
  {
    id: 'lin',
    name: '林知栖',
    role: '主理人',
    avatar: '/avatars/user-lin.png',
    color: '#d97757',
    amount: 5713,
    percent: 45.2,
    dutyTitle: '主导日常频次类开支',
    dutyIcon: 'local_grocery_store',
    items: [
      { label: '生鲜食材', percent: 78 },
      { label: '教育幼托', percent: 85 },
      { label: '日用采购', percent: 62 }
    ]
  },
  {
    id: 'chen',
    name: '陈先生',
    role: '协同人',
    avatar: '/avatars/member-chen.png',
    color: '#41674c',
    amount: 5410,
    percent: 42.8,
    dutyTitle: '主导周期大宗类开支',
    dutyIcon: 'home',
    items: [
      { label: '住房房贷/物业', percent: 100 },
      { label: '车辆维护/保险', percent: 92 },
      { label: '数码硬件家电', percent: 70 }
    ]
  },
  {
    id: 'child',
    name: '林小满',
    role: '孩子',
    avatar: '/avatars/刘海女孩.png',
    color: '#e29578',
    amount: 925,
    percent: 7.3,
    dutyTitle: '成长与兴趣班培养',
    dutyIcon: 'school',
    items: [
      { label: '课外才艺乐器', percent: 90 },
      { label: '儿童图书绘本', percent: 80 },
      { label: '文具运动装备', percent: 75 }
    ]
  },
  {
    id: 'elder',
    name: '苏外婆',
    role: '长辈',
    avatar: '/avatars/白发老奶奶.png',
    color: '#88726c',
    amount: 592,
    percent: 4.7,
    dutyTitle: '采买与健康照料',
    dutyIcon: 'medication',
    items: [
      { label: '便民早市食材', percent: 65 },
      { label: '居家常备药箱', percent: 70 },
      { label: '社区便民理疗', percent: 50 }
    ]
  }
]

// 动态计算家庭成员开支列表
const currentDivisionList = computed(() => {
  if (!ledgerStore.hasMultipleMembers) {
    return [
      {
        id: 'lin',
        name: '林知栖',
        role: '账本专属人',
        avatar: '/avatars/user-lin.png',
        color: '#d97757',
        amount: 5713,
        percent: 100,
        dutyTitle: '个人自主生活与品质消费',
        dutyIcon: 'person',
        items: [
          { label: '餐饮美食', percent: 52 },
          { label: '教育学习', percent: 34 },
          { label: '美妆日用', percent: 14 }
        ]
      }
    ]
  }
  return allDivisionList
})

const activeDivisionMemberId = ref('lin')

const focusedDivisionMember = computed(() => {
  return currentDivisionList.value.find(m => m.id === activeDivisionMemberId.value) || currentDivisionList.value[0]
})

const nextDivisionMember = () => {
  const currentIndex = currentDivisionList.value.findIndex(m => m.id === activeDivisionMemberId.value)
  const nextIndex = (currentIndex + 1) % currentDivisionList.value.length
  activeDivisionMemberId.value = currentDivisionList.value[nextIndex].id
}

// 个人账本专属：个人消费习惯与画像维度数据模型
interface PersonalDimension {
  id: string
  name: string
  tag: string
  icon: string
  color: string
  amount: number
  percent: number
  tip: string
  aiDiagnostic: string
  items: { label: string; percent: number }[]
}

const personalDimensionList: PersonalDimension[] = [
  {
    id: 'essential',
    name: '生活刚需',
    tag: '基础生存保障',
    icon: 'home',
    color: '#d97757',
    amount: 7987,
    percent: 64,
    tip: '住房租金、日常餐饮与出行必需',
    aiDiagnostic: '刚需支出纪律严明，无多余浪费，环比基本持平',
    items: [
      { label: '日常餐饮', percent: 45 },
      { label: '居住水电', percent: 35 },
      { label: '通勤交通', percent: 20 }
    ]
  },
  {
    id: 'leisure',
    name: '品质休闲',
    tag: '生活体验调节',
    icon: 'coffee',
    color: '#41674c',
    amount: 2745,
    percent: 22,
    tip: '咖啡下午茶、周末聚会与观影休闲',
    aiDiagnostic: '休闲开支控制良好，较月度预算上限尚有 28% 余量',
    items: [
      { label: '咖啡探店', percent: 48 },
      { label: '聚餐娱乐', percent: 32 },
      { label: '美妆个护', percent: 20 }
    ]
  },
  {
    id: 'growth',
    name: '自我增值',
    tag: '长期价值投资',
    icon: 'school',
    color: '#e29578',
    amount: 1748,
    percent: 14,
    tip: '专业书籍、技能培训与知识付费',
    aiDiagnostic: '持续保持技能与健康增值投入，支出回报比健康',
    items: [
      { label: '图书课程', percent: 55 },
      { label: '运动健身', percent: 30 },
      { label: '数码工具', percent: 15 }
    ]
  }
]

const activePersonalDimensionId = ref('essential')

const focusedPersonalDimension = computed(() => {
  return personalDimensionList.find(d => d.id === activePersonalDimensionId.value) || personalDimensionList[0]
})

// --- 6. ECharts 图表实例与逻辑 ---
const trendChartRef = ref<HTMLDivElement | null>(null)
const pieChartRef = ref<HTMLDivElement | null>(null)

let trendChart: echarts.ECharts | null = null
let pieChart: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

// 系列显示控制
const showIncome = ref(true)
const showExpense = ref(true)
const showSavings = ref(true)

const toggleSeries = (name: '收入' | '支出' | '净结余') => {
  if (name === '收入') showIncome.value = !showIncome.value
  if (name === '支出') showExpense.value = !showExpense.value
  if (name === '净结余') showSavings.value = !showSavings.value
  updateTrendChart()
}

// 环形图中心文字指示
const donutCenterInfo = ref({
  label: '当月总支出',
  value: '¥12,640',
  sub: ''
})
const activeCategoryName = ref('')

const resetDonutCenter = () => {
  const total = currentExpenseBreakdown.value.reduce((acc, cur) => acc + cur.amount, 0)
  donutCenterInfo.value = {
    label: activeTab.value === 'trend' ? '当月总支出' : '当期总支出',
    value: `¥${total.toLocaleString()}`,
    sub: ''
  }
  activeCategoryName.value = ''
}

const setDonutCenter = (item: CategoryExpenseItem) => {
  donutCenterInfo.value = {
    label: item.name,
    value: `¥${item.amount.toLocaleString()}`,
    sub: `${item.percent}%`
  }
  activeCategoryName.value = item.name
}

const onCategoryHover = (item: CategoryExpenseItem) => {
  setDonutCenter(item)
  pieChart?.dispatchAction({
    type: 'highlight',
    name: item.name
  })
}

const onCategoryLeave = () => {
  resetDonutCenter()
  pieChart?.dispatchAction({
    type: 'downplay'
  })
}

// 更新主走势复合图表 (ECharts 双柱 + 平滑折线面积图)
const updateTrendChart = () => {
  if (!trendChart) return

  const memberKey = !ledgerStore.hasMultipleMembers ? 'lin' : (activeMemberId.value === 'chen' || activeMemberId.value === 'lin' ? activeMemberId.value : 'all')
  const dataset = trendDataMatrix[activeTab.value][memberKey]
  const savings = dataset.incomes.map((inc, i) => inc - dataset.expenses[i])

  const seriesList: any[] = []

  // 1. 总流入 (收入) 柱状图
  if (showIncome.value) {
    seriesList.push({
      name: '总流入 (收入)',
      type: 'bar',
      barWidth: 16,
      barGap: '20%',
      itemStyle: {
        borderRadius: [3, 3, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(65, 103, 76, 0.95)' },
          { offset: 1, color: 'rgba(65, 103, 76, 0.65)' }
        ])
      },
      data: dataset.incomes,
      z: 2
    })
  }

  // 2. 总支出 柱状图
  if (showExpense.value) {
    seriesList.push({
      name: '总支出',
      type: 'bar',
      barWidth: 16,
      itemStyle: {
        borderRadius: [3, 3, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(217, 119, 87, 0.95)' },
          { offset: 1, color: 'rgba(217, 119, 87, 0.70)' }
        ])
      },
      data: dataset.expenses,
      z: 2
    })
  }

  // 3. 当月净结余 (储蓄) 折线与阴影面积
  if (showSavings.value) {
    seriesList.push({
      name: '当期留存结余 (储蓄)',
      type: 'line',
      smooth: 0.35,
      showSymbol: true,
      symbol: 'circle',
      symbolSize: (_val: number, params: any) => (params.dataIndex === dataset.highlightIndex ? 9 : 6),
      itemStyle: {
        color: '#99462a',
        borderColor: '#ffffff',
        borderWidth: 2
      },
      lineStyle: {
        width: 2.5,
        color: '#99462a'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(153, 70, 42, 0.22)' },
          { offset: 1, color: 'rgba(153, 70, 42, 0.0)' }
        ])
      },
      markPoint: {
        symbol: 'roundRect',
        symbolSize: [116, 28],
        symbolOffset: [0, -22],
        itemStyle: {
          color: '#1c1c1a',
          shadowColor: 'rgba(0, 0, 0, 0.15)',
          shadowBlur: 6,
          shadowOffsetY: 3
        },
        label: {
          color: '#fcf9f6',
          fontSize: 11,
          fontWeight: 'bold',
          fontFamily: "'Manrope', sans-serif",
          formatter: dataset.highlightText
        },
        data: [
          {
            name: '当期留存结余',
            coord: [dataset.highlightIndex, savings[dataset.highlightIndex]]
          }
        ]
      },
      data: savings,
      z: 3
    })
  }

  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    grid: {
      top: 36,
      right: 25,
      bottom: 28,
      left: 56,
      containLabel: false
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#ffffff',
      borderColor: '#dbc1b9',
      borderWidth: 1,
      borderRadius: 10,
      padding: [10, 14],
      shadowColor: 'rgba(0, 0, 0, 0.08)',
      shadowBlur: 12,
      shadowOffsetY: 4,
      textStyle: {
        color: '#1c1c1a',
        fontSize: 12,
        fontFamily: "'Manrope', sans-serif"
      },
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(153, 70, 42, 0.04)'
        }
      },
      formatter: (params: any) => {
        if (!Array.isArray(params) || params.length === 0) return ''
        const title = params[0].axisValue || ''
        let html = `<div style="font-weight:700;font-size:13px;color:#1c1c1a;margin-bottom:6px;border-bottom:1px solid #f0edeb;padding-bottom:4px;">${title} 财务明细</div>`
        let incomeVal = 0
        let expenseVal = 0

        params.forEach((item: any) => {
          let dotColor = '#55433d'
          let sign = ''
          if (item.seriesName.includes('收入')) {
            dotColor = '#41674c'
            sign = '+'
            incomeVal = item.value
          } else if (item.seriesName.includes('支出')) {
            dotColor = '#d97757'
            sign = '-'
            expenseVal = item.value
          } else if (item.seriesName.includes('结余') || item.seriesName.includes('储蓄')) {
            dotColor = '#99462a'
            sign = item.value >= 0 ? '+' : ''
          }

          html += `
            <div style="display:flex;justify-content:space-between;align-items:center;gap:18px;font-size:12px;margin-top:4px;">
              <span style="display:flex;align-items:center;gap:6px;color:#55433d;">
                <span style="width:7px;height:7px;border-radius:50%;background:${dotColor};display:inline-block;"></span>
                ${item.seriesName}
              </span>
              <span style="font-family:'JetBrains Mono',monospace;font-weight:600;color:#1c1c1a;">
                ${sign}¥ ${Number(item.value).toLocaleString()}
              </span>
            </div>
          `
        })

        if (incomeVal > 0) {
          const rate = (((incomeVal - expenseVal) / incomeVal) * 100).toFixed(1)
          html += `
            <div style="margin-top:6px;padding-top:4px;border-top:1px dashed #f0edeb;display:flex;justify-content:space-between;font-size:11px;color:#88726c;">
              <span>当期实际储蓄率:</span>
              <strong style="color:#41674c;font-family:'JetBrains Mono';">${rate}%</strong>
            </div>
          `
        }
        return html
      }
    },
    xAxis: {
      type: 'category',
      data: dataset.categories,
      axisLine: { lineStyle: { color: '#88726c', width: 1 } },
      axisTick: { show: false },
      axisLabel: {
        color: (value?: string | number) => {
          const str = String(value ?? '')
          return (str.includes('现') || str.includes('至今')) ? '#1c1c1a' : '#55433d'
        },
        fontSize: 12,
        fontFamily: "'Manrope', sans-serif"
      }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          color: '#dbc1b9',
          type: 'dashed',
          opacity: 0.5
        }
      },
      axisLabel: {
        color: '#88726c',
        fontSize: 11,
        fontFamily: "'JetBrains Mono', monospace",
        formatter: (val: number) => {
          if (val === 0) return '¥0'
          if (val >= 1000) return `¥${Math.round(val / 1000)}k`
          return `¥${val}`
        }
      }
    },
    series: seriesList
  }

  trendChart.setOption(option, true)
}

// 更新多层级支出构成 Donut 饼图
const updatePieChart = () => {
  if (!pieChart) return

  const items = currentExpenseBreakdown.value
  resetDonutCenter()

  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#ffffff',
      borderColor: '#dbc1b9',
      borderWidth: 1,
      borderRadius: 8,
      padding: [8, 12],
      textStyle: {
        color: '#1c1c1a',
        fontSize: 12,
        fontFamily: "'Manrope', sans-serif"
      },
      formatter: (params: any) => {
        return `
          <div style="font-weight:700;font-size:12px;color:#1c1c1a;margin-bottom:3px;">${params.name}</div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#99462a;">
            ¥ ${Number(params.value).toLocaleString()} (${params.percent}%)
          </div>
        `
      }
    },
    series: [
      {
        name: '支出分类',
        type: 'pie',
        radius: ['58%', '82%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 3,
          borderColor: '#ffffff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          scale: true,
          scaleSize: 4,
          label: {
            show: false
          }
        },
        data: items.map(c => ({
          name: c.name,
          value: c.amount,
          itemStyle: { color: c.color }
        }))
      }
    ]
  }

  pieChart.setOption(option, true)

  // 监听扇区悬停联动中心指示器
  pieChart.off('mouseover')
  pieChart.off('mouseout')

  pieChart.on('mouseover', (params: any) => {
    const match = items.find(i => i.name === params.name)
    if (match) {
      setDonutCenter(match)
    }
  })

  pieChart.on('mouseout', () => {
    resetDonutCenter()
  })
}

// 维度与成员切换方法
const switchTimeTab = (tabId: 'trend' | 'quarter' | 'year') => {
  activeTab.value = tabId
  nextTick(() => {
    updateTrendChart()
    updatePieChart()
  })
}

const switchMember = (memberId: string) => {
  activeMemberId.value = memberId
  if (memberId !== 'all') {
    activeDivisionMemberId.value = memberId
  }
  nextTick(() => {
    updateTrendChart()
    updatePieChart()
  })
}

// 监听 Pinia 账本切换，平滑刷新所有图表与指标
watch(() => ledgerStore.currentLedger, () => {
  activeMemberId.value = 'all'
  activeDivisionMemberId.value = 'lin'
  nextTick(() => {
    updateTrendChart()
    updatePieChart()
  })
})

// --- 7. AI 诊断刷新微交互 ---
const isRefreshingAdvice = ref(false)
const refreshAdvice = () => {
  if (isRefreshingAdvice.value) return
  isRefreshingAdvice.value = true

  setTimeout(() => {
    isRefreshingAdvice.value = false
    modalState.value = {
      visible: true,
      icon: 'psychology',
      title: '知栖 AI 财务诊断已重新拟合',
      content: '基于最新记账流水模型，已重新评估储蓄与财务健康度：总体评级维持 AAA 极稳健，阶段性餐饮与出行消费已纳入周期均线模型，流动性持续优良！'
    }
  }, 1000)
}

// --- 8. 模态窗口管理 ---
const modalState = ref({
  visible: false,
  icon: 'info',
  title: '',
  content: ''
})

const openModal = (type: 'adjustGoal' | 'autoInvest') => {
  if (type === 'adjustGoal') {
    modalState.value = {
      visible: true,
      icon: 'flag_circle',
      title: '调整本季度财务目标',
      content: '当前“专项储备基金（15万元）”达成进度为 91.2%，可根据现金流波动上调 1.5 万元目标或缩短储蓄周期。确认将开启目标配置？'
    }
  } else {
    modalState.value = {
      visible: true,
      icon: 'savings',
      title: '配置共享自动定投',
      content: '知栖系统已连接共有资金池。根据当月净结余，系统推荐配置每月 8 日自动将结余的 60% 转入稳健低风险定投组合。确认开启定投计划？'
    }
  }
}

const handleModalConfirm = () => {
  modalState.value.visible = false
}

// --- 9. 生命周期与自适应挂载 ---
onMounted(() => {
  nextTick(() => {
    // 1. 初始化走势复合图
    if (trendChartRef.value) {
      trendChart = echarts.init(trendChartRef.value)
      updateTrendChart()
    }

    // 2. 初始化分类 Donut 图
    if (pieChartRef.value) {
      pieChart = echarts.init(pieChartRef.value)
      updatePieChart()
    }

    setTimeout(() => {
      trendChart?.resize()
      pieChart?.resize()
    }, 100)

    // 3. 响应式观察器
    const handleResize = () => {
      trendChart?.resize()
      pieChart?.resize()
    }

    window.addEventListener('resize', handleResize)

    if (trendChartRef.value && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        handleResize()
      })
      resizeObserver.observe(trendChartRef.value)
      if (pieChartRef.value) {
        resizeObserver.observe(pieChartRef.value)
      }
    }
  })
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  if (trendChart) {
    trendChart.dispose()
    trendChart = null
  }
  if (pieChart) {
    pieChart.dispose()
    pieChart = null
  }
})
</script>

<style scoped>
/* 针对当前页面微调动画与交互 */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
