export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  // クライアントサイドでのみ実行
  if (process.client) {
    // 初回アクセス時にトークンを復元
    if (!authStore.isAuthenticated) {
      authStore.restoreAuth()
    }

    // 認証されていない場合はログインページへリダイレクト
    if (!authStore.isLoggedIn) {
      return navigateTo('/login')
    }
  }
})
