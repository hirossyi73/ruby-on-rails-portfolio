import type { RequestOptions } from '~/types'

export const useApi = () => {
  const config = useRuntimeConfig()

  const apiRequest = async (endpoint: string, options: RequestOptions & any = {}) => {
    // SSR時はサーバー側URL、CSR時はパブリックURL
    const baseUrl = process.server
      ? config.apiBaseUrl
      : config.public.apiBaseUrl

    // 認証トークンを取得
    let authToken = options.token // 直接指定されたトークン
    if (!authToken && process.client) {
      // ストアからトークンを取得
      const authStore = useAuthStore()
      authToken = authStore.getAccessToken
    }

    // URLパラメータを構築
    let url = `${baseUrl}${endpoint}`
    if (options.params) {
      const searchParams = new URLSearchParams()
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`
      }
    }

    // ヘッダーを構築
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    // 認証トークンがあればAuthorizationヘッダーに追加
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`
    }

    return await $fetch(url, {
      ...options,
      headers
    })
  }

  return {
    get: (endpoint: string, params?: Record<string, any>) =>
      apiRequest(endpoint, { method: 'GET', params }),
    post: (endpoint: string, body: any) =>
      apiRequest(endpoint, { method: 'POST', body }),
    put: (endpoint: string, body: any) =>
      apiRequest(endpoint, { method: 'PUT', body }),
    delete: (endpoint: string) =>
      apiRequest(endpoint, { method: 'DELETE' })
  }
}
