export interface User {
  id: number
  name: string
  username: string
  email: string
  address: {
    street: string
    city: string
  }
  createdAt: string
}

export type NewUser = Omit<User, 'id'>
