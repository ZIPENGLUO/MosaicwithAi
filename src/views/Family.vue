<template>
  <div>
    <!-- 头部欢迎与操作 -->
    <div class="welcome">
      <div>
        <h2 class="page-title">家庭协同</h2>
        <p class="muted">和家人一起记账、分配预算并保持透明协作</p>
      </div>
      <v-btn color="primary">邀请成员</v-btn>
    </div>

    <!-- 成员列表与协同动态 -->
    <div class="family-grid">
      <!-- 成员列表卡片 -->
      <div class="card panel">
        <h3 class="section-title">家庭成员</h3>
        <div v-for="m in members" :key="m.name" class="member-row">
          <v-avatar color="#f6ddd4">{{ m.name.slice(0, 1) }}</v-avatar>
          <div>
            <b>{{ m.name }}</b>
            <span>{{ m.role }}</span>
          </div>
          <strong>¥{{ m.amount.toLocaleString() }}</strong>
        </div>
      </div>

      <!-- 协同记录与权限提醒 -->
      <div class="card panel">
        <h3 class="section-title">协同记录</h3>
        <div class="activity">
          <span class="activity-dot" />
          <div>
            <b>陈先生</b> 更新了 9 月家庭预算
            <small>今天 09:24</small>
          </div>
        </div>
        <div class="activity">
          <span class="activity-dot green" />
          <div>
            <b>林知栖</b> 确认了 3 笔智能票据
            <small>昨天 18:42</small>
          </div>
        </div>
        <v-alert type="info" variant="tonal" class="mt-5">
          家庭数据已开启隐私隔离，成员只能查看授权范围内的账目。
        </v-alert>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FamilyMember {
  name: string
  role: string
  amount: number
}

const members: FamilyMember[] = [
  { name: '林知栖', role: '家庭管理员', amount: 6890 },
  { name: '陈先生', role: '普通成员', amount: 5590 },
  { name: '林小满', role: '普通成员', amount: 0 }
]
</script>
