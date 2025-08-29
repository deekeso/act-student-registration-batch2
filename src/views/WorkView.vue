<template>
  <div class="workspaces-wrapper">
    <!-- Header Section -->
    <div class="workspaces-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">Your Workspaces</h1>
          <p class="page-subtitle">Organize and collaborate on your projects</p>
        </div>
        <el-button class="logout-btn" @click="handleLogout" size="large">Logout</el-button>
      </div>
    </div>

    <div class="workspaces-container">
      <!-- Owned Workspaces Section -->
      <div class="workspaces-section">
        <div class="section-header">
          <div class="section-title-wrapper">
            <h3 class="section-title">Owned Workspaces</h3>
            <span class="workspace-count">{{ ownedWorkspaces.length }}</span>
          </div>
          <div class="section-divider"></div>
        </div>

        <div class="workspaces-grid">
          <div
            v-for="workspace in ownedWorkspaces"
            :key="workspace.workspaceId"
            class="workspace-card owned-workspace"
            @click="goToWorkspace(workspace.workspaceId)"
          >
            <div class="card-header">
              <div></div>
              <div class="workspace-badge owner-badge">Owner</div>
            </div>
            <div class="card-content">
              <h4 class="workspace-name">{{ workspace.name }}</h4>
              <p class="workspace-meta">Click to open workspace</p>
            </div>
            <div class="card-footer">
              <div class="access-indicator">
                <el-icon><User /></el-icon>
                <span>Full Access</span>
              </div>
            </div>
          </div>

          <!-- Create Workspace Card -->
          <div class="workspace-card create-card" @click="handleCreateWorkspace">
            <div class="create-content">
              <div class="create-icon">
                <el-icon><Plus /></el-icon>
              </div>
              <h4 class="create-title">Create Workspace</h4>
              <p class="create-subtitle">Start a new project</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Shared Workspaces Section -->
      <div class="workspaces-section" v-if="sharedWorkspaces.length">
        <div class="section-header">
          <div class="section-title-wrapper">
            <h3 class="section-title">Shared Workspaces</h3>
            <span class="workspace-count">{{ sharedWorkspaces.length }}</span>
          </div>
          <div class="section-divider"></div>
        </div>

        <div class="workspaces-grid">
          <div
            v-for="workspace in sharedWorkspaces"
            :key="workspace.workspaceId"
            class="workspace-card shared-workspace"
            @click="goToWorkspace(workspace.workspaceId)"
          >
            <div class="card-header">
              <div></div>
              <div class="workspace-badge shared-badge">
                {{
                  workspacesStore.getUserRole(workspace.workspaceId, userStore.currentUser!.userId)
                }}
              </div>
            </div>
            <div class="card-content">
              <h4 class="workspace-name">{{ workspace.name }}</h4>
              <p class="workspace-meta">Shared workspace</p>
            </div>
            <div class="card-footer">
              <div class="access-indicator">
                <el-icon><User /><User /></el-icon>
                <span>Collaborative</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!ownedWorkspaces.length && !sharedWorkspaces.length" class="empty-state">
        <div class="empty-content">
          <div class="empty-icon">
            <el-icon><FolderOpened /></el-icon>
          </div>
          <h3>No workspaces yet</h3>
          <p>Create your first workspace to get started</p>
          <el-button
            type="primary"
            @click="handleCreateWorkspace"
            size="large"
            class="empty-action-btn"
          >
            <el-icon><Plus /></el-icon>
            Create Your First Workspace
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { FolderOpened, Plus, User } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/authStore'
import { useWorkspacesStore } from '@/store/workStore'
import { useBoardsStore } from '@/store/boardStore'

const userStore = useUserStore()
const workspacesStore = useWorkspacesStore()
const boardsStore = useBoardsStore()
const router = useRouter()

const ownedWorkspaces = computed(() =>
  userStore.currentUser ? workspacesStore.ownedWorkspaces(userStore.currentUser.userId) : [],
)
const sharedWorkspaces = computed(() =>
  userStore.currentUser ? workspacesStore.sharedWorkspaces(userStore.currentUser.userId) : [],
)

const handleCreateWorkspace = async () => {
  try {
    // Prompt for workspace name
    const name = await new Promise<string>((resolve) => {
      ElMessageBox.prompt('Enter workspace name', 'Create Workspace', {
        confirmButtonText: 'Create',
        cancelButtonText: 'Cancel',
        inputPattern: /.+/,
        inputErrorMessage: 'Workspace name is required',
      }).then(({ value }) => resolve(value))
    })
    const workspaceId = await workspacesStore.createWorkspace(name)

    // Create a default board for the new workspace
    const boardId = await boardsStore.createBoard(workspaceId, `${name}`)

    ElMessage.success('Workspace and board created')
    router.push(`/board/${boardId}`)
  } catch (error) {
    console.log(error)
    ElMessage.error('Failed to create workspace')
  }
}

const goToWorkspace = (workspaceId: number) => {
  // Get the first board of this workspace, or create one if none exists
  const boards = boardsStore.getBoardsByWorkspace(workspaceId)

  if (boards.length > 0) {
    // Navigate to the first board
    router.push(`/board/${boards[0].boardId}`)
  } else {
    // Create a default board for this workspace
    try {
      const workspace = workspacesStore.workspaces.find((w) => w.workspaceId === workspaceId)
      const boardId = boardsStore.createBoard(workspaceId, `${workspace?.name || 'Untitled'} Board`)
      router.push(`/board/${boardId}`)
    } catch (error) {
      console.log(error)
      ElMessage.error('Failed to access workspace')
    }
  }
}

async function handleLogout() {
  userStore.logout()
  router.push('/')
}
</script>

<style scoped>
.workspaces-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
}

.workspaces-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 25% 25%, rgba(94, 135, 245, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(118, 75, 162, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.workspaces-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 24px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--quaternary);
  margin: 0;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  color: #64748b;
  font-size: 1rem;
  margin: 4px 0 0 0;
  font-weight: 400;
}

.logout-btn {
  border: none;
  border-radius: 20px;
  width: 68px;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  transform: translateY(-2px);
}

.workspaces-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
  position: relative;
}

.workspaces-section {
  margin-bottom: 48px;
}

.section-header {
  margin-bottom: 24px;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--quaternary);
  margin: 0;
}

.workspace-count {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.section-divider {
  height: 2px;
  background: linear-gradient(90deg, var(--primary), transparent);
  border-radius: 1px;
  width: 60px;
}

.workspaces-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.workspace-card {
  border-radius: 16px;
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden;
  position: relative;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.workspace-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.workspace-card:hover::before {
  opacity: 1;
}

.workspace-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: var(--primary);
}

.owned-workspace {
  background: linear-gradient(135deg, rgba(94, 135, 245, 0.02) 0%, rgba(78, 105, 195, 0.02) 100%);
}

.shared-workspace {
  background: linear-gradient(135deg, rgba(118, 75, 162, 0.02) 0%, rgba(61, 75, 145, 0.02) 100%);
}

.card-header {
  padding: 20px 20px 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.workspace-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  box-shadow: 0 4px 12px rgba(94, 135, 245, 0.3);
}

.workspace-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.owner-badge {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.shared-badge {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.card-content {
  padding: 16px 20px;
}

.workspace-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--quaternary);
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.workspace-meta {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
  font-weight: 400;
}

.card-footer {
  padding: 0 20px 20px 20px;
}

.access-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 500;
}

.access-indicator .el-icon {
  font-size: 14px;
}

/* Create Card Styling */
.create-card {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 2px dashed #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  position: relative;
  overflow: hidden;
}

.create-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(94, 135, 245, 0.1), transparent);
  transition: left 0.6s ease;
}

.create-card:hover::after {
  left: 100%;
}

.create-card:hover {
  border-color: var(--primary);
  background: linear-gradient(135deg, rgba(94, 135, 245, 0.05) 0%, rgba(78, 105, 195, 0.05) 100%);
}

.create-content {
  text-align: center;
  z-index: 1;
  position: relative;
}

.create-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px auto;
  color: white;
  font-size: 24px;
  box-shadow: 0 8px 24px rgba(94, 135, 245, 0.3);
  transition: all 0.3s ease;
}

.create-card:hover .create-icon {
  transform: scale(1.1);
  box-shadow: 0 12px 32px rgba(94, 135, 245, 0.4);
}

.create-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--quaternary);
  margin: 0 0 8px 0;
}

.create-subtitle {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
}

/* Empty State */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.empty-content {
  max-width: 400px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px auto;
  color: #64748b;
  font-size: 32px;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--quaternary);
  margin: 0 0 8px 0;
}

.empty-state p {
  color: #64748b;
  font-size: 1rem;
  margin: 0 0 24px 0;
}

.empty-action-btn {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(94, 135, 245, 0.3);
  transition: all 0.3s ease;
}

.empty-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(94, 135, 245, 0.4);
}

/* Element Plus Overrides */
:deep(.el-card) {
  border: none;
  box-shadow: none;
  background: transparent;
}

:deep(.el-card__body) {
  padding: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .workspaces-container {
    padding: 24px 16px;
  }

  .workspaces-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .header-content {
    padding: 0 16px;
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .page-title {
    font-size: 1.75rem;
  }

  .workspace-card {
    min-height: auto;
  }

  .create-card {
    min-height: 160px;
  }
}

@media (max-width: 480px) {
  .workspaces-grid {
    grid-template-columns: 1fr;
  }

  .workspace-card {
    margin: 0;
  }

  .page-title {
    font-size: 1.5rem;
  }
}

/* Animation for new cards */
.workspace-card {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Staggered animation for multiple cards */
.workspace-card:nth-child(1) {
  animation-delay: 0.1s;
}
.workspace-card:nth-child(2) {
  animation-delay: 0.2s;
}
.workspace-card:nth-child(3) {
  animation-delay: 0.3s;
}
.workspace-card:nth-child(4) {
  animation-delay: 0.4s;
}
.workspace-card:nth-child(5) {
  animation-delay: 0.5s;
}

/* Loading state */
.workspace-card.loading {
  opacity: 0.7;
  pointer-events: none;
}

.workspace-card.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* Hover effects for better interactivity */
.workspace-icon {
  transition: all 0.3s ease;
}

.workspace-card:hover .workspace-icon {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(94, 135, 245, 0.4);
}

.workspace-badge {
  transition: all 0.3s ease;
}

.workspace-card:hover .workspace-badge {
  transform: scale(1.05);
}
</style>
