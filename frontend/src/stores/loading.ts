import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(true) // 初期状態はローディング中
  
  return {
    isLoading
  }
})