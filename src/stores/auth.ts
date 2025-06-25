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

      // Get stored credentials from localStorage
      const storedUsername = localStorage.getItem('Username')
      const storedPassword = localStorage.getItem('Password')

      // If no stored credentials, use default admin credentials
      const validUsername = storedUsername || 'admin'
      const validPassword = storedPassword || 'admin123!'

      if (this.username === validUsername && this.password === validPassword) {
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

    resetPassword(username: string, newPassword: string) {
      // Only allow password reset for admin user
      if (username !== 'admin') {
        return {
          success: false,
          message: 'Username not found. Only valid user can reset password.',
        }
      }

      // Update the stored credentials
      this.username = username
      this.password = newPassword

      // Save to localStorage
      localStorage.setItem('Username', username)
      localStorage.setItem('Password', newPassword)

      return { success: true, message: 'Password reset successfully' }
    },
  },
})
