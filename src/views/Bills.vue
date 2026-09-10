<template>
  <div class="flex flex-col w-full min-h-full" style="background-color: #fcf9f6">
    <div class="max-w-[88rem] mx-auto w-full px-4 py-3 flex flex-col gap-3">
      <!-- 1. Top Meta & Actions Combined Line -->
      <div class="flex items-center justify-between gap-3 pb-1 flex-wrap">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
            <span>账本明细</span>
            <span class="material-symbols-outlined text-xs">chevron_right</span>
            <span class="text-primary font-semibold">{{ ledgerStore.currentLedger }} · 收支台账</span>
          </div>
          <h1 class="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold ml-2">账目台账与明细</h1>
          <span class="text-xs px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-medium border border-surface-container">16:9宽屏工作台</span>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-all shadow-sm font-label-sm text-label-sm cursor-pointer"
            type="button"
            @click="exportExcel"
          >
            <span class="material-symbols-outlined text-sm">file_download</span>
            <span>导出Excel</span>
          </button>
          <button
            class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-all shadow-sm font-label-sm text-label-sm cursor-pointer"
            type="button"
            @click="batchCategorize"
          >
            <span class="material-symbols-outlined text-sm">drive_file_rename_outline</span>
            <span>批量归类</span>
          </button>
          <button
            class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container text-primary hover:bg-surface-container-high transition-all shadow-sm font-label-sm text-label-sm font-semibold cursor-pointer"
            type="button"
            @click="openRecurringModal"
          >
            <span class="material-symbols-outlined text-sm text-primary">autorenew</span>
            <span>周期收支</span>
          </button>
          <button
            class="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-surface-tint transition-all shadow-sm font-label-sm text-label-sm font-semibold cursor-pointer"
            type="button"
            @click="openAddDialog"
          >
            <span class="material-symbols-outlined text-sm font-bold">add</span>
            <span>新增单笔收支</span>
          </button>
        </div>
      </div>

      <!-- 2. Compact Single/Dual-Row Horizontal Filter Ribbon -->
      <section class="bg-surface-container-lowest rounded-xl p-3 shadow-sm border border-surface-container flex flex-col gap-2.5">
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <div class="flex items-center gap-3 flex-wrap">
            <!-- 快捷时段切换 -->
            <div class="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
              <button
                v-for="p in periodOptions"
                :key="p"
                type="button"
                class="px-3 py-1 rounded-lg font-label-md text-label-sm transition-all cursor-pointer"
                :class="selectedPeriod === p
                  ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'"
                @click="selectedPeriod = p"
              >
                {{ p }}
              </button>
            </div>

            <!-- 日期跨度指示 -->
            <div
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low border border-surface-container hover:border-surface-container-high cursor-pointer transition-colors text-on-surface-variant hover:text-on-surface"
              @click="toggleDateFilter"
            >
              <span class="material-symbols-outlined text-sm text-primary">calendar_today</span>
              <span class="font-amount-table text-body-sm font-medium text-on-surface">{{ displayDateRange }}</span>
              <span class="material-symbols-outlined text-sm text-on-surface-variant">arrow_drop_down</span>
            </div>
          </div>

          <!-- 搜索与辅助操作 -->
          <div class="flex items-center gap-2">
            <div class="relative flex items-center">
              <span class="material-symbols-outlined absolute left-2.5 text-on-surface-variant text-sm">search</span>
              <input
                v-model="searchQuery"
                class="h-8 pl-8 pr-3 bg-surface-container-low text-on-surface rounded-xl font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-on-surface-variant/40 w-48 border border-transparent hover:border-surface-container-high transition-all"
                placeholder="搜商户或备注..."
                type="text"
              />
              <button
                v-if="searchQuery"
                type="button"
                class="absolute right-2 text-on-surface-variant hover:text-on-surface"
                @click="searchQuery = ''"
              >
                <span class="material-symbols-outlined text-xs">close</span>
              </button>
            </div>
            <button
              class="px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-label-sm text-label-sm transition-colors cursor-pointer"
              type="button"
              @click="resetFilters"
            >
              重置
            </button>
            <button
              class="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface font-label-sm text-label-sm hover:bg-surface-container transition-colors cursor-pointer"
              type="button"
              @click="saveView"
            >
              保存视图
            </button>
          </div>
        </div>

        <!-- 第二行：精确筛选 -->
        <div class="flex items-center justify-between gap-3 pt-2 border-t border-surface-container flex-wrap">
          <div class="flex items-center gap-3 flex-wrap">
            <div class="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
              <span class="material-symbols-outlined text-sm">filter_list</span>
              <span>精确筛选:</span>
            </div>

            <!-- 收支类型切换 -->
            <div class="flex items-center bg-surface-container-low p-0.5 rounded-lg">
              <button
                v-for="t in typeOptions"
                :key="t.value"
                type="button"
                class="px-2.5 py-1 rounded-md font-label-sm text-label-sm transition-colors cursor-pointer"
                :class="filterType === t.value
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'"
                @click="filterType = t.value"
              >
                {{ t.label }}
              </button>
            </div>

            <!-- 分类下拉 -->
            <div class="relative flex items-center">
              <select
                v-model="selectedCategory"
                class="h-8 bg-surface-container-low text-on-surface rounded-xl pl-2.5 pr-7 appearance-none font-label-sm text-label-sm focus:outline-none cursor-pointer border border-surface-container hover:border-surface-container-high transition-colors"
              >
                <option value="全部分类">全食品类与收支</option>
                <option value="生鲜食品">餐饮美食 (餐食/生鲜)</option>
                <option value="居家日常">居家生活 (物业/日用)</option>
                <option value="交通出行">交通出行 (油耗/通行)</option>
                <option value="医疗健康">医疗健康 (日常/药品)</option>
                <option value="休闲娱乐">休闲娱乐 (文教/亲子)</option>
                <option value="职业薪酬">职业薪酬 (工资发放)</option>
              </select>
              <span class="material-symbols-outlined absolute right-2 pointer-events-none text-on-surface-variant text-sm">expand_more</span>
            </div>

            <!-- 家庭成员下拉 (仅在多人账本自适应显示) -->
            <div class="relative flex items-center" v-if="ledgerStore.hasMultipleMembers">
              <select
                v-model="selectedMember"
                class="h-8 bg-surface-container-low text-on-surface rounded-xl pl-2.5 pr-7 appearance-none font-label-sm text-label-sm focus:outline-none cursor-pointer border border-surface-container hover:border-surface-container-high transition-colors"
              >
                <option value="全部">全家所有成员</option>
                <option value="林知栖">林知栖 (户主)</option>
                <option value="陈先生">陈先生 (配偶)</option>
                <option value="姥姥">姥姥 (长辈)</option>
              </select>
              <span class="material-symbols-outlined absolute right-2 pointer-events-none text-on-surface-variant text-sm">expand_more</span>
            </div>
          </div>

          <div class="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
            <span>实时自动同步</span>
          </div>
        </div>
      </section>

      <!-- 3. Summary & Batch Ribbon -->
      <div class="flex items-center justify-between bg-surface-container-low px-4 py-1.5 rounded-xl border border-surface-container-high flex-wrap gap-2">
        <div class="flex items-center gap-3 flex-wrap">
          <div class="flex items-center gap-1.5">
            <input
              id="select-all"
              type="checkbox"
              :checked="isAllSelected"
              class="w-3.5 h-3.5 rounded text-primary accent-primary focus:ring-0 cursor-pointer"
              @change="toggleSelectAll"
            />
            <label class="font-label-sm text-label-sm text-on-surface cursor-pointer select-none" for="select-all">全选本页</label>
          </div>
          <span class="text-on-surface-variant text-xs">|</span>
          <div class="flex items-center gap-1">
            <span class="font-body-sm text-body-sm text-on-surface-variant">共筛选</span>
            <span class="font-amount-table text-amount-table text-on-surface font-bold">{{ filteredBills.length }}</span>
            <span class="font-body-sm text-body-sm text-on-surface-variant">笔记录</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1 bg-surface-container-lowest px-2 py-0.5 rounded-md shadow-xs">
              <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span class="font-label-sm text-label-sm text-on-surface-variant">支出:</span>
              <span class="font-amount-table text-amount-table font-semibold text-primary">¥ {{ currentFilterExpense.toFixed(2) }}</span>
            </div>
            <div class="flex items-center gap-1 bg-surface-container-lowest px-2 py-0.5 rounded-md shadow-xs">
              <span class="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
              <span class="font-label-sm text-label-sm text-on-surface-variant">收入:</span>
              <span class="font-amount-table text-amount-table font-semibold text-secondary">¥ {{ currentFilterIncome.toFixed(2) }}</span>
            </div>
            <div class="flex items-center gap-1 bg-surface-container-lowest px-2 py-0.5 rounded-md shadow-xs">
              <span class="font-label-sm text-label-sm text-on-surface-variant">收支结余:</span>
              <span
                class="font-amount-table text-amount-table font-semibold"
                :class="(currentFilterIncome - currentFilterExpense) >= 0 ? 'text-on-surface' : 'text-primary'"
              >
                {{ (currentFilterIncome - currentFilterExpense) >= 0 ? '+¥ ' : '-¥ ' }}{{ Math.abs(currentFilterIncome - currentFilterExpense).toFixed(2) }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="font-label-sm text-label-sm text-on-surface-variant">已选 <strong class="text-on-surface">{{ selectedRowIds.length }}</strong> 项</span>
          <button
            class="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            type="button"
            :disabled="selectedRowIds.length === 0"
            @click="batchCategorize"
          >
            <span class="material-symbols-outlined text-xs">label</span>
            <span>分类</span>
          </button>
          <button
            class="px-2 py-1 rounded bg-error-container text-on-error-container hover:bg-error/20 font-label-sm text-label-sm transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            type="button"
            :disabled="selectedRowIds.length === 0"
            @click="batchDelete"
          >
            <span class="material-symbols-outlined text-xs">delete</span>
            <span>删除</span>
          </button>
        </div>
      </div>

      <!-- 4. Ledger Table Component for 16:9 Widescreen Layout -->
      <div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-surface-container flex flex-col">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm border-b border-surface-container select-none">
                <th class="py-2 pl-4 pr-1 w-8">
                  <span class="sr-only">选择</span>
                </th>
                <th class="py-2 px-2 whitespace-nowrap">记账时间</th>
                <th class="py-2 px-3 whitespace-nowrap">分类类目</th>
                <th class="py-2 px-4 whitespace-nowrap">商户与交易明细摘要</th>
                <th v-if="ledgerStore.hasMultipleMembers" class="py-2 px-3 whitespace-nowrap">家庭成员</th>
                <th class="py-2 px-3 whitespace-nowrap">支付渠道</th>
                <th class="py-2 px-4 text-right whitespace-nowrap">收支金额 (元)</th>
                <th class="py-2 px-3 text-center whitespace-nowrap">凭证附件</th>
                <th class="py-2 pr-4 pl-2 text-right whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-surface-container text-on-surface font-body-sm text-body-sm">
              <tr
                v-for="item in paginatedBills"
                :key="item.id"
                class="hover:bg-surface-container-low/60 transition-colors group"
                :class="item.type === '收入' ? 'bg-primary-fixed/10 hover:bg-primary-fixed/20' : ''"
              >
                <!-- 勾选框 -->
                <td class="py-2 pl-4 pr-1">
                  <input
                    type="checkbox"
                    :checked="selectedRowIds.includes(item.id)"
                    class="row-checkbox w-3.5 h-3.5 rounded text-primary accent-primary focus:ring-0 cursor-pointer"
                    @change="toggleSelectRow(item.id)"
                  />
                </td>

                <!-- 记账时间 -->
                <td class="py-2 px-2 whitespace-nowrap">
                  <div class="flex flex-col">
                    <span
                      class="font-amount-table text-amount-table font-medium leading-none"
                      :class="item.type === '收入' ? 'text-primary' : 'text-on-surface'"
                    >
                      {{ item.date }}
                    </span>
                    <span class="font-label-sm text-label-sm text-on-surface-variant leading-none mt-1">{{ item.time }} {{ getWeekday(item.date) }}</span>
                  </div>
                </td>

                <!-- 分类类目 -->
                <td class="py-2 px-3 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-7 h-7 rounded-lg flex items-center justify-center shadow-xs shrink-0"
                      :class="getCategoryIconBadgeClass(item.category, item.type)"
                    >
                      <span class="material-symbols-outlined text-base">{{ item.icon || getCategoryIcon(item.category) }}</span>
                    </div>
                    <div class="flex flex-col">
                      <span
                        class="font-label-md font-semibold leading-tight"
                        :class="item.type === '收入' ? 'text-primary' : 'text-on-surface'"
                      >
                        {{ item.category }}
                      </span>
                      <span class="font-label-sm text-label-sm text-on-surface-variant leading-none">{{ item.subCategory || '日常生活' }}</span>
                    </div>
                  </div>
                </td>

                <!-- 商户与交易明细摘要 -->
                <td class="py-2 px-4">
                  <div class="flex flex-col cursor-pointer" @click="openDetail(item)">
                    <span class="font-body-sm font-medium text-on-surface leading-tight hover:text-primary transition-colors">
                      {{ item.title }}
                    </span>
                    <span class="font-label-sm text-label-sm text-on-surface-variant truncate max-w-md">
                      {{ item.remark || '日常开支明细' }}
                    </span>
                  </div>
                </td>

                <!-- 家庭成员 (仅在多人账本展示) -->
                <td v-if="ledgerStore.hasMultipleMembers" class="py-2 px-3 whitespace-nowrap">
                  <div class="flex items-center gap-1.5">
                    <img
                      :src="getMemberAvatar(item.member)"
                      :alt="item.member"
                      class="w-5 h-5 rounded-full object-cover border border-outline-variant/30"
                    />
                    <span class="font-label-sm text-label-sm text-on-surface">{{ item.member }}</span>
                  </div>
                </td>

                <!-- 支付渠道 -->
                <td class="py-2 px-3 whitespace-nowrap">
                  <span
                    class="inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded"
                    :class="item.type === '收入'
                      ? 'text-primary bg-surface-container-lowest shadow-xs'
                      : 'text-on-surface-variant bg-surface-container'"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full"
                      :class="getChannelDotClass(item.account)"
                    ></span>
                    {{ item.account }}
                  </span>
                </td>

                <!-- 收支金额 -->
                <td class="py-2 px-4 text-right whitespace-nowrap">
                  <span
                    class="font-amount-table text-amount-table font-bold tracking-tight"
                    :class="item.type === '收入' ? 'text-primary' : 'text-on-surface'"
                  >
                    {{ item.type === '收入' ? '+' : '-' }}{{ item.amount.toFixed(2) }}
                  </span>
                </td>

                <!-- 凭证附件 -->
                <td class="py-2 px-3 text-center whitespace-nowrap">
                  <button
                    v-if="item.voucher"
                    type="button"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full transition-all text-xs cursor-pointer"
                    :class="item.type === '收入'
                      ? 'bg-primary-fixed text-on-primary-fixed-variant hover:bg-primary-fixed-dim'
                      : 'bg-surface-container-high text-on-surface-variant hover:text-primary hover:bg-surface-container'"
                    @click="openDetail(item)"
                  >
                    <span class="material-symbols-outlined text-xs">{{ getVoucherIcon(item.voucher) }}</span>
                    <span class="font-label-sm">{{ item.voucher }}</span>
                  </button>
                  <span v-else class="font-label-sm text-label-sm text-on-surface-variant/40">—</span>
                </td>

                <!-- 操作 -->
                <td class="py-2 pr-4 pl-2 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      class="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all cursor-pointer"
                      title="编辑详情"
                      type="button"
                      @click="openDetail(item)"
                    >
                      <span class="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button
                      class="p-1 rounded text-on-surface-variant hover:text-error hover:bg-surface-container transition-all cursor-pointer"
                      title="删除记录"
                      type="button"
                      @click="deleteBill(item.id)"
                    >
                      <span class="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- 空态显示 -->
              <tr v-if="filteredBills.length === 0">
                <td colspan="9" class="py-12 text-center text-on-surface-variant">
                  <div class="flex flex-col items-center justify-center gap-2">
                    <span class="material-symbols-outlined text-4xl text-outline-variant">search_off</span>
                    <p class="font-label-md text-on-surface font-semibold">未找到符合条件的账目明细</p>
                    <p class="font-label-sm text-on-surface-variant">您可以尝试更换筛选范围或重置全部检索条件</p>
                    <button
                      type="button"
                      class="mt-2 px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-xs cursor-pointer"
                      @click="resetFilters"
                    >
                      重置筛选
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 紧凑分页栏 -->
        <div class="px-4 py-2 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-surface-container text-xs">
          <div class="flex items-center gap-3 text-on-surface-variant font-label-sm text-label-sm">
            <span>显示 {{ pageStart }}-{{ pageEnd }} 条 / 共 {{ filteredBills.length }} 条记录</span>
            <div class="flex items-center gap-1">
              <span>每页:</span>
              <select
                v-model="pageSize"
                class="bg-surface-container-lowest text-on-surface rounded px-2 py-0.5 font-label-sm text-label-sm focus:outline-none cursor-pointer border border-surface-container"
              >
                <option :value="10">10 条 / 页</option>
                <option :value="20">20 条 / 页</option>
                <option :value="50">50 条 / 页</option>
              </select>
            </div>
          </div>

          <div class="flex items-center gap-1">
            <button
              class="w-7 h-7 rounded bg-surface-container-lowest text-on-surface-variant flex items-center justify-center border border-surface-container cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="currentPage <= 1"
              type="button"
              @click="currentPage--"
            >
              <span class="material-symbols-outlined text-xs">chevron_left</span>
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              class="w-7 h-7 rounded font-amount-table text-xs flex items-center justify-center transition-colors cursor-pointer border border-surface-container"
              :class="currentPage === page
                ? 'bg-primary text-on-primary font-semibold shadow-xs border-primary'
                : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'"
              type="button"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
            <button
              class="w-7 h-7 rounded bg-surface-container-lowest text-on-surface flex items-center justify-center hover:bg-surface-container-high transition-colors border border-surface-container cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="currentPage >= totalPages"
              type="button"
              @click="currentPage++"
            >
              <span class="material-symbols-outlined text-xs">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 5. Smart Insight 3-Card Deck -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <!-- Card 1: 类目支出比重 -->
        <div class="bg-surface-container-lowest rounded-xl p-3 shadow-sm flex flex-col justify-between border border-surface-container">
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <h3 class="font-label-md font-bold text-on-surface flex items-center gap-1">
                <span class="material-symbols-outlined text-base text-primary">donut_small</span>
                <span>类目支出比重</span>
              </h3>
              <span class="font-label-sm text-label-sm text-primary font-semibold bg-primary-fixed px-2 py-0.5 rounded-full">合理预算内</span>
            </div>
            <p class="font-label-sm text-label-sm text-on-surface-variant mb-2">居家与餐饮占总体开支约 64%，处于理想生活健康区间。</p>
            <div class="flex flex-col gap-1.5">
              <div>
                <div class="flex justify-between font-label-sm text-label-sm mb-0.5">
                  <span>居家日用 & 生鲜</span>
                  <span class="font-amount-table font-semibold">42% (¥5,241.80)</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
                  <div class="h-full rounded-full bg-primary" style="width: 42%;"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between font-label-sm text-label-sm mb-0.5">
                  <span>交通出行 & 油费</span>
                  <span class="font-amount-table font-semibold">22% (¥2,745.00)</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
                  <div class="h-full rounded-full bg-primary-container" style="width: 22%;"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between font-label-sm text-label-sm mb-0.5">
                  <span>亲子娱乐 & 文教</span>
                  <span class="font-amount-table font-semibold">18% (¥2,246.00)</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
                  <div class="h-full rounded-full bg-primary-fixed-dim" style="width: 18%;"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="pt-2 mt-1 border-t border-surface-container flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
            <span>距离月度限额尚存: <strong class="text-primary font-bold">¥ 4,519.50</strong></span>
            <span class="material-symbols-outlined text-sm text-primary">trending_flat</span>
          </div>
        </div>

        <!-- Card 2: 家庭出资协同 (多人) vs 支付渠道流向 (单人) -->
        <div class="bg-surface-container-lowest rounded-xl p-3 shadow-sm flex flex-col justify-between border border-surface-container">
          <template v-if="ledgerStore.hasMultipleMembers">
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <h3 class="font-label-md font-bold text-on-surface flex items-center gap-1">
                  <span class="material-symbols-outlined text-base text-primary">diversity_3</span>
                  <span>家庭出资协同</span>
                </h3>
                <span class="font-label-sm text-label-sm text-on-surface-variant">本月对账</span>
              </div>
              <div class="grid grid-cols-2 gap-2 mt-2">
                <div class="flex flex-col p-2 bg-surface-container-low rounded-lg">
                  <div class="flex items-center gap-1.5">
                    <img class="w-5 h-5 rounded-full object-cover" src="/avatars/user-lin.png" alt="林知栖" />
                    <span class="font-label-sm font-semibold text-on-surface">林知栖</span>
                  </div>
                  <span class="font-amount-table text-on-surface font-bold text-base mt-1">¥ 6,890</span>
                  <span class="font-label-sm text-on-surface-variant text-xs mt-0.5">生鲜/宝宝日常</span>
                </div>
                <div class="flex flex-col p-2 bg-surface-container-low rounded-lg">
                  <div class="flex items-center gap-1.5">
                    <img class="w-5 h-5 rounded-full object-cover" src="/avatars/member-chen.png" alt="陈先生" />
                    <span class="font-label-sm font-semibold text-on-surface">陈先生</span>
                  </div>
                  <span class="font-amount-table text-on-surface font-bold text-base mt-1">¥ 5,590</span>
                  <span class="font-label-sm text-on-surface-variant text-xs mt-0.5">车辆/物业/宽带</span>
                </div>
              </div>
            </div>
            <div class="pt-2 mt-1 border-t border-surface-container flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
              <div class="flex items-center gap-1">
                <span class="material-symbols-outlined text-sm text-primary">balance</span>
                <span>出资比例 5.5 : 4.5</span>
              </div>
              <span class="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant text-xs border border-surface-container">协同健康</span>
            </div>
          </template>

          <template v-else>
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <h3 class="font-label-md font-bold text-on-surface flex items-center gap-1">
                  <span class="material-symbols-outlined text-base text-primary">account_balance_wallet</span>
                  <span>支付渠道分布</span>
                </h3>
                <span class="font-label-sm text-label-sm text-on-surface-variant">个人账户流向</span>
              </div>
              <div class="grid grid-cols-2 gap-2 mt-2">
                <div class="flex flex-col p-2 bg-surface-container-low rounded-lg">
                  <div class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-sm text-primary">credit_card</span>
                    <span class="font-label-sm font-semibold text-on-surface">招商一卡通</span>
                  </div>
                  <span class="font-amount-table text-on-surface font-bold text-base mt-1">¥ 7,420</span>
                  <span class="font-label-sm text-on-surface-variant text-xs mt-0.5">主支付账户 (58%)</span>
                </div>
                <div class="flex flex-col p-2 bg-surface-container-low rounded-lg">
                  <div class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-sm text-secondary">payments</span>
                    <span class="font-label-sm font-semibold text-on-surface">微信与支付宝</span>
                  </div>
                  <span class="font-amount-table text-on-surface font-bold text-base mt-1">¥ 5,060</span>
                  <span class="font-label-sm text-on-surface-variant text-xs mt-0.5">扫码日常零开 (42%)</span>
                </div>
              </div>
            </div>
            <div class="pt-2 mt-1 border-t border-surface-container flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
              <div class="flex items-center gap-1">
                <span class="material-symbols-outlined text-sm text-primary">check_circle</span>
                <span>资金渠道比例均衡</span>
              </div>
              <span class="px-1.5 py-0.5 rounded bg-surface-container-high text-primary text-xs border border-surface-container font-medium">无逾期风险</span>
            </div>
          </template>
        </div>

        <!-- Card 3: 智能票据入账 -->
        <div class="bg-surface-container-lowest rounded-xl p-3 shadow-sm flex flex-col justify-between border border-surface-container">
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <div class="flex items-center gap-1 text-primary">
                <span class="material-symbols-outlined text-base">receipt_long</span>
                <h3 class="font-label-md font-bold text-on-surface">智能票据入账</h3>
              </div>
              <span class="font-label-sm text-xs text-primary font-semibold">AI 自动解析</span>
            </div>
            <p class="font-label-sm text-label-sm text-on-surface-variant leading-relaxed mb-2">
              支持拖拽购物小票、餐厅发票或网购电子凭证，智能引擎自动匹配商户与金额并归类入账。
            </p>
          </div>
          <div class="pt-2 border-t border-surface-container">
            <router-link
              to="/ocr"
              class="w-full py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5 text-on-surface font-label-sm text-label-sm no-underline"
            >
              <span class="material-symbols-outlined text-sm text-primary">document_scanner</span>
              <span>拍照扫描或上传票据凭证</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 6. 新增单笔收支弹窗 (Stitch UI 风格弹窗) -->
    <div
      v-if="addDialog"
      class="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-200"
      @click.self="addDialog = false"
    >
      <div class="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col">
        <div class="px-5 py-3.5 bg-surface-container-low flex items-center justify-between border-b border-surface-container">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-xl">edit_note</span>
            <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">新增收支账目</h2>
          </div>
          <button class="text-on-surface-variant hover:text-on-surface transition-colors p-1 cursor-pointer" type="button" @click="addDialog = false">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div class="p-5 flex flex-col gap-3.5">
          <!-- 支出 / 收入 / 转账 分段切换 -->
          <div class="grid grid-cols-3 bg-surface-container-low p-1 rounded-xl">
            <button
              type="button"
              class="py-1.5 rounded-lg font-label-md text-label-md font-semibold transition-all text-center cursor-pointer"
              :class="newForm.type === '支出'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'"
              @click="newForm.type = '支出'"
            >
              支出
            </button>
            <button
              type="button"
              class="py-1.5 rounded-lg font-label-md text-label-md font-semibold transition-all text-center cursor-pointer"
              :class="newForm.type === '收入'
                ? 'bg-surface-container-lowest text-secondary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'"
              @click="newForm.type = '收入'"
            >
              收入
            </button>
            <button
              type="button"
              class="py-1.5 rounded-lg font-label-md text-label-md font-semibold transition-all text-center cursor-pointer"
              :class="newForm.type === '转账'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'"
              @click="newForm.type = '转账'"
            >
              转账
            </button>
          </div>

          <!-- 记账金额 -->
          <div class="flex flex-col gap-1">
            <label class="font-label-sm text-label-sm text-on-surface-variant">记账金额 (¥)</label>
            <div class="relative flex items-center">
              <span class="absolute left-3 font-amount-display text-2xl text-on-surface font-bold">¥</span>
              <input
                v-model="newForm.amount"
                class="w-full h-12 pl-9 pr-3 bg-surface-container-low text-on-surface rounded-xl font-amount-display text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/30"
                placeholder="0.00"
                step="0.01"
                type="number"
              />
            </div>
          </div>

          <!-- 分类与出资人 -->
          <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-1">
              <label class="font-label-sm text-label-sm text-on-surface-variant">归属品类</label>
              <select
                v-model="newForm.category"
                class="w-full h-10 bg-surface-container-low text-on-surface rounded-xl px-3 font-body-sm text-body-sm focus:outline-none cursor-pointer border border-surface-container"
              >
                <option value="生鲜食品">生鲜食品</option>
                <option value="商务午餐">商务午餐 / 餐饮</option>
                <option value="居家日常">居家日常</option>
                <option value="交通出行">交通出行</option>
                <option value="休闲娱乐">休闲娱乐</option>
                <option value="医疗健康">医疗健康</option>
                <option value="职业薪酬">职业薪酬</option>
                <option value="数码电器">数码电器</option>
              </select>
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-label-sm text-label-sm text-on-surface-variant">
                {{ ledgerStore.hasMultipleMembers ? '家庭成员' : '记账人' }}
              </label>
              <select
                v-model="newForm.member"
                class="w-full h-10 bg-surface-container-low text-on-surface rounded-xl px-3 font-body-sm text-body-sm focus:outline-none cursor-pointer border border-surface-container"
              >
                <option value="林知栖">林知栖 (主理人)</option>
                <option value="陈先生">陈先生 (协同人)</option>
                <option value="姥姥">姥姥 (长辈)</option>
              </select>
            </div>
          </div>

          <!-- 商户或用途备注 -->
          <div class="flex flex-col gap-1">
            <label class="font-label-sm text-label-sm text-on-surface-variant">商户或用途备注</label>
            <input
              v-model="newForm.title"
              class="w-full h-10 px-3 bg-surface-container-low text-on-surface rounded-xl font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-surface-container"
              placeholder="例如：周末盒马采购、星巴克咖啡..."
              type="text"
            />
          </div>

          <!-- 详细小票/物品描述 -->
          <div class="flex flex-col gap-1">
            <label class="font-label-sm text-label-sm text-on-surface-variant">商品明细摘要 (选填)</label>
            <input
              v-model="newForm.remark"
              class="w-full h-10 px-3 bg-surface-container-low text-on-surface rounded-xl font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-surface-container"
              placeholder="例如：进口眼肉牛排、日日鲜水培生菜..."
              type="text"
            />
          </div>

          <!-- 支付账户 -->
          <div class="flex flex-col gap-1">
            <label class="font-label-sm text-label-sm text-on-surface-variant">支付账户</label>
            <div class="grid grid-cols-3 gap-2">
              <label
                v-for="chan in ['微信支付', '支付宝', '招商银行']"
                :key="chan"
                class="flex items-center gap-2 p-2 bg-surface-container-low rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors"
                :class="newForm.account.includes(chan) ? 'ring-1 ring-primary bg-primary-fixed/20' : ''"
              >
                <input
                  v-model="newForm.account"
                  :value="chan"
                  class="accent-primary"
                  name="pay-chan"
                  type="radio"
                />
                <span class="font-label-sm text-label-sm">{{ chan }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="px-5 py-3.5 bg-surface-container-low flex items-center justify-end gap-3 border-t border-surface-container">
          <button
            class="px-4 py-1.5 rounded-xl text-on-surface-variant hover:text-on-surface font-label-md text-label-md cursor-pointer transition-colors"
            type="button"
            @click="addDialog = false"
          >
            取消
          </button>
          <button
            class="px-5 py-1.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-surface-tint transition-colors shadow-sm cursor-pointer"
            type="button"
            @click="submitNewBill"
          >
            确认记入账本
          </button>
        </div>
      </div>
    </div>

    <!-- 7. 账单明细深度详情弹窗 (Stitch UI 风格) -->
    <div
      v-if="detailDialog && activeBill"
      class="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-200"
      @click.self="detailDialog = false"
    >
      <div class="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col">
        <div class="px-5 py-3.5 bg-surface-container-low flex items-center justify-between border-b border-surface-container">
          <div class="flex items-center gap-2">
            <div
              class="w-7 h-7 rounded-lg flex items-center justify-center"
              :class="activeBill.type === '收入' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container-high text-on-surface'"
            >
              <span class="material-symbols-outlined text-base">{{ activeBill.icon || getCategoryIcon(activeBill.category) }}</span>
            </div>
            <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">账目明细核查</h2>
          </div>
          <button class="text-on-surface-variant hover:text-on-surface transition-colors p-1 cursor-pointer" type="button" @click="detailDialog = false">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div class="p-5 flex flex-col gap-3.5 text-xs">
          <!-- 金额与商户大卡片 -->
          <div class="p-4 rounded-xl bg-surface-container-low flex flex-col items-center justify-center text-center gap-1 border border-surface-container">
            <span class="font-label-sm text-on-surface-variant">{{ activeBill.title }}</span>
            <span
              class="text-3xl font-extrabold font-amount-display leading-tight"
              :class="activeBill.type === '收入' ? 'text-secondary' : 'text-primary'"
            >
              {{ activeBill.type === '收入' ? '+' : '-' }}¥{{ activeBill.amount.toFixed(2) }}
            </span>
            <span class="text-xs text-secondary font-medium mt-1 flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">check_circle</span>
              已核验记账 · 账目状态正常
            </span>
          </div>

          <!-- 核心属性 -->
          <div class="grid grid-cols-2 gap-3 p-3 bg-surface-container-low rounded-xl border border-surface-container">
            <div class="flex flex-col gap-0.5">
              <span class="font-label-sm text-on-surface-variant">记账时间</span>
              <span class="font-amount-table font-semibold text-on-surface">{{ activeBill.date }} {{ activeBill.time }} {{ getWeekday(activeBill.date) }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="font-label-sm text-on-surface-variant">分类科目</span>
              <span class="font-medium text-on-surface">{{ activeBill.category }} / {{ activeBill.subCategory || '日常' }}</span>
            </div>
            <div class="flex flex-col gap-0.5" v-if="ledgerStore.hasMultipleMembers">
              <span class="font-label-sm text-on-surface-variant">家庭成员</span>
              <div class="flex items-center gap-1.5 mt-0.5">
                <img :src="getMemberAvatar(activeBill.member)" class="w-4 h-4 rounded-full object-cover" />
                <span class="font-medium text-on-surface">{{ activeBill.member }}</span>
              </div>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="font-label-sm text-on-surface-variant">支付渠道</span>
              <span class="font-medium text-on-surface">{{ activeBill.account }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="font-label-sm text-on-surface-variant">凭证附件</span>
              <span class="font-medium text-primary">{{ activeBill.voucher || '无纸质凭证' }}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="font-label-sm text-on-surface-variant">所属账本</span>
              <span class="font-medium text-on-surface">{{ ledgerStore.currentLedger }} · 收支台账</span>
            </div>
          </div>

          <!-- 商品子项清单 -->
          <div v-if="activeBill.subItems && activeBill.subItems.length" class="flex flex-col gap-1.5">
            <span class="font-label-sm text-on-surface font-bold flex items-center justify-between">
              <span>小票商品提取要素 ({{ activeBill.subItems.length }}项)</span>
              <span class="text-primary font-mono">Vision-LLM 已校准</span>
            </span>
            <div class="rounded-xl border border-surface-container overflow-hidden">
              <table class="w-full text-left border-collapse text-xs">
                <thead class="bg-surface-container-low text-on-surface-variant">
                  <tr>
                    <th class="py-1.5 px-3">商品名称</th>
                    <th class="py-1.5 px-3 text-center w-16">数量</th>
                    <th class="py-1.5 px-3 text-right w-20">单价</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-surface-container">
                  <tr v-for="(it, idx) in activeBill.subItems" :key="idx" class="hover:bg-surface-container-low/40">
                    <td class="py-1.5 px-3 text-on-surface">{{ it.name }}</td>
                    <td class="py-1.5 px-3 text-center font-mono">{{ it.count }}</td>
                    <td class="py-1.5 px-3 text-right font-amount-table font-semibold text-on-surface">¥{{ it.price.toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 交易摘要说明 -->
          <div class="p-2.5 rounded-xl bg-surface-container-low text-on-surface-variant border border-surface-container">
            <span class="font-label-sm text-on-surface-variant block mb-0.5">摘要明细</span>
            <span class="text-on-surface">{{ activeBill.remark || '日常消费流水记录' }}</span>
          </div>
        </div>

        <div class="px-5 py-3 bg-surface-container-low flex items-center justify-between border-t border-surface-container">
          <button
            class="text-error hover:underline text-xs font-medium cursor-pointer"
            type="button"
            @click="deleteBill(activeBill.id); detailDialog = false"
          >
            删除此单记录
          </button>
          <div class="flex items-center gap-2">
            <button
              class="px-3.5 py-1.5 rounded-xl text-on-surface-variant hover:text-on-surface font-label-md text-xs cursor-pointer"
              type="button"
              @click="detailDialog = false"
            >
              关闭
            </button>
            <button
              class="px-4 py-1.5 rounded-xl bg-primary text-on-primary font-label-md text-xs font-semibold hover:bg-surface-tint transition-colors shadow-sm cursor-pointer"
              type="button"
              @click="detailDialog = false"
            >
              确认无误
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 8. 全局操作轻量 Toast -->
    <div
      v-if="toastVisible"
      class="fixed bottom-6 right-6 z-50 px-4 py-3 bg-inverse-surface text-inverse-on-surface rounded-xl shadow-lg flex items-center gap-2.5 text-xs animate-fadeIn"
    >
      <span class="material-symbols-outlined text-primary text-base">info</span>
      <span>{{ toastMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useLedgerStore } from '../stores/ledger'

const ledgerStore = useLedgerStore()

interface SubItem {
  name: string
  count: number
  price: number
}

interface BillDetailItem {
  id: string
  title: string
  category: string
  subCategory?: string
  date: string // YYYY-MM-DD
  time: string
  member: string
  amount: number
  type: '收入' | '支出' | '转账'
  account: string
  voucher?: string
  icon?: string
  remark?: string
  subItems?: SubItem[]
}

// 筛选项配置
const periodOptions = ['本月', '上月', '近7天', '今年']
const selectedPeriod = ref('本月')

const typeOptions = [
  { label: '全部类型', value: 'all' as const },
  { label: '支出', value: '支出' as const },
  { label: '收入', value: '收入' as const },
  { label: '转账', value: '转账' as const }
]
const filterType = ref<'all' | '支出' | '收入' | '转账'>('all')

const selectedCategory = ref('全部分类')
const selectedMember = ref('全部')
const searchQuery = ref('')

// 分页配置
const currentPage = ref(1)
const pageSize = ref(10)

// 勾选操作
const selectedRowIds = ref<string[]>([])

// 详细弹窗控制
const detailDialog = ref(false)
const activeBill = ref<BillDetailItem | null>(null)

// 新增账目弹窗
const addDialog = ref(false)
const newForm = reactive({
  type: '支出' as '支出' | '收入' | '转账',
  amount: '',
  title: '',
  category: '生鲜食品',
  member: '林知栖',
  account: '微信支付',
  remark: ''
})

// Toast 状态
const toastVisible = ref(false)
const toastMessage = ref('')
let toastTimer: any = null

const showToast = (msg: string) => {
  toastMessage.value = msg
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastVisible.value = false
  }, 3000)
}

// 完整真实流水数据 (与 Stitch UI 账目明细原型完全对齐)
const billsData = ref<BillDetailItem[]>([
  {
    id: 'b-1',
    title: '盒马鲜生 (万象天地店)',
    category: '生鲜食品',
    subCategory: '居家日用',
    date: '2024-10-28',
    time: '18:42',
    member: '林知栖',
    amount: 328.60,
    type: '支出',
    account: '微信支付',
    voucher: '发票 x1',
    icon: 'local_grocery_store',
    remark: '进口大西洋鲑鱼排、日日鲜水培生菜、安佳鲜牛奶',
    subItems: [
      { name: '进口大西洋鲑鱼排 300g', count: 1, price: 128.00 },
      { name: '日日鲜水培生菜 250g', count: 2, price: 9.90 },
      { name: '安佳全脂纯牛奶 1L*2', count: 1, price: 38.80 },
      { name: '澳洲安格斯牛肉饼', count: 1, price: 68.00 }
    ]
  },
  {
    id: 'b-2',
    title: '沃歌斯 Wagas (高新科技园)',
    category: '商务午餐',
    subCategory: '餐饮美食',
    date: '2024-10-28',
    time: '12:30',
    member: '林知栖',
    amount: 68.00,
    type: '支出',
    account: '支付宝',
    icon: 'restaurant',
    remark: '能量色拉配鲜榨果汁 · 团队外出会谈'
  },
  {
    id: 'b-3',
    title: '某人工智能科技公司 · 10月薪资发放',
    category: '月度薪资',
    subCategory: '职业薪酬',
    date: '2024-10-27',
    time: '10:15',
    member: '陈先生',
    amount: 18500.00,
    type: '收入',
    account: '招行一卡通',
    voucher: '回单',
    icon: 'payments',
    remark: '陈先生主账户统筹入账 (基本薪酬+绩效奖金)'
  },
  {
    id: 'b-4',
    title: '奈尔宝儿童乐园 (周末亲子活动票)',
    category: '亲子乐园',
    subCategory: '休闲娱乐',
    date: '2024-10-26',
    time: '19:30',
    member: '陈先生',
    amount: 398.00,
    type: '支出',
    account: '微信支付',
    voucher: '门票',
    icon: 'attractions',
    remark: '陪伴孩子周末拓展活动'
  },
  {
    id: 'b-5',
    title: '中国石化 (深南大道加油站)',
    category: '车辆加油',
    subCategory: '交通出行',
    date: '2024-10-25',
    time: '15:20',
    member: '陈先生',
    amount: 420.00,
    type: '支出',
    account: '建行信用卡',
    voucher: '发票 x1',
    icon: 'local_gas_station',
    remark: '95号汽油加满 49.5升'
  },
  {
    id: 'b-6',
    title: '叮当快药 (益生菌与维他命咀嚼片)',
    category: '健康保障',
    subCategory: '医疗健康',
    date: '2024-10-24',
    time: '20:10',
    member: '林知栖',
    amount: 156.40,
    type: '支出',
    account: '医保账户',
    voucher: '电子票',
    icon: 'medical_services',
    remark: '换季居家常备医药箱补充'
  },
  {
    id: 'b-7',
    title: '南方电网 · 10月份生活用电扣缴',
    category: '水电物业',
    subCategory: '居家生活',
    date: '2024-10-22',
    time: '09:40',
    member: '陈先生',
    amount: 245.80,
    type: '支出',
    account: '招行扣款',
    voucher: '月账单',
    icon: 'bolt',
    remark: '南山区金地花园自动代扣'
  },
  {
    id: 'b-8',
    title: '山姆会员商店 (前海旗舰店)',
    category: '生鲜食品',
    subCategory: '居家日用',
    date: '2024-10-20',
    time: '16:10',
    member: '林知栖',
    amount: 896.00,
    type: '支出',
    account: '招行信用卡',
    voucher: '发票 x1',
    icon: 'local_grocery_store',
    remark: '半个月生活大包装物资补齐',
    subItems: [
      { name: '澳洲进口谷饲牛小排 1kg', count: 1, price: 178.00 },
      { name: 'Member\'s Mark 鲜牛奶 2L*2', count: 1, price: 42.90 },
      { name: '瑞士卷 16片装', count: 1, price: 68.00 },
      { name: '三文鱼刺身拼盘 400g', count: 1, price: 139.60 }
    ]
  },
  {
    id: 'b-9',
    title: '林知栖 10月份薪资入账',
    category: '月度薪资',
    subCategory: '职业薪酬',
    date: '2024-10-15',
    time: '10:00',
    member: '林知栖',
    amount: 16500.00,
    type: '收入',
    account: '招行一卡通',
    voucher: '回单',
    icon: 'payments',
    remark: '设计总监月度薪资与季度奖金发放'
  },
  {
    id: 'b-10',
    title: '太二酸菜鱼聚餐',
    category: '商务午餐',
    subCategory: '餐饮美食',
    date: '2024-10-12',
    time: '19:15',
    member: '陈先生',
    amount: 188.00,
    type: '支出',
    account: '支付宝',
    voucher: '发票 x1',
    icon: 'restaurant',
    remark: '周末亲友聚餐'
  },
  {
    id: 'b-11',
    title: '滴滴特惠快车出行接送',
    category: '车辆加油',
    subCategory: '交通出行',
    date: '2024-10-11',
    time: '18:10',
    member: '林知栖',
    amount: 28.60,
    type: '支出',
    account: '支付宝',
    icon: 'directions_car',
    remark: '晚高峰暴雨接送回家'
  },
  {
    id: 'b-12',
    title: '中国银行货币基金分红入账',
    category: '月度薪资',
    subCategory: '理财收益',
    date: '2024-10-08',
    time: '08:30',
    member: '陈先生',
    amount: 320.50,
    type: '收入',
    account: '中国银行',
    voucher: '回单',
    icon: 'account_balance',
    remark: '稳健型应急储备金投资分红结息'
  }
])

// 动态日期显示
const displayDateRange = computed(() => {
  if (selectedPeriod.value === '本月') return '2024-10-01 ~ 2024-10-31'
  if (selectedPeriod.value === '上月') return '2024-09-01 ~ 2024-09-30'
  if (selectedPeriod.value === '近7天') return '2024-10-22 ~ 2024-10-28'
  return '2024-01-01 ~ 2024-10-31'
})

// 多维检索过滤
const filteredBills = computed(() => {
  return billsData.value.filter(b => {
    // 搜索词过滤
    if (searchQuery.value) {
      const q = searchQuery.value.trim().toLowerCase()
      const matchTitle = b.title.toLowerCase().includes(q)
      const matchRemark = (b.remark || '').toLowerCase().includes(q)
      const matchCategory = b.category.toLowerCase().includes(q)
      const matchSubItem = b.subItems?.some(it => it.name.toLowerCase().includes(q))
      if (!matchTitle && !matchRemark && !matchCategory && !matchSubItem) return false
    }

    // 收支类型过滤
    if (filterType.value !== 'all' && b.type !== filterType.value) {
      return false
    }

    // 分类过滤
    if (selectedCategory.value !== '全部分类') {
      const cat = selectedCategory.value
      const matchesCat = b.category.includes(cat) || (b.subCategory && b.subCategory.includes(cat))
      if (!matchesCat) return false
    }

    // 成员过滤
    if (selectedMember.value !== '全部' && b.member !== selectedMember.value) {
      return false
    }

    return true
  })
})

// 分页数据
const paginatedBills = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredBills.value.slice(start, start + pageSize.value)
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredBills.value.length / pageSize.value))
})

const pageStart = computed(() => {
  if (filteredBills.value.length === 0) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const pageEnd = computed(() => {
  return Math.min(currentPage.value * pageSize.value, filteredBills.value.length)
})

// 统计金额
const currentFilterExpense = computed(() => {
  return filteredBills.value.filter(b => b.type === '支出').reduce((sum, b) => sum + b.amount, 0)
})

const currentFilterIncome = computed(() => {
  return filteredBills.value.filter(b => b.type === '收入').reduce((sum, b) => sum + b.amount, 0)
})

// 勾选批量操作
const isAllSelected = computed(() => {
  return paginatedBills.value.length > 0 && paginatedBills.value.every(b => selectedRowIds.value.includes(b.id))
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    const pageIds = paginatedBills.value.map(b => b.id)
    selectedRowIds.value = selectedRowIds.value.filter(id => !pageIds.includes(id))
  } else {
    paginatedBills.value.forEach(b => {
      if (!selectedRowIds.value.includes(b.id)) {
        selectedRowIds.value.push(b.id)
      }
    })
  }
}

const toggleSelectRow = (id: string) => {
  const idx = selectedRowIds.value.indexOf(id)
  if (idx >= 0) {
    selectedRowIds.value.splice(idx, 1)
  } else {
    selectedRowIds.value.push(id)
  }
}

const batchDelete = () => {
  if (confirm(`确定要删除选中的 ${selectedRowIds.value.length} 笔账目流水吗？`)) {
    billsData.value = billsData.value.filter(b => !selectedRowIds.value.includes(b.id))
    showToast(`成功批量删除 ${selectedRowIds.value.length} 笔流水记录`)
    selectedRowIds.value = []
  }
}

const batchCategorize = () => {
  showToast('已启动批量智能分类助手')
}

const deleteBill = (id: string) => {
  billsData.value = billsData.value.filter(b => b.id !== id)
  showToast('账目流水已移出账本')
}

const resetFilters = () => {
  selectedPeriod.value = '本月'
  filterType.value = 'all'
  selectedCategory.value = '全部分类'
  selectedMember.value = '全部'
  searchQuery.value = ''
  currentPage.value = 1
  showToast('已重置所有检索条件')
}

const saveView = () => {
  showToast('当前筛选视图已保存至常用收藏')
}

const exportExcel = () => {
  showToast(`已成功导出 ${filteredBills.value.length} 笔对账流水 (Excel格式)`)
}

const openRecurringModal = () => {
  showToast('周期性收支已开启：房贷与水电费次月自动执行')
}

const toggleDateFilter = () => {
  showToast('已定位至 2024年10月度核算区间')
}

// 辅助展示
const getMemberAvatar = (member: string) => {
  if (member.includes('陈')) return '/avatars/member-chen.png'
  if (member.includes('姥姥')) return '/avatars/白发老奶奶.png'
  return '/avatars/user-lin.png'
}

const getWeekday = (dateStr: string) => {
  const d = new Date(dateStr)
  const map = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return map[d.getDay()] || ''
}

const getCategoryIcon = (cat: string) => {
  if (cat.includes('生鲜')) return 'local_grocery_store'
  if (cat.includes('餐') || cat.includes('食')) return 'restaurant'
  if (cat.includes('薪') || cat.includes('工资')) return 'payments'
  if (cat.includes('乐') || cat.includes('游')) return 'attractions'
  if (cat.includes('油') || cat.includes('车') || cat.includes('交')) return 'local_gas_station'
  if (cat.includes('医') || cat.includes('药')) return 'medical_services'
  if (cat.includes('电') || cat.includes('水') || cat.includes('居')) return 'bolt'
  return 'receipt_long'
}

const getCategoryIconBadgeClass = (cat: string, type: string) => {
  if (type === '收入') return 'bg-primary-fixed text-on-primary-fixed'
  if (cat.includes('生鲜')) return 'bg-primary-fixed text-on-primary-fixed'
  if (cat.includes('餐')) return 'bg-tertiary-fixed text-on-tertiary-fixed'
  if (cat.includes('亲子') || cat.includes('乐园')) return 'bg-primary-fixed-dim text-on-primary-fixed-variant'
  if (cat.includes('医')) return 'bg-error-container text-on-error-container'
  return 'bg-surface-container-highest text-on-surface'
}

const getChannelDotClass = (account: string) => {
  if (account.includes('微信')) return 'bg-secondary'
  if (account.includes('支付宝')) return 'bg-primary'
  if (account.includes('招行') || account.includes('建行')) return 'bg-primary'
  return 'bg-secondary'
}

const getVoucherIcon = (voucher: string) => {
  if (voucher.includes('回单')) return 'verified'
  if (voucher.includes('门票')) return 'confirmation_number'
  return 'receipt_long'
}

// 弹窗与详情
const openDetail = (item: BillDetailItem) => {
  activeBill.value = item
  detailDialog.value = true
}

const openAddDialog = () => {
  newForm.amount = ''
  newForm.title = ''
  newForm.remark = ''
  newForm.type = '支出'
  addDialog.value = true
}

const submitNewBill = () => {
  const amt = parseFloat(newForm.amount)
  if (!amt || !newForm.title) {
    alert('请填写完整记账金额与商户说明')
    return
  }

  billsData.value.unshift({
    id: `b-${Date.now()}`,
    title: newForm.title,
    category: newForm.category,
    subCategory: '新增记账',
    date: new Date().toISOString().slice(0, 10),
    time: new Date().toTimeString().slice(0, 5),
    member: newForm.member,
    amount: amt,
    type: newForm.type,
    account: newForm.account,
    voucher: '电子票',
    icon: getCategoryIcon(newForm.category),
    remark: newForm.remark || '手动录入开支'
  })

  addDialog.value = false
  showToast(`已成功录入「${newForm.title}」¥${amt.toFixed(2)}`)
}
</script>

<style scoped>
/* 针对 16:9 宽屏布局定制微调，保持和 Stitch UI 高度一致 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.18s ease-out forwards;
}

/* 保证表格单元格紧凑整洁 */
table {
  border-spacing: 0;
}
</style>
