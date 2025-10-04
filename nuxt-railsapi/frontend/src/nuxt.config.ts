// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // TypeScript設定
  typescript: {
    strict: true,
    typeCheck: true,
  },

  // CSS設定
  css: [],

  // モジュール設定
  modules: ['@pinia/nuxt'],

  // ランタイム設定
  runtimeConfig: {
    // プライベートキー（サーバーサイドでのみ利用可能）

    // パブリックキー（クライアントサイドでも利用可能）
    public: {
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
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
})
