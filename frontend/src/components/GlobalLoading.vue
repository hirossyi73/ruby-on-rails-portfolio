<template>
  <div
    id="global-loading"
    class="global-loading-overlay"
    :class="{ hidden: !isLoading }"
  >
    <div class="global-loading-content">
      <div class="global-loading-spinner" />
      <div class="global-loading-text">
        Loading...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLoadingStore } from '~/stores/loading'

// ストアからローディング状態を取得
const loadingStore = useLoadingStore()
const isLoading = computed(() => loadingStore.isLoading)
</script>

<style scoped>
.global-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  opacity: 1;
  visibility: visible;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.global-loading-overlay.hidden {
  opacity: 0;
  visibility: hidden;
}

.global-loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.global-loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.global-loading-text {
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
