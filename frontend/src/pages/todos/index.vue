<template>
  <div class="min-h-screen bg-gray-50">
    <!-- ヘッダー -->
    <AppHeader
      title="TODO管理"
      icon="Document"
      icon-color="#409eff"
      :menu-items="headerMenuItems"
      @menu-click="handleHeaderMenuClick"
    />

    <!-- メインコンテンツ -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 統計情報 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" v-if="!isMobile">
        <el-card 
          v-for="stat in statsCards" 
          :key="stat.key"
          shadow="hover" 
          class="text-center"
        >
          <div class="flex flex-col items-center">
            <el-icon size="32" :color="stat.iconColor" class="mb-2">
              <component :is="stat.icon" />
            </el-icon>
            <div class="text-2xl font-bold" :class="stat.textColor">
              {{ stat.value }}
            </div>
            <div class="text-sm text-gray-500">
              {{ stat.label }}
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
          <TodoItem
            v-for="todo in filteredTodos"
            :key="todo.id"
            :todo="todo"
            :show-actions="true"
            :allow-toggle="true"
            :allow-edit="true"
            :allow-delete="true"
            :is-mobile="isMobile"
            @toggle-status="toggleTodoStatus"
            @edit="editTodo"
            @delete="deleteTodo"
          />
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
  title: 'TODO一覧 - Nuxt + Rails API ポートフォリオ',
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

// 統計カードの設定
const statsCards = computed(() => [
  {
    key: 'total',
    icon: DataAnalysis,
    iconColor: '#409eff',
    textColor: 'text-gray-900',
    value: totalCount.value,
    label: '総数'
  },
  {
    key: 'completed',
    icon: CircleCheck,
    iconColor: '#67c23a',
    textColor: 'text-green-600',
    value: completedCount.value,
    label: '完了'
  },
  {
    key: 'pending',
    icon: Clock,
    iconColor: '#e6a23c',
    textColor: 'text-yellow-600',
    value: pendingCount.value,
    label: '未完了'
  },
  {
    key: 'displayed',
    icon: Files,
    iconColor: '#909399',
    textColor: 'text-gray-600',
    value: todos.value.length,
    label: '表示中'
  }
])

// ヘッダーメニューの設定
const headerMenuItems = computed(() => [
  {
    label: '再読み込み',
    icon: 'Refresh',
    props: {
      type: 'primary',
      loading: pending.value
    },
    action: 'refresh'
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
])

// ヘッダーメニューのクリックハンドラー
const handleHeaderMenuClick = (item: any, event: Event) => {
  if (item.action === 'refresh') {
    refreshTodos()
  }
  // NuxtLinkの場合は自動でナビゲーションされる
}

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
