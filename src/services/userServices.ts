import type { NewUser, User } from '@/types/user'
import api from './api'

// get all users
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>('/users')
  return response.data
}

// get user by ID
export const getUserById = async (id: number): Promise<User> => {
  const response = await api.get<User>(`/users/${id}`)
  return response.data
}

// create user
export const createUser = async (user: NewUser): Promise<User> => {
  const response = await api.post<User>(`/users`, user)
  return response.data
}

// update user
export const updateUser = async (id: number, user: Partial<User>): Promise<User> => {
  const response = await api.put<User>(`/users/${id}`, user)
  return response.data
}

// delete user
export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`)
}
