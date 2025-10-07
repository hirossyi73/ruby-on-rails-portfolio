import { computed } from 'vue'
import { useLoadingStore } from '~/stores/loading'

export const useLoading = () => {
  const loadingStore = useLoadingStore()
  
  const showLoading = () => {
    // 既にローディング中の場合は何もしない
    if (loadingStore.isLoading) {
      return
    }
    
    const loadingElement = document.getElementById('global-loading')
    if (loadingElement) {
      // ローディングを表示
      loadingElement.classList.remove('hidden')
      loadingStore.isLoading = true
    }
  }
  
  const hideLoading = () => {
    const loadingElement = document.getElementById('global-loading')
    if (loadingElement) {
      // フェードアウト効果でローディングを非表示
      loadingElement.classList.add('hidden')
      loadingStore.isLoading = false
    }
  }
  
  return {
    showLoading,
    hideLoading,
    isLoading: computed(() => loadingStore.isLoading)
  }
}