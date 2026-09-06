<template>
  <div>
    <!-- 头部欢迎与操作 -->
    <div class="welcome">
      <div>
        <h2 class="page-title">财务日历</h2>
        <p class="muted">把每日收支、固定账单和家庭日程放在同一张日历上</p>
      </div>
      <v-btn color="primary">+ 新增日程</v-btn>
    </div>

    <!-- 日历主体与当日详情 -->
    <div class="calendar-layout">
      <!-- 月历面板 -->
      <div class="card panel">
        <div class="calendar-head">
          <v-btn icon="‹" variant="text" />
          <h3>2026年9月</h3>
          <v-btn icon="›" variant="text" />
        </div>

        <div class="week">
          <span v-for="w in weeks" :key="w">{{ w }}</span>
        </div>

        <div class="days">
          <div
            v-for="d in 35"
            :key="d"
            class="day"
            :class="{ today: d === 4, mutedday: d < 2 || d > 30 }"
          >
            <b>{{ d < 32 ? d : d - 31 }}</b>
            <span v-if="d % 4 === 0">-¥{{ (d * 13).toFixed(0) }}</span>
            <i v-if="d % 6 === 0" />
          </div>
        </div>
      </div>

      <!-- 当日收支列表 -->
      <div class="card panel">
        <div class="panel-head">
          <div>
            <h3 class="section-title">9月4日 星期四</h3>
            <span class="muted">3 笔流水 · 今日固定支出 1 笔</span>
          </div>
          <v-chip color="primary" size="small">实时</v-chip>
        </div>

        <div class="day-total">
          <span>当日支出</span>
          <strong>-¥388.60</strong>
        </div>

        <div class="bill-row">
          <div class="bill-icon">
            <SvgIcon name="receipt" />
          </div>
          <div class="bill-info">
            <b>早餐咖啡</b>
            <span>08:30 · 餐饮美食</span>
          </div>
          <strong>- ¥28.00</strong>
        </div>

        <div class="bill-row">
          <div class="bill-icon">
            <SvgIcon name="receipt" />
          </div>
          <div class="bill-info">
            <b>盒马鲜生</b>
            <span>18:42 · 居家日用</span>
          </div>
          <strong>- ¥328.60</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '../components/SvgIcon.vue'

const weeks = ['日', '一', '二', '三', '四', '五', '六']
</script>
