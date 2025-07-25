<template>
  <div class="navbar-outer">
    <div class="navbar">
      <h1 @click="home" class="navbar-title">LazPlus</h1>
      <SearchBar />
      <el-button v-if="authStore.isLoggedIn" @click="productCart" link class="cart">
        <el-icon><ShoppingCart /></el-icon>
        <span class="button-text">Cart</span>
      </el-button>
      <el-button v-if="authStore.isLoggedIn" @click="productOrdered" link class="order">
        <el-icon><Document /></el-icon>
        <span class="button-text">Order</span>
      </el-button>
      <el-button v-if="authStore.isLoggedIn" @click="userProfile" link class="user">
        <el-icon><User /></el-icon>
        <span class="button-text">{{ currentUser }}</span>
      </el-button>
      <el-button v-if="!authStore.isLoggedIn" link @click="loginDialogVisible = true" class="login">
        <el-icon><Lock /></el-icon>
        <span class="button-text">Login</span>
      </el-button>
      <el-button v-if="!authStore.isLoggedIn" link @click="$emit('open-register-dialog')" class="signup">
        <el-icon><Edit /></el-icon>
        <span class="button-text">Sign up</span>
      </el-button>
      <el-button v-if="authStore.isLoggedIn" link @click="logout" class="logout">
        <el-icon><SwitchButton /></el-icon>
        <span class="button-text">Logout</span>
      </el-button>
    </div>
    <UserLogin v-model:visible="loginDialogVisible" @login="handleLogin" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import SearchBar from './SearchBar.vue'
import UserLogin from './dialog/UserLogin.vue'
import { useAuthStore } from '@/stores/userAuth'
import { Document, Edit, Lock, ShoppingCart, SwitchButton, User } from '@element-plus/icons-vue'
import { computed, onMounted, ref } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()
const currentUser = computed(() => authStore.username)
const loginDialogVisible = ref(false)

onMounted(() => {
  authStore.loadUserInfo()
})

function home() {
  router.push('/')
}

function productCart() {
  router.push('/product/cart')
}

function productOrdered() {
  router.push('/product/ordered')
}

function userProfile() {
  router.push('/profile')
}

async function handleLogin({ username, password }: { username: string, password: string }) {
  const loadingInstance = ElLoading.service({ fullscreen: true, text: 'Logging in...' })
  try {
    const loginPromise = authStore.userLogin(username, password)
    const timerPromise = new Promise(resolve => setTimeout(resolve, 1000))
    const result = await loginPromise
    await timerPromise

    if (result.success) {
      ElMessage.success(result.message)
      loginDialogVisible.value = false
      await authStore.loadUserInfo()
    } else {
      ElMessage.error(result.message)
    }
  } finally {
    loadingInstance.close()
  }
}

async function logout() {
  const loadingInstance = ElLoading.service({ fullscreen: true, text: 'Logging out...' })
  try {
    await authStore.userLogout()
    await authStore.loadUserInfo()
    router.push('/')
    await new Promise(resolve => setTimeout(resolve, 1000))
  } finally {
    loadingInstance.close()
  }
}
</script>

<style scoped>
.navbar-outer {
  display: flex;
  justify-content: center;
  background-color: #2E2E2E;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar {
  width: 100%;
  max-width: 1600px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rem 2rem;
  padding: 24px;
}

.navbar h1 {
  font-size: 32px;
  font-weight: 700;
  color: #D9D9D9;
  position: relative;
  cursor: pointer;
}

/* buttons */
:deep(.el-button) {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

/* Line hover effect for h1 and buttons */
.navbar-title, .cart, .order, .user, .login, .signup, .logout {
  transition: all 0.3s ease;
}

.navbar-title:hover::after,
.cart:hover::after,
.order:hover::after,
.user:hover::after,
.login:hover::after,
.signup:hover::after,
.logout:hover::after  {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #FFD700;
  transform: scaleX(1);
  transform-origin: bottom right;
  transition: transform 0.3s ease;
}

.navbar-title::after,
.cart::after,
.order::after,
.user::after,
.login::after,
.signup::after,
.logout::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #FFD700;
  transform: scaleX(0);
  transform-origin: bottom right;
  transition: transform 0.3s ease;
}

.button-text, .el-icon {
  color: #D9D9D9;
}

@media (max-width: 575px) {
  .navbar {
    gap: 1rem;
    padding: 16px;
  }

  .el-button .button-text {
    display: none;
  }

  .navbar-title {
    display: none;
  }

  .el-button {
    padding: 8px;
    min-width: 0;
  }

  .el-button .el-icon {
    font-size: 20px;
  }

  /* Disable hover effect on smaller screens */
  :deep(.el-button:hover)::after {
    transform: scaleX(0);
  }
}
</style>
