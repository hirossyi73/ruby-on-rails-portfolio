<template>
  <div class="min-h-screen bg-gray-50">
    <!-- ヘッダー -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <el-icon size="32" color="#409eff">
              <Document />
            </el-icon>
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900">
              TODO管理
            </h1>
          </div>

          <!-- デスクトップサイズでのボタン表示 -->
          <div class="hidden md:flex items-center space-x-4">
            <el-button type="primary" :loading="pending" @click="refreshTodos">
              <el-icon><Refresh /></el-icon>
              再読み込み
            </el-button>

            <NuxtLink to="/">
              <el-button>
                <el-icon><HomeFilled /></el-icon>
                ホーム
              </el-button>
            </NuxtLink>
          </div>

          <!-- モバイルサイズでのハンバーガーメニューボタン -->
          <div class="md:hidden">
            <button
              @click="isMenuOpen = !isMenuOpen"
              class="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <div class="hamburger-icon" :class="{ 'open': isMenuOpen }">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- モバイルメニュー -->
      <div
        v-if="isMenuOpen"
        class="md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg z-50"
      >
        <div class="px-4 py-4 space-y-3">
          <el-button
            type="primary"
            :loading="pending"
            @click="refreshTodos"
            class="w-full justify-start"
            size="large"
          >
            <el-icon><Refresh /></el-icon>
            再読み込み
          </el-button>

          <NuxtLink to="/" class="block">
            <el-button class="w-full justify-start" size="large">
              <el-icon><HomeFilled /></el-icon>
              ホーム
            </el-button>
          </NuxtLink>
        </div>
      </div>

      <!-- モバイルメニューオーバーレイ -->
      <div
        v-if="isMenuOpen"
        @click="isMenuOpen = false"
        class="md:hidden fixed inset-0 bg-black bg-opacity-25 z-40"
      ></div>
    </header>

    <!-- メインコンテンツ -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 統計情報 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <el-card shadow="hover" class="text-center">
          <div class="flex flex-col items-center">
            <el-icon size="32" color="#409eff" class="mb-2">
              <DataAnalysis />
            </el-icon>
            <div class="text-2xl font-bold text-gray-900">
              {{ totalCount }}
            </div>
            <div class="text-sm text-gray-500">
              総数
            </div>
          </div>
        </el-card>

        <el-card shadow="hover" class="text-center">
          <div class="flex flex-col items-center">
            <el-icon size="32" color="#67c23a" class="mb-2">
              <CircleCheck />
            </el-icon>
            <div class="text-2xl font-bold text-green-600">
              {{ completedCount }}
            </div>
            <div class="text-sm text-gray-500">
              完了
            </div>
          </div>
        </el-card>

        <el-card shadow="hover" class="text-center">
          <div class="flex flex-col items-center">
            <el-icon size="32" color="#e6a23c" class="mb-2">
              <Clock />
            </el-icon>
            <div class="text-2xl font-bold text-yellow-600">
              {{ pendingCount }}
            </div>
            <div class="text-sm text-gray-500">
              未完了
            </div>
          </div>
        </el-card>

        <el-card shadow="hover" class="text-center">
          <div class="flex flex-col items-center">
            <el-icon size="32" color="#909399" class="mb-2">
              <Files />
            </el-icon>
            <div class="text-2xl font-bold text-gray-600">
              {{ todos.length }}
            </div>
            <div class="text-sm text-gray-500">
              表示中
            </div>
          </div>
        </el-card>
      </div>

      <!-- TODOリスト -->
      <el-card shadow="always" class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-semibold text-gray-800">
              <el-icon class="mr-2"><List /></el-icon>
              TODO一覧
            </span>

            <!-- デスクトップサイズでのフィルター表示 -->
            <div class="hidden md:flex items-center space-x-4">
              <!-- フィルター機能 -->
              <el-select v-model="filters.status" placeholder="ステータス" size="small" class="!w-32">
                <el-option label="すべて" value="all" />
                <el-option label="完了" value="completed" />
                <el-option label="未完了" value="pending" />
              </el-select>

              <!-- ページサイズ選択 -->
              <el-select v-model="filters.per_page" size="small" class="!w-24">
                <el-option label="10" :value="10" />
                <el-option label="20" :value="20" />
                <el-option label="50" :value="50" />
              </el-select>
            </div>

            <!-- モバイルサイズでのフィルターボタン -->
            <div class="md:hidden">
              <button
                @click="isFilterMenuOpen = !isFilterMenuOpen"
                class="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <el-icon size="16">
                  <Filter />
                </el-icon>
              </button>
            </div>
          </div>

          <!-- モバイル用フィルターメニュー -->
          <div
            v-if="isFilterMenuOpen && isMobile"
            class="mt-4 p-4 bg-gray-50 rounded-lg border"
          >
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">ステータス</label>
                <el-select v-model="filters.status" placeholder="ステータス" size="small" class="w-full">
                  <el-option label="すべて" value="all" />
                  <el-option label="完了" value="completed" />
                  <el-option label="未完了" value="pending" />
                </el-select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">表示件数</label>
                <el-select v-model="filters.per_page" size="small" class="w-full">
                  <el-option label="10件" :value="10" />
                  <el-option label="20件" :value="20" />
                  <el-option label="50件" :value="50" />
                </el-select>
              </div>

              <div class="flex justify-end">
                <el-button size="small" @click="isFilterMenuOpen = false">
                  閉じる
                </el-button>
              </div>
            </div>
          </div>
        </template>

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

        <!-- 空状態 -->
        <div v-else-if="todos.length === 0" class="text-center py-12">
          <el-icon size="64" color="#c0c4cc" class="mb-4">
            <Document />
          </el-icon>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            TODOがありません
          </h3>
          <p class="text-gray-500">
            新しいTODOを作成してください
          </p>
          <el-button type="primary" class="mt-4" @click="createTodo">
            <el-icon><Plus /></el-icon>
            TODO作成
          </el-button>
        </div>

        <!-- TODOリスト -->
        <div v-else class="space-y-4">
          <div
            v-for="todo in filteredTodos"
            :key="todo.id"
            class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors duration-200"
            :class="{
              'bg-gray-50 opacity-75': todo.completed,
              'bg-white': !todo.completed
            }"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <el-checkbox
                    :model-value="todo.completed"
                    size="large"
                    @change="toggleTodoStatus(todo)"
                  />

                  <h3
                    class="text-lg font-medium"
                    :class="{
                      'line-through text-gray-500': todo.completed,
                      'text-gray-900': !todo.completed
                    }"
                  >
                    {{ todo.title }}
                  </h3>
                </div>

                <p
                  v-if="todo.description && !isMobile"
                  class="text-gray-600 ml-8 mb-3 leading-relaxed"
                  :class="{ 'line-through': todo.completed }"
                >
                  {{ todo.description }}
                </p>

                <div class="flex items-center justify-between ml-8">
                  <div class="flex items-center space-x-4">
                    <el-tag
                      :type="todo.completed ? 'success' : 'warning'"
                      size="small"
                      effect="light"
                    >
                      <el-icon class="mr-1">
                        <CircleCheck v-if="todo.completed" />
                        <Clock v-else />
                      </el-icon>
                      {{ todo.completed ? '完了' : '未完了' }}
                    </el-tag>

                    <span class="text-xs text-gray-400" v-show="!isMobile">ID: {{ todo.id }}</span>
                  </div>

                  <div class="flex items-center space-x-2">
                    <el-button size="small" type="primary" text @click="editTodo(todo)">
                      <el-icon><Edit /></el-icon>
                      編集
                    </el-button>

                    <el-button size="small" type="danger" text @click="deleteTodo(todo)">
                      <el-icon><Delete /></el-icon>
                      削除
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- ページネーション -->
      <div v-if="pagination && pagination.total_pages > 1" class="flex justify-center mb-8">
        <!-- デスクトップサイズ用ページネーション -->
        <el-pagination
          v-show="!isMobile"
          :current-page="filters.page"
          :page-size="filters.per_page"
          :total="pagination.total_count"
          :page-sizes="[10, 20, 50, 100]"
          :small="false"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
        
        <!-- モバイルサイズ用ページネーション -->
        <el-pagination
          v-show="isMobile"
          :current-page="filters.page"
          :page-size="filters.per_page"
          :total="pagination.total_count"
          :page-sizes="[10, 20, 50]"
          :small="true"
          layout="prev, pager, next"
          background
          class="mobile-pagination"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>

      <!-- モバイル用ページ情報とサイズ選択 -->
      <div v-if="pagination && pagination.total_pages > 1 && isMobile" class="flex flex-col items-center mb-6 space-y-3">
        <div class="text-sm text-gray-600 text-center">
          {{ pagination.total_count }}件中 {{ ((filters.page - 1) * filters.per_page) + 1 }} - 
          {{ Math.min(filters.page * filters.per_page, pagination.total_count) }}件を表示
        </div>
        
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-600">表示件数:</span>
          <el-select v-model="filters.per_page" size="small" class="!w-20">
            <el-option label="10" :value="10" />
            <el-option label="20" :value="20" />
            <el-option label="50" :value="50" />
          </el-select>
        </div>
      </div>

      <!-- 追加のアクション -->
      <div class="flex justify-center mt-8 space-x-4">
        <el-button type="success" size="large" @click="createTodo">
          <el-icon><Plus /></el-icon>
          新しいTODO
        </el-button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import {
  Document,
  Refresh,
  HomeFilled,
  DataAnalysis,
  CircleCheck,
  Clock,
  Files,
  List,
  Plus,
  Edit,
  Delete,
  Filter
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

interface Pagination {
  current_page: number
  total_pages: number
  total_count: number
  has_next_page: boolean
  has_prev_page: boolean
}

interface TodosResponse {
  todos: Todo[]
  pagination: Pagination
}

interface TodoFilters {
  page?: number
  per_page?: number
  status?: string
}

// ページのメタデータを設定
useHead({
  title: 'TODO一覧 - Nuxt + Rails API',
  meta: [
    {
      name: 'description',
      content: 'Element Plus と Tailwind CSS を使用したTODO管理システム'
    }
  ]
})

// 認証ミドルウェアを適用
definePageMeta({
  middleware: 'auth'
})

// リアクティブデータ
const todos = ref<Todo[]>([])
const pagination = ref<Pagination | null>(null)
const pending = ref(false)
const error = ref<string | null>(null)
const isMenuOpen = ref(false)
const isFilterMenuOpen = ref(false)
const windowWidth = ref(0)

// フィルター設定
const filters = ref<TodoFilters>({
  page: 1,
  per_page: 20,
  status: 'all'
})

// useApiコンポーザブルを使用
const api = useApi()

// TODOを取得する関数
const fetchTodos = async () => {
  pending.value = true
  error.value = null

  try {
    const data = await api.get('/api/v1/todos', filters.value) as TodosResponse

    todos.value = data.todos || []
    pagination.value = data.pagination || null

    ElMessage.success(`${todos.value.length}件のTODOを取得しました`)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('TODOの取得に失敗しました:', err)
    error.value = 'TODOの取得に失敗しました。バックエンドAPIが起動していることを確認してください。'
    ElMessage.error('TODOの取得に失敗しました')

    // APIエラー時は空配列を設定
    todos.value = []
    pagination.value = null
  } finally {
    pending.value = false
  }
}

// 再読み込み関数
const refreshTodos = () => {
  ElMessage.info('TODOリストを更新しています...')
  isMenuOpen.value = false // モバイルメニューを閉じる
  fetchTodos()
}

// ページ変更
const handlePageChange = (page: number) => {
  filters.value.page = page
  // watchによる自動フェッチがあるため、ここでのfetchTodos()呼び出しは不要
}

// ページサイズ変更
const handleSizeChange = (size: number) => {
  filters.value.per_page = size
  filters.value.page = 1 // ページサイズ変更時は1ページ目に戻る
}

// TODOの状態切り替え
const toggleTodoStatus = async (todo: Todo) => {
  try {
    await api.put(`/api/v1/todos/${todo.id}`, { completed: !todo.completed })

    todo.completed = !todo.completed
    ElMessage.success(`TODO「${todo.title}」を${todo.completed ? '完了' : '未完了'}にしました`)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('TODOの更新に失敗しました:', err)
    ElMessage.error('TODOの更新に失敗しました')
  }
}

// TODO編集
const editTodo = (todo: Todo) => {
  navigateTo(`/todos/${todo.id}/edit`)
}

// TODO削除
const deleteTodo = async (todo: Todo) => {
  try {
    await ElMessageBox.confirm(
      `TODO「${todo.title}」を削除しますか？`,
      '確認',
      {
        confirmButtonText: '削除',
        cancelButtonText: 'キャンセル',
        type: 'warning'
      }
    )

    await api.delete(`/api/v1/todos/${todo.id}`)

    todos.value = todos.value.filter((t: Todo) => t.id !== todo.id)
    ElMessage.success(`TODO「${todo.title}」を削除しました`)
  } catch (err) {
    if (err instanceof Error && err.message !== 'cancel') {
      // eslint-disable-next-line no-console
      console.error('TODOの削除に失敗しました:', err)
      ElMessage.error('TODOの削除に失敗しました')
    }
    // ユーザーがキャンセルした場合は何もしない
  }
}

// TODO作成
const createTodo = () => {
  navigateTo('/todos/create')
}

// 計算プロパティ
const completedCount = computed(() =>
  todos.value.filter((todo: Todo) => todo.completed).length
)

const pendingCount = computed(() =>
  todos.value.filter((todo: Todo) => !todo.completed).length
)

const totalCount = computed(() =>
  pagination.value?.total_count || todos.value.length
)

const filteredTodos = computed(() => {
  if (filters.value.status === 'all') { return todos.value }
  if (filters.value.status === 'completed') { return todos.value.filter((todo: Todo) => todo.completed) }
  if (filters.value.status === 'pending') { return todos.value.filter((todo: Todo) => !todo.completed) }
  return todos.value
})

const isMobile = computed(() => windowWidth.value < 768)

// ページ読み込み時にTODOを取得
onMounted(async () => {
  const { hideLoading } = useLoading()

  // ウィンドウサイズの初期化
  if (typeof window !== 'undefined') {
    windowWidth.value = window.innerWidth
    window.addEventListener('resize', () => {
      windowWidth.value = window.innerWidth
    })
  }

  try {
    await fetchTodos()
  } finally {
    // ページ読み込み完了後にローディング解除
    hideLoading()
  }
})

// フィルター変更時に自動でリフレッシュ
watch(filters, () => {
  isFilterMenuOpen.value = false // フィルター変更時にモバイルメニューを閉じる
  fetchTodos()
}, { deep: true })
</script>

<style scoped>
/* Element Plusとの組み合わせ用のカスタムスタイル */
.el-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.el-card:hover {
  --el-card-border-color: #409eff;
}

/* チェックボックスのカスタマイズ */
.el-checkbox {
  --el-checkbox-checked-bg-color: #67c23a;
  --el-checkbox-checked-border-color: #67c23a;
}

/* アニメーション効果 */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.todo-item {
  animation: slideInUp 0.4s ease-out;
}

/* ハンバーガーメニューのスタイル */
.hamburger-icon {
  width: 20px;
  height: 16px;
  position: relative;
  cursor: pointer;
}

.hamburger-icon span {
  display: block;
  position: absolute;
  height: 2px;
  width: 100%;
  background: #374151;
  border-radius: 1px;
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: .25s ease-in-out;
}

.hamburger-icon span:nth-child(1) {
  top: 0px;
}

.hamburger-icon span:nth-child(2) {
  top: 7px;
}

.hamburger-icon span:nth-child(3) {
  top: 14px;
}

.hamburger-icon.open span:nth-child(1) {
  top: 7px;
  transform: rotate(135deg);
}

.hamburger-icon.open span:nth-child(2) {
  opacity: 0;
  left: -60px;
}

.hamburger-icon.open span:nth-child(3) {
  top: 7px;
  transform: rotate(-135deg);
}

/* モバイルメニューのアニメーション */
.mobile-menu {
  transform: translateY(-100%);
  transition: transform 0.3s ease-in-out;
}

.mobile-menu.open {
  transform: translateY(0);
}

/* モバイル用ページネーション */
.mobile-pagination {
  --el-pagination-font-size: 14px;
  --el-pagination-button-width: 32px;
  --el-pagination-button-height: 32px;
}

.mobile-pagination .el-pager .number {
  min-width: 32px;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
}

.mobile-pagination .btn-prev,
.mobile-pagination .btn-next {
  min-width: 32px;
  height: 32px;
  line-height: 32px;
  font-size: 12px;
}

/* モバイルでのボタン間隔調整 */
@media (max-width: 640px) {
  .mobile-pagination .el-pager {
    gap: 2px;
  }
  
  .mobile-pagination .el-pager .number {
    min-width: 28px;
    height: 28px;
    line-height: 28px;
    font-size: 12px;
  }
}
</style>
