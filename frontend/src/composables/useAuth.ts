/**
 * 認証用コンポーザブル
 * SSR/CSR両対応、Cookieベースの認証管理
 */

interface User {
  id: number
  email: string
  name?: string
}

export const useAuth = () => {
  const config = useRuntimeConfig()

  // Cookie設定（SSR/CSR共通）
  const cookieOptions = {
    maxAge: 60 * 60 * 24 * 7, // 7日間
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  }

  // アクセストークン（Cookie）
  const accessToken = useCookie('access_token', cookieOptions)
  const refreshToken = useCookie('refresh_token', {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 30, // 30日間
  })
  const userCookie = useCookie<User | null>('user', cookieOptions)

  /**
   * ログイン状態の確認
   */
  const isAuthenticated = computed(() => !!accessToken.value)

  /**
   * ユーザー情報の取得
   */
  const user = computed(() => userCookie.value)

  /**
   * ログイン処理
   */
  const login = async (email: string, password: string) => {
    const api = useApi()

    try {
      const data = (await api.post('/api/oauth/token', {
        grant_type: 'password',
        username: email,
        password,
        client_id: config.public.oauthClientId,
        client_secret: config.public.oauthClientSecret,
      })) as {
        access_token: string
        refresh_token?: string
        user?: User
      }

      // Cookieに保存（SSR/CSR両対応）
      accessToken.value = data.access_token
      if (data.refresh_token) {
        refreshToken.value = data.refresh_token
      }
      if (data.user) {
        userCookie.value = data.user
      }

      return { success: true, user: data.user }
    } catch (error) {
      return { success: false, error }
    }
  }

  /**
   * ログアウト処理
   */
  const logout = () => {
    accessToken.value = null
    refreshToken.value = null
    userCookie.value = null
  }

  /**
   * トークンリフレッシュ
   */
  const refresh = async () => {
    if (!refreshToken.value) {
      logout()
      return false
    }

    const api = useApi()

    try {
      const data = (await api.post('/api/oauth/token', {
        grant_type: 'refresh_token',
        refresh_token: refreshToken.value,
        client_id: config.public.oauthClientId,
        client_secret: config.public.oauthClientSecret,
      })) as {
        access_token: string
        refresh_token?: string
      }

      accessToken.value = data.access_token
      if (data.refresh_token) {
        refreshToken.value = data.refresh_token
      }

      return true
    } catch (error) {
      logout()
      return false
    }
  }

  /**
   * 認証確認（SSR対応）
   */
  const checkAuth = async () => {
    // トークンがない場合は未認証
    if (!accessToken.value) {
      return false
    }

    // SSR時はサーバーAPIで検証
    try {
      // Nitroのイベントハンドラーを使用してサーバーAPIを呼び出す
      const api = useApi()
      const data = await api.get('/api/auth/me')

      // ユーザー情報をCookieに保存
      if (data && data.id) {
        userCookie.value = data
      }

      return data && data.id
    } catch (error) {
      return false
    }

    // CSR時はトークンの存在のみで判定（APIコールは不要）
    return true
  }

  return {
    // 状態
    isAuthenticated,
    user,
    accessToken: computed(() => accessToken.value),

    // メソッド
    login,
    logout,
    refresh,
    checkAuth,
  }
}
