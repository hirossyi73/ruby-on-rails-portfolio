export default defineEventHandler((event) => {
  // Cookieまたはヘッダーからトークンを取得
  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.replace('Bearer ', '') || getCookie(event, 'access_token')

  if (!token) {
    return null
  }

  // トークンをevent.contextに保存（他のAPIで使用可能）
  event.context.token = token

  // 簡易的なレスポンス（実際のユーザー情報はRails APIから取得する想定）
  return {
    authenticated: true,
    token
  }
})
