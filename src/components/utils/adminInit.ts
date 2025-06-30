import type { Admin } from '@/types/adminInterface'

export function initializeAdminCredentials() {
  const existingAdmin = localStorage.getItem('admin')

  if (!existingAdmin) {
    const defaultAdminData = [
      {
        username: 'admin',
        password: 'admin123',
      },
      {
        username: 'admin2',
        password: 'admin123',
      },
      {
        username: 'admin3',
        password: 'admin123',
      },
      {
        username: 'admin4',
        password: 'admin123',
      },
    ]
    localStorage.setItem('admin', JSON.stringify(defaultAdminData))
    console.log('Default admin credentials initialized')
  }
}

export function getStoredAdminCredentials() {
  const adminData = localStorage.getItem('admin')
  return adminData ? JSON.parse(adminData) : null
}

export function resetAdminPassword(username: string, newPassword: string): boolean {
  const adminData = localStorage.getItem('admin')
  if (!adminData) {
    return false
  }

  const admins = JSON.parse(adminData)
  const adminIndex = admins.findIndex((admin: Admin) => admin.username === username)
  if (adminIndex === -1) {
    return false
  }

  admins[adminIndex].password = newPassword
  localStorage.setItem('admin', JSON.stringify(admins))
  return true
}
