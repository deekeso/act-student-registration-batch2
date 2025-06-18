import { reactive, computed } from 'vue'
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

  // Validate credentials (non-empty fields are valid)
  const validateCredentials = () => {
    if (!isFormValid.value) {
      return { success: false, message: 'Please enter both username and password' }
    }

    // Placeholder: Any non-empty credentials are valid for testing
    // Replace with API call in production
    return { success: true, message: 'Login successful', username: state.username }
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

  return {
    state,
    isFormValid,
    validateCredentials,
    loadStoredCredentials,
    saveCredentials,
  }
}
