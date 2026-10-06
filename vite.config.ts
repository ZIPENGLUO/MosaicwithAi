import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    server: {
        port: 5173,
        // 端口被占用时不再自动换端口：直接报错更好定位（避免 5173/5174 混用）
        strictPort: false,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true
            }
        },
        watch: {
            // 忽略编辑器/AI 工具写文件时产生的临时文件与目录，
            // 否则 Vite 会去 watch 一个刚被删除的 .tmp 文件 → EBUSY → dev server 崩溃
            ignored: [
                '**/.git/**',
                '**/node_modules/**',
                '**/dist/**',
                '**/.*.tmpdir/**',
                '**/*.tmp',
                '**/*.tmpdir/**',
                '**/*~',
                '**/.~*'
            ]
        }
    }
})
