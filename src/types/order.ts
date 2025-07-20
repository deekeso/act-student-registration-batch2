import type { CartItem } from './CartItem'

export interface Order {
  orderId: number
  items: CartItem[]
  status: 'pending' | 'completed'
  timeline: { status: string; date: string }[]
}
