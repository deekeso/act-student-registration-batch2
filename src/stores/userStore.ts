import { createUser, deleteUser, getUserById, getUsers, updateUser } from '@/services/userServices'
import type { NewUser, User } from '@/types/user'
import {
  validateCity,
  validateEmailField,
  validateName,
  validateStreet,
  validateUsernameField,
} from '@/utils/formValidation'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    selectedUser: null as User | null,
    tempIdCounter: 10000,
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

    // async addUser(
    //   user: NewUser,
    //   name: string,
    //   username: string,
    //   email: string,
    //   address: { street: string; city: string },
    // ) {
    //   const errors: { field: string; message: string }[] = []

    //   // Validate all fields and collect errors
    //   const nameCheck = validateName(name)
    //   if (!nameCheck.valid) errors.push({ field: 'name', message: nameCheck.message })

    //   const usernameCheck = validateUsernameField(username)
    //   if (!usernameCheck.valid) errors.push({ field: 'username', message: usernameCheck.message })

    //   const emailCheck = validateEmailField(email)
    //   if (!emailCheck.valid) errors.push({ field: 'email', message: emailCheck.message })

    //   const streetCheck = validateStreet(address.street)
    //   if (!streetCheck.valid) errors.push({ field: 'street', message: streetCheck.message })

    //   const cityCheck = validateCity(address.city)
    //   if (!cityCheck.valid) errors.push({ field: 'city', message: cityCheck.message })

    //   // If there are any errors, return them
    //   if (errors.length > 0) {
    //     return { success: false, errors }
    //   }

    //   // If no errors, create the user
    //   const newUser = await createUser(user)
    //   this.users.push(newUser)
    //   return { success: true, errors: [] }
    // },

    // async editUser(id: number, user: Partial<User>) {
    //   const errors: { field: string; message: string }[] = []

    //   // Validate provided fields
    //   if (user.name !== undefined) {
    //     const nameCheck = validateName(user.name)
    //     if (!nameCheck.valid) errors.push({ field: 'name', message: nameCheck.message })
    //   }

    //   if (user.username !== undefined) {
    //     const usernameCheck = validateUsernameField(user.username)
    //     if (!usernameCheck.valid) errors.push({ field: 'username', message: usernameCheck.message })
    //   }

    //   if (user.email !== undefined) {
    //     const emailCheck = validateEmailField(user.email)
    //     if (!emailCheck.valid) errors.push({ field: 'email', message: emailCheck.message })
    //   }

    //   if (user.address?.street !== undefined) {
    //     const streetCheck = validateStreet(user.address.street)
    //     if (!streetCheck.valid) errors.push({ field: 'street', message: streetCheck.message })
    //   }

    //   if (user.address?.city !== undefined) {
    //     const cityCheck = validateCity(user.address.city)
    //     if (!cityCheck.valid) errors.push({ field: 'city', message: cityCheck.message })
    //   }

    //   // If there are any errors, return them
    //   if (errors.length > 0) {
    //     return { success: false, errors }
    //   }

    //   try {
    //     const updatedUser = await updateUser(id, user)
    //     const index = this.users.findIndex((u) => u.id === id)
    //     if (index !== -1) {
    //       this.users[index] = updatedUser ?? { ...this.users[index], ...user }
    //     }
    //     return { success: true, errors: [] }
    //   } catch (error) {
    //     console.error('Update failed:', error)
    //     // Fallback: update locally if the service call fails
    //     const index = this.users.findIndex((u) => u.id === id)
    //     if (index !== -1) {
    //       this.users[index] = { ...this.users[index], ...user }
    //       return { success: true, errors: [] }
    //     }
    //     return {
    //       success: false,
    //       errors: [{ field: '', message: 'Failed to update user due to an unexpected error' }],
    //     }
    //   }
    // },

    // Helper method to generate unique temporary IDs
    generateTempId(): number {
      this.tempIdCounter++
      console.log('Generated temporary ID:', this.tempIdCounter)
      return this.tempIdCounter
    },

    async addUser(
      user: NewUser,
      name: string,
      username: string,
      email: string,
      address: { street: string; city: string },
    ) {
      const errors: { field: string; message: string }[] = []

      // Validate all fields and collect errors
      const nameCheck = validateName(name)
      if (!nameCheck.valid) errors.push({ field: 'name', message: nameCheck.message })

      const usernameCheck = validateUsernameField(username)
      if (!usernameCheck.valid) errors.push({ field: 'username', message: usernameCheck.message })

      const emailCheck = validateEmailField(email)
      if (!emailCheck.valid) errors.push({ field: 'email', message: emailCheck.message })

      const streetCheck = validateStreet(address.street)
      if (!streetCheck.valid) errors.push({ field: 'street', message: streetCheck.message })

      const cityCheck = validateCity(address.city)
      if (!cityCheck.valid) errors.push({ field: 'city', message: cityCheck.message })

      // If there are any errors, return them
      if (errors.length > 0) {
        return { success: false, errors }
      }

      try {
        // If no errors, create the user
        const newUser = await createUser(user)
        console.log('API returned user with ID:', newUser.id)

        // Check if the API returned a duplicate ID
        const existingUserIndex = this.users.findIndex((u) => u.id === newUser.id)
        if (existingUserIndex !== -1) {
          console.log('Duplicate ID detected from API, generating temporary ID')
          // Generate a unique temporary ID
          const tempId = this.generateTempId()
          const userWithTempId = { ...newUser, id: tempId }
          console.log('User assigned temporary ID:', tempId)
          this.users.push(userWithTempId)
        } else {
          console.log('API ID is unique, using original ID:', newUser.id)
          this.users.push(newUser)
        }

        return { success: true, errors: [] }
      } catch (error) {
        console.error('Failed to create user:', error)
        return {
          success: false,
          errors: [{ field: '', message: 'Failed to create user due to an unexpected error' }],
        }
      }
    },

    async editUser(id: number, user: Partial<User>) {
      console.log('Attempting to edit user with ID:', id)

      const errors: { field: string; message: string }[] = []

      // Validate provided fields
      if (user.name !== undefined) {
        const nameCheck = validateName(user.name)
        if (!nameCheck.valid) errors.push({ field: 'name', message: nameCheck.message })
      }

      if (user.username !== undefined) {
        const usernameCheck = validateUsernameField(user.username)
        if (!usernameCheck.valid) errors.push({ field: 'username', message: usernameCheck.message })
      }

      if (user.email !== undefined) {
        const emailCheck = validateEmailField(user.email)
        if (!emailCheck.valid) errors.push({ field: 'email', message: emailCheck.message })
      }

      if (user.address?.street !== undefined) {
        const streetCheck = validateStreet(user.address.street)
        if (!streetCheck.valid) errors.push({ field: 'street', message: streetCheck.message })
      }

      if (user.address?.city !== undefined) {
        const cityCheck = validateCity(user.address.city)
        if (!cityCheck.valid) errors.push({ field: 'city', message: cityCheck.message })
      }

      // If there are any errors, return them
      if (errors.length > 0) {
        return { success: false, errors }
      }

      // Find the user in local store
      const index = this.users.findIndex((u) => u.id === id)
      console.log('User found at index:', index)

      if (index === -1) {
        console.log('User not found in store')
        return {
          success: false,
          errors: [{ field: '', message: 'User not found' }],
        }
      }

      // Check if this is a temporary ID
      const isTemporaryId = id >= this.tempIdCounter - 1000
      console.log('Is temporary ID:', isTemporaryId)

      if (isTemporaryId) {
        // For users with temporary IDs, just update locally
        console.log('Updating user with temporary ID locally only')
        this.users[index] = { ...this.users[index], ...user }
        console.log('Updated user:', this.users[index])
        return { success: true, errors: [] }
      }

      try {
        // For users with real IDs, try to update via API
        console.log('Attempting API update for user with real ID')
        const updatedUser = await updateUser(id, user)
        this.users[index] = updatedUser ?? { ...this.users[index], ...user }
        console.log('API update successful, updated user:', this.users[index])
        return { success: true, errors: [] }
      } catch (error) {
        console.error('API update failed:', error)
        // Fallback: update locally if the service call fails
        this.users[index] = { ...this.users[index], ...user }
        console.log('Fallback local update applied:', this.users[index])
        return { success: true, errors: [] }
      }
    },

    async removeUser(id: number) {
      await deleteUser(id)
      // Remove from users array
      this.users = this.users.filter((user) => user.id !== id)

      // Clear selectedUser if it's the deleted user
      if (this.selectedUser && this.selectedUser.id === id) {
        this.selectedUser = null
      }
    },
  },
})
