<template>
  <div>
    <header>
      <nav class="navbar">
        <div class="navbar-brand">
          <h1><NuxtLink to="/" @click="closeMenu">Nuxt + Rails API ポートフォリオ</NuxtLink></h1>
        </div>
        
        <!-- ハンバーガーメニューボタン（モバイル用） -->
        <button 
          class="hamburger"
          :class="{ 'is-active': isMenuOpen }"
          @click="toggleMenu"
          aria-label="メニューを開く"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <!-- ナビゲーションメニュー -->
        <div class="navbar-menu" :class="{ 'is-active': isMenuOpen }">
          <NuxtLink to="/" class="nav-link" @click="closeMenu">
            ホーム
          </NuxtLink>

          <NuxtLink v-if="isAuthenticated" to="/todos" class="nav-link" @click="closeMenu">
            TODO一覧
          </NuxtLink>
          
          <span v-if="isAuthenticated" class="nav-user">
            {{ user?.email || 'ユーザー' }}
          </span>
          
          <button v-if="isAuthenticated" class="nav-button" @click="handleLogout">
            ログアウト
          </button>
          
          <NuxtLink v-else to="/login" class="nav-link" @click="closeMenu">
            ログイン
          </NuxtLink>
        </div>
        
        <!-- オーバーレイ（モバイル用） -->
        <div 
          v-if="isMenuOpen" 
          class="navbar-overlay"
          @click="closeMenu"
        ></div>
      </nav>
    </header>
    
    <main>
      <slot />
    </main>
    
    <footer>
      <p>&copy; 2025 Nuxt + Rails API ポートフォリオ</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const { isAuthenticated, user, logout } = useAuth()
const router = useRouter()

// ハンバーガーメニューの状態管理
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

// ログアウト処理
const handleLogout = async () => {
  closeMenu() // メニューを閉じる
  
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

    logout()
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
  position: relative;
}

.navbar-brand h1 {
  margin: 0;
  font-size: 1.5rem;
}

/* ハンバーガーボタン */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.hamburger span {
  width: 24px;
  height: 3px;
  background: white;
  border-radius: 3px;
  transition: all 0.3s ease;
  transform-origin: 1px;
}

.hamburger.is-active span:first-child {
  transform: rotate(45deg);
}

.hamburger.is-active span:nth-child(2) {
  opacity: 0;
  transform: translateX(20px);
}

.hamburger.is-active span:nth-child(3) {
  transform: rotate(-45deg);
}

/* ナビゲーションメニュー */
.navbar-menu {
  display: flex;
  gap: 1rem;
  align-items: center;
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

/* オーバーレイ */
.navbar-overlay {
  display: none;
}

/* モバイル用スタイル */
@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }
  
  .navbar-brand h1 {
    font-size: 1.2rem;
  }
  
  .hamburger {
    display: flex;
  }
  
  .navbar-menu {
    position: fixed;
    top: 0;
    right: -100%;
    height: 100vh;
    width: 280px;
    background-color: #4CAF50;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: 4rem 1rem 1rem;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    transition: right 0.3s ease;
    z-index: 1000;
    gap: 0;
  }
  
  .navbar-menu.is-active {
    right: 0;
  }
  
  .navbar-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
  
  .nav-link,
  .nav-user,
  .nav-button {
    width: 100%;
    text-align: left;
    margin: 0.5rem 0;
    padding: 1rem;
    border-radius: 8px;
  }
  
  .nav-link:hover,
  .nav-button:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
  
  .nav-user {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
  }
}

main {
  min-height: calc(100vh - 135px);
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

@media (max-width: 768px) {
  main {
    padding: 1rem;
  }
}
</style>
