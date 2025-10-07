export default defineEventHandler(async (event) => {
  // Cookieまたはヘッダーからトークンを取得
  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.replace('Bearer ', '') || getCookie(event, 'access_token')

  if (!token) {
    return null
  }

  // トークンをevent.contextに保存（他のAPIで使用可能）
  event.context.token = token

  // Rails APIの /auth/me を呼び出してユーザー情報を取得
  const config = useRuntimeConfig()
  const apiBaseUrl = config.apiBaseUrl || 'http://backend:3000'

  try {
    const userData = await $fetch<{ id: number; email: string; name?: string }>(`${apiBaseUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    return {
      authenticated: true,
      token,
      user: userData
    }
  } catch (error) {
    // トークンが無効または期限切れの場合
    return null
  }
})
