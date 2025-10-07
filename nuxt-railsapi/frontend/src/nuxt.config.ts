// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // TypeScript設定
  // typescript: {
  //   strict: false,
  //   typeCheck: false,
  // },

  // CSS設定
  css: [],

  // モジュール設定
  modules: ['@pinia/nuxt'],

  // ランタイム設定
  runtimeConfig: {
    // プライベートキー（サーバーサイドでのみ利用可能）
    apiBaseUrl: 'http://backend:3000',

    // パブリックキー（クライアントサイドでも利用可能）
    public: {
      apiBaseUrl: 'http://localhost:3000',
    },
  },

  // サーバー設定
  devServer: {
    port: 3000,
    host: '0.0.0.0',
  },

  // 互換性の日付設定
  compatibilityDate: '2024-10-07',
})
