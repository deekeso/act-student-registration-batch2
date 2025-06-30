<template>
  <base-container>
    <login-form :confirmpassword="true"></login-form>
  </base-container>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { BaseContainer, LoginForm } from '@/components'
import { useAuth } from '@/composables/useAuth'
</script>

<style></style>
