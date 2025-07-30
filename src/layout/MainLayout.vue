<template>
  <header class="sticky-header">
    <NavigationBar
      @open-dialog="() => { console.log('Dialog should open!'); loginDialogVisible = true }"
      @open-register-dialog="registerDialogVisible = true"
    />
  </header>
  <main>
    <slot />
  </main>
  <footer></footer>
  <UserLogin :visible="loginDialogVisible" @update:visible="loginDialogVisible = $event" />
  <UserRegistration :visible="registerDialogVisible" @update:visible="registerDialogVisible = $event" />
</template>

<script setup lang="ts">
import UserLogin from '@/components/dialog/UserLogin.vue'
import UserRegistration from '@/components/dialog/UserRegistration.vue'
import NavigationBar from '@/components/NavigationBar.vue'
import { ref } from 'vue'

const loginDialogVisible = ref(false)
const registerDialogVisible = ref(false)

</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 999; /* ensures it stays above other content */
}

</style>
