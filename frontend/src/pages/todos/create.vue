<template>
  <div class="min-h-screen bg-gray-50">
    <!-- ヘッダー -->
    <AppHeader
      title="新しいTODO作成"
      icon="Plus"
      icon-color="#409eff"
      :menu-items="headerMenuItems"
      @menu-click="handleHeaderMenuClick"
    />

    <!-- メインコンテンツ -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <TodoForm
        :is-submitting="isSubmitting"
        @submit="handleSubmit"
        @cancel="navigateToTodos"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Plus,
  ArrowLeft,
  HomeFilled
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 型定義
interface TodoFormData {
  title: string
  description?: string
  completed: boolean
}

// ページのメタデータを設定
useHead({
  title: 'TODO作成 - Nuxt + Rails API ポートフォリオ',
  meta: [
    {
      name: 'description',
      content: '新しいTODOを作成するページ'
    }
  ]
})

// 認証ミドルウェアを適用
definePageMeta({
  middleware: 'auth'
})

// API
const api = useApi()

// 送信状態
const isSubmitting = ref(false)

// ヘッダーメニューの設定
const headerMenuItems = [
  {
    label: '一覧に戻る',
    icon: 'ArrowLeft',
    component: 'NuxtLink',
    props: {
      to: '/todos',
      buttonProps: {}
    },
    action: 'back'
  },
  {
    label: 'ホーム',
    icon: 'HomeFilled',
    component: 'NuxtLink',
    props: {
      to: '/',
      buttonProps: {}
    },
    action: 'home'
  }
]

// ヘッダーメニューのクリックハンドラー
const handleHeaderMenuClick = (item: any, event: Event) => {
  // NuxtLinkの場合は自動でナビゲーションされる
}

// フォーム送信処理
const handleSubmit = async (formData: TodoFormData) => {
  try {
    isSubmitting.value = true

    // APIでTODO作成
    await api.post('/api/v1/todos', {
      title: formData.title,
      description: formData.description || undefined,
      completed: formData.completed
    })

    ElMessage.success(`TODO「${formData.title}」を作成しました`)

    // 作成完了後の確認ダイアログ
    await ElMessageBox.confirm(
      'TODOの作成が完了しました。一覧ページに移動しますか？',
      '作成完了',
      {
        confirmButtonText: '一覧を見る',
        cancelButtonText: '続けて作成',
        type: 'success'
      }
    )

    // 一覧ページに遷移
    await navigateTo('/todos')
  } catch (err) {
    if (err instanceof Error && err.message !== 'cancel') {
      // eslint-disable-next-line no-console
      console.error('TODO作成に失敗しました:', err)
      ElMessage.error('TODO作成に失敗しました')
    }
    // ユーザーが「続けて作成」を選んだ場合は何もしない
  } finally {
    isSubmitting.value = false
  }
}

// 一覧ページに戻る
const navigateToTodos = () => {
  navigateTo('/todos')
}

// ページロード時にローディング解除
onMounted(() => {
  const { hideLoading } = useLoading()
  hideLoading()
})
</script>

<style scoped>
/* ページレベルのスタイル */
header {
  animation: slideInDown 0.6s ease-out;
}

main {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
