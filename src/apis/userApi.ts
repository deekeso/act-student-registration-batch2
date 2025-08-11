import type { User } from '@/types/User'
import axios from 'axios'
import dayjs from 'dayjs'

const API_URL = 'https://jsonplaceholder.typicode.com'

export const fetchUserApi = async () => {
  const response = await axios.get(`${API_URL}/users`)
  return response.data
}

export const addUserApi = async (newUser: Partial<User>) => {
  const response = await axios.post(`${API_URL}/users`, newUser)
  return response.data
}

export const editUserApi = async (editUserId: number, updatedUser: Partial<User>) => {
  const response = await axios.put(`${API_URL}/users/${editUserId}`, updatedUser)
  return response.data
}

export const removeUserApi = async (deleteUserId: number) => {
  const response = await axios.delete(`${API_URL}/users/${deleteUserId}`)
  return response.data
}

export const getUserById = async (id: number): Promise<User> => {
  const response = await axios.get(`${API_URL}/users/${id}`)
  const user = await response.data
  return {
    ...user,
    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  }
}
