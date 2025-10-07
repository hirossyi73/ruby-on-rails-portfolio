<template>
  <div class="min-h-screen bg-gray-50">
    <!-- ヘッダー -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <el-icon size="32" color="#409eff">
              <Plus />
            </el-icon>
            <h1 class="text-2xl font-bold text-gray-900">
              新しいTODO作成
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
      <TodoForm
        :is-submitting="isSubmitting"
        @submit="handleSubmit"
        @cancel="navigateToTodos"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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
  title: 'TODO作成 - Nuxt + Rails API',
  meta: [
    {
      name: 'description',
      content: '新しいTODOを作成するページ'
    }
  ]
})

// 送信状態
const isSubmitting = ref(false)

// フォーム送信処理
const handleSubmit = async (formData: TodoFormData) => {
  try {
    isSubmitting.value = true

    // APIでTODO作成
    const { $config } = useNuxtApp()
    const baseUrl = $config.public.apiBaseUrl
    
    const response = await fetch(`${baseUrl}/api/v1/todos`, {
      method: 'POST',
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
