import type { RequestOptions } from '~/types'

export const useApi = () => {
  const config = useRuntimeConfig()

  const apiRequest = async (endpoint: string, options: RequestOptions & any = {}) => {
    // SSR時はサーバー側URL、CSR時はパブリックURL
    const baseUrl = process.server
      ? config.apiBaseUrl
      : config.public.apiBaseUrl

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

    return await $fetch(url, {
      ...options,
      // CORSヘッダーを追加
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
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
