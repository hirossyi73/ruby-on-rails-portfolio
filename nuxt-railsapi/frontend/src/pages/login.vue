<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <el-card class="w-full max-w-md" shadow="always">
      <template #header>
        <div class="flex items-center justify-center">
          <el-icon size="48" color="#409eff" class="mr-3">
            <Lock />
          </el-icon>
          <h1 class="text-3xl font-bold text-gray-800">
            ログイン
          </h1>
        </div>
      </template>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="メールアドレス" prop="email">
          <el-input
            v-model="loginForm.email"
            type="email"
            placeholder="your-email@example.com"
            size="large"
            :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item label="パスワード" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="パスワードを入力"
            size="large"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            native-type="submit"
            class="w-full"
          >
            <el-icon class="mr-2">
              <Right />
            </el-icon>
            ログイン
          </el-button>
        </el-form-item>
      </el-form>

      <div class="mt-6 text-center">
        <NuxtLink to="/" class="text-blue-600 hover:text-blue-800">
          <el-icon class="mr-1">
            <HomeFilled />
          </el-icon>
          ホームに戻る
        </NuxtLink>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Lock, User, Right, HomeFilled } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

// ページメタデータ
useHead({
  title: 'ログイン - TODO管理',
  meta: [
    {
      name: 'description',
      content: 'OAuth認証によるログイン'
    }
  ]
})

// ストアとAPI
const authStore = useAuthStore()
const api = useApi()
const router = useRouter()
const config = useRuntimeConfig()

// フォームデータ
const loginFormRef = ref<FormInstance>()
const loginForm = reactive({
  email: '',
  password: ''
})

const loading = ref(false)

// バリデーションルール
const rules: FormRules = {
  email: [
    { required: true, message: 'メールアドレスを入力してください', trigger: 'blur' },
    { type: 'email', message: '正しいメールアドレスを入力してください', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'パスワードを入力してください', trigger: 'blur' },
    { min: 6, message: 'パスワードは6文字以上で入力してください', trigger: 'blur' }
  ]
}

// 通常のログイン処理
const handleLogin = async () => {
  if (!loginFormRef.value) { return }

  await loginFormRef.value.validate(async (valid) => {
    if (!valid) { return }

    loading.value = true

    try {
      // OAuthトークンエンドポイントを呼び出し
      const data = await api.post('/oauth/token', {
        grant_type: 'password',
        username: loginForm.email,
        password: loginForm.password,
        client_id: config.public.oauthClientId,
        client_secret: config.public.oauthClientSecret
      }) as {
        access_token: string
        refresh_token?: string
        user?: { id: number; email: string; name?: string }
      }

      // 認証情報を保存
      authStore.setAuth(
        data.access_token,
        data.refresh_token,
        data.user
      )

      ElMessage.success('ログインに成功しました')

      // TODOページへリダイレクト
      await router.push('/todos')
    } catch (error) {
      ElMessage.error('ログインに失敗しました。メールアドレスとパスワードを確認してください。')
    } finally {
      loading.value = false
    }
  })
}

// ページロード時にローディング解除
onMounted(() => {
  const { hideLoading } = useLoading()
  hideLoading()
})
</script>

<style scoped>
.el-card {
  border-radius: 12px;
}

:deep(.el-card__header) {
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

:deep(.el-card__header h1) {
  color: white;
  margin: 0;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #374151;
}

:deep(.el-divider__text) {
  background-color: white;
  color: #9ca3af;
  font-size: 0.875rem;
}
</style>
