import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
export const useAuth = () => {
  const router = useRouter()

  /**
   * check the value of isAuthenticated
   * @returns {any}
   */
  function isAuthenticated(): boolean {
    return JSON.parse(localStorage.getItem('isAuthenticated') || 'false')
  }

  
  /**
   *  Check if the user is authenticated or not
   * @returns {any}
   */
  function checkAuth() {
    if (isAuthenticated()) {
      router.push('/dashboard')
    } else {
      router.push('/')
    }
  }

  
  /**
   * logout the user and reset the session
   * @returns {any}
   */
  function onLogout() {
    localStorage.setItem('isAuthenticated', JSON.stringify(false))
    ElMessage.success('You successfully logout')
    router.push('/')
  }

  return { checkAuth, onLogout, isAuthenticated }
}
