<template>
  <div>
    <!-- グローバルローディング -->
    <GlobalLoading />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// アプリ全体の設定
</script>

<style>
/* グローバルスタイル */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  color: #333;
  line-height: 1.6;
}

#__nuxt {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
