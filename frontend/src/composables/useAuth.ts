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
    //secure: process.env.NODE_ENV === 'production',
    secure: false, // 一旦falseにする
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
    console.log('[AUTH] ログイン処理開始')
    console.log('[AUTH] email:', email)

    const api = useApi()

    try {
      console.log('[AUTH] OAuth API呼び出し開始')
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

      console.log('[AUTH] OAuth API応答受信')
      console.log('[AUTH] access_token:', !!data.access_token)
      console.log('[AUTH] refresh_token:', !!data.refresh_token)
      console.log('[AUTH] user:', data.user)

      // Cookieに保存（SSR/CSR両対応）
      accessToken.value = data.access_token
      if (data.refresh_token) {
        refreshToken.value = data.refresh_token
      }

      console.log('[AUTH] Cookie保存完了')

      // アクセストークンでユーザー情報を取得
      console.log('[AUTH] ユーザー情報取得開始')
      try {
        const userInfo = await api.get('/api/auth/me', {
          token: data.access_token,
        })

        console.log('[AUTH] ユーザー情報取得成功:', userInfo)
        userCookie.value = userInfo
      } catch (userError) {
        console.log('[AUTH] ユーザー情報取得失敗:', userError)
        // ユーザー情報取得に失敗しても、ログイン自体は成功とする
      }

      console.log('[AUTH] accessToken.value:', !!accessToken.value)
      console.log('[AUTH] userCookie.value:', userCookie.value)

      return { success: true, user: userCookie.value }
    } catch (error) {
      console.log('[AUTH] ログイン失敗:', error)
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
    console.log('[AUTH] checkAuth開始')
    console.log('[AUTH] accessToken.value:', !!accessToken.value)

    // トークンがない場合は未認証
    if (!accessToken.value) {
      console.log('[AUTH] アクセストークンなし - 未認証')
      return false
    }

    // SSR時はサーバーAPIで検証
    try {
      console.log('[AUTH] サーバーAPIでユーザー情報を確認中...')

      // Nitroのイベントハンドラーを使用してサーバーAPIを呼び出す
      const api = useApi()
      const data = await api.get('/api/auth/me')

      console.log('[AUTH] API応答:', data)

      // ユーザー情報をCookieに保存
      if (data && data.id) {
        userCookie.value = data
        console.log('[AUTH] ユーザー情報をCookieに保存:', data)
      }

      const isValid = data && data.id
      console.log('[AUTH] 認証結果:', isValid)
      return isValid
    } catch (error) {
      console.log('[AUTH] API呼び出しエラー:', error)
      return false
    }

    // CSR時はトークンの存在のみで判定（APIコールは不要）
    console.log('[AUTH] CSR時 - トークン存在による認証')
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
