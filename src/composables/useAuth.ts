import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
export const useAuth = () => {
  const router = useRouter()
  const route = useRoute()
  
  /**
   * check the value of isAuthenticated
   * @returns {any}
   */
  function isAuthenticated(): boolean {
    return JSON.parse(localStorage.getItem('isAuthenticated') || 'false')
  }

  // check if the user is guest
  function isGuest() {
    const isAuth = isAuthenticated();
    const currentPath = route.path;

    // Block authenticated users from accessing guest-only pages
    if (isAuth && currentPath === '/forgot-password') {
      router.push('/dashboard');
    }
  }
  
  /**
   *  Check if the user is authenticated or not
   * @returns {any}
   */
  function checkAuth() {
    //const currentPath = route.path;
    if (isAuthenticated()) {
      router.push('/dashboard')
    } 
    else {
      router.push('/')
    }
  }

  
  /**
   * logout the user and reset the session
   * @returns {any}
   */
  function onLogout() {
    localStorage.setItem('isAuthenticated', JSON.stringify(false))
    ElMessage.success('Successfully logout')
    router.push('/')
  }

  return { isGuest, checkAuth, onLogout, isAuthenticated }
}
