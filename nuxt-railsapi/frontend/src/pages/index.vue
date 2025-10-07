<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
    <!-- ヘッダー -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <el-icon size="32" color="#409eff">
              <Monitor />
            </el-icon>
            <h1 class="text-2xl font-bold text-gray-900">
              Nuxt + Rails API
            </h1>
          </div>

          <div class="flex items-center space-x-4">
            <el-button type="primary" :loading="isLoading" @click="checkApiStatus">
              <el-icon><Connection /></el-icon>
              API確認
            </el-button>

            <el-tag
              :type="apiConnected ? 'success' : 'danger'"
              size="large"
              effect="dark"
            >
              {{ apiConnected ? '接続中' : '切断' }}
            </el-tag>
          </div>
        </div>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- ウェルカムセクション -->
      <div class="text-center mb-16">
        <div class="mb-8">
          <el-icon size="64" color="#409eff" class="mb-4">
            <Star />
          </el-icon>
        </div>

        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          こんにちは！
        </h2>

        <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
          Nuxt.js と Rails API を使用したモダンなフルスタックアプリケーションへようこそ！
          <br>
          Element Plus と Tailwind CSS でスタイリングされた美しいUIをお楽しみください。
        </p>

        <el-alert
          v-if="apiMessage"
          :title="apiMessage"
          :type="apiConnected ? 'success' : 'error'"
          :closable="false"
          show-icon
          class="max-w-md mx-auto mb-8"
        />
      </div>

      <!-- 機能カード -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <el-card
          v-for="feature in features"
          :key="feature.id"
          shadow="hover"
          class="feature-card cursor-pointer transition-all duration-300 hover:scale-105"
          @click="handleFeatureClick(feature)"
        >
          <template #header>
            <div class="flex items-center space-x-3">
              <el-icon :size="24" :color="feature.color">
                <component :is="feature.icon" />
              </el-icon>
              <span class="text-lg font-semibold text-gray-800">
                {{ feature.title }}
              </span>
            </div>
          </template>

          <p class="text-gray-600 leading-relaxed mb-4">
            {{ feature.description }}
          </p>

          <div class="flex flex-wrap gap-2">
            <el-tag
              v-for="tech in feature.technologies"
              :key="tech"
              size="small"
              :type="feature.tagType"
              effect="light"
            >
              {{ tech }}
            </el-tag>
          </div>
        </el-card>
      </div>

      <!-- クイックアクション -->
      <div class="bg-white rounded-2xl shadow-lg p-8 text-center">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">
          アプリケーションを探索
        </h3>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <el-button
            type="primary"
            size="large"
            class="min-w-[200px]"
            @click="navigateToTodos"
          >
            <el-icon><Document /></el-icon>
            TODO一覧を見る
          </el-button>

          <el-button
            type="info"
            size="large"
            class="min-w-[200px]"
            @click="openGithub"
          >
            <el-icon><Link /></el-icon>
            GitHub
          </el-button>
        </div>
      </div>

      <!-- 統計情報 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow"
        >
          <el-icon :size="32" :color="stat.color" class="mb-3">
            <component :is="stat.icon" />
          </el-icon>
          <div class="text-2xl font-bold text-gray-900 mb-1">
            {{ stat.value }}
          </div>
          <div class="text-sm text-gray-500">
            {{ stat.label }}
          </div>
        </div>
      </div>
    </main>

    <!-- フッター -->
    <footer class="bg-gray-900 text-white py-8 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-gray-400">
          © 2024 Nuxt + Rails API Project. Built with
          <el-icon color="#41b883" class="mx-1">
            <Star />
          </el-icon>
          Vue.js & Rails
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  Monitor,
  Connection,
  Star,
  Document,
  View,
  Link,
  Platform,
  Lightning,
  Box,
  DataAnalysis,
  Setting
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// ページのメタデータを設定
useHead({
  title: 'ホーム - Nuxt + Rails API',
  meta: [
    {
      name: 'description',
      content: 'Element Plus と Tailwind CSS を使用したモダンなフルスタックアプリケーション'
    }
  ]
})

// リアクティブデータ
const isLoading = ref(false)
const apiConnected = ref(false)
const apiMessage = ref('')

// useApiコンポーザブルを使用
const api = useApi()

// 機能データ
const features = reactive([
  {
    id: 1,
    title: 'Nuxt.js',
    description: 'Vue.jsベースのフルスタックフレームワーク。SSR、SPA、静的サイト生成をサポート。',
    icon: Platform,
    color: '#41b883',
    tagType: 'success',
    technologies: ['Vue 3', 'TypeScript', 'SSR']
  },
  {
    id: 2,
    title: 'Rails API',
    description: '高速で信頼性の高いバックエンドAPI。RESTful設計とJSON形式でのデータ交換。',
    icon: Lightning,
    color: '#cc0000',
    tagType: 'danger',
    technologies: ['Ruby', 'MySQL', 'REST API']
  },
  {
    id: 3,
    title: 'Docker',
    description: 'コンテナ化された開発環境。一貫性のある環境でチーム開発を効率化。',
    icon: Box,
    color: '#2496ed',
    tagType: 'primary',
    technologies: ['Docker', 'Compose', 'Container']
  },
  {
    id: 4,
    title: 'Element Plus',
    description: 'Vue 3対応のUIコンポーネントライブラリ。美しく使いやすいインターフェース。',
    icon: Star,
    color: '#409eff',
    tagType: 'primary',
    technologies: ['Components', 'Theme', 'Icons']
  },
  {
    id: 5,
    title: 'Tailwind CSS',
    description: 'ユーティリティファーストのCSSフレームワーク。高速でカスタマイズ可能。',
    icon: Setting,
    color: '#38bdf8',
    tagType: 'info',
    technologies: ['Utility', 'Responsive', 'JIT']
  },
  {
    id: 6,
    title: 'TypeScript',
    description: '型安全なJavaScript開発。大規模アプリケーションの開発効率を向上。',
    icon: DataAnalysis,
    color: '#3178c6',
    tagType: 'primary',
    technologies: ['Type Safety', 'IntelliSense', 'Refactoring']
  }
])

// 統計データ
const stats = reactive([
  {
    label: 'フロントエンド',
    value: 'Vue 3',
    icon: Platform,
    color: '#41b883'
  },
  {
    label: 'バックエンド',
    value: 'Rails 7',
    icon: Lightning,
    color: '#cc0000'
  },
  {
    label: 'データベース',
    value: 'MySQL',
    icon: DataAnalysis,
    color: '#00618a'
  },
  {
    label: 'コンテナ',
    value: 'Docker',
    icon: Box,
    color: '#2496ed'
  }
])

// メソッド
const checkApiStatus = async () => {
  isLoading.value = true
  apiMessage.value = ''

  try {
    const response = await api.get('/health') as { status: string }

    if (response.status === 'OK') {
      apiConnected.value = true
      apiMessage.value = 'APIに正常に接続されています'
      ElMessage.success('APIに正常に接続されました')
    } else {
      apiConnected.value = false
      apiMessage.value = 'APIへの接続に失敗しました'
      ElMessage.error('APIへの接続に失敗しました')
    }
  } catch (error) {
    apiConnected.value = false
    apiMessage.value = 'APIへの接続でエラーが発生しました'
    ElMessage.error('APIへの接続でエラーが発生しました')
    // eslint-disable-next-line no-console
    console.error('API Error:', error)
  } finally {
    isLoading.value = false
  }
}

const handleFeatureClick = (feature: any) => {
  ElMessage.info(`${feature.title} の詳細情報を表示します`)
}

const navigateToTodos = () => {
  navigateTo('/todos')
}

const openGithub = () => {
  window.open('https://github.com', '_blank')
}

// ページロード時にAPI状態を確認
onMounted(() => {
  // eslint-disable-next-line no-console
  console.log('Indexページが読み込まれました')
  checkApiStatus()
})
</script>

<style scoped>
/* Element Plusとの組み合わせ用のカスタムスタイル */
.feature-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-card:hover {
  --el-card-border-color: #409eff;
}

/* アニメーション効果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-card {
  animation: fadeInUp 0.6s ease-out;
}
</style>
