<template>
  <div class="min-h-screen bg-gray-50">
    <!-- ヘッダー -->
    <AppHeader
      title="TODO編集"
      icon="Edit"
      icon-color="#e6a23c"
      :menu-items="headerMenuItems"
      @menu-click="handleHeaderMenuClick"
    />

    <!-- メインコンテンツ -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- ローディング状態 -->
      <div v-if="pending" class="flex justify-center items-center py-12">
        <el-loading-spinner size="40" />
        <span class="ml-4 text-gray-600">TODOを読み込み中...</span>
      </div>

      <!-- エラー状態 -->
      <el-alert
        v-else-if="error"
        :title="error"
        type="error"
        show-icon
        :closable="false"
        class="mb-4"
      />

      <!-- フォーム -->
      <TodoForm
        v-else-if="todo"
        :initial-data="todo"
        :is-edit="true"
        :todo-id="todo.id"
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
  Edit,
  ArrowLeft,
  HomeFilled
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 認証ミドルウェアを適用
definePageMeta({
  middleware: 'auth'
})

// 型定義
interface Todo {
  id: number
  title: string
  description?: string
  completed: boolean
  created_at?: string
  updated_at?: string
}

interface TodoFormData {
  title: string
  description?: string
  completed: boolean
}

// ページのメタデータを設定
useHead({
  title: 'TODO編集 - Nuxt + Rails API ポートフォリオ',
  meta: [
    {
      name: 'description',
      content: 'TODOを編集するページ'
    }
  ]
})

// ルートパラメータ
const route = useRoute()
const todoId = Number(route.params.id)

// API
const api = useApi()

// リアクティブデータ
const todo = ref<Todo | null>(null)
const pending = ref(false)
const error = ref<string | null>(null)
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

// TODOを取得する関数
const fetchTodo = async () => {
  pending.value = true
  error.value = null

  try {
    const data = await api.get(`/api/v1/todos/${todoId}`) as Todo
    todo.value = data
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('TODOの取得に失敗しました:', err)
    error.value = err instanceof Error ? err.message : 'TODOの取得に失敗しました'
    ElMessage.error('TODOの取得に失敗しました')
  } finally {
    pending.value = false
  }
}

// フォーム送信処理
const handleSubmit = async (formData: TodoFormData) => {
  try {
    isSubmitting.value = true

    const updatedTodo = await api.put(`/api/v1/todos/${todoId}`, {
      title: formData.title,
      description: formData.description || undefined,
      completed: formData.completed
    }) as Todo

    todo.value = updatedTodo

    ElMessage.success(`TODO「${formData.title}」を更新しました`)

    // 更新完了後の確認ダイアログ
    await ElMessageBox.confirm(
      'TODOの更新が完了しました。一覧ページに移動しますか？',
      '更新完了',
      {
        confirmButtonText: '一覧を見る',
        cancelButtonText: '続けて編集',
        type: 'success'
      }
    )

    // 一覧ページに遷移
    await navigateTo('/todos')
  } catch (err) {
    if (err instanceof Error && err.message !== 'cancel') {
      // eslint-disable-next-line no-console
      console.error('TODO更新に失敗しました:', err)
      ElMessage.error('TODO更新に失敗しました')
    }
    // ユーザーが「続けて編集」を選んだ場合は何もしない
  } finally {
    isSubmitting.value = false
  }
}

// 一覧ページに戻る
const navigateToTodos = () => {
  navigateTo('/todos')
}

// ページ読み込み時にTODOを取得
onMounted(() => {
  if (!todoId || isNaN(todoId)) {
    error.value = '無効なTODO IDです'
  } else {
    fetchTodo()
  }

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
