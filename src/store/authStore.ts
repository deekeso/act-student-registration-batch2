import { defineStore } from 'pinia'
import type { User } from '@/types/authUser'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[], // All registered users
    currentUser: null as User | null, // Currently logged-in user
  }),

  actions: {
    register(username: string, password: string, email?: string) {
      // Check if username already exists
      if (this.users.some((u) => u.username === username)) {
        throw new Error('Username already exists')
      }

      // Generate new userId based on array length
      const userId = this.users.length + 1
      const newUser: User = { userId, username, password, email }
      this.users.push(newUser)
      this.currentUser = newUser
    },

    login(username: string, password: string) {
      const user = this.users.find((u) => u.username === username && u.password === password)
      if (!user) {
        throw new Error('Invalid username or password')
      }
      this.currentUser = user
    },

    logout() {
      this.currentUser = null
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.currentUser,
    getUserByUsername: (state) => (username: string) =>
      state.users.find((u) => u.username === username),
  },
})
