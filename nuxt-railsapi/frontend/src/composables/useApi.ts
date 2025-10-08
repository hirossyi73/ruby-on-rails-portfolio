import type { RequestOptions } from '~/types'

export const useApi = () => {
  const config = useRuntimeConfig()

  const apiRequest = async (
    endpoint: string,
    options: RequestOptions & any = {}
  ) => {
    // SSR時はサーバー側URL、CSR時はパブリックURL
    const baseUrl = process.server
      ? config.apiBaseUrl
      : config.public.apiBaseUrl

    // 認証トークンを取得（SSR/CSR両対応）
    let authToken = options.token // 直接指定されたトークン
    if (!authToken) {
      // useAuth からトークンを取得
      const { accessToken } = useAuth()
      authToken = accessToken.value
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
      ...options.headers,
    }

    // 認証トークンがあればAuthorizationヘッダーに追加
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`
    }

    return await $fetch(url, {
      ...options,
      headers,
    })
  }

  return {
    // 各メソッドはオプションを受け取る（token や headers など）
    get: (endpoint: string, options?: any) =>
      apiRequest(endpoint, { method: 'GET', ...(options || {}) }),
    post: (endpoint: string, body: any, options?: any) =>
      apiRequest(endpoint, { method: 'POST', body, ...(options || {}) }),
    put: (endpoint: string, body: any, options?: any) =>
      apiRequest(endpoint, { method: 'PUT', body, ...(options || {}) }),
    delete: (endpoint: string, options?: any) =>
      apiRequest(endpoint, { method: 'DELETE', ...(options || {}) }),
  }
}
