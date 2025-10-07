<template>
  <div class="min-h-screen bg-gray-50">
    <!-- ヘッダー -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <el-icon size="32" color="#e6a23c">
              <Edit />
            </el-icon>
            <h1 class="text-2xl font-bold text-gray-900">
              TODO編集
            </h1>
          </div>

          <div class="flex items-center space-x-4">
            <NuxtLink to="/todos">
              <el-button>
                <el-icon><ArrowLeft /></el-icon>
                一覧に戻る
              </el-button>
            </NuxtLink>

            <NuxtLink to="/">
              <el-button>
                <el-icon><HomeFilled /></el-icon>
                ホーム
              </el-button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

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
  title: 'TODO編集 - Nuxt + Rails API',
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

// リアクティブデータ
const todo = ref<Todo | null>(null)
const pending = ref(false)
const error = ref<string | null>(null)
const isSubmitting = ref(false)

// TODOを取得する関数
const fetchTodo = async () => {
  pending.value = true
  error.value = null
  
  try {
    const { $config } = useNuxtApp()
    const baseUrl = $config.public.apiBaseUrl
    
    const response = await fetch(`${baseUrl}/api/v1/todos/${todoId}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('TODOが見つかりません')
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    todo.value = data
  } catch (err) {
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

    const { $config } = useNuxtApp()
    const baseUrl = $config.public.apiBaseUrl
    
    const response = await fetch(`${baseUrl}/api/v1/todos/${todoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: formData.title,
        description: formData.description || undefined,
        completed: formData.completed
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const updatedTodo = await response.json()
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
    return
  }
  fetchTodo()
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
