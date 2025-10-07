<template>
  <div>
    <header>
      <nav class="navbar">
        <div class="navbar-brand">
          <h1>Nuxt + Rails API</h1>
        </div>
        <div class="navbar-menu">
          <NuxtLink to="/" class="nav-link">
            ホーム
          </NuxtLink>
          <NuxtLink to="/todos" class="nav-link">
            TODO一覧
          </NuxtLink>
          <span v-if="authStore.isLoggedIn" class="nav-user">
            {{ authStore.user?.email || 'ユーザー' }}
          </span>
          <button v-if="authStore.isLoggedIn" class="nav-button" @click="handleLogout">
            ログアウト
          </button>
          <NuxtLink v-else to="/login" class="nav-link">
            ログイン
          </NuxtLink>
        </div>
      </nav>
    </header>
    
    <main>
      <slot />
    </main>
    
    <footer>
      <p>&copy; 2025 Nuxt + Rails API プロジェクト</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'

const authStore = useAuthStore()
const router = useRouter()

// クライアントサイドで認証状態を復元
onMounted(() => {
  if (process.client && !authStore.isAuthenticated) {
    authStore.restoreAuth()
  }
})

// ログアウト処理
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      'ログアウトしますか？',
      '確認',
      {
        confirmButtonText: 'ログアウト',
        cancelButtonText: 'キャンセル',
        type: 'warning'
      }
    )

    authStore.logout()
    ElMessage.success('ログアウトしました')
    await router.push('/login')
  } catch {
    // キャンセル時は何もしない
  }
}
</script>

<style scoped>
.navbar {
  background-color: #4CAF50;
  padding: 1rem 2rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand h1 {
  margin: 0;
  font-size: 1.5rem;
}

.navbar-menu {
  display: flex;
  gap: 1rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: bold;
}

.nav-user {
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  opacity: 0.9;
}

.nav-button {
  color: white;
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.9rem;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

main {
  min-height: calc(100vh - 120px);
  padding: 2rem;
}

footer {
  background-color: #f5f5f5;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}

footer p {
  margin: 0;
  color: #666;
}
</style>
