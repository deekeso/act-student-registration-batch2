<script setup lang="ts">
import LoginForm from '@/components/LoginForm.vue'
</script>

<template>
  <main class="login-view">
    <LoginForm />
  </main>
</template>

<style scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .login-view {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .login-view {
    padding: 12px;
  }
}
</style>
