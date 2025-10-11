/**
 * 認証ミドルウェア（SSR/CSR両対応）
 * Cookie ベースの認証ガード
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // ミドルウェア開始ログ
  console.log('[MIDDLEWARE] 認証ミドルウェア開始')
  console.log('[MIDDLEWARE] アクセス先:', to.path)
  console.log('[MIDDLEWARE] process.server:', process.server)
  console.log('[MIDDLEWARE] process.client:', process.client)
  
  // 公開ページは認証不要
  const publicPages = ['/login', '/']
  if (publicPages.includes(to.path)) {
    console.log('[MIDDLEWARE] 公開ページのため認証をスキップ:', to.path)
    return
  }

  // useAuth composable で認証確認
  const { checkAuth } = useAuth()
  
  console.log('[MIDDLEWARE] 認証チェック開始')
  const isAuthenticated = await checkAuth()
  console.log('[MIDDLEWARE] 認証結果:', isAuthenticated)

  // 未認証の場合はログインページへリダイレクト
  if (!isAuthenticated) {
    console.log('[MIDDLEWARE] 未認証のためログインページへリダイレクト')
    console.log('[MIDDLEWARE] リダイレクト先: /login?redirect=' + to.fullPath)
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }
  
  console.log('[MIDDLEWARE] 認証OK - ページへのアクセスを許可')
})
