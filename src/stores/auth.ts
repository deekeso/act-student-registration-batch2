import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

// Define types for the state and user
interface User {
  username: string
  password?: string
}

// Interface for the state of the authentication store
interface AuthState {
  isAuthenticated: boolean
  // Logged out null
  currentUser: User | null
  users: User[]
}

// Define the authentication store
export const useAuthStore = defineStore('auth', {

  // Initial state as not logged in
  state: (): AuthState => ({
    isAuthenticated: false,
    currentUser: null,
    users: [
      {
        username: 'admin',
        password: 'admin123',
      },
      {
        username: 'user',
        password: 'user123',
      },
    ],
  }),

  getters: {
    isLoggedIn: (state): boolean => state.isAuthenticated,
  },

  actions: {
    login(username: string, password: string): boolean {
      // Check if user exists in users array and if password is correct
      const user = this.users.find(
        (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password,
      )

      // If user exists, set isAuthenticated to true and currentUser to user object copy
      if (user) {
        this.isAuthenticated = true
        this.currentUser = { ...user }

        // Don't store password in currentUser for security
        if (this.currentUser) {
          delete this.currentUser.password
        }

        ElMessage({
          message: 'Login successful!',
          type: 'success',
        })

        return true
      }

      return false
    },

    logout() {
      this.isAuthenticated = false
      this.currentUser = null
    },

    // Check if a username exists in the system for forgot password
    checkUserExists(username: string): boolean {
      if (!username) return false

      const userExists = this.users.some((u) => u.username.toLowerCase() === username.toLowerCase())

      return userExists
    },

    // Reset password for a user
    resetPassword(username: string, newPassword: string): boolean {

      // Check if user exists in users array
      const userIndex = this.users.findIndex(
        (u) => u.username.toLowerCase() === username.toLowerCase(),
      )

      // If user exists, update password
      if (userIndex !== -1) {
        this.users[userIndex].password = newPassword
        return true
      }

      return false
    },
  },

  persist: {
    key: 'auth-state',
    storage: localStorage,
  }
})