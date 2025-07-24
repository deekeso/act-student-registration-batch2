import type { CartItem } from './CartItem'

export interface Order {
  orderId: number
  items: CartItem[]
  status: 'Pending' | 'Completed'
  timeline: { status: string; date: string }[]
}
