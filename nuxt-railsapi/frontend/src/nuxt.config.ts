// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // TypeScript設定 - タイプチェックを無効化
  typescript: {
    strict: false,
    typeCheck: false,
  },

  // CSS設定
  css: [],

  // モジュール設定
  modules: ['@pinia/nuxt'],

  // ランタイム設定
  runtimeConfig: {
    // プライベートキー（サーバーサイドでのみ利用可能）
    apiBaseUrl: process.env.NUXT_API_BASE_URL || 'http://backend:3000',

    // パブリックキー（クライアントサイドでも利用可能）
    public: {
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
    },
  },

  // サーバー設定
  nitro: {
    port: 3000,
    host: '0.0.0.0',
  },

  // ビルド設定
  build: {
    transpile: [],
  },

  // 互換性の日付設定
  compatibilityDate: '2025-10-04',
})
