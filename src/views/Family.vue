<template>
  <div class="w-full max-w-[1560px] mx-auto p-4 md:p-6 flex flex-col gap-5 min-h-full" style="background-color: #fcf9f6">
    <!-- 1. 顶部操作与欢迎卡片 -->
    <div class="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3.5">
        <div class="rounded-xl bg-primary-container text-on-primary flex items-center justify-center shadow-xs shrink-0" style="width: 48px; height: 48px; min-width: 48px; min-height: 48px;">
          <span class="material-symbols-outlined text-2xl">diversity_3</span>
        </div>
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h2 class="text-xl font-bold font-headline-md text-on-surface">
              {{ ledgerStore.hasMultipleMembers ? '家庭协同管理中心' : '账本协同与授权共享' }}
            </h2>
            <span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="ledgerStore.hasMultipleMembers ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'">
              {{ ledgerStore.currentLedger }}
            </span>
            <span v-if="ledgerStore.hasMultipleMembers" class="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-mono">
              全员隐私隔离生效中
            </span>
          </div>
          <p class="text-xs text-on-surface-variant mt-1">
            {{ ledgerStore.hasMultipleMembers
              ? '家庭全员分摊透明流转，智能核对共同资金池与开支权益，让家庭财务温馨有条理'
              : '管理个人账本的授权协作者、代记账权限与多端数据同步隔离偏好' }}
          </p>
        </div>
      </div>

      <!-- 顶栏快捷操作组 -->
      <div class="flex items-center gap-2.5 flex-wrap">
        <button
          type="button"
          class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
          @click="openSettlementDialog"
        >
          <span class="material-symbols-outlined text-base text-secondary">balance</span>
          <span>出资对账测算</span>
        </button>
        <button
          type="button"
          class="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container text-on-primary text-xs font-semibold hover:bg-primary transition-all shadow-sm cursor-pointer"
          @click="openInviteDialog"
        >
          <span class="material-symbols-outlined text-base">person_add</span>
          <span>邀请新成员</span>
        </button>
      </div>
    </div>

    <!-- 2. 核心指标卡片区 (4 张精美数据微卡) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- 指标 1: 协作成员 -->
      <div class="p-4 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs text-on-surface-variant font-medium">在册协同成员</span>
          <div class="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-sm">groups</span>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex items-baseline gap-1">
            <span class="font-amount-display text-2xl font-bold text-on-surface">{{ memberList.length }}</span>
            <span class="text-xs text-on-surface-variant">位成员</span>
          </div>
          <span class="text-[11px] text-secondary font-medium flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">verified_user</span>
            {{ ledgerStore.hasMultipleMembers ? '2位主理人 · 1位长辈 · 1位儿童' : '当前为单人独立主账号' }}
          </span>
        </div>
      </div>

      <!-- 指标 2: 共同预算池 -->
      <div class="p-4 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs text-on-surface-variant font-medium">{{ ledgerStore.hasMultipleMembers ? '家庭共同预算池' : '本期支出预算' }}</span>
          <div class="w-7 h-7 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
            <span class="material-symbols-outlined text-sm">pie_chart</span>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex items-baseline gap-1">
            <span class="text-sm font-headline-sm text-on-surface-variant">¥</span>
            <span class="font-amount-display text-2xl font-bold text-on-surface">20,000</span>
          </div>
          <div class="flex items-center justify-between text-[11px] text-on-surface-variant">
            <span>已共同支出 68.5%</span>
            <span class="text-secondary font-semibold">余 ¥6,300</span>
          </div>
        </div>
      </div>

      <!-- 指标 3: 待对账分摊款 -->
      <div class="p-4 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs text-on-surface-variant font-medium">本期待对账分摊</span>
          <div class="w-7 h-7 rounded-full bg-primary-container/20 text-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-sm">currency_exchange</span>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex items-baseline gap-1">
            <span class="text-sm font-headline-sm text-on-surface-variant">¥</span>
            <span class="font-amount-display text-2xl font-bold text-primary">{{ pendingSettlementAmount.toFixed(2) }}</span>
          </div>
          <span class="text-[11px] text-on-surface-variant flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full" :class="pendingSettlementAmount > 0 ? 'bg-primary animate-pulse' : 'bg-secondary'"></span>
            {{ pendingSettlementAmount > 0 ? '陈先生应结算给林知栖' : '全部账目已结清' }}
          </span>
        </div>
      </div>

      <!-- 指标 4: 应急储备资金池 -->
      <div class="p-4 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs text-on-surface-variant font-medium">共有应急储备金</span>
          <div class="w-7 h-7 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
            <span class="material-symbols-outlined text-sm">shield_with_heart</span>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex items-baseline gap-1">
            <span class="text-sm font-headline-sm text-on-surface-variant">¥</span>
            <span class="font-amount-display text-2xl font-bold text-on-surface">50,000</span>
          </div>
          <span class="text-[11px] text-secondary font-semibold flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">trending_up</span>
            年化 2.85% · 随时备用调配
          </span>
        </div>
      </div>
    </div>

    <!-- 3. 主工作区两栏布局 -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      <!-- 左栏 (7列): 家庭成员角色权益与个人配额卡片列表 -->
      <div class="lg:col-span-7 flex flex-col gap-4">
        <div class="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20 shadow-sm flex flex-col gap-4">
          <div class="flex items-center justify-between pb-3 border-b border-surface-container-high/60">
            <div>
              <h3 class="font-headline-sm text-base text-on-surface font-bold">
                {{ ledgerStore.hasMultipleMembers ? '家庭成员角色与出资配额' : '成员权限与协作列表' }}
              </h3>
              <p class="text-xs text-on-surface-variant mt-0.5">
                实时追踪每个成员的专属额度、责任领域与记账权限
              </p>
            </div>
            <span class="text-xs px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-medium">
              共 {{ memberList.length }} 位成员
            </span>
          </div>

          <!-- 成员卡片流 -->
          <div class="flex flex-col gap-3.5">
            <div
              v-for="member in memberList"
              :key="member.id"
              class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/40 transition-all flex flex-col gap-3"
            >
              <!-- 成员基本信息栏 -->
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div class="flex items-center gap-3">
                  <div class="relative shrink-0" style="width: 48px; height: 48px; min-width: 48px;">
                    <img
                      :src="member.avatar"
                      :alt="member.name"
                      class="rounded-full object-cover border-2 border-white shadow-xs"
                      style="width: 48px; height: 48px; min-width: 48px; max-width: 48px; min-height: 48px; max-height: 48px; object-fit: cover; display: block;"
                    />
                    <span
                      class="absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-white"
                      :style="{ backgroundColor: member.themeColor, width: '14px', height: '14px' }"
                    ></span>
                  </div>
                  <div class="flex flex-col">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-sm text-on-surface">{{ member.name }}</span>
                      <span
                        class="px-2 py-0.5 rounded text-[11px] font-medium"
                        :class="member.roleBadgeClass"
                      >
                        {{ member.role }}
                      </span>
                      <span v-if="member.isCurrentUser" class="text-[10px] text-primary font-semibold">
                        (当前账号)
                      </span>
                    </div>
                    <span class="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1">
                      <span class="material-symbols-outlined text-xs text-primary">{{ member.dutyIcon }}</span>
                      <span>{{ member.dutyDesc }}</span>
                    </span>
                  </div>
                </div>

                <!-- 金额与操作 -->
                <div class="flex items-center gap-3">
                  <div class="flex flex-col items-end">
                    <span class="text-xs text-on-surface-variant">本月已支出</span>
                    <span class="font-amount-table font-bold text-base text-on-surface">
                      ¥{{ member.spentAmount.toLocaleString() }}
                    </span>
                  </div>
                  <button
                    type="button"
                    class="px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
                    @click="openEditQuotaDialog(member)"
                  >
                    调整额度
                  </button>
                </div>
              </div>

              <!-- 支出进度条与预算占用 -->
              <div class="flex flex-col gap-1.5 pt-2 border-t border-outline-variant/15">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-on-surface-variant">
                    月度支出预算额度: <b>¥{{ member.budgetQuota.toLocaleString() }}</b>
                  </span>
                  <span class="font-semibold" :class="member.percentUsed > 90 ? 'text-primary' : 'text-on-surface'">
                    使用率 {{ member.percentUsed }}%
                  </span>
                </div>
                <div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :style="{ width: Math.min(member.percentUsed, 100) + '%', backgroundColor: member.themeColor }"
                  ></div>
                </div>
              </div>

              <!-- 负责核心领域微标 -->
              <div class="flex items-center justify-between text-[11px] text-on-surface-variant flex-wrap gap-2 pt-1">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="text-on-surface-variant">专注领域:</span>
                  <span
                    v-for="cat in member.categories"
                    :key="cat"
                    class="px-2 py-0.5 rounded bg-surface-container-lowest text-on-surface border border-outline-variant/20 font-medium"
                  >
                    {{ cat }}
                  </span>
                </div>

                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-xs text-secondary">lock</span>
                  <span class="text-[11px]">{{ member.permissionLevel }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右栏 (5列): 共同出资清算中心 & 协同动态时光轴 -->
      <div class="lg:col-span-5 flex flex-col gap-5">
        <!-- 板块 1: 共同开支分摊与清算中心 -->
        <div class="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20 shadow-sm flex flex-col gap-3.5">
          <div class="flex items-center justify-between pb-2 border-b border-surface-container-high/60">
            <div>
              <h3 class="font-headline-sm text-base text-on-surface font-bold">
                {{ ledgerStore.hasMultipleMembers ? '家庭出资对账与清算' : '个人账户结算中心' }}
              </h3>
              <p class="text-xs text-on-surface-variant mt-0.5">
                自动核算垫付与应付差额，一键完成对账结清
              </p>
            </div>
            <span class="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-medium">
              智能分摊引擎
            </span>
          </div>

          <!-- 双人出资约定比例条 -->
          <div class="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 flex flex-col gap-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-semibold text-on-surface">家庭约定出资配比</span>
              <span class="text-primary font-bold">林知栖 55% : 陈先生 45%</span>
            </div>
            <div class="w-full h-2 rounded-full flex overflow-hidden bg-surface-container-highest">
              <div class="h-full bg-primary" style="width: 55%" title="林知栖 55%"></div>
              <div class="h-full bg-secondary" style="width: 45%" title="陈先生 45%"></div>
            </div>
            <div class="flex items-center justify-between text-[11px] text-on-surface-variant">
              <span>林知栖垫付更多开销</span>
              <span>陈先生按月归集结算</span>
            </div>
          </div>

          <!-- 待确认清算事项卡片 -->
          <div
            v-if="pendingSettlementAmount > 0"
            class="p-3.5 rounded-xl bg-primary/5 border border-primary/20 flex flex-col gap-2.5"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-base">payments</span>
                <span class="font-bold text-xs text-on-surface">周末山姆大采购协同清算</span>
              </div>
              <span class="font-amount-table font-bold text-primary text-sm">¥{{ pendingSettlementAmount.toFixed(2) }}</span>
            </div>
            <p class="text-[11px] text-on-surface-variant leading-relaxed">
              林知栖垫付周末生活采购总额 ¥2,600，按 55%:45% 分摊规则，陈先生应承担 ¥1,170.00。
            </p>
            <div class="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                class="px-3 py-1.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                @click="confirmSettlement"
              >
                确认已转账结清
              </button>
            </div>
          </div>

          <div
            v-else
            class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-center gap-2 text-secondary text-xs font-medium"
          >
            <span class="material-symbols-outlined text-sm">check_circle</span>
            <span>本月家庭出资账目已全部对齐结清，无待办分摊！</span>
          </div>
        </div>

        <!-- 板块 2: 实时协同动态时光轴 -->
        <div class="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20 shadow-sm flex flex-col gap-3.5">
          <div class="flex items-center justify-between pb-2 border-b border-surface-container-high/60">
            <div>
              <h3 class="font-headline-sm text-base text-on-surface font-bold">协同动态流水</h3>
              <p class="text-xs text-on-surface-variant mt-0.5">全员记账、预算调整与票据入账实时审计</p>
            </div>
            <span class="material-symbols-outlined text-on-surface-variant text-base">history</span>
          </div>

          <div class="flex flex-col gap-3">
            <div
              v-for="(act, idx) in activityList"
              :key="idx"
              class="flex items-start gap-3 text-xs pb-3 border-b border-surface-container-high/50 last:border-0 last:pb-0"
            >
              <span
                class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                :class="act.iconBg"
              >
                <span class="material-symbols-outlined text-sm" :class="act.iconColor">{{ act.icon }}</span>
              </span>
              <div class="flex flex-col flex-1">
                <div class="flex items-center justify-between">
                  <span class="font-semibold text-on-surface">{{ act.title }}</span>
                  <span class="text-[11px] text-on-surface-variant">{{ act.time }}</span>
                </div>
                <p class="text-on-surface-variant text-[11px] mt-0.5 leading-relaxed">{{ act.detail }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 板块 3: 隐私与权限安全保障卡片 -->
        <div class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2 text-xs">
          <div class="flex items-center gap-2 text-on-surface font-bold">
            <span class="material-symbols-outlined text-base text-primary">security</span>
            <span>端侧家庭隐私安全护盾</span>
          </div>
          <p class="text-on-surface-variant text-[11px] leading-relaxed">
            账本数据经本地安全加解密，私密支出仅本人可见。共同账户的每一笔收支流转均具备防篡改操作痕迹。
          </p>
        </div>
      </div>
    </div>

    <!-- 4. 邀请新成员模态弹窗 -->
    <div
      v-if="showInviteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div class="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-xl border border-outline-variant/30 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-primary font-bold">
            <span class="material-symbols-outlined text-xl">group_add</span>
            <span class="text-base">邀请新成员加入「{{ ledgerStore.currentLedger }}」</span>
          </div>
          <button class="text-on-surface-variant hover:text-on-surface cursor-pointer" type="button" @click="showInviteModal = false">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="flex flex-col gap-3 text-xs">
          <div class="flex flex-col gap-1">
            <label class="font-semibold text-on-surface">成员姓名 / 称谓</label>
            <input
              v-model="newMemberForm.name"
              type="text"
              placeholder="例如：奶奶、弟弟、保洁阿姨"
              class="w-full h-10 px-3 rounded-lg border border-outline-variant/40 bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="font-semibold text-on-surface">家庭协同角色</label>
            <select
              v-model="newMemberForm.role"
              class="w-full h-10 px-3 rounded-lg border border-outline-variant/40 bg-surface-container-low text-on-surface focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="家庭管理员">家庭管理员 (拥有完整记账与预算权限)</option>
              <option value="协同出资人">协同出资人 (参与公用账本记账与分摊)</option>
              <option value="长辈备用金账户">长辈备用金账户 (专属额度与便民代扣)</option>
              <option value="儿童成长账户">儿童成长账户 (限额零花与成长储蓄)</option>
            </select>
          </div>

          <div class="flex flex-col gap-1">
            <label class="font-semibold text-on-surface">月度预算配额 (元)</label>
            <input
              v-model="newMemberForm.quota"
              type="number"
              placeholder="2000"
              class="w-full h-10 px-3 rounded-lg border border-outline-variant/40 bg-surface-container-low text-on-surface focus:outline-none focus:border-primary font-amount-table"
            />
          </div>

          <!-- 生成的邀请码与二维码预览 -->
          <div class="p-3 rounded-xl bg-surface-container-low flex flex-col items-center justify-center gap-1.5 border border-outline-variant/20 mt-1">
            <span class="text-[11px] text-on-surface-variant">家庭专属邀请码 (7天有效)</span>
            <span class="font-mono text-base font-bold text-primary tracking-widest">MOSAIC-8892-HOME</span>
            <span class="text-[10px] text-on-surface-variant">让对方扫描二维码或在加入账本时输入此码即可入组</span>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
            @click="showInviteModal = false"
          >
            取消
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-xs font-semibold bg-primary-container text-on-primary hover:bg-primary shadow-xs"
            @click="submitInviteMember"
          >
            确认发送邀请
          </button>
        </div>
      </div>
    </div>

    <!-- 5. 调整额度模态弹窗 -->
    <div
      v-if="showEditQuotaModal && currentEditMember"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div class="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-6 shadow-xl border border-outline-variant/30 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-primary font-bold">
            <span class="material-symbols-outlined text-xl">tune</span>
            <span class="text-base">调整「{{ currentEditMember.name }}」配额</span>
          </div>
          <button class="text-on-surface-variant hover:text-on-surface cursor-pointer" type="button" @click="showEditQuotaModal = false">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="flex flex-col gap-3 text-xs">
          <p class="text-on-surface-variant">
            设定该成员本月专属支出限额，当支出超过 80% 时系统将推送关怀提醒。
          </p>
          <div class="flex flex-col gap-1">
            <label class="font-semibold text-on-surface">月度预算配额 (元)</label>
            <input
              v-model="editQuotaValue"
              type="number"
              class="w-full h-10 px-3 rounded-lg border border-outline-variant/40 bg-surface-container-low text-on-surface focus:outline-none focus:border-primary font-amount-table text-base"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
            @click="showEditQuotaModal = false"
          >
            取消
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-xs font-semibold bg-primary-container text-on-primary hover:bg-primary shadow-xs"
            @click="saveQuota"
          >
            保存配置
          </button>
        </div>
      </div>
    </div>

    <!-- 6. 成功提示 Toast 浮层 -->
    <div
      class="fixed bottom-6 right-6 z-50 transition-all duration-300 flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-xl border border-outline/20"
      :class="toastVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'"
    >
      <span class="material-symbols-outlined text-secondary text-base">check_circle</span>
      <span class="text-xs font-medium">{{ toastMsg }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLedgerStore } from '../stores/ledger'

const ledgerStore = useLedgerStore()

interface MemberItem {
  id: string
  name: string
  role: string
  roleBadgeClass: string
  avatar: string
  themeColor: string
  dutyIcon: string
  dutyDesc: string
  spentAmount: number
  budgetQuota: number
  percentUsed: number
  categories: string[]
  permissionLevel: string
  isCurrentUser?: boolean
}

// 模拟家庭账本全员体系 (在个人模式下自动自适应当前账号)
const familyMembers = ref<MemberItem[]>([
  {
    id: 'lin',
    name: '林知栖',
    role: '妈妈 · 账本主理人',
    roleBadgeClass: 'bg-primary/10 text-primary',
    avatar: '/avatars/user-lin.png',
    themeColor: '#d97757',
    dutyIcon: 'home',
    dutyDesc: '主理生活日用、宝宝健康与食材采买',
    spentAmount: 6890,
    budgetQuota: 8000,
    percentUsed: 86,
    categories: ['生鲜食材', '育儿教育', '美妆日用'],
    permissionLevel: '最高权限 · 具备资金调配权',
    isCurrentUser: true
  },
  {
    id: 'chen',
    name: '陈先生',
    role: '爸爸 · 联合主理人',
    roleBadgeClass: 'bg-secondary/15 text-secondary',
    avatar: '/avatars/member-chen.png',
    themeColor: '#41674c',
    dutyIcon: 'directions_car',
    dutyDesc: '主导住房按揭、物业宽带与车辆保养',
    spentAmount: 5590,
    budgetQuota: 7000,
    percentUsed: 79,
    categories: ['按揭房贷', '车辆维护', '数码家电'],
    permissionLevel: '管理权限 · 支持预算与票据审核'
  },
  {
    id: 'child',
    name: '林小满',
    role: '女儿 · 零花教育金',
    roleBadgeClass: 'bg-primary-fixed/30 text-on-primary-fixed-variant',
    avatar: '/avatars/刘海女孩.png',
    themeColor: '#e29578',
    dutyIcon: 'school',
    dutyDesc: '兴趣拓展培训、图书文具与成长储蓄',
    spentAmount: 925,
    budgetQuota: 1500,
    percentUsed: 61,
    categories: ['课外才艺', '绘本玩具', '零花储蓄'],
    permissionLevel: '受限权限 · 支出需主理人复核'
  },
  {
    id: 'elder',
    name: '苏外婆',
    role: '长辈 · 居家备用金',
    roleBadgeClass: 'bg-surface-container-highest text-on-surface-variant',
    avatar: '/avatars/白发老奶奶.png',
    themeColor: '#88726c',
    dutyIcon: 'medication',
    dutyDesc: '便民早市食材采买、健康医药备用',
    spentAmount: 592,
    budgetQuota: 2000,
    percentUsed: 29,
    categories: ['便民早市', '常备药箱', '社区理疗'],
    permissionLevel: '代记账权限 · 专享快捷记账'
  }
])

const personalMember = ref<MemberItem[]>([
  {
    id: 'lin',
    name: '林知栖',
    role: '主账号 · 个人主理人',
    roleBadgeClass: 'bg-primary/10 text-primary',
    avatar: '/avatars/user-lin.png',
    themeColor: '#d97757',
    dutyIcon: 'person',
    dutyDesc: '个人自主生活、职业发展与品质消费',
    spentAmount: 12480,
    budgetQuota: 15000,
    percentUsed: 83,
    categories: ['餐饮美食', '居住日常', '自我增值', '休闲体验'],
    permissionLevel: '最高权限 · 个人私密独享',
    isCurrentUser: true
  }
])

const memberList = computed(() => {
  return ledgerStore.hasMultipleMembers ? familyMembers.value : personalMember.value
})

// 待清算分摊金额
const pendingSettlementAmount = ref(1170.00)

// 协同流水动态
const activityList = ref([
  {
    icon: 'edit_calendar',
    iconBg: 'bg-secondary/15',
    iconColor: 'text-secondary',
    title: '陈先生 更新了 10 月车辆保养专项预算',
    time: '12 分钟前',
    detail: '原预算 ¥1,500 上调至 ¥2,000，增加换季防冻液与四轮定位专项。'
  },
  {
    icon: 'receipt_long',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    title: '林知栖 确认了山姆大采购智能票据',
    time: '今天 09:24',
    detail: '提取 4 项生鲜明细共 ¥428.50，自动归集至公用主账户。'
  },
  {
    icon: 'medical_services',
    iconBg: 'bg-primary-container/20',
    iconColor: 'text-primary',
    title: '苏外婆 发生一笔常备药箱备用金支出',
    time: '昨天 18:42',
    detail: '药房代扣 ¥156.40，备用金余额充裕。'
  },
  {
    icon: 'savings',
    iconBg: 'bg-secondary/15',
    iconColor: 'text-secondary',
    title: '系统自动执行：结余转存家庭应急金',
    time: '3 天前',
    detail: '上月净结余的 60% (¥3,600) 已转入稳健收益理财池。'
  }
])

// 弹窗与表单状态
const showInviteModal = ref(false)
const showEditQuotaModal = ref(false)
const currentEditMember = ref<MemberItem | null>(null)
const editQuotaValue = ref(0)
const toastVisible = ref(false)
const toastMsg = ref('')

const newMemberForm = ref({
  name: '',
  role: '协同出资人',
  quota: 2000
})

const showToast = (msg: string) => {
  toastMsg.value = msg
  toastVisible.value = true
  setTimeout(() => {
    toastVisible.value = false
  }, 3000)
}

const openInviteDialog = () => {
  newMemberForm.value = {
    name: '',
    role: '协同出资人',
    quota: 2000
  }
  showInviteModal.value = true
}

const submitInviteMember = () => {
  if (!newMemberForm.value.name) {
    showToast('请输入成员姓名或称谓')
    return
  }
  showInviteModal.value = false
  showToast(`已生成「${newMemberForm.value.name}」的家庭邀请函与专属二维码！`)
}

const openEditQuotaDialog = (member: MemberItem) => {
  currentEditMember.value = member
  editQuotaValue.value = member.budgetQuota
  showEditQuotaModal.value = true
}

const saveQuota = () => {
  if (currentEditMember.value) {
    currentEditMember.value.budgetQuota = Number(editQuotaValue.value)
    currentEditMember.value.percentUsed = Math.round((currentEditMember.value.spentAmount / currentEditMember.value.budgetQuota) * 100)
    showToast(`已成功将「${currentEditMember.value.name}」的月度额度调整为 ¥${currentEditMember.value.budgetQuota.toLocaleString()}`)
  }
  showEditQuotaModal.value = false
}

const confirmSettlement = () => {
  pendingSettlementAmount.value = 0
  activityList.value.unshift({
    icon: 'done_all',
    iconBg: 'bg-secondary/15',
    iconColor: 'text-secondary',
    title: '陈先生 与 林知栖 完成了本期分摊对账',
    time: '刚刚',
    detail: '结算金额 ¥1,170.00 已到账，本月分摊全部结清。'
  })
  showToast('结算对账成功！已同步计入本月结算对账凭证')
}

const openSettlementDialog = () => {
  showToast('已对齐当前全部成员出资比例，正在生成本期协同对账清单')
}
</script>
