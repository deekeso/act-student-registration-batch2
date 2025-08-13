import type { CartItem } from './CartItem'
import type { Order } from './order'

export interface User {
  userId?: number
  email?: string
  username?: string
  password?: string
  contactNumber?: string
  age?: number
  birthDate?: string
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
    landmark: string
  }
  userCart?: CartItem[]
  userOrders?: Order[]
}
