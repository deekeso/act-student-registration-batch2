import { defineStore } from 'pinia'
import type { Workspace } from '@/types/workspace'
import { useUserStore } from './authStore'

interface WorkspaceMember {
  userId: number
  role: 'owner' | 'editor' | 'viewer'
}

export const useWorkspacesStore = defineStore('workspaces', {
  state: () => {
    const workspacesJson = localStorage.getItem('trello-workspaces')
    let workspaces: Workspace[] = []

    if (workspacesJson) {
      try {
        const parsedWorkspaces = JSON.parse(workspacesJson)
        if (
          Array.isArray(parsedWorkspaces) &&
          parsedWorkspaces.every(
            (w) =>
              typeof w.workspaceId === 'number' &&
              typeof w.name === 'string' &&
              Array.isArray(w.members) &&
              w.members.every(
                (m: WorkspaceMember) =>
                  typeof m.userId === 'number' && ['owner', 'editor', 'viewer'].includes(m.role),
              ),
          )
        ) {
          workspaces = parsedWorkspaces
        }
      } catch (e) {
        console.error('Failed to parse workspaces from localStorage:', e)
      }
    }

    return {
      workspaces: workspaces as Workspace[],
    }
  },

  actions: {
    saveToStorage() {
      localStorage.setItem('trello-workspaces', JSON.stringify(this.workspaces))
    },

    createWorkspace(name: string) {
      const userStore = useUserStore()
      if (!userStore.currentUser) {
        throw new Error('User must be logged in to create a workspace')
      }
      const workspaceId = this.workspaces.length + 1
      const newWorkspace: Workspace = {
        workspaceId,
        name,
        members: [{ userId: userStore.currentUser.userId, role: 'owner' }],
      }
      this.workspaces.push(newWorkspace)
      this.saveToStorage()
      return workspaceId // Return ID for redirect
    },

    deleteWorkspace(workspaceId: number) {
      const userStore = useUserStore()
      if (!userStore.currentUser) {
        throw new Error('User must be logged in to delete a workspace')
      }
      const workspace = this.workspaces.find((w) => w.workspaceId === workspaceId)
      if (!workspace) {
        throw new Error('Workspace not found')
      }
      const userRole = workspace.members!.find(
        (m) => m.userId === userStore.currentUser!.userId,
      )?.role
      if (userRole !== 'owner') {
        throw new Error('Only owners can delete a workspace')
      }
      this.workspaces = this.workspaces.filter((w) => w.workspaceId !== workspaceId)
      this.saveToStorage()
    },

    addMember(workspaceId: number, username: string, role: 'editor' | 'viewer') {
      const userStore = useUserStore()
      if (!userStore.currentUser) {
        throw new Error('User must be logged in to add members')
      }
      const workspace = this.workspaces.find((w) => w.workspaceId === workspaceId)
      if (!workspace) {
        throw new Error('Workspace not found')
      }
      const userRole = workspace.members!.find(
        (m) => m.userId === userStore.currentUser!.userId,
      )?.role
      if (userRole !== 'owner') {
        throw new Error('Only owners can add members')
      }
      const user = userStore.getUserByUsername(username)
      if (!user) {
        throw new Error('User not found')
      }
      if (workspace.members!.some((m) => m.userId === user.userId)) {
        throw new Error('User is already a member of this workspace')
      }
      workspace.members!.push({ userId: user.userId, role })
      this.saveToStorage()
    },

    async updateWorkspaceName(workspaceId: number, newName: string) {
      const workspace = this.workspaces.find((w) => w.workspaceId === workspaceId)
      if (workspace) {
        workspace.name = newName
        this.saveToStorage()
      }
    },
  },

  getters: {
    ownedWorkspaces: (state) => (userId: number) =>
      state.workspaces.filter((w) =>
        w.members!.some((m) => m.userId === userId && m.role === 'owner'),
      ),
    sharedWorkspaces: (state) => (userId: number) =>
      state.workspaces.filter((w) =>
        w.members!.some((m) => m.userId === userId && m.role !== 'owner'),
      ),
    getUserRole: (state) => (workspaceId: number, userId: number) =>
      state.workspaces
        .find((w) => w.workspaceId === workspaceId)
        ?.members!.find((m) => m.userId === userId)?.role || null,
  },
})
