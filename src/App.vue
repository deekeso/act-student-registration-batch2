<template>
  <!-- General layout container, adds login-page for specific styling -->
  <div class="app-container" :class="{ 'login-page': isLoginPage || isForgotPasswordPage }">

    <!-- Decorative shapes based on Figma design -->
    <img :src="upperRightShape" alt="Decorative shape" class="shape upper-right" />
    <img :src="lowerLeftShape" alt="Decorative shape" class="shape lower-left" />

    <!-- Header that appears when not in login or forgot password page -->
    <el-header v-if="!isLoginPage && !isForgotPasswordPage" class="app-header">
      <!-- Mobile menu button, not visible on desktop -->
      <div class="mobile-menu-container" v-if="isAuthenticated">
        <el-button color="transparent" size="large" class="hamburger-btn" @click="drawerOpen = true" :icon="Menu" />
      </div>

      <!-- Logo (always visible)-->
      <div class="logo-container">
        <img :src="logo" alt="Logo" class="logo-image" />
      </div>

      <!-- Desktop menu -->
      <el-menu
        v-if="isAuthenticated"
        mode="horizontal"
        :ellipsis="false"
        class="navbar desktop-menu"
        router="true"
        default-active="activeRoute"
        text-color="white"
        active-text-color="white"
        :background-color="'transparent'"
      >
        <!-- Push menu items to the right -->
        <div class="flex-spacer"></div>

        <!-- Menu items -->
        <el-menu-item index="/">Home</el-menu-item>
        <el-menu-item index="/students">Students</el-menu-item>
        <el-menu-item @click="showLogoutConfirmation = true">
          <el-icon><SwitchButton /></el-icon>
          <span>Logout</span>
        </el-menu-item>
      </el-menu>
    </el-header>
    
    <!-- Mobile drawer menu -->
    <el-drawer
      v-model="drawerOpen"
      title="Menu"
      direction="ltr"
      size="250px"
      :with-header="true"
    >
      <el-menu
        default-active="activeRoute"
        class="drawer-menu"
        @select="handleSelect"
      >
        <el-menu-item index="/">
          <el-icon><House /></el-icon>
          <span>Home</span>
        </el-menu-item>
        <el-menu-item index="/students">
          <el-icon><User /></el-icon>
          <span>Students</span>
        </el-menu-item>
        <el-menu-item index="logout">
          <el-icon><SwitchButton /></el-icon>
          <span>Logout</span>
        </el-menu-item>
      </el-menu>
    </el-drawer>

    <!-- Main content, adds fullHeight for centering login content -->
    <el-main :class="{ 'full-height': isLoginPage || isForgotPasswordPage }">
      <router-view />
    </el-main>

    <!-- Footer that appears when not in login or forgot password page -->
    <el-footer v-if="!isLoginPage && !isForgotPasswordPage" class="app-footer">
      <p>&copy; {{ currentYear }} Regiplus Student Registration System</p>
    </el-footer>

    <!-- Logout Confirmation Modal -->
    <confirmation-modal
      :show="showLogoutConfirmation"
      title="Confirm Logout"
      message="Are you sure you want to logout?"
      confirm-button-text="Logout"
      @confirm="logout"
      @cancel="showLogoutConfirmation = false"
    />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import ConfirmationModal from './components/ConfirmationModal.vue'
import { SwitchButton, Menu, House, User } from '@element-plus/icons-vue'

import upperRightShape from './assets/upper-right-shape.svg'
import lowerLeftShape from './assets/lower-left-shape.svg'
import logo from './assets/logo.svg'

const router = useRouter() // Initializes the router
const route = useRoute() // Gets current route object
const authStore = useAuthStore() // Initalizes authentication store
const drawerOpen = ref(false) // Controls the mobile drawer state

const isAuthenticated = computed(() => authStore.isAuthenticated) // Checks if user is authenticated
const isLoginPage = computed(() => route.path === '/login') // Checks if current route is login
const isForgotPasswordPage = computed(() => route.path === '/forgot-password') // Checks if current route is forgot password
const activeRoute = computed(() => route.path) // Gets current route path

// Function to handle logout, sends user back to login page
const logout = () => {
  showLogoutConfirmation.value = false
  authStore.logout()
  router.push('/login')
}

// State for logout confirmation modal
const showLogoutConfirmation = ref(false)

// Function to handle menu selection in the drawer
const handleSelect = (index: string) => {
  drawerOpen.value = false
  if (index === 'logout') {
    showLogoutConfirmation.value = true
  } else {
    router.push(index)
  }
}

// Function to get current year for the
const currentYear = computed(() => {
  return new Date().getFullYear()
})
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: auto !important;
  min-height: 60px;
}

.navbar{
  background-color: transparent;
  display: flex;
  justify-content: space-between;
  margin: none;
  width: 100%;
  border-bottom: none !important;
}

.mobile-menu-container {
  display: none;
}

.hamburger-btn {
  color: white;
  padding: 8px;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-image {
  height: 70px;
}

.login-button-container {
  margin-left: auto;
}

.login-button {
  color: white;
  font-size: 16px;
}

.drawer-menu {
  border-right: none;
}

.shape {
  position: fixed;
  z-index: -1;
  pointer-events: none;
}

.upper-right {
  top: 0;
  right: 0;
  max-width: 40%;
}

.lower-left {
  bottom: 0;
  left: 0;
  max-width: 40%;
}

.flex-spacer {
  flex-grow: 1;
}

.app-footer {
  text-align: center;
  color: white;
  padding: 20px;
}

.full-height {
  flex: 1;
  display: flex;
}

.login-page {
  background-color: transparent;
}

.el-main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.el-main.full-height {
  max-width: 100%;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.app-footer {
  color: white;
  text-align: center;
  height: auto !important;
}

@media (max-width: 768px) {
  .mobile-menu-container {
    display: block;
    margin-right: 15px;
    /* Fixed width to ensure the logo can be properly centered */
    width: 40px;
  }
  
  .desktop-menu {
    display: none;
  }
  
  .logo-container {
    position: absolute;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    pointer-events: none; /* Allow clicks to pass through to elements behind */
  }
  
  .logo-image {
    pointer-events: auto; /* Re-enable clicks on the logo itself */
  }
  
  .app-header {
    padding: 0 10px;
    position: relative; /* Needed for absolute positioning of logo */
  }
  
  .login-button-container {
    width: 40px; /* Balance the layout with the hamburger button */
  }
  
  :deep(.el-menu--horizontal > .el-menu-item) {
    padding: 0 10px;
  }
}

:deep(.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border-bottom-color: #67B8F9 !important;
}

:deep(.el-menu--horizontal > .el-menu-item.is-active) {
  border-bottom-color: #67B8F9 !important;
  font-weight: bold;
}
</style>
