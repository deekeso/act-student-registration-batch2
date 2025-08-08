import { addUser, editUser, fetchUser, removeUser } from '@/apis/userApi'
import type { User } from '@/types/User'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('users', {
  state: () => ({
    user: [] as User[],
  }),

  actions: {
    async getUsers() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        const fetchedUsers = await fetchUser()

        this.user = fetchedUsers.map((user: User) => ({
          ...user,
          createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        }))
        console.log('Fetched user:', this.user)
      } catch (error) {
        console.error(error)
      }
    },

    async createUser(newUser: Partial<User>) {
      try {
        const newId = this.user.length + 1

        const createdUser = {
          ...newUser,
          id: newId,
          createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        }
        await addUser(createdUser)
        this.user.push(createdUser)
        ElMessage.success('User Added')
        console.log('User added to store. New user count:', this.user.length)
      } catch (error) {
        console.error(' Error in createUser:', error)
      }
    },

    async updateUser(id: number, newUserData: Partial<User>) {
      try {
        const userIndex = this.user.findIndex((u) => u.id === id)
        console.log('userIndex found:', userIndex)

        if (userIndex === -1) {
          throw new Error('User not found!')
        }

        const existingUser = this.user[userIndex]
        console.log('Found user:', existingUser)

        //local user edit logic
        const isLocalUser = id > 10
        if (isLocalUser) {
          this.user[userIndex] = { ...existingUser, ...newUserData, id }
          ElMessage.success('User Updated')
          console.log('Local user updated:', this.user[userIndex])
        } else {
          //For existing user edit logic
          const updatedUser = await editUser(id, newUserData)
          this.user[userIndex] = {
            ...existingUser,
            ...updatedUser,
            createdAt: existingUser.createdAt,
          }
          ElMessage.success('User Updated')
          console.log('API user updated:', updatedUser)
        }
      } catch (error) {
        console.error(' Error in updateUser:', error)
        throw error
      }
    },

    async deleteUser(id: number) {
      try {
        await removeUser(id)
        this.user = this.user.filter((u) => u.id !== id)
        ElMessage.success('Deletion successful')
        console.log(`User with ID ${id} deleted.`)
      } catch (error) {
        console.error('Failed to delete user:', error)
      }
    },
  },
})
