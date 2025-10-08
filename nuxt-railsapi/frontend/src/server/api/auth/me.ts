export default defineEventHandler(async (event) => {
  // リクエストからCookieを取得
  const cookies = parseCookies(event)
  const accessToken = cookies.access_token

  if (!accessToken) {
    return {
      authenticated: false,
      user: null,
    }
  }

  // バックエンドAPIでトークン検証
  try {
    const api = useApi()
    const userData = await api.get('/auth/me', { token: accessToken })

    // バックエンドからユーザー情報が返ってきた場合は認証成功
    if (userData && userData.id) {
      return {
        authenticated: true,
        user: userData,
      }
    } else {
      return {
        authenticated: false,
        user: null,
      }
    }
  } catch (error) {
    return {
      authenticated: false,
      user: null,
    }
  }
})
