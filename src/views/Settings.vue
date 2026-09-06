<template>
  <div>
    <!-- 头部欢迎与保存按钮 -->
    <div class="welcome">
      <div>
        <h2 class="page-title">个人设置</h2>
        <p class="muted">管理个人资料、家庭角色和安全偏好</p>
      </div>
      <v-btn color="primary">保存修改</v-btn>
    </div>

    <!-- 设置面板网格 -->
    <div class="settings-grid">
      <!-- 基本信息与家庭角色 -->
      <div class="card panel">
        <h3 class="section-title">基本信息与家庭角色</h3>
        <div class="avatar-setting">
          <v-avatar size="72" color="#f6ddd4">知</v-avatar>
          <div>
            <b>林知栖</b>
            <span>户主 · 账本主理人</span>
            <v-btn size="small" variant="tonal" color="primary">更换头像</v-btn>
          </div>
        </div>

        <v-text-field label="用户昵称 / 姓名" model-value="林知栖" />
        <v-text-field label="绑定手机号码" model-value="138 **** 9204" readonly />
        <v-text-field label="安全邮箱" model-value="lin****@mosaic.me" readonly />
      </div>

      <!-- 安全偏好与通知 -->
      <div class="card panel">
        <h3 class="section-title">安全与通知</h3>
        <v-switch color="primary" label="账目变更通知" :model-value="true" hide-details />
        <v-switch color="primary" label="预算接近阈值提醒" :model-value="true" hide-details />
        <v-switch color="primary" label="智能识别完成提醒" :model-value="true" hide-details />
        <v-divider class="my-4" />
        <div class="security-row">
          <SvgIcon name="shield" />
          <div>
            <b>隐私隔离保护中</b>
            <span>API 密钥与敏感信息不会出现在前端</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '../components/SvgIcon.vue'
</script>
