import { getUserById, getUsers } from '@/services/userServices'
import type { User } from '@/types/user'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    selectedUser: null as User | null,
  }),

  actions: {
    async fetchAllUsers() {
      try {
        this.users = await getUsers()
      } catch (error) {
        console.error('Failed to fetch users: ', error)
      }
    },

    async fetchUserById(id: number) {
      try {
        this.selectedUser = await getUserById(id)
      } catch (error) {
        console.error('Failed to fetch user', error)
      }
    },
  },
})
