import { defineStore } from 'pinia'
import CryptoJS from 'crypto-js'
import {
  validateEmailField,
  validateUsernameField,
  validatePasswordField,
} from '@/composables/userValidation'
import type { User } from '@/types/user'
import { useCartStore } from './cart'
import { useOrdersStore } from './orders'

interface LoginState {
  email: string
  username: string
  password: string
  userInfo: User | null
}

export const useAuthStore = defineStore('auth', {
  state: () =>
    ({
      email: '',
      username: '',
      password: '',
      userInfo: {} as User | null,
      isLoggedIn: !!localStorage.getItem('isLoggedIn'),
    }) as LoginState & { isLoggedIn: boolean },

  actions: {
    userLogin(username: string, password: string) {
      // Validate fields
      const usernameCheck = validateUsernameField(username)
      if (!usernameCheck.valid) return { success: false, message: usernameCheck.message }

      const passwordCheck = validatePasswordField(password)
      if (!passwordCheck.valid) return { success: false, message: passwordCheck.message }

      // Check credentials
      const users = JSON.parse(localStorage.getItem('Users') || '[]')
      const user = users.find((u: User) => u.username === username)
      const inputPasswordHash = CryptoJS.SHA256(password).toString()

      if (user && user.password === inputPasswordHash) {
        localStorage.setItem('currentUser', username)
        localStorage.setItem('isLoggedIn', 'true')

        // update store
        this.username = username
        this.password = password
        this.email = user.email
        this.isLoggedIn = true

        // load cart for the user
        const cartStore = useCartStore()
        cartStore.loadFromCartUser()

        // load orders for the user
        const ordersStore = useOrdersStore()
        ordersStore.loadFromUserOrders()

        return { success: true, message: 'Login successful', username }
      } else {
        return { success: false, message: 'Invalid username or password' }
      }
    },

    userRegistration(email: string, username: string, password: string, userData: User) {
      const emailCheck = validateEmailField(email)
      if (!emailCheck.valid) return { success: false, message: emailCheck.message }

      const usernameCheck = validateUsernameField(username)
      if (!usernameCheck.valid) return { success: false, message: usernameCheck.message }

      const passwordCheck = validatePasswordField(password)
      if (!passwordCheck.valid) return { success: false, message: passwordCheck.message }

      const users = JSON.parse(localStorage.getItem('Users') || '[]')

      // check for duplicates
      if (users.some((u: User) => u.email === userData.email || u.username === userData.username)) {
        return { success: false, message: 'Email or username already registered.' }
      }

      // new user id
      const lastUserId = Number(localStorage.getItem('lastUserId') || '0')
      const newUserId = lastUserId + 1

      // new user object
      const newUser: User = {
        ...userData,
        userId: newUserId,
        password: CryptoJS.SHA256(userData.password!).toString(),
        userCart: [],
        userOrders: [],
      }

      // add new user
      users.push(newUser)

      // save credentials
      localStorage.setItem('Users', JSON.stringify(users))
      localStorage.setItem('lastUserId', String(newUserId))
      localStorage.setItem('currentUser', username)
      localStorage.setItem('isLoggedIn', 'true')

      // update store
      this.email = email
      this.username = username
      this.password = password
      this.userInfo = newUser

      return { success: true, message: 'Registration successful.' }
    },

    userLogout() {
      // Remove session info from localStorage
      localStorage.removeItem('currentUser')
      localStorage.removeItem('isLoggedIn')

      const ordersStore = useOrdersStore()
      ordersStore.clearOrderOnLogout()

      const cartStore = useCartStore()
      cartStore.clearCartOnLogout()

      // Reset store state
      this.email = ''
      this.username = ''
      this.password = ''
      this.isLoggedIn = false
      return { success: true, message: 'Logged out' }
    },

    loadUserInfo() {
      const currentUser = localStorage.getItem('currentUser')
      const users = JSON.parse(localStorage.getItem('Users') || '[]')
      const user = users.find((u: User) => u.username === currentUser) || null
      this.userInfo = user
      if (user) {
        this.username = user.username
        this.email = user.email
        this.password = ''
      } else {
        this.username = ''
        this.email = ''
        this.password = ''
      }
    },

    userUpdateInfo(data: Partial<User>) {
      const currentUser = localStorage.getItem('currentUser')
      const users = JSON.parse(localStorage.getItem('Users') || '[]')
      const userIndex = users.findIndex((u: User) => u.username === currentUser)
      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          ...data,
          address: {
            ...users[userIndex].address,
          ...data.address,
        },
      name: {
            ...users[userIndex].name,
            ...data.name,
          },
      }
        localStorage.setItem('Users', JSON.stringify(users))
        this.userInfo = users[userIndex]
        return { success: true, message: 'User information updated successfully.' }
      }
      return { success: false, message: 'User not found.' }

    },
    //   if (!this.username) {
    //     return { success: false, message: 'No user is currently logged in.' }
    //   }
    //   this.password = newPassword
    //   this.saveCredentials()
    //   return { success: true, message: 'Password updated successfully.' }
    // },
  },

  getters: {
    isLoginValid: (state) => {
      return (
        validateUsernameField(state.username).valid && validatePasswordField(state.password).valid
      )
    },
    isUserValid: (state) => {
      return (
        validateEmailField(state.email).valid &&
        validateUsernameField(state.username).valid &&
        validatePasswordField(state.password).valid
      )
    },
  },
})
