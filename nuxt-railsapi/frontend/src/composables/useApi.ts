export const useApi = () => {
  const config = useRuntimeConfig()
  
  const apiRequest = async (endpoint: string, options: any = {}) => {
    // SSR時はサーバー側URL、CSR時はパブリックURL
    const baseUrl = process.server 
      ? config.apiBaseUrl 
      : config.public.apiBaseUrl
    
    return await $fetch(`${baseUrl}${endpoint}`, {
      ...options,
      // CORSヘッダーを追加
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })
  }
  
  return {
    get: (endpoint: string) => apiRequest(endpoint, { method: 'GET' }),
    post: (endpoint: string, body: any) => apiRequest(endpoint, { method: 'POST', body }),
    put: (endpoint: string, body: any) => apiRequest(endpoint, { method: 'PUT', body }),
    delete: (endpoint: string) => apiRequest(endpoint, { method: 'DELETE' })
  }
}