import { defineStore } from 'pinia'
import { useUserStore } from './authStore'
import { useWorkspacesStore } from './workStore'
import { useBoardsStore } from './boardStore'
import type { TaskCard } from '@/types/taskCard'
import type { TaskList } from '@/types/taskList'

export const useTaskListsStore = defineStore('taskLists', {
  state: () => ({
    // Task lists are stored within boards, so no separate localStorage
    lists: [] as TaskList[],
  }),

  actions: {
    addTaskCard(boardId: number, listId: number, title: string) {
      const userStore = useUserStore()
      const workspacesStore = useWorkspacesStore()
      const boardsStore = useBoardsStore()

      if (!userStore.currentUser) {
        throw new Error('User must be logged in to add a task card')
      }

      const board = boardsStore.getBoard(boardId)
      if (!board) {
        throw new Error('Board not found')
      }

      const userRole = workspacesStore.getUserRole(board.workspaceId, userStore.currentUser.userId)
      if (!userRole || userRole === 'viewer') {
        throw new Error('Only owners or editors can add task cards')
      }

      const taskList = board.taskList.find((t) => t.listId === listId)
      if (!taskList) {
        throw new Error('Task list not found')
      }

      const cardId = taskList.taskCard!.length
        ? Math.max(...taskList.taskCard!.map((c) => c.cardId)) + 1
        : 1
      const newTaskCard: TaskCard = {
        cardId,
        title: title || 'Untitled Card',
        listId,
        status: 'incomplete',
      }
      taskList.taskCard!.push(newTaskCard)
      boardsStore.saveToStorage()
      return cardId
    },
  },
})
