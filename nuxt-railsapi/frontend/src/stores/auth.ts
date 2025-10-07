import { defineStore } from 'pinia'

interface User {
  id: number
  email: string
  name?: string
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false
  }),

  getters: {
    getAccessToken: (state) => state.accessToken,
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated && !!state.accessToken
  },

  actions: {
    // トークンとユーザー情報を設定
    setAuth(accessToken: string, refreshToken?: string, user?: User) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken || null
      this.user = user || null
      this.isAuthenticated = true

      // ローカルストレージに保存（ブラウザのみ）
      if (process.client) {
        localStorage.setItem('access_token', accessToken)
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken)
        }
        if (user) {
          localStorage.setItem('user', JSON.stringify(user))
        }
      }
    },

    // ローカルストレージからトークンを復元
    restoreAuth() {
      if (process.client) {
        const accessToken = localStorage.getItem('access_token')
        const refreshToken = localStorage.getItem('refresh_token')
        const userStr = localStorage.getItem('user')

        if (accessToken) {
          this.accessToken = accessToken
          this.refreshToken = refreshToken
          this.user = userStr ? JSON.parse(userStr) : null
          this.isAuthenticated = true
        }
      }
    },

    // ログアウト
    logout() {
      this.accessToken = null
      this.refreshToken = null
      this.user = null
      this.isAuthenticated = false

      if (process.client) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
      }
    },

    // トークンを更新
    async refreshAccessToken() {
      if (!this.refreshToken) {
        this.logout()
        return false
      }

      try {
        const api = useApi()
        const data = await api.post('/api/v1/oauth/token', {
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken
        }) as { access_token: string; refresh_token?: string }

        this.setAuth(data.access_token, data.refresh_token || this.refreshToken, this.user || undefined)
        return true
      } catch (error) {
        console.error('トークンの更新に失敗しました:', error)
        this.logout()
        return false
      }
    }
  }
})
