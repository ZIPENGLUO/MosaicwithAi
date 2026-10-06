/// <reference types="vite/client" />

/** 我们自定义的环境变量类型（Vite 只会自动补 VITE_ 前缀的基础类型） */
interface ImportMetaEnv {
    /** 后端地址；不配时默认走 vite 代理的 /api */
    readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}