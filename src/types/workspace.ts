export interface Workspace {
  workspaceId: number
  name?: string
  members?: { userId: number; role: 'owner' | 'editor' | 'viewer' }[] // Users and their roles
}
