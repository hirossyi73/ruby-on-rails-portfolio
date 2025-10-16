// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // TypeScript設定
  // typescript: {
  //   strict: false,
  //   typeCheck: false,
  // },

  // CSS設定
  css: ['~/assets/css/main.css'],

  // モジュール設定
  modules: ['@pinia/nuxt', '@element-plus/nuxt', '@nuxtjs/tailwindcss'],

  // Element Plus設定
  elementPlus: {
    /** Options */
    themes: ['dark'],
  },

  // Tailwind CSS設定
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    viewer: true,
  },

  // ランタイム設定
  runtimeConfig: {
    // プライベートキー（サーバーサイドでのみ利用可能）
    apiBaseUrl: process.env.NUXT_API_BASE_URL || 'http://backend:3000',

    // パブリックキー（クライアントサイドでも利用可能）
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:80',
      oauthClientId: process.env.NUXT_PUBLIC_OAUTH_CLIENT_ID || '',
      oauthClientSecret: process.env.NUXT_PUBLIC_OAUTH_CLIENT_SECRET || '',
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
