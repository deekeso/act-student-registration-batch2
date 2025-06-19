import { defineStore } from 'pinia'
import { computed } from 'vue'

interface LoginState {
  username: string
  password: string
}

export const useAuthStore = defineStore('auth', {
  state: () =>
    ({
      username: '',
      password: '',
    }) as LoginState,

  getters: {
    isFormValid: (state) => {
      return computed(() => state.username.trim() && state.password.trim())
    },
  },

  actions: {
    validateCredentials() {
      if (!this.isFormValid.value) {
        return { success: false, message: 'Please enter both username and password' }
      }

      // Hardcoded admin credentials for testing
      const ADMIN_USERNAME = 'admin'
      const ADMIN_PASSWORD = 'admin123!'

      if (this.username === ADMIN_USERNAME && this.password === ADMIN_PASSWORD) {
        return { success: true, message: 'Login successful', username: this.username }
      } else {
        return { success: false, message: 'Invalid username or password' }
      }
    },

    loadStoredCredentials() {
      const savedUsername = localStorage.getItem('Username')
      const savedPassword = localStorage.getItem('Password')
      if (savedUsername) {
        this.username = savedUsername
      }
      if (savedPassword) {
        this.password = savedPassword
      }
    },

    saveCredentials() {
      localStorage.setItem('Username', this.username)
      localStorage.setItem('Password', this.password)
    },

    clearCredentials() {
      this.username = ''
      this.password = ''
      localStorage.removeItem('Username')
      localStorage.removeItem('Password')
    },
  },
})
