<template>
  <div>
    <!-- フォームセクション -->
    <el-card shadow="always" :class="isMobile ? 'mb-4' : 'mb-6'">
      <template #header>
        <div class="flex items-center">
          <el-icon class="mr-2" color="#409eff">
            <EditPen />
          </el-icon>
          <span :class="isMobile ? 'text-base' : 'text-lg'" class="font-semibold text-gray-800">
            {{ isEdit ? 'TODO編集' : 'TODO詳細情報' }}
          </span>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        :label-width="isMobile ? '100%' : '120px'"
        :label-position="isMobile ? 'top' : 'right'"
        size="large"
        @submit.prevent="handleSubmit"
      >
        <el-form-item label="タイトル" prop="title">
          <el-input
            v-model="formData.title"
            placeholder="TODOのタイトルを入力してください"
            maxlength="100"
            show-word-limit
            clearable
          />
        </el-form-item>

        <el-form-item label="説明" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            placeholder="TODOの詳細説明を入力してください（任意）"
            :rows="4"
            maxlength="500"
            show-word-limit
            resize="vertical"
          />
        </el-form-item>

        <el-form-item label="ステータス" prop="completed">
          <el-radio-group v-model="formData.completed">
            <el-radio :label="false">
              <el-icon class="mr-1">
                <Clock />
              </el-icon>
              未完了
            </el-radio>
            <el-radio :label="true">
              <el-icon class="mr-1">
                <CircleCheck />
              </el-icon>
              完了
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <div class="responsive-form-buttons">
            <el-button
              type="primary"
              size="large"
              :class="isMobile ? 'w-full' : ''"
              :loading="isSubmitting"
              @click="handleSubmit"
            >
              <el-icon><Check /></el-icon>
              {{ isEdit ? '更新する' : '作成する' }}
            </el-button>

            <el-button
              size="large"
              :class="isMobile ? 'w-full' : ''"
              @click="handleCancel"
            >
              <el-icon><Close /></el-icon>
              キャンセル
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- プレビューセクション -->
    <el-card v-if="formData.title" shadow="hover" :class="isMobile ? 'mb-4' : 'mb-6'">
      <template #header>
        <div class="flex items-center">
          <el-icon class="mr-2" color="#67c23a">
            <View />
          </el-icon>
          <span :class="isMobile ? 'text-base' : 'text-lg'" class="font-semibold text-gray-800">
            プレビュー
          </span>
        </div>
      </template>

      <TodoItem
        :todo="previewTodo"
        :show-actions="false"
        :allow-toggle="false"
        :allow-edit="false"
        :allow-delete="false"
        :is-mobile="isMobile"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import {
  EditPen,
  Check,
  Close,
  View
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import TodoItem from './TodoItem.vue'

// モバイル判定
const windowWidth = ref(0)
const isMobile = computed(() => windowWidth.value < 768)

// プレビュー用のTODOオブジェクト
const previewTodo = computed(() => ({
  id: props.todoId || 0,
  title: formData.title,
  description: formData.description || undefined,
  completed: formData.completed,
  created_at: undefined,
  updated_at: undefined
}))

// 型定義
interface TodoFormData {
  title: string
  description?: string
  completed: boolean
}

interface Props {
  initialData?: TodoFormData
  isEdit?: boolean
  todoId?: number
  isSubmitting?: boolean
}

interface Emits {
  (e: 'submit', data: TodoFormData): void
  (e: 'cancel'): void
}

// Props定義
const props = withDefaults(defineProps<Props>(), {
  initialData: () => ({
    title: '',
    description: '',
    completed: false
  }),
  isEdit: false,
  todoId: undefined,
  isSubmitting: false
})

// Emits定義
const emit = defineEmits<Emits>()

// フォーム参照
const formRef = ref<FormInstance>()

// フォームデータ
const formData = reactive<TodoFormData>({
  title: '',
  description: '',
  completed: false
})

// 初期データの監視と設定
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formData.title = newData.title || ''
      formData.description = newData.description || ''
      formData.completed = newData.completed || false
    }
  },
  { immediate: true, deep: true }
)

// バリデーションルール
const formRules: FormRules = {
  title: [
    { required: true, message: 'タイトルは必須です', trigger: 'blur' },
    { min: 1, max: 100, message: 'タイトルは1文字以上100文字以下で入力してください', trigger: 'blur' }
  ],
  description: [
    { max: 500, message: '説明は500文字以下で入力してください', trigger: 'blur' }
  ]
}

// フォーム送信処理
const handleSubmit = async () => {
  if (!formRef.value) {
    return
  }

  try {
    // バリデーション実行
    const isValid = await formRef.value.validate()
    if (!isValid) {
      ElMessage.warning('入力内容を確認してください')
      return
    }

    // 親コンポーネントに送信イベントを発行
    emit('submit', {
      title: formData.title,
      description: formData.description || undefined,
      completed: formData.completed
    })
  } catch (error) {
    console.error('フォームバリデーションエラー:', error)
  }
}

// キャンセル処理
const handleCancel = () => {
  emit('cancel')
}

// 外部からフォームをリセットする機能
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  formData.title = ''
  formData.description = ''
  formData.completed = false
}

// 外部からバリデーションを実行する機能
const validateForm = async (): Promise<boolean> => {
  if (!formRef.value) {
    return false
  }
  
  try {
    return await formRef.value.validate()
  } catch {
    return false
  }
}

// 親コンポーネントで使用できるようにメソッドを公開
defineExpose({
  resetForm,
  validateForm,
  formData
})

// ウィンドウサイズの監視
onMounted(() => {
  if (typeof window !== 'undefined') {
    windowWidth.value = window.innerWidth
    window.addEventListener('resize', () => {
      windowWidth.value = window.innerWidth
    })
  }
})
</script>

<style scoped>
/* Element Plusとの組み合わせ用のカスタムスタイル */
.el-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.el-form-item {
  margin-bottom: 24px;
}

/* プレビューエリアのスタイル */
.el-card:hover {
  --el-card-border-color: #409eff;
}

/* フォーカス状態の改善 */
.el-input__wrapper:focus-within {
  box-shadow: 0 0 0 1px #409eff inset;
}

.el-textarea__inner:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 1px #409eff inset;
}

/* アニメーション効果 */
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

.el-card {
  animation: fadeInUp 0.6s ease-out;
}
</style>
