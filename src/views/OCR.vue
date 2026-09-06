<template>
  <div>
    <!-- 头部欢迎与标签 -->
    <div class="welcome">
      <div>
        <h2 class="page-title">智能票据识别</h2>
        <p class="muted">上传票据，OCR 与大语言模型将自动提取账目信息</p>
      </div>
      <v-chip color="secondary" variant="tonal">AI 自动解析</v-chip>
    </div>

    <!-- OCR 识别网格 -->
    <div class="ocr-grid">
      <!-- 上传卡片 -->
      <div class="card upload-card">
        <div class="upload-art">
          <SvgIcon name="scan" />
          <h3>拖拽或点击上传票据</h3>
          <p>支持 JPG、PNG、PDF，单文件不超过 10MB</p>
          <v-btn color="primary">选择文件</v-btn>
        </div>
        <div class="process">
          <span class="active">1 上传票据</span>
          <span>2 OCR 识别</span>
          <span>3 人工确认</span>
          <span>4 写入账目</span>
        </div>
      </div>

      <!-- 识别结果预览与表单确认 -->
      <div class="card panel">
        <div class="panel-head">
          <h3 class="section-title">识别结果预览</h3>
          <v-chip size="small" color="secondary" variant="tonal">识别完成</v-chip>
        </div>

        <div class="receipt-preview">
          <div class="receipt-mock">
            MOSIC<br />
            <strong>盒马鲜生</strong>
            <hr />
            牛肉、西兰花等 7 项<br />
            <b>合计 ¥328.60</b><br />
            2026-09-03 18:42
          </div>
        </div>

        <v-text-field label="商户名称" model-value="盒马鲜生" />
        <v-text-field label="金额" model-value="328.60" prefix="¥" />
        <v-select
          label="消费分类"
          :items="['居家日用', '餐饮美食', '交通出行']"
          model-value="居家日用"
        />
        <v-btn block color="primary">确认并写入账本</v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '../components/SvgIcon.vue'
</script>
