<template>
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- 左側：アイコンとタイトル -->
        <div class="flex items-center space-x-4">
          <el-icon size="32" :color="iconColor" v-if="icon">
            <component :is="iconComponents[icon]" />
          </el-icon>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900">
            {{ title }}
          </h1>
        </div>

        <!-- デスクトップサイズでのメニュー表示 -->
        <div class="hidden md:flex items-center space-x-4">
          <div v-for="(item, index) in menuItems" :key="index">
            <!-- NuxtLinkの場合 -->
            <NuxtLink v-if="item.component === 'NuxtLink'" :to="item.props?.to || '#'">
              <el-button v-bind="item.props?.buttonProps || {}">
                <el-icon v-if="item.icon">
                  <component :is="iconComponents[item.icon]" />
                </el-icon>
                {{ item.label }}
              </el-button>
            </NuxtLink>
            
            <!-- 通常のボタンの場合 -->
            <el-button
              v-else
              v-bind="item.props"
              @click="handleMenuClick(item, $event)"
            >
              <el-icon v-if="item.icon">
                <component :is="iconComponents[item.icon]" />
              </el-icon>
              {{ item.label }}
            </el-button>
          </div>
        </div>

        <!-- モバイルサイズでのハンバーガーメニューボタン -->
        <div class="md:hidden" v-if="menuItems.length > 0">
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
        <div v-for="(item, index) in menuItems" :key="`mobile-${index}`">
          <!-- NuxtLinkの場合 -->
          <NuxtLink v-if="item.component === 'NuxtLink'" :to="item.props?.to || '#'" class="block">
            <el-button
              v-bind="{ ...item.props?.buttonProps, class: 'w-full justify-start', size: 'large' }"
            >
              <el-icon v-if="item.icon">
                <component :is="iconComponents[item.icon]" />
              </el-icon>
              {{ item.label }}
            </el-button>
          </NuxtLink>
          
          <!-- 通常のボタンの場合 -->
          <el-button
            v-else
            v-bind="{ ...item.props, class: 'w-full justify-start', size: 'large' }"
            @click="handleMenuClick(item, $event)"
          >
            <el-icon v-if="item.icon">
              <component :is="iconComponents[item.icon]" />
            </el-icon>
            {{ item.label }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- モバイルメニューオーバーレイ -->
    <div
      v-if="isMenuOpen"
      @click="isMenuOpen = false"
      class="md:hidden fixed inset-0 bg-black bg-opacity-25 z-40"
    ></div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ArrowLeft,
  HomeFilled,
  Refresh,
  Plus,
  Edit,
  Document,
  Filter
} from '@element-plus/icons-vue'

// アイコンマッピング
const iconComponents = {
  ArrowLeft,
  HomeFilled,
  Refresh,
  Plus,
  Edit,
  Document,
  Filter
}

// Props の型定義
interface MenuItem {
  label: string
  icon?: keyof typeof iconComponents  // アイコンキーの型を制限
  component?: string // デフォルトは 'el-button'
  props?: Record<string, any>
  action?: string | (() => void)
  to?: string // NuxtLink用
}

interface Props {
  title: string
  icon: keyof typeof iconComponents  // アイコンキーの型を制限
  iconColor?: string
  menuItems: MenuItem[]
}

// Props の定義
const props = withDefaults(defineProps<Props>(), {
  iconColor: '#409eff',
  menuItems: () => []
})

// Emits の定義
const emit = defineEmits<{
  menuClick: [item: MenuItem, event: Event]
}>()

// リアクティブデータ
const isMenuOpen = ref(false)

// メニューアイテムのクリックハンドラー
const handleMenuClick = (item: MenuItem, event: Event) => {
  // モバイルメニューを閉じる
  isMenuOpen.value = false
  
  // 親コンポーネントにイベントを通知
  emit('menuClick', item, event)
  
  // アクション実行
  if (typeof item.action === 'function') {
    item.action()
  }
}
</script>

<style scoped>
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
</style>
