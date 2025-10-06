export default defineNuxtPlugin(() => {
  // APIクライアント用の設定
  const config = useRuntimeConfig()

  // カスタムfetch関数を提供
  const apiClient = {
    get: async (endpoint: string) => {
      try {
        // SSR時はサーバー側のURL、CSR時はパブリックURL を使用
        const baseUrl = process.server
          ? config.apiBaseUrl
          : config.public.apiBaseUrl

        const response = await fetch(`${baseUrl}${endpoint}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return await response.json()
      } catch (error) {
        console.error('API request failed:', error)
        throw error
      }
    },
  }

  return {
    provide: {
      api: apiClient,
    },
  }
})
