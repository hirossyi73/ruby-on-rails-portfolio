<template>
  <div class="home-container">
    <div class="welcome-section">
      <h2 class="greeting">こんにちは！</h2>
      <p class="description">
        Nuxt.js と Rails API を使用したフルスタックアプリケーションへようこそ！
      </p>
      
      <div class="features">
        <div class="feature-card">
          <h3>🚀 Nuxt.js</h3>
          <p>Vue.jsベースのフルスタックフレームワーク</p>
        </div>
        
        <div class="feature-card">
          <h3>⚡ Rails API</h3>
          <p>高速で信頼性の高いバックエンドAPI</p>
        </div>
        
        <div class="feature-card">
          <h3>🐳 Docker</h3>
          <p>コンテナ化された開発環境</p>
        </div>
      </div>
      
      <div class="quick-actions">
        <NuxtLink to="/todos" class="action-button">
          📝 TODO一覧を見る
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ページのメタデータを設定
useHead({
  title: 'ホーム - Nuxt + Rails API',
  meta: [
    { 
      name: 'description', 
      content: 'Nuxt.js と Rails API を使用したフルスタックアプリケーション' 
    }
  ]
})

// 必要に応じてここにページロジックを追加
onMounted(() => {
  console.log('Indexページが読み込まれました')
})
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.welcome-section {
  text-align: center;
  margin-bottom: 3rem;
}

.greeting {
  font-size: 3rem;
  color: #4CAF50;
  margin-bottom: 1rem;
  font-weight: bold;
}

.description {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 3rem;
  line-height: 1.6;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.feature-card h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.quick-actions {
  text-align: center;
  margin-top: 3rem;
}

.action-button {
  display: inline-block;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.action-button:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .greeting {
    font-size: 2rem;
  }
  
  .features {
    grid-template-columns: 1fr;
  }
  
  .home-container {
    padding: 1rem;
  }
}
</style>
