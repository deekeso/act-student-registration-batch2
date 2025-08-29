export interface TaskCard {
  cardId: number
  listId: number
  title: string
  status?: 'complete' | 'incomplete'
  description?: string
}
