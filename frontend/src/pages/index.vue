<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
    <!-- ヘッダー -->
    <AppHeader
      title="Nuxt + Rails API"
    />

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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, markRaw } from 'vue'
import {
  Monitor,
  Connection,
  Star,
  Document,
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
const apiConnected = ref(false)
const apiMessage = ref('')

// 機能データ
const features = reactive([
  {
    id: 1,
    title: 'Nuxt.js',
    description: 'Vue.jsベースのフルスタックフレームワーク。SSR、SPA、静的サイト生成をサポート。',
    icon: markRaw(Platform),
    color: '#41b883',
    tagType: 'success',
    technologies: ['Vue 3', 'TypeScript', 'SSR']
  },
  {
    id: 2,
    title: 'Rails API',
    description: '高速で信頼性の高いバックエンドAPI。RESTful設計とJSON形式でのデータ交換。',
    icon: markRaw(Lightning),
    color: '#cc0000',
    tagType: 'danger',
    technologies: ['Ruby', 'MySQL', 'REST API']
  },
  {
    id: 3,
    title: 'Docker',
    description: 'コンテナ化された開発環境。一貫性のある環境でチーム開発を効率化。',
    icon: markRaw(Box),
    color: '#2496ed',
    tagType: 'primary',
    technologies: ['Docker', 'Compose', 'Container']
  },
  {
    id: 4,
    title: 'Element Plus',
    description: 'Vue 3対応のUIコンポーネントライブラリ。美しく使いやすいインターフェース。',
    icon: markRaw(Star),
    color: '#409eff',
    tagType: 'primary',
    technologies: ['Components', 'Theme', 'Icons']
  },
  {
    id: 5,
    title: 'Tailwind CSS',
    description: 'ユーティリティファーストのCSSフレームワーク。高速でカスタマイズ可能。',
    icon: markRaw(Setting),
    color: '#38bdf8',
    tagType: 'info',
    technologies: ['Utility', 'Responsive', 'JIT']
  },
  {
    id: 6,
    title: 'TypeScript',
    description: '型安全なJavaScript開発。大規模アプリケーションの開発効率を向上。',
    icon: markRaw(DataAnalysis),
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
    icon: markRaw(Platform),
    color: '#41b883'
  },
  {
    label: 'バックエンド',
    value: 'Rails 7',
    icon: markRaw(Lightning),
    color: '#cc0000'
  },
  {
    label: 'データベース',
    value: 'MySQL',
    icon: markRaw(DataAnalysis),
    color: '#00618a'
  },
  {
    label: 'コンテナ',
    value: 'Docker',
    icon: markRaw(Box),
    color: '#2496ed'
  }
])

const handleFeatureClick = (feature: any) => {
  ElMessage.info(`${feature.title} の詳細情報を表示します`)
}

const navigateToTodos = () => {
  navigateTo('/todos')
}

const openGithub = () => {
  window.open('https://github.com/hirossyi73/ruby-on-rails-portfolio', '_blank')
}

// ページロード時にAPI状態を確認
onMounted(async () => {
  const { hideLoading } = useLoading()
  // ページ読み込み完了後にローディング解除
  hideLoading()
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
