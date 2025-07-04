<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <router-link to="/">
        <span class="brand-name">StudentPlus</span>
      </router-link>

      <!-- Menu Toggle (Mobile) -->
      <button class="menu-toggle" @click="toggleMenu" :aria-expanded="isMenuOpen">
        <svg class="menu-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>

      <!-- Navigation Links -->
      <ul :class="['navbar-links', isMenuOpen ? 'open' : '']">
        <span class="add-user" @click="drawer = true">Register Student</span>
        <span class="add-user" @click="onHandleLogout()">Logout</span>
      </ul>
    </div>
  </nav>

  <the-drawer v-model:visible="drawer">
    <student-form
      :firstname="''"
      :lastname="''"
      :middlename="''"
      :age="0"
      :birthdate="''"
      :address="''"
      :course="''"
      :BtnLabel="'Add User'"
      :BtnDelete="false"
      :OnAdd="true"
    ></student-form>
  </the-drawer>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import { TheDrawer } from '@/components/ui'
import { StudentForm } from '@/components'
import { useAuth } from '@/composables/useAuth'
import { ElMessage, ElMessageBox } from 'element-plus'

const drawer = ref(false)

const { onLogout } = useAuth()

const isMenuOpen = ref(false)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const onHandleLogout = () => {
  ElMessageBox.confirm('Do you really want to logout?', 'Warning', {
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(() => {
      onLogout()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Logout canceled',
      })
    })
}
</script>

<style scoped>
a {
  text-decoration: none;
}

.navbar {
  background-color: var(--brand-blue);
  border-bottom: 1px solid #e5e7eb;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 80;
}

.navbar-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 0.5rem;
}

.navbar-logo img {
  height: 2rem;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
}

.brand-name:hover,
.brand-name:active {
  color: #fff;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
}

.menu-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: white;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: inline-flex;
    align-items: center;
  }
}

.navbar-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
}

.nav-link {
  text-decoration: none;
  color: #1f2937;
  font-weight: 500;
  padding: 0.5rem;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #2563eb;
}

.nav-link.active {
  color: #2563eb;
}

.add-user {
  cursor: pointer;
  padding: 2px;
  color: #fff;
}

@media (max-width: 768px) {
  .navbar-links {
    position: absolute;
    top: 60px;
    right: 1rem;
    flex-direction: column;
    background: white;
    border: 1px solid #e5e7eb;
    padding: 1rem;
    border-radius: 0.5rem;
    display: none;
  }

  .navbar-links.open {
    display: flex;
    right: 0;
    left: 0;
    width: 100%;
  }

  .add-user {
    color: black;
  }
}
</style>
