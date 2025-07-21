<template>
  <header>
    <NavigationBar
@open-dialog="() => { console.log('Dialog should open!'); loginDialogVisible = true }"
      @open-register-dialog="registerDialogVisible = true"
    />
  </header>
  <main>
    <div @open-dialog="loginDialogVisible = true">
      <slot />
    </div>  
  </main>
  <footer></footer>
  <UserLogin :visible="loginDialogVisible" @update:visible="loginDialogVisible = $event" />
  <UserRegistration :visible="registerDialogVisible" @update:visible="handleRegisterDialogClose" />
</template>

<script setup lang="ts">
import UserLogin from '@/components/dialog/UserLogin.vue'
import UserRegistration from '@/components/dialog/UserRegistration.vue'
import NavigationBar from '@/components/NavigationBar.vue'
import { ElMessageBox } from 'element-plus'
import { ref } from 'vue'

const loginDialogVisible = ref(false)
const registerDialogVisible = ref(false)

// register dialog
const handleRegisterDialogClose = async (val: boolean) => {
  if (!val) {
    try {
      await ElMessageBox.confirm('Are you sure to close the registration dialog?')
      registerDialogVisible.value = false
    } catch {}
  } else {
    registerDialogVisible.value = true
  }
}
</script>

<style scoped></style>
