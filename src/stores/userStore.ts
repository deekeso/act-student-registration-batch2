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
        const user = await getUserById(id)
        if (user) {
          this.selectedUser = user
        } else {
          // fallback to store
          this.selectedUser = this.users.find((u) => u.id === id) ?? null
        }
      } catch (error) {
        console.error('Failed to fetch user', error)

        // fallback to store
        this.selectedUser = this.users.find((u) => u.id === id) ?? null
      }
    },

    async addUser(user: NewUser) {
      const newUser = await createUser(user)
      this.users.push(newUser)
    },

    async editUser(id: number, user: Partial<User>) {
      try {
        const updatedUser = await updateUser(id, user)

        const index = this.users.findIndex((u) => u.id === id)

        if (index !== -1) {
          this.users[index] = updatedUser ?? { ...this.users[index], ...user }
        }
      } catch (error) {
        console.error('Update failed:', error)

        // fallback
        const index = this.users.findIndex((u) => u.id === id)
        if (index !== -1) {
          this.users[index] = { ...this.users[index], ...user }
        }
      }
    },

    async removeUser(id: number) {
      await deleteUser(id)
      this.users = this.users.filter((user) => user.id !== id)
    },
  },
})
