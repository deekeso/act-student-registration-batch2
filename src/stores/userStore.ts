import { createUser, deleteUser, getUserById, getUsers, updateUser } from '@/services/userServices'
import type { NewUser, User } from '@/types/user'
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

    async addUser(user: NewUser) {
      const newUser = await createUser(user)
      this.users.push(newUser)
    },

    async editUser(id: number, user: Partial<User>) {
      const updatedUser = await updateUser(id, user)
      const index = this.users.findIndex((u) => u.id === id)
      if (index !== -1) this.users[index] = updatedUser
    },

    async removeUser(id: number) {
      await deleteUser(id)
      this.users = this.users.filter((user) => user.id !== id)
    },
  },
})
