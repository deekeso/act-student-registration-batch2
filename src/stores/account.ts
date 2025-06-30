import { useRouter } from 'vue-router'
import { defineStore } from 'pinia'
import { users } from '@/constants'
import type { Credentials } from '@/types'
import { ElMessage } from 'element-plus'
import { SHA256 } from 'crypto-js'

export const useAccount = defineStore('accounts', {
  // Defines the default state for the store.
  state: () => ({
    router: useRouter(),
    admin: {
      username:  'admin@gmail.com',
      password: SHA256('admin123!').toString(),
    },
  }),

  actions: {
    
    /**
     *  Create demo user and student list on localstorage
     * @returns {any}
     */
    onCreateUsers() {
      try {
        localStorage.setItem('isAuthenticated', 'false')
        localStorage.setItem('students', JSON.stringify(users))
        localStorage.setItem('accounts', JSON.stringify(this.admin))
      } catch (error) {
        console.error(error)
      }
    },

    
    /**
     * Check user credentials if valid
     * @param {any} credentials:Credentials
     * @returns {any}
     */
    onLogin(credentials: Credentials) { 
      const account = JSON.parse(localStorage.getItem('accounts') || 'null')
      const hashedPassword = SHA256(credentials.password).toString()

      try {
        // check if theres any accounts found
        if(!account){
          ElMessage.error('No accounts found')
        }
        // check username and password 
        if (account?.username === credentials.username && account?.password === hashedPassword) {
          localStorage.setItem('isAuthenticated', 'true')
          ElMessage.success('Successfully login')
          this.router.push('/dashboard')
        } else {
          ElMessage.error('Invalid Username or Password')
          this.router.push('/')
        }
      } catch (error) {
        console.error(error)
      }
    },

    
    /**
     * Update the user's password
     * @param {any} username:string 
     * @param {any} newpassword:string
     * @returns {any}
     */
    onForgotPassword(username: string, newpassword: string) {
      const account = JSON.parse(localStorage.getItem('accounts') || 'null')
      if (account?.username === username) {
        const updatedAccount = {
          ...account,
          password: SHA256(newpassword).toString(),
        }

        localStorage.setItem('accounts', JSON.stringify(updatedAccount))
        localStorage.setItem('isAuthenticated', 'false')

        ElMessage.success('Successfully changed password')
        this.router.push('/')
      } else {
        ElMessage.error('Username not found')
      }
    }
  }
})






