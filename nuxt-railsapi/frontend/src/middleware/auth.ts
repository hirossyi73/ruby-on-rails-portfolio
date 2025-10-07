/**
 * 認証ミドルウェア（SSR/CSR両対応）
 * Cookie ベースの認証ガード
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // 公開ページは認証不要
  const publicPages = ['/login', '/']
  if (publicPages.includes(to.path)) {
    return
  }

  // useAuth composable で認証確認
  const { checkAuth } = useAuth()
  const isAuthenticated = await checkAuth()

  // 未認証の場合はログインページへリダイレクト
  if (!isAuthenticated) {
    return navigateTo('/login', {
      redirectCode: process.server ? 302 : undefined
    })
  }
})
