import { reactive, computed } from 'vue'
import mockData from '@/assets/mock-data.json'

const { adminUsers } = mockData

interface LoginState {
  username: string
  password: string
}

export function useLoginValidation() {
  // Reactive state for login form
  const state = reactive<LoginState>({
    username: '',
    password: '',
  })

  // Check if form is valid
  const isFormValid = computed(() => {
    return state.username.trim() && state.password.trim()
  })

  // Validate credentials against adminUsers
  const validateCredentials = () => {
    if (!isFormValid.value) {
      return { success: false, message: 'Please enter both username and password' }
    }

    const admin = adminUsers.find(
      (user) => user.username === state.username && user.password === state.password,
    )

    if (admin) {
      return { success: true, message: 'Login successful', username: state.username }
    } else {
      return { success: false, message: 'Invalid username or password' }
    }
  }

  // Load credentials from localStorage
  const loadStoredCredentials = () => {
    const savedUsername = localStorage.getItem('Username')
    const savedPassword = localStorage.getItem('Password')
    if (savedUsername) {
      state.username = savedUsername
    }
    if (savedPassword) {
      state.password = savedPassword
    }
  }

  // Save credentials to localStorage
  const saveCredentials = () => {
    localStorage.setItem('Username', state.username)
    localStorage.setItem('Password', state.password)
  }

  // Check if credentials are stored in localStorage
  const hasStoredCredentials = computed(() => {
    return localStorage.getItem('Username') || localStorage.getItem('Password')
  })

  return {
    state,
    isFormValid,
    validateCredentials,
    loadStoredCredentials,
    saveCredentials,
    hasStoredCredentials,
  }
}
