<template>
  <div class="w-full max-w-[1400px] mx-auto p-4 md:p-6 flex flex-col gap-6 min-h-full" style="background-color: #fcf9f6">
    <!-- 1. 顶部标题栏 -->
    <header class="w-full px-5 py-4 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex flex-col gap-1.5">
        <div class="flex items-center gap-2 font-label-sm text-xs text-outline">
          <span>系统设置</span>
          <span class="material-symbols-outlined text-xs">chevron_right</span>
          <span class="text-on-surface-variant font-medium">个人档案与偏好配置</span>
        </div>
        <div class="flex items-center gap-3 flex-wrap">
          <h1 class="font-headline-lg text-2xl text-on-surface font-bold tracking-tight">
            个人与账本偏好设置
          </h1>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-xs font-semibold">
            <span class="w-2 h-2 rounded-full bg-secondary"></span>
            当前身份：账本主理人（林知栖）
          </span>
        </div>
      </div>

      <!-- 右侧操作 -->
      <div class="flex items-center gap-3">
        <button
          class="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant text-xs font-medium transition-colors cursor-pointer border border-outline-variant/30"
          type="button"
          title="将测试数据重置为演示默认值"
          @click="loadDemoData"
        >
          <span class="material-symbols-outlined text-base text-primary">restart_alt</span>
          <span>载入演示数据</span>
        </button>

        <button
          class="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container hover:bg-primary text-on-primary text-xs font-semibold shadow-sm active:scale-95 transition-all cursor-pointer"
          type="button"
          @click="saveAllSettings"
        >
          <span class="material-symbols-outlined text-base">save</span>
          <span>保存设置</span>
        </button>
      </div>
    </header>

    <!-- 2. 分类标签栏 -->
    <nav class="flex items-center gap-2 bg-surface-container-high/60 p-1.5 rounded-2xl w-fit flex-wrap">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
        :class="activeTab === tab.id
          ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
          : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/50 font-medium'"
        type="button"
        @click="activeTab = tab.id"
      >
        <span
          class="material-symbols-outlined text-base"
          :class="activeTab === tab.id ? 'text-primary' : 'text-outline'"
        >
          {{ tab.icon }}
        </span>
        <span>{{ tab.label }}</span>
      </button>

      <button
        class="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ml-1"
        :class="activeTab === 'all'
          ? 'bg-primary/10 text-primary font-bold'
          : 'text-outline hover:text-on-surface hover:bg-surface-container-lowest/50'"
        type="button"
        @click="activeTab = 'all'"
      >
        <span class="material-symbols-outlined text-base">view_quilt</span>
        <span>完整视图</span>
      </button>
    </nav>

    <!-- 3. 主体内容网格 (双栏布局) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- 左列 (7 列) -->
      <div
        class="lg:col-span-7 flex flex-col gap-6"
        v-show="activeTab === 'all' || activeTab === 'profile' || activeTab === 'budget'"
      >
        <!-- 模块 1: 基本资料与家庭角色 -->
        <section
          v-show="activeTab === 'all' || activeTab === 'profile'"
          class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-5"
        >
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <h2 class="font-headline-sm text-base text-on-surface font-bold">基本信息与家庭角色</h2>
              </div>
              <p class="font-body-sm text-xs text-outline mt-1 ml-4.5">维护个人身份与在家庭账本协同中的称谓定位</p>
            </div>
            <span class="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-xs font-semibold">
              用户编号: #UID-10928
            </span>
          </div>

          <!-- 字段输入表单 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="font-label-sm text-xs text-on-surface-variant font-semibold">用户姓名 / 昵称</label>
              <input
                v-model="profileForm.nickname"
                class="px-3.5 py-2.5 rounded-xl bg-surface-container-low font-body-md text-sm text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all border border-transparent focus:border-primary/40"
                type="text"
                placeholder="例如：林知栖"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="font-label-sm text-xs text-on-surface-variant font-semibold">家庭角色与分工</label>
              <input
                v-model="profileForm.role"
                class="px-3.5 py-2.5 rounded-xl bg-surface-container-low font-body-md text-sm text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all border border-transparent focus:border-primary/40"
                type="text"
                placeholder="例如：户主 · 财务主管"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="font-label-sm text-xs text-on-surface-variant font-semibold">联系手机号码</label>
              <input
                v-model="profileForm.phone"
                class="px-3.5 py-2.5 rounded-xl bg-surface-container-low font-body-md text-sm text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all border border-transparent focus:border-primary/40 font-mono"
                type="text"
                placeholder="138 **** 9204"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="font-label-sm text-xs text-on-surface-variant font-semibold">联系电子邮箱</label>
              <input
                v-model="profileForm.email"
                class="px-3.5 py-2.5 rounded-xl bg-surface-container-low font-body-md text-sm text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all border border-transparent focus:border-primary/40"
                type="email"
                placeholder="lin@mosaic.me"
              />
            </div>
          </div>

          <!-- 手绘卡通头像选择器 -->
          <div class="pt-3 flex flex-col gap-3 bg-surface-container-low/60 p-4 rounded-xl border border-outline-variant/15">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-lg">face</span>
                <span class="font-headline-sm text-sm text-on-surface font-bold">家庭手绘卡通形象</span>
                <span class="text-xs text-primary font-medium">当前选中: {{ currentAvatarName }}</span>
              </div>
              <span class="text-xs text-outline">点击即可即时切换</span>
            </div>

            <!-- 常用 6 款手绘头像 -->
            <div class="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-1">
              <div
                v-for="av in primaryAvatars"
                :key="av.id"
                class="flex flex-col items-center gap-1.5 group cursor-pointer"
                @click="selectAvatar(av)"
              >
                <div
                  class="relative w-14 h-14 rounded-2xl overflow-hidden shadow-xs transition-all duration-200"
                  :class="selectedAvatarId === av.id
                    ? 'ring-2 ring-primary-container p-0.5 bg-primary-fixed scale-105 shadow-md'
                    : 'hover:scale-105 bg-surface-container opacity-85 hover:opacity-100'"
                >
                  <img
                    :src="av.src"
                    :alt="av.name"
                    class="w-full h-full object-cover rounded-xl"
                  />
                  <div
                    v-if="selectedAvatarId === av.id"
                    class="absolute bottom-0 inset-x-0 bg-primary-container/95 text-on-primary flex items-center justify-center py-0.5"
                  >
                    <span class="material-symbols-outlined text-xs font-bold">check</span>
                  </div>
                </div>
                <span
                  class="font-label-sm text-xs text-center transition-colors truncate max-w-[72px]"
                  :class="selectedAvatarId === av.id
                    ? 'text-primary font-bold'
                    : 'text-on-surface-variant group-hover:text-primary'"
                >
                  {{ av.name }}
                </span>
              </div>
            </div>

            <!-- 展开更多家庭成员头像 -->
            <div class="pt-2 border-t border-outline-variant/15 flex flex-col gap-2">
              <button
                class="self-start text-xs text-primary hover:text-primary-container flex items-center gap-1 font-medium cursor-pointer"
                type="button"
                @click="showMoreAvatars = !showMoreAvatars"
              >
                <span class="material-symbols-outlined text-sm transition-transform" :class="{ 'rotate-180': showMoreAvatars }">
                  expand_more
                </span>
                <span>{{ showMoreAvatars ? '收起备选形象' : '查看更多备选家庭形象 (15 款手绘素材)' }}</span>
              </button>

              <div v-if="showMoreAvatars" class="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-2">
                <div
                  v-for="av in extendedAvatars"
                  :key="av.id"
                  class="flex flex-col items-center gap-1.5 group cursor-pointer"
                  @click="selectAvatar(av)"
                >
                  <div
                    class="relative w-12 h-12 rounded-xl overflow-hidden shadow-xs transition-all duration-200"
                    :class="selectedAvatarId === av.id
                      ? 'ring-2 ring-primary-container p-0.5 bg-primary-fixed scale-105 shadow-md'
                      : 'hover:scale-105 bg-surface-container opacity-80 hover:opacity-100'"
                  >
                    <img
                      :src="av.src"
                      :alt="av.name"
                      class="w-full h-full object-cover rounded-lg"
                    />
                    <div
                      v-if="selectedAvatarId === av.id"
                      class="absolute bottom-0 inset-x-0 bg-primary-container/95 text-on-primary flex items-center justify-center py-0.5"
                    >
                      <span class="material-symbols-outlined text-[10px] font-bold">check</span>
                    </div>
                  </div>
                  <span
                    class="font-label-sm text-[11px] text-center transition-colors truncate max-w-[64px]"
                    :class="selectedAvatarId === av.id ? 'text-primary font-bold' : 'text-on-surface-variant'"
                  >
                    {{ av.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 模块 2: 薪资基准与家庭预算 -->
        <section
          v-show="activeTab === 'all' || activeTab === 'budget'"
          class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-5"
        >
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                <h2 class="font-headline-sm text-base text-on-surface font-bold">薪资与月度预算规划</h2>
              </div>
              <p class="font-body-sm text-xs text-outline mt-1 ml-4.5">设定家庭收入基准与资金分配比例模型</p>
            </div>
            <span class="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-xs font-semibold">
              自动按月结转测算
            </span>
          </div>

          <!-- 薪资与预算参数输入 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- 月度固定薪资 -->
            <div class="flex flex-col gap-1.5">
              <label class="font-label-sm text-xs text-on-surface-variant font-semibold">月度税后固定薪资</label>
              <div class="relative">
                <input
                  v-model.number="salaryForm.monthlySalary"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low font-amount-table text-sm text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all font-semibold border border-transparent focus:border-primary/40 pl-8"
                  type="number"
                  min="0"
                  step="500"
                />
                <span class="absolute left-3 top-2.5 text-xs text-outline font-bold">¥</span>
                <span class="absolute right-3 top-2.5 text-xs text-outline font-medium">/ 月</span>
              </div>
            </div>

            <!-- 每月发薪日 -->
            <div class="flex flex-col gap-1.5">
              <label class="font-label-sm text-xs text-on-surface-variant font-semibold">每月自动入账/发薪日</label>
              <div class="relative">
                <select
                  v-model="salaryForm.payDay"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low font-body-md text-sm text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all cursor-pointer border border-transparent appearance-none"
                >
                  <option v-for="d in 31" :key="d" :value="d">
                    每月 {{ d }} 日 {{ d === 10 ? '（常规发薪日）' : '' }}
                  </option>
                </select>
                <span class="material-symbols-outlined absolute right-3 top-2.5 text-outline text-lg pointer-events-none">
                  calendar_today
                </span>
              </div>
            </div>

            <!-- 月度支出预算上限 -->
            <div class="flex flex-col gap-1.5">
              <label class="font-label-sm text-xs text-on-surface-variant font-semibold">全家月度支出预算上限</label>
              <div class="relative">
                <input
                  v-model.number="salaryForm.monthlyBudgetLimit"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low font-amount-table text-sm text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all font-semibold border border-transparent focus:border-primary/40 pl-8"
                  type="number"
                  min="0"
                  step="500"
                />
                <span class="absolute left-3 top-2.5 text-xs text-outline font-bold">¥</span>
                <span class="absolute right-3 top-2.5 text-xs text-outline font-medium">/ 预算</span>
              </div>
            </div>

            <!-- 年终结余预期 -->
            <div class="flex flex-col gap-1.5">
              <label class="font-label-sm text-xs text-on-surface-variant font-semibold">年度储蓄理财目标</label>
              <div class="relative">
                <input
                  v-model.number="salaryForm.annualSavingsTarget"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low font-amount-table text-sm text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all font-semibold border border-transparent focus:border-primary/40 pl-8"
                  type="number"
                  min="0"
                  step="5000"
                />
                <span class="absolute left-3 top-2.5 text-xs text-outline font-bold">¥</span>
                <span class="absolute right-3 top-2.5 text-xs text-outline font-medium">/ 年</span>
              </div>
            </div>
          </div>

          <!-- 结转至家庭公用金比例滑块 -->
          <div class="p-4 rounded-xl bg-surface-container-low flex flex-col gap-3 border border-outline-variant/15">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-lg">pie_chart</span>
                <span class="font-label-md text-xs text-on-surface font-semibold">薪资自动分配至家庭公用金比例</span>
              </div>
              <span class="font-amount-table text-sm text-primary font-bold">
                {{ salaryForm.familyShareRatio }}% 家庭公用 / {{ 100 - salaryForm.familyShareRatio }}% 个人自由支配
              </span>
            </div>

            <!-- 滑块控制 -->
            <div class="relative flex items-center py-1">
              <input
                v-model.number="salaryForm.familyShareRatio"
                type="range"
                min="0"
                max="100"
                step="5"
                class="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary"
              />
            </div>

            <!-- 双色进度条展示 -->
            <div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden flex">
              <div
                class="bg-primary-container h-full transition-all duration-200"
                :style="{ width: `${salaryForm.familyShareRatio}%` }"
              ></div>
              <div
                class="bg-secondary-container h-full transition-all duration-200"
                :style="{ width: `${100 - salaryForm.familyShareRatio}%` }"
              ></div>
            </div>

            <!-- 测算分解 -->
            <div class="flex items-center justify-between font-label-sm text-xs text-outline flex-wrap gap-2 pt-0.5">
              <span class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-primary-container"></span>
                转入全家公共开销账户:
                <b class="text-on-surface font-amount-table text-sm font-semibold">
                  ¥ {{ calculatedFamilyPoolAmount.toLocaleString() }}
                </b>
              </span>
              <span class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-secondary-container"></span>
                自留个人自由支配零花:
                <b class="text-on-surface font-amount-table text-sm font-semibold">
                  ¥ {{ calculatedPersonalAllowanceAmount.toLocaleString() }}
                </b>
              </span>
            </div>
          </div>
        </section>
      </div>

      <!-- 右列 (5 列) -->
      <div
        class="lg:col-span-5 flex flex-col gap-6"
        v-show="activeTab === 'all' || activeTab === 'preferences' || activeTab === 'system'"
      >
        <!-- 模块 3: 记账偏好与提醒通知 -->
        <section
          v-show="activeTab === 'all' || activeTab === 'preferences'"
          class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-5"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                <h2 class="font-headline-sm text-base text-on-surface font-bold">记账偏好与通知提醒</h2>
              </div>
              <p class="font-body-sm text-xs text-outline mt-1 ml-4.5">设置日常记账通知与超预算阈值提醒</p>
            </div>
            <div class="w-8 h-8 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <span class="material-symbols-outlined text-lg">tune</span>
            </div>
          </div>

          <!-- 开关列表 -->
          <div class="flex flex-col gap-3">
            <!-- 预算预警 -->
            <div class="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/10">
              <div class="flex flex-col pr-2">
                <span class="font-label-md text-xs text-on-surface font-semibold">预算接近 85% 阈值提醒</span>
                <span class="font-body-sm text-[11px] text-outline mt-0.5">
                  当月家庭支出快达到上限时，在首页与通知栏提示
                </span>
              </div>
              <div
                class="w-11 h-6 rounded-full p-0.5 flex items-center cursor-pointer transition-colors shrink-0 shadow-inner"
                :class="preferencesForm.budgetAlert ? 'bg-primary-container justify-end' : 'bg-surface-container-high justify-start'"
                @click="preferencesForm.budgetAlert = !preferencesForm.budgetAlert"
              >
                <div class="w-5 h-5 rounded-full bg-surface-container-lowest shadow-md"></div>
              </div>
            </div>

            <!-- 成员记账动态通知 -->
            <div class="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/10">
              <div class="flex flex-col pr-2">
                <span class="font-label-md text-xs text-on-surface font-semibold">家庭成员记账动态提醒</span>
                <span class="font-body-sm text-[11px] text-outline mt-0.5">
                  配偶或长辈记入新账单时同步在通知中心提示
                </span>
              </div>
              <div
                class="w-11 h-6 rounded-full p-0.5 flex items-center cursor-pointer transition-colors shrink-0 shadow-inner"
                :class="preferencesForm.memberBillAlert ? 'bg-primary-container justify-end' : 'bg-surface-container-high justify-start'"
                @click="preferencesForm.memberBillAlert = !preferencesForm.memberBillAlert"
              >
                <div class="w-5 h-5 rounded-full bg-surface-container-lowest shadow-md"></div>
              </div>
            </div>

            <!-- OCR 票据识别后自动记账 -->
            <div class="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/10">
              <div class="flex flex-col pr-2">
                <span class="font-label-md text-xs text-on-surface font-semibold">智能小票识别自动核对入账</span>
                <span class="font-body-sm text-[11px] text-outline mt-0.5">
                  OCR 识别完成商户与金额后，直接生成待确认明细
                </span>
              </div>
              <div
                class="w-11 h-6 rounded-full p-0.5 flex items-center cursor-pointer transition-colors shrink-0 shadow-inner"
                :class="preferencesForm.ocrAutoConfirm ? 'bg-primary-container justify-end' : 'bg-surface-container-high justify-start'"
                @click="preferencesForm.ocrAutoConfirm = !preferencesForm.ocrAutoConfirm"
              >
                <div class="w-5 h-5 rounded-full bg-surface-container-lowest shadow-md"></div>
              </div>
            </div>

            <!-- 默认记账币种 -->
            <div class="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/10 flex items-center justify-between">
              <div class="flex flex-col">
                <span class="font-label-md text-xs text-on-surface font-semibold">默认币种符号</span>
                <span class="font-body-sm text-[11px] text-outline mt-0.5">人民币 CNY（¥）</span>
              </div>
              <span class="px-2 py-1 rounded-lg bg-surface-container text-xs font-mono text-on-surface-variant font-semibold">
                CNY · ¥
              </span>
            </div>
          </div>
        </section>

        <!-- 模块 4: 毕业设计演示与系统信息 -->
        <section
          v-show="activeTab === 'all' || activeTab === 'system'"
          class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-5"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                <h2 class="font-headline-sm text-base text-on-surface font-bold">系统与演示信息</h2>
              </div>
              <p class="font-body-sm text-xs text-outline mt-1 ml-4.5">毕业设计答辩演示与系统环境说明</p>
            </div>
            <div class="w-8 h-8 rounded-xl bg-secondary-container flex items-center justify-center text-secondary shrink-0">
              <span class="material-symbols-outlined text-lg">school</span>
            </div>
          </div>

          <!-- 系统卡片 -->
          <div class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/15 flex flex-col gap-2.5">
            <div class="flex items-center justify-between text-xs">
              <span class="text-outline">系统名称</span>
              <span class="font-semibold text-on-surface">Mosaic 家庭智能财务管家</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-outline">系统定位</span>
              <span class="font-semibold text-primary">本科毕业设计演示系统</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-outline">技术架构</span>
              <span class="font-mono text-on-surface-variant">Vue 3 + Vite + TypeScript + Pinia</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-outline">当前运行模式</span>
              <span class="text-secondary font-medium flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                本地响应式演示环境 (Mock Storage)
              </span>
            </div>
          </div>

          <!-- 快捷操作按钮组 -->
          <div class="grid grid-cols-2 gap-3 pt-1">
            <button
              class="py-2.5 px-3 rounded-xl border border-outline-variant/40 hover:bg-surface-container text-xs font-semibold text-on-surface transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              type="button"
              @click="exportMockData"
            >
              <span class="material-symbols-outlined text-base text-secondary">download</span>
              <span>导出演示配置</span>
            </button>

            <button
              class="py-2.5 px-3 rounded-xl border border-outline-variant/40 hover:bg-surface-container text-xs font-semibold text-primary transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              type="button"
              @click="loadDemoData"
            >
              <span class="material-symbols-outlined text-base">refresh</span>
              <span>恢复演示初始值</span>
            </button>
          </div>
        </section>
      </div>
    </div>

    <!-- 4. 底部保存操作条 -->
    <footer class="mt-2 pt-4 border-t border-surface-container-high flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 bg-surface/90 backdrop-blur pb-2 z-10">
      <div class="flex items-center gap-2 text-outline font-body-sm text-xs">
        <span class="material-symbols-outlined text-base text-primary">info</span>
        <span>设置更改后立即生效，公用金比例将自动联动至家庭总账本</span>
      </div>

      <div class="flex items-center gap-3 shrink-0">
        <button
          class="px-4 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant text-xs font-medium transition-colors cursor-pointer"
          type="button"
          @click="revertChanges"
        >
          撤销修改
        </button>

        <button
          class="px-6 py-2 rounded-xl bg-primary-container hover:bg-primary text-on-primary text-xs font-semibold shadow-sm active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          type="button"
          :disabled="isSaving"
          @click="saveAllSettings"
        >
          <span v-if="!isSaving" class="material-symbols-outlined text-base">check_circle</span>
          <span v-else class="material-symbols-outlined text-base animate-spin">refresh</span>
          <span>{{ isSaving ? '保存中...' : '保存并应用设置' }}</span>
        </button>
      </div>
    </footer>

    <!-- 全局 Toast 提示 -->
    <div
      v-if="toast.show"
      class="fixed bottom-16 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-lg border transition-all duration-300"
      :class="toast.type === 'success'
        ? 'bg-secondary-container text-on-secondary-container border-secondary/30'
        : 'bg-surface-container-highest text-on-surface border-outline-variant/40'"
    >
      <span class="material-symbols-outlined text-base">
        {{ toast.type === 'success' ? 'check_circle' : 'info' }}
      </span>
      <span class="text-xs font-semibold">{{ toast.message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLedgerStore } from '../stores/ledger'
import { useAuthStore } from '../stores/auth'

const ledgerStore = useLedgerStore()
const authStore = useAuthStore()

// 1. 分类标签
interface NavTab {
  id: string
  label: string
  icon: string
}

const tabs: NavTab[] = [
  { id: 'profile', label: '1. 个人资料与头像', icon: 'person' },
  { id: 'budget', label: '2. 薪资与预算规划', icon: 'payments' },
  { id: 'preferences', label: '3. 记账与通知提醒', icon: 'tune' },
  { id: 'system', label: '4. 系统与演示信息', icon: 'school' }
]

const activeTab = ref<string>('all')

// 2. 个人资料表单
const DEFAULT_PROFILE = {
  nickname: '林知栖',
  role: '户主 · 财务主管',
  phone: '138 **** 9204',
  email: 'lin****@mosaic.me'
}

const profileForm = ref({ ...DEFAULT_PROFILE })

// 3. 手绘卡通头像
interface AvatarOption {
  id: string
  name: string
  src: string
}

const primaryAvatars: AvatarOption[] = [
  { id: 'mom', name: '知性妈妈', src: '/avatars/user-lin.png' },
  { id: 'dad', name: '儒雅先生', src: '/avatars/眼镜男士.png' },
  { id: 'grandpa', name: '慈祥爷爷', src: '/avatars/白发老爷爷.png' },
  { id: 'grandma', name: '慈祥奶奶', src: '/avatars/白发老奶奶.png' },
  { id: 'boy', name: '运动男孩', src: '/avatars/运动男孩.png' },
  { id: 'girl', name: '元气女孩', src: '/avatars/刘海女孩.png' }
]

const extendedAvatars: AvatarOption[] = [
  { id: 'ext1', name: '双丸子头女孩', src: '/avatars/双丸子头女孩.png' },
  { id: 'ext2', name: '短发女士', src: '/avatars/短发女士.png' },
  { id: 'ext3', name: '发髻女士', src: '/avatars/发髻女士.png' },
  { id: 'ext4', name: '发髻女士2', src: '/avatars/发髻女士_2.png' },
  { id: 'ext5', name: '卷发眼镜男士', src: '/avatars/卷发眼镜男士.png' },
  { id: 'ext6', name: '白发眼镜男士', src: '/avatars/白发眼镜男士.png' },
  { id: 'ext7', name: '短发男孩', src: '/avatars/短发男孩.png' },
  { id: 'ext8', name: '棒球帽男孩', src: '/avatars/棒球帽男孩.png' },
  { id: 'ext9', name: '长发女士', src: '/avatars/长发女士_2.png' }
]

const showMoreAvatars = ref(false)
const selectedAvatarId = ref<string>('mom')

const currentAvatarName = computed(() => {
  const all = [...primaryAvatars, ...extendedAvatars]
  const found = all.find(a => a.id === selectedAvatarId.value)
  return found ? found.name : '知性妈妈'
})

const selectAvatar = (av: AvatarOption) => {
  selectedAvatarId.value = av.id
  showToast(`已选用专属形象「${av.name}」`, 'success')
}

// 4. 薪资与预算配置
const DEFAULT_SALARY = {
  monthlySalary: 25800,
  payDay: 10,
  monthlyBudgetLimit: 18000,
  annualSavingsTarget: 100000,
  familyShareRatio: 60
}

const salaryForm = ref({ ...DEFAULT_SALARY })

// 计算家庭公用金与自留零花
const calculatedFamilyPoolAmount = computed(() => {
  const s = Number(salaryForm.value.monthlySalary) || 0
  const r = Number(salaryForm.value.familyShareRatio) || 0
  return Math.round(s * (r / 100))
})

const calculatedPersonalAllowanceAmount = computed(() => {
  const s = Number(salaryForm.value.monthlySalary) || 0
  const r = Number(salaryForm.value.familyShareRatio) || 0
  return Math.round(s * ((100 - r) / 100))
})

// 5. 记账偏好配置
const DEFAULT_PREFERENCES = {
  budgetAlert: true,
  memberBillAlert: true,
  ocrAutoConfirm: true
}

const preferencesForm = ref({ ...DEFAULT_PREFERENCES })

// 6. 保存与撤销
const isSaving = ref(false)

const saveAllSettings = () => {
  isSaving.value = true
  setTimeout(() => {
    isSaving.value = false
    // 联动更新 Pinia Store 当前用户昵称与头像
    // 成员 id 是后端返回的数字 user_id；这里找"当前登录用户"自己那条
    const me = authStore.user
    const currentMember = ledgerStore.currentMembers.find(m => m.id === me?.id)
    if (currentMember) {
      currentMember.name = profileForm.value.nickname
      const allAv = [...primaryAvatars, ...extendedAvatars]
      const chosen = allAv.find(a => a.id === selectedAvatarId.value)
      if (chosen) {
        currentMember.avatar = chosen.src
      }
    }
    showToast('偏好设置已成功保存并立即生效！', 'success')
  }, 350)
}

const revertChanges = () => {
  profileForm.value = { ...DEFAULT_PROFILE }
  salaryForm.value = { ...DEFAULT_SALARY }
  preferencesForm.value = { ...DEFAULT_PREFERENCES }
  selectedAvatarId.value = 'mom'
  showToast('已撤销未保存的改动', 'info')
}

const loadDemoData = () => {
  revertChanges()
  showToast('已重新载入毕业设计默认演示数据', 'success')
}

const exportMockData = () => {
  const data = {
    profile: profileForm.value,
    avatar: currentAvatarName.value,
    salaryAndBudget: salaryForm.value,
    preferences: preferencesForm.value,
    exportTime: new Date().toLocaleString()
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mosaic-settings-demo-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
  showToast('已导出当前系统演示配置文件 JSON', 'success')
}

// 7. Toast 提示
const toast = ref({
  show: false,
  message: '',
  type: 'info' as 'info' | 'success'
})
let toastTimer: any = null

const showToast = (message: string, type: 'info' | 'success' = 'info') => {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => {
    toast.value.show = false
  }, 2400)
}
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
