<template>
  <div class="navbar-outer">
    <div class="navbar">
      <h1 @click="home">LazPlus</h1>
      <SearchBar />
      <el-button @click="productCart" link>Cart</el-button>
      <el-button @click="productOrdered" link>Order</el-button>
      <el-button v-if="!authStore.isLoggedIn" link @click="$emit('open-dialog')">Login</el-button>
      <el-button v-if="!authStore.isLoggedIn" link @click="$emit('open-register-dialog')"
        >Sign up</el-button
      >
      <el-button v-if="authStore.isLoggedIn" link @click="authStore.userLogout">Logout</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import SearchBar from './SearchBar.vue'
import { useAuthStore } from '@/stores/userAuth'

const router = useRouter()
const authStore = useAuthStore()

function home() {
  router.push('/home')
}

function productCart() {
  router.push('/product/cart')
}

function productOrdered() {
  router.push('/product/ordered')
}
</script>

<style scoped>
.navbar-outer {
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: #ffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rem;
  padding: 24px;
  width: 100%;
}

.navbar h1 {
  font-size: 32px;
  font-weight: 700;
  color: #0f146d;
}
</style>
