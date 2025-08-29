import type { TaskCard } from './taskCard'

export interface TaskList {
  listId: number
  boardId: number
  listName?: string
  taskCard?: TaskCard[]
  listOrder?: number
}
