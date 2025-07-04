<template>
  <base-container>
    <login-form :confirmpassword="true"></login-form>
  </base-container>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { BaseContainer, LoginForm } from '@/components'

const { isGuest } = useAuth();

onMounted(() => {
  isGuest()
}) 

</script>

<style></style>
