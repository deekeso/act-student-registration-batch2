import { defineStore } from 'pinia'
import type { Board } from '@/types/board'
import type { TaskList } from '@/types/taskList'
import { useUserStore } from './authStore'
import { useWorkspacesStore } from './workStore'
import type { TaskCard } from '@/types/taskCard'

export const useBoardsStore = defineStore('boards', {
  state: () => {
    const boardsJson = localStorage.getItem('trello-boards')
    let boards: Board[] = []

    if (boardsJson) {
      try {
        const parsedBoards = JSON.parse(boardsJson)
        if (
          Array.isArray(parsedBoards) &&
          parsedBoards.every(
            (b) =>
              typeof b.boardId === 'number' &&
              typeof b.workspaceId === 'number' &&
              typeof b.boardName === 'string' &&
              Array.isArray(b.members) &&
              b.members.every(
                (m: { userId: number; role: string }) =>
                  typeof m.userId === 'number' && ['owner', 'editor', 'viewer'].includes(m.role),
              ) &&
              Array.isArray(b.taskList) &&
              b.taskList.every(
                (t: TaskList) =>
                  typeof t.listId === 'number' &&
                  typeof t.boardId === 'number' &&
                  typeof t.listName === 'string' &&
                  typeof t.listOrder === 'number' &&
                  Array.isArray(t.taskCard) &&
                  t.taskCard.every(
                    (c: TaskCard) =>
                      typeof c.cardId === 'number' &&
                      typeof c.title === 'string' &&
                      typeof c.cardId === 'number' &&
                      // typeof c.cardOrder === 'number' &&
                      (c.description === undefined || typeof c.description === 'string'),
                  ),
              ),
          )
        ) {
          boards = parsedBoards
        }
      } catch (e) {
        console.error('Failed to parse boards from localStorage:', e)
      }
    }

    return {
      boards: boards as Board[],
    }
  },

  actions: {
    saveToStorage() {
      localStorage.setItem('trello-boards', JSON.stringify(this.boards))
    },

    createBoard(workspaceId: number, boardName: string) {
      const userStore = useUserStore()
      const workspacesStore = useWorkspacesStore()
      if (!userStore.currentUser) {
        throw new Error('User must be logged in to create a board')
      }
      const workspace = workspacesStore.workspaces.find((w) => w.workspaceId === workspaceId)
      if (!workspace) {
        throw new Error('Workspace not found')
      }
      const userRole = workspacesStore.getUserRole(workspaceId, userStore.currentUser.userId)
      if (!userRole || userRole === 'viewer') {
        throw new Error('Only owners or editors can create boards')
      }
      const boardId = this.boards.length + 1
      const newBoard: Board = {
        boardId,
        workspaceId,
        boardName: boardName || 'Untitled Board',
        members: workspace.members, // Inherit members from workspace
        taskList: [],
      }
      this.boards.push(newBoard)
      this.saveToStorage()
      return boardId
    },

    updateBoardName(boardId: number, boardName: string) {
      const userStore = useUserStore()
      const workspacesStore = useWorkspacesStore()
      if (!userStore.currentUser) {
        throw new Error('User must be logged in to update a board')
      }
      const board = this.boards.find((b) => b.boardId === boardId)
      if (!board) {
        throw new Error('Board not found')
      }
      const userRole = workspacesStore.getUserRole(board.workspaceId, userStore.currentUser.userId)
      if (!userRole || userRole === 'viewer') {
        throw new Error('Only owners or editors can update board name')
      }
      board.boardName = boardName
      this.saveToStorage()
    },

    addTaskList(boardId: number, listName: string) {
      const userStore = useUserStore()
      const workspacesStore = useWorkspacesStore()
      if (!userStore.currentUser) {
        throw new Error('User must be logged in to add a task list')
      }
      const board = this.boards.find((b) => b.boardId === boardId)
      if (!board) {
        throw new Error('Board not found')
      }
      const userRole = workspacesStore.getUserRole(board.workspaceId, userStore.currentUser.userId)
      if (!userRole || userRole === 'viewer') {
        throw new Error('Only owners or editors can add task lists')
      }
      const listId = board.taskList!.length
        ? Math.max(...board.taskList!.map((t) => t.listId)) + 1
        : 1
      const listOrder = board.taskList!.length
        ? Math.max(...board.taskList.map((t) => t.listOrder!)) + 1
        : 1
      const newTaskList: TaskList = {
        listId,
        boardId,
        listName: listName || 'Untitled List',
        taskCard: [],
        listOrder,
      }
      board.taskList.push(newTaskList)
      this.saveToStorage()
      return listId
    },

    updateTaskListName(boardId: number, listId: number, listName: string) {
      const userStore = useUserStore()
      const workspacesStore = useWorkspacesStore()
      if (!userStore.currentUser) {
        throw new Error('User must be logged in to update a task list')
      }
      const board = this.boards.find((b) => b.boardId === boardId)
      if (!board) {
        throw new Error('Board not found')
      }
      const userRole = workspacesStore.getUserRole(board.workspaceId, userStore.currentUser.userId)
      if (!userRole || userRole === 'viewer') {
        throw new Error('Only owners or editors can update task lists')
      }
      const taskList = board.taskList!.find((t) => t.listId === listId)
      if (!taskList) {
        throw new Error('Task list not found')
      }
      taskList.listName = listName
      this.saveToStorage()
    },

    deleteTaskList(boardId: number, listId: number) {
      const userStore = useUserStore()
      const workspacesStore = useWorkspacesStore()
      if (!userStore.currentUser) {
        throw new Error('User must be logged in to delete a task list')
      }
      const board = this.boards.find((b) => b.boardId === boardId)
      if (!board) {
        throw new Error('Board not found')
      }
      const userRole = workspacesStore.getUserRole(board.workspaceId, userStore.currentUser.userId)
      if (!userRole || userRole === 'viewer') {
        throw new Error('Only owners or editors can delete task lists')
      }
      const taskListIndex = board.taskList!.findIndex((t) => t.listId === listId)
      if (taskListIndex === -1) {
        throw new Error('Task list not found')
      }
      board.taskList!.splice(taskListIndex, 1)
      // Update listOrder for remaining lists
      board.taskList!.forEach((t, index) => {
        t.listOrder = index + 1
      })
      this.saveToStorage()
    },

    addMember(boardId: number, username: string, role: 'editor' | 'viewer') {
      const userStore = useUserStore()
      const workspacesStore = useWorkspacesStore()
      if (!userStore.currentUser) {
        throw new Error('User must be logged in to add members')
      }
      const board = this.boards.find((b) => b.boardId === boardId)
      if (!board) {
        throw new Error('Board not found')
      }
      const userRole = workspacesStore.getUserRole(board.workspaceId, userStore.currentUser.userId)
      if (userRole !== 'owner') {
        throw new Error('Only owners can manage board members')
      }
      const user = userStore.getUserByUsername(username)
      if (!user) {
        throw new Error('User not found')
      }
      if (board.members!.some((m) => m.userId === user.userId)) {
        throw new Error('User is already a member of this board')
      }
      const workspace = workspacesStore.workspaces.find((w) => w.workspaceId === board.workspaceId)
      if (!workspace) {
        throw new Error('Workspace not found')
      }
      if (!workspace.members!.some((m) => m.userId === user.userId)) {
        // Add user to workspace with the same role as the board
        workspacesStore.addMember(board.workspaceId, username, role)
      }
      board.members!.push({ userId: user.userId, role })
      this.saveToStorage()
    },

    removeMember(boardId: number, userId: number) {
      const userStore = useUserStore()
      const workspacesStore = useWorkspacesStore()
      if (!userStore.currentUser) {
        throw new Error('User must be logged in to remove members')
      }
      const board = this.boards.find((b) => b.boardId === boardId)
      if (!board) {
        throw new Error('Board not found')
      }
      const userRole = workspacesStore.getUserRole(board.workspaceId, userStore.currentUser.userId)
      if (userRole !== 'owner') {
        throw new Error('Only owners can remove board members')
      }
      if (
        board.members!.find((m) => m.userId === userId)?.role === 'owner' &&
        userRole === 'owner'
      ) {
        throw new Error('Cannot remove the owner')
      }
      board.members = board.members!.filter((m) => m.userId !== userId)
      this.saveToStorage()
    },

    moveTaskCard(
      boardId: number,
      fromListId: number,
      toListId: number,
      cardId: number,
      newIndex: number,
    ) {
      const board = this.getBoard(boardId)
      if (!board) return

      const fromList = board.taskList.find((l) => l.listId === fromListId)
      const toList = board.taskList.find((l) => l.listId === toListId)
      if (!fromList || !toList || !fromList.taskCard) return

      const idx = fromList.taskCard.findIndex((c) => c.cardId === cardId)
      if (idx === -1) return

      const [card] = fromList.taskCard.splice(idx, 1)
      if (!toList.taskCard) toList.taskCard = []
      toList.taskCard.splice(newIndex, 0, card)

      this.saveToStorage()
    },

    reorderTaskCards(boardId: number, listId: number, oldIndex: number, newIndex: number) {
      const board = this.getBoard(boardId)
      if (!board) return

      const list = board.taskList.find((l) => l.listId === listId)
      if (!list || !list.taskCard) return

      const [card] = list.taskCard.splice(oldIndex, 1)
      list.taskCard.splice(newIndex, 0, card)

      this.saveToStorage()
    },

    reorderTaskLists(boardId: number, oldIndex: number, newIndex: number) {
      const board = this.getBoard(boardId)
      if (!board) return

      const [list] = board.taskList.splice(oldIndex, 1)
      board.taskList.splice(newIndex, 0, list)

      // reassign listOrder for persistence
      board.taskList.forEach((l, i) => (l.listOrder = i))

      this.saveToStorage()
    },
  },

  getters: {
    getBoard: (state) => (boardId: number) => state.boards.find((b) => b.boardId === boardId),
    getBoardsByWorkspace: (state) => (workspaceId: number) =>
      state.boards.filter((b) => b.workspaceId === workspaceId),
  },
})
