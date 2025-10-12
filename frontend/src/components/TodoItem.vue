<template>
  <div
    class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors duration-200 todo-item"
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
            @change="handleToggleStatus"
            :disabled="!allowToggle"
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

            <span class="text-xs text-gray-400" v-if="!isMobile">
              ID: {{ todo.id }}
            </span>
          </div>

          <div v-if="showActions" class="flex items-center space-x-2">
            <el-button 
              size="small" 
              type="primary" 
              text 
              @click="handleEdit"
              :disabled="!allowEdit"
            >
              <el-icon><Edit /></el-icon>
              編集
            </el-button>

            <el-button 
              size="small" 
              type="danger" 
              text 
              @click="handleDelete"
              :disabled="!allowDelete"
            >
              <el-icon><Delete /></el-icon>
              削除
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CircleCheck, Clock, Edit, Delete } from '@element-plus/icons-vue'

// 型定義
interface Todo {
  id: number
  title: string
  description?: string
  completed: boolean
  created_at?: string
  updated_at?: string
}

interface Props {
  todo: Todo
  showActions?: boolean        // 編集・削除ボタンを表示するか
  allowToggle?: boolean       // ステータス切り替えを許可するか
  allowEdit?: boolean         // 編集を許可するか
  allowDelete?: boolean       // 削除を許可するか
  isMobile?: boolean          // モバイル表示かどうか
}

interface Emits {
  (e: 'toggle-status', todo: Todo): void
  (e: 'edit', todo: Todo): void
  (e: 'delete', todo: Todo): void
}

// プロパティのデフォルト値
const props = withDefaults(defineProps<Props>(), {
  showActions: true,
  allowToggle: true,
  allowEdit: true,
  allowDelete: true,
  isMobile: false
})

const emit = defineEmits<Emits>()

// イベントハンドラー
const handleToggleStatus = () => {
  if (props.allowToggle) {
    emit('toggle-status', props.todo)
  }
}

const handleEdit = () => {
  if (props.allowEdit) {
    emit('edit', props.todo)
  }
}

const handleDelete = () => {
  if (props.allowDelete) {
    emit('delete', props.todo)
  }
}
</script>

<style scoped>
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

/* チェックボックスのカスタマイズ */
.el-checkbox {
  --el-checkbox-checked-bg-color: #67c23a;
  --el-checkbox-checked-border-color: #67c23a;
}

/* 無効化された要素のスタイル */
.el-checkbox.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.el-button.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
