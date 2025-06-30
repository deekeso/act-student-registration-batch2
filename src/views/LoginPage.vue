<template>
  <base-container>
    <login-form></login-form>
  </base-container>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useAccount } from '@/stores/account'
import { BaseContainer, LoginForm } from '@/components'
import { useAuth } from '@/composables/useAuth'
const { onCreateUsers } = useAccount()
const { checkAuth } = useAuth()

// create test account onMount
onMounted(() => {
  checkAuth()

  if (!localStorage.getItem('accounts') && !localStorage.getItem('students')) {
    onCreateUsers()
  }
})
</script>

<style scoped></style>
