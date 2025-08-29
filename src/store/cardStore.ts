import { defineStore } from 'pinia'
import { useUserStore } from './authStore'
import { useWorkspacesStore } from './workStore'
import { useBoardsStore } from './boardStore'

export const useTaskCardsStore = defineStore('taskCards', {
  state: () => ({
    // Task cards are stored within taskList in boards, so no separate state
  }),

  actions: {
    updateTaskCard(
      boardId: number,
      listId: number,
      cardId: number,
      updates: { title?: string; description?: string; status?: 'complete' | 'incomplete' },
    ) {
      const userStore = useUserStore()
      const workspacesStore = useWorkspacesStore()
      const boardsStore = useBoardsStore()

      if (!userStore.currentUser) {
        throw new Error('User must be logged in to update a task card')
      }

      const board = boardsStore.getBoard(boardId)
      if (!board) {
        throw new Error('Board not found')
      }

      const userRole = workspacesStore.getUserRole(board.workspaceId, userStore.currentUser.userId)
      if (!userRole || userRole === 'viewer') {
        throw new Error('Only owners or editors can update task cards')
      }

      const taskList = board.taskList.find((t) => t.listId === listId)
      if (!taskList) {
        throw new Error('Task list not found')
      }

      const taskCard = taskList.taskCard!.find((c) => c.cardId === cardId)
      if (!taskCard) {
        throw new Error('Task card not found')
      }

      if (updates.title !== undefined) {
        taskCard.title = updates.title
      }
      if (updates.description !== undefined) {
        taskCard.description = updates.description
      }
      if (updates.status !== undefined) {
        taskCard.status = updates.status
      }

      boardsStore.saveToStorage()
    },

    deleteTaskCard(boardId: number, listId: number, cardId: number) {
      const userStore = useUserStore()
      const workspacesStore = useWorkspacesStore()
      const boardsStore = useBoardsStore()

      if (!userStore.currentUser) {
        throw new Error('User must be logged in to delete a task card')
      }

      const board = boardsStore.getBoard(boardId)
      if (!board) {
        throw new Error('Board not found')
      }

      const userRole = workspacesStore.getUserRole(board.workspaceId, userStore.currentUser.userId)
      if (!userRole || userRole === 'viewer') {
        throw new Error('Only owners or editors can delete task cards')
      }

      const taskList = board.taskList.find((t) => t.listId === listId)
      if (!taskList) {
        throw new Error('Task list not found')
      }

      const taskCardIndex = taskList.taskCard!.findIndex((c) => c.cardId === cardId)
      if (taskCardIndex === -1) {
        throw new Error('Task card not found')
      }

      taskList.taskCard!.splice(taskCardIndex, 1)
      boardsStore.saveToStorage()
    },
  },
})
