import type { TaskList } from './taskList'

export interface Board {
  boardId: number
  workspaceId: number
  taskList: TaskList[]
  boardName?: string
  members?: { userId: number; role: 'owner' | 'editor' | 'viewer' }[]
}
