export interface Product {
  id: number
  name?: string
  description?: string
  price?: number
  oldPrice?: number
  discount?: number
  stock?: number
  image?: string
  category?: string
  rating?: number
  reviewsCount?: number
  badge?: string // For listing-badge (e.g., "NEW", "SALE")
  brand?: string // For listing-brand-link
}
