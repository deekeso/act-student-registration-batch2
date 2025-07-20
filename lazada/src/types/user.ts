import type { CartItem } from './CartItem'

export interface User {
  userId: number
  email?: string
  username?: string
  password?: string
  age?: number
  name?: {
    lastName: string
    firstName: string
    middleName: string
  }
  address?: {
    street: string
    barangay: string
    city: string
    province: string
    zipCode: number
    landmark?: string
  }
  userCart?: CartItem[]
}
