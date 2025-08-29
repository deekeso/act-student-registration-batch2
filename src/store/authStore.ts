import { defineStore } from 'pinia'
import type { User } from '@/types/authUser'

export const useUserStore = defineStore('user', {
  state: () => {
    const usersJson = localStorage.getItem('trello-users')
    const currentUserJson = localStorage.getItem('trello-current-user')

    let users: User[] = []
    let currentUser: User | null = null

    if (usersJson) {
      try {
        const parsedUsers = JSON.parse(usersJson)
        if (
          Array.isArray(parsedUsers) &&
          parsedUsers.every(
            (u) =>
              typeof u.userId === 'number' &&
              typeof u.username === 'string' &&
              typeof u.password === 'string' &&
              (u.email === undefined || typeof u.email === 'string'),
          )
        ) {
          users = parsedUsers
        }
      } catch (e) {
        console.error('Failed to parse users from localStorage:', e)
      }
    }

    if (currentUserJson) {
      try {
        const parsedUser = JSON.parse(currentUserJson)
        if (
          typeof parsedUser.userId === 'number' &&
          typeof parsedUser.username === 'string' &&
          typeof parsedUser.password === 'string' &&
          (parsedUser.email === undefined || typeof parsedUser.email === 'string')
        ) {
          currentUser = parsedUser
        }
      } catch (e) {
        console.error('Failed to parse currentUser from localStorage:', e)
      }
    }

    return {
      users: users as User[],
      currentUser: currentUser as User | null,
    }
  },

  actions: {
    saveToStorage() {
      localStorage.setItem('trello-users', JSON.stringify(this.users))
      localStorage.setItem('trello-current-user', JSON.stringify(this.currentUser))
    },

    register(username: string, password: string, email?: string) {
      if (this.users.some((u) => u.username === username)) {
        throw new Error('Username already exists')
      }
      const userId = this.users.length + 1
      const newUser: User = { userId, username, password, email }
      this.users.push(newUser)
      this.currentUser = newUser
      this.saveToStorage()
    },

    login(username: string, password: string) {
      const user = this.users.find((u) => u.username === username && u.password === password)
      if (!user) {
        throw new Error('Invalid username or password')
      }
      this.currentUser = user
      this.saveToStorage()
    },

    logout() {
      this.currentUser = null
      this.saveToStorage()
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.currentUser,
    getUserByUsername: (state) => (username: string) =>
      state.users.find((u) => u.username === username),
  },
})
