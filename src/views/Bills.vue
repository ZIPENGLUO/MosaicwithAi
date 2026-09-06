<template>
  <div>
    <!-- 头部欢迎与操作 -->
    <div class="welcome">
      <div>
        <h2 class="page-title">账目明细</h2>
        <p class="muted">统一管理个人与家庭账本中的每一笔收支</p>
      </div>
      <v-btn color="primary">+ 新增账目</v-btn>
    </div>

    <!-- 筛选面板与表格数据 -->
    <div class="card panel">
      <div class="filters">
        <v-text-field
          density="compact"
          variant="solo"
          hide-details
          placeholder="搜索商户、备注或分类"
        />
        <v-select
          density="compact"
          variant="solo"
          hide-details
          label="收支类型"
          :items="['全部', '支出', '收入']"
        />
        <v-select
          density="compact"
          variant="solo"
          hide-details
          label="家庭成员"
          :items="['全部', '林知栖', '陈先生']"
        />
        <v-btn variant="tonal" color="primary">导出数据</v-btn>
      </div>

      <v-table>
        <thead>
          <tr>
            <th>日期</th>
            <th>账目</th>
            <th>分类</th>
            <th>经办成员</th>
            <th class="text-right">金额</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in bills" :key="b.title">
            <td>{{ b.date }}</td>
            <td>
              <div class="table-title">{{ b.title }}</div>
            </td>
            <td>
              <v-chip size="small" variant="tonal">{{ b.category }}</v-chip>
            </td>
            <td>{{ b.member }}</td>
            <td
              class="text-right amount-small"
              :class="{ 'good-text': b.type === '收入' }"
            >
              {{ b.type === '收入' ? '+' : '-' }}¥{{ b.amount.toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { bills } from '../data'
</script>
