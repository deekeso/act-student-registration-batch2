//Features to implement: Fetch and display the user’s: Name Email Address (street + city) Show a loading indicator before the data appears.

export interface User {
  id?: number
  name?: string
  username?: string
  email?: string
  address?: {
    street?: string
    city?: string
  }
  createdAt?: string
}
