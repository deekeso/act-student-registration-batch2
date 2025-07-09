import { defineStore } from 'pinia'
import type { Admin } from '@/interfaces/adminInterface'
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

export const useAuthenticationStore = defineStore('auth', () => {
  const admin = ref<Admin>({
    username: '',
    password: '',
  })

  const isLoading = ref(false)

  function handleLogin() {
    localStorage.setItem('token', generateToken())
    localStorage.setItem(
      'loggedInAdmin',
      JSON.stringify({
        username: admin.value.username.trim(),
        loginTime: new Date().toISOString(),
      }),
    )

    console.log('Admin logged in successfully:', {
      username: admin.value.username.trim(),
      loginTime: new Date().toISOString(),
    })

    return true
  }

  function generateToken() {
    return 'admin_token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
  }

  const isAuthenticated = computed(() => {
    try {
      const token = localStorage.getItem('token')
      const savedLoggedInAdmin = localStorage.getItem('loggedInAdmin')

      if (!token || !savedLoggedInAdmin) {
        return false
      }
      const parsedAdmin = JSON.parse(savedLoggedInAdmin)
      return !!(token && parsedAdmin && parsedAdmin.username && parsedAdmin.loginTime)
    } catch (error) {
      console.error('Auth validation error:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('loggedInAdmin')
      return false
    }
  })

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('loggedInAdmin')
    ElMessage.success('Admin logout successful')
    window.location.href = '/login'
  }

  return {
    admin,
    isLoading,
    handleLogin,
    isAuthenticated,
    logout,
  }
})
