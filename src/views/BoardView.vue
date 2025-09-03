<template>
  <div class="board-wrapper">
    <!-- Board Header -->
    <div class="board-header">
      <div class="header-content">
        <div class="board-title-section">
          <el-input
            v-model="boardName"
            @blur="updateBoardName"
            :disabled="userRole !== 'owner' && userRole !== 'editor'"
            placeholder="Board name"
            class="board-name-input"
            size="large"
            clearable
          />
          <div class="board-meta">
            <span class="role-badge" :class="userRole">{{ userRole }}</span>
            <span class="member-count">{{ board?.members?.length || 0 }} members</span>
          </div>
        </div>

        <div class="header-actions">
          <!-- Filter Controls -->
          <div class="filter-controls">
            <el-select v-model="statusFilter" class="status-filter" size="default">
              <el-option label="All tasks" value="all" />
              <el-option label="Incomplete" value="incomplete" />
              <el-option label="Complete" value="complete" />
            </el-select>
          </div>

          <el-button v-if="userRole === 'owner'" @click="toggleMembersPanel" class="members-btn">
            <el-icon><UserFilled /></el-icon>
          </el-button>
          <el-button @click="goToWorkspace" class="back-btn"> Back </el-button>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="!board" class="error-state">
      <div class="error-content">
        <div class="error-icon">
          <el-icon><Warning /></el-icon>
        </div>
        <h3>Board Not Found</h3>
        <p>This board doesn't exist or you don't have access to it.</p>
        <el-button type="primary" @click="goToWorkspace" size="large">
          <el-icon><ArrowLeft /></el-icon>
          Back to Workspace
        </el-button>
      </div>
    </div>

    <!-- Board Content -->
    <template v-else>
      <!-- Members Panel (Slide-out) -->
      <div v-if="userRole === 'owner'" class="members-panel" :class="{ active: showMembersPanel }">
        <div class="members-panel-header">
          <h3>Board Members</h3>
          <el-button @click="toggleMembersPanel" circle size="small" :icon="Close" />
        </div>
        <div class="members-panel-content">
          <div class="members-list">
            <div v-for="member in board.members" :key="member.userId" class="member-item">
              <div class="member-info">
                <div class="member-avatar">
                  {{ getUsername(member.userId).charAt(0).toUpperCase() }}
                </div>
                <div class="member-details">
                  <span class="member-name">{{ getUsername(member.userId) }}</span>
                  <span class="member-role">{{ member.role }}</span>
                </div>
              </div>
              <el-button
                v-if="member.role !== 'owner'"
                @click="removeMember(member.userId)"
                type="danger"
                size="small"
                circle
                :icon="Delete"
              />
            </div>
          </div>
          <el-button @click="addMemberPrompt" type="primary" class="add-member-btn">
            Add Member
          </el-button>
        </div>
      </div>

      <!-- Kanban Board -->
      <div class="kanban-board">
        <div class="task-lists-container" ref="listsContainer">
          <div
            v-for="taskList in filteredTaskLists"
            :key="taskList.listId"
            class="task-list"
            :data-list-id="taskList.listId"
          >
            <div class="list-header">
              <el-input
                v-model="taskList.listName"
                @blur="updateTaskListName(taskList.listId, taskList.listName!)"
                :disabled="userRole !== 'owner' && userRole !== 'editor'"
                placeholder="List name"
                class="list-title-input"
              />
              <div class="list-actions">
                <span class="task-count">
                  {{ getFilteredCards(taskList).length }}
                  <span v-if="statusFilter !== 'all'" class="total-count">
                    / {{ taskList.taskCard?.length || 0 }}
                  </span>
                </span>
                <el-dropdown v-if="userRole !== 'viewer'">
                  <el-button size="small" text :icon="More" />
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="deleteTaskList(taskList.listId)">
                        <el-icon><Delete /></el-icon>
                        Delete List
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>

            <!-- Task Cards -->
            <div
              class="task-cards"
              :ref="(el) => setDraggableRef(el as HTMLElement | null, taskList)"
              :data-list-id="taskList.listId"
            >
              <div
                v-for="card in getFilteredCards(taskList)"
                :key="card.cardId"
                class="task-card"
                :class="{ completed: card.status === 'complete' }"
                :data-card-id="card.cardId"
              >
                <!-- <div
                v-for="card in getFilteredCards(taskList)"
                :key="card.cardId"
                class="task-card"
                :class="{ completed: card.status === 'complete' }"
              > -->
                <div class="card-header">
                  <div class="card-status" :class="card.status">
                    <div class="status-dot"></div>
                  </div>
                  <el-dropdown v-if="userRole !== 'viewer'">
                    <el-button size="small" :icon="More" text />
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="deleteTaskCard(taskList.listId, card.cardId)">
                          <el-icon><Delete /></el-icon>
                          Delete Card
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>

                <el-input
                  v-model="card.title"
                  @blur="updateTaskCard(taskList.listId, card.cardId, { title: card.title })"
                  :disabled="userRole !== 'owner' && userRole !== 'editor'"
                  placeholder="Card title"
                  class="card-title-input"
                />

                <el-input
                  v-model="card.description"
                  type="textarea"
                  @blur="
                    updateTaskCard(taskList.listId, card.cardId, { description: card.description })
                  "
                  :disabled="userRole !== 'owner' && userRole !== 'editor'"
                  placeholder="Add a description..."
                  class="card-description-input"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                />

                <div class="card-footer">
                  <el-select
                    v-model="card.status"
                    @change="updateTaskCard(taskList.listId, card.cardId, { status: card.status })"
                    :disabled="userRole !== 'owner' && userRole !== 'editor'"
                    placeholder="Status"
                    class="status-select"
                    size="small"
                  >
                    <el-option label="Incomplete" value="incomplete" />
                    <el-option label="Complete" value="complete" />
                  </el-select>
                </div>
              </div>

              <!-- Add Card Button -->
              <div
                v-if="userRole !== 'viewer'"
                class="add-card-btn"
                @click="addTaskCardPrompt(taskList.listId)"
              >
                <el-icon><Plus /></el-icon>
                <span>Add a card</span>
              </div>

              <!-- No cards message when filtered -->
              <div
                v-if="getFilteredCards(taskList).length === 0 && taskList.taskCard?.length !== 0"
                class="no-filtered-cards"
              >
                <p>No {{ statusFilter }} tasks in this list</p>
              </div>
            </div>
          </div>

          <!-- Add List Column -->
          <div v-if="userRole !== 'viewer'" class="add-list-column" @click="addTaskListPrompt">
            <div class="add-list-content">
              <div class="add-list-icon">
                <el-icon><Plus /></el-icon>
              </div>
              <h4>Add another list</h4>
              <p>Organize your tasks</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Members Panel Overlay -->
    <div v-if="showMembersPanel" class="panel-overlay" @click="toggleMembersPanel"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Close, Delete, More, Plus, UserFilled, Warning } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/authStore'
import { useWorkspacesStore } from '@/store/workStore'
import { useBoardsStore } from '@/store/boardStore'
import { useTaskCardsStore } from '@/store/cardStore'
import { useTaskListsStore } from '@/store/listStore'
import type { TaskList } from '@/types/taskList'
import type { TaskCard } from '@/types/taskCard'
import { useDraggable } from 'vue-draggable-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const workspacesStore = useWorkspacesStore()
const boardsStore = useBoardsStore()
const taskListStore = useTaskListsStore()
const taskCardStore = useTaskCardsStore()

const showMembersPanel = ref(false)
const statusFilter = ref<'all' | 'complete' | 'incomplete'>('all')

const toggleMembersPanel = () => {
  showMembersPanel.value = !showMembersPanel.value
}

const boardId = computed(() => Number(route.params.boardId || route.params.id))
const board = computed(() => boardsStore.getBoard(boardId.value))
const workspaceId = computed(() => board.value?.workspaceId || 0)
const userRole = computed(() =>
  userStore.currentUser && workspaceId.value
    ? workspacesStore.getUserRole(workspaceId.value, userStore.currentUser.userId)
    : null,
)
const boardName = ref(board.value?.boardName || '')
const taskLists = computed(() =>
  (board.value?.taskList ?? []).slice().sort((a, b) => (a.listOrder ?? 0) - (b.listOrder ?? 0)),
)

// Filter function for individual task lists
const getFilteredCards = (taskList: TaskList): TaskCard[] => {
  if (!taskList.taskCard) return []

  if (statusFilter.value === 'all') {
    return taskList.taskCard
  }
  return taskList.taskCard.filter((card) => card.status === statusFilter.value)
}

// Computed property for filtered task lists (only show lists that have cards matching the filter)
const filteredTaskLists = computed(() => {
  if (statusFilter.value === 'all') {
    return taskLists.value
  }

  // Show all lists, but the cards within them will be filtered by getFilteredCards
  return taskLists.value
})

const listsContainer = ref<HTMLElement | null>(null)

useDraggable(
  listsContainer,
  computed(() => board.value?.taskList ?? []),
  {
    animation: 150,
    ghostClass: 'ghost-list',
    handle: '.list-header',
    onUpdate: async (evt) => {
      const oldIndex = evt.oldIndex ?? 0
      const newIndex = evt.newIndex ?? 0
      await boardsStore.reorderTaskLists(boardId.value, oldIndex, newIndex)
    },
  },
)

const setDraggableRef = (el: HTMLElement | null, taskList: TaskList) => {
  if (!el) return

  useDraggable(el, ref(taskList.taskCard ?? []), {
    animation: 150,
    group: 'cards', // allow cross-list drag
    ghostClass: 'ghost',

    onAdd: async (evt) => {
      const cardId = Number(evt.item.dataset.cardId)
      const fromListId = Number((evt.from as HTMLElement).dataset.listId)
      const toListId = taskList.listId
      const newIndex = evt.newIndex ?? 0

      await boardsStore.moveTaskCard(boardId.value, fromListId, toListId, cardId, newIndex)
    },

    onUpdate: async (evt) => {
      const listId = taskList.listId
      const oldIndex = evt.oldIndex ?? 0
      const newIndex = evt.newIndex ?? 0

      await boardsStore.reorderTaskCards(boardId.value, listId, oldIndex, newIndex)
    },
  })
}

const goToWorkspace = () => {
  const currentUserId = userStore.currentUser?.userId
  if (currentUserId) {
    router.push(`/workspace/${currentUserId}`)
  } else {
    router.push('/') // fallback (AuthView)
  }
}

const getUsername = (userId: number) => {
  const user = userStore.users.find((u) => u.userId === userId)
  return user ? user.username : 'Unknown'
}

const addMemberPrompt = async () => {
  try {
    const username = await new Promise<string>((resolve) => {
      ElMessageBox.prompt('Enter username to add', 'Add Member', {
        confirmButtonText: 'Add',
        cancelButtonText: 'Cancel',
        inputPattern: /.+/,
        inputErrorMessage: 'Username is required',
      }).then(({ value }) => resolve(value))
    })
    const role = await new Promise<'editor' | 'viewer'>((resolve) => {
      ElMessageBox({
        title: 'Select Role',
        message: 'Choose a role for the member:',
        showCancelButton: true,
        confirmButtonText: 'Editor',
        cancelButtonText: 'Viewer',
      })
        .then(() => resolve('editor'))
        .catch(() => resolve('viewer'))
    })
    await boardsStore.addMember(boardId.value, username, role)
    ElMessage.success('Member added')
  } catch (error) {
    console.log(error)
    ElMessage.error('User not found')
  }
}

const removeMember = async (userId: number) => {
  try {
    await ElMessageBox.confirm('Are you sure you want to remove this member?', 'Confirm Remove', {
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel',
      type: 'warning',
    })
    await boardsStore.removeMember(boardId.value, userId)
    ElMessage.success('Member removed')
  } catch (error) {
    console.log(error)
  }
}

const updateBoardName = async () => {
  try {
    await boardsStore.updateBoardName(boardId.value, boardName.value)

    if (workspaceId.value) {
      await workspacesStore.updateWorkspaceName(workspaceId.value, boardName.value)
    }

    ElMessage.success('Board name updated')
  } catch (error) {
    console.log(error)
    boardName.value = board.value?.boardName || ''
  }
}

const addTaskListPrompt = async () => {
  try {
    const listName = await new Promise<string>((resolve) => {
      ElMessageBox.prompt('Enter list name', 'Add Task List', {
        confirmButtonText: 'Add',
        cancelButtonText: 'Cancel',
        inputPattern: /.+/,
        inputErrorMessage: 'List name is required',
      }).then(({ value }) => resolve(value))
    })
    await boardsStore.addTaskList(boardId.value, listName)
    ElMessage.success('Task list added')
  } catch (error) {
    console.log(error)
  }
}

const updateTaskListName = async (listId: number, listName: string) => {
  try {
    await boardsStore.updateTaskListName(boardId.value, listId, listName)
    ElMessage.success('Task list name updated')
  } catch (error) {
    console.log(error)
  }
}

const deleteTaskList = async (listId: number) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to delete this task list?',
      'Confirm Delete',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      },
    )
    await boardsStore.deleteTaskList(boardId.value, listId)
    ElMessage.success('Task list deleted')
  } catch (error) {
    console.log(error)
  }
}

const addTaskCardPrompt = async (listId: number) => {
  try {
    const title = await new Promise<string>((resolve) => {
      ElMessageBox.prompt('Enter card title', 'Add Task Card', {
        confirmButtonText: 'Add',
        cancelButtonText: 'Cancel',
        inputPattern: /.+/,
        inputErrorMessage: 'Card title is required',
      }).then(({ value }) => resolve(value))
    })
    await taskListStore.addTaskCard(boardId.value, listId, title)
    ElMessage.success('Task card added')
  } catch (error) {
    console.log(error)
  }
}

const updateTaskCard = async (
  listId: number,
  cardId: number,
  updates: { title?: string; description?: string; status?: 'complete' | 'incomplete' },
) => {
  try {
    await taskCardStore.updateTaskCard(boardId.value, listId, cardId, updates)
    ElMessage.success('Task card updated')
  } catch (error) {
    console.log(error)
  }
}

const deleteTaskCard = async (listId: number, cardId: number) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to delete this task card?',
      'Confirm Delete',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      },
    )
    await taskCardStore.deleteTaskCard(boardId.value, listId, cardId)
    ElMessage.success('Task card deleted')
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped>
.board-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  position: relative;
}

.board-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(94, 135, 245, 0.03) 0%, transparent 60%),
    radial-gradient(circle at 80% 70%, rgba(118, 75, 162, 0.03) 0%, transparent 60%);
  pointer-events: none;
}

.board-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.header-content {
  max-width: 100%;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.board-title-section {
  flex: 1;
}

.board-name-input {
  margin-bottom: 8px;
}

:deep(.board-name-input .el-input__wrapper) {
  border: none;
  background: transparent;
  box-shadow: none;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--quaternary);
  padding: 8px 0;
}

:deep(.board-name-input .el-input__inner) {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--quaternary);
  padding: 0;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

:deep(.board-name-input .el-input__wrapper:hover) {
  background: rgba(248, 250, 252, 0.8);
  border-radius: 8px;
}

.board-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.role-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.role-badge.owner {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.role-badge.editor {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.role-badge.viewer {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  color: white;
}

.member-count {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.members-btn {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border: none;
  color: white;
  border-radius: 10px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(94, 135, 245, 0.3);
  transition: all 0.3s ease;
}

.members-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(94, 135, 245, 0.4);
}

.back-btn {
  border: 2px solid #e5e7eb;
  background: white;
  color: #64748b;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-2px);
}

/* status filter */
.status-filter {
  min-width: 120px;
}

.status-filter .el-input__inner {
  text-align: left;
}

.filter-label {
  color: var(--el-text-color-secondary);
  font-size: 12px;
  margin-right: 4px;
}

/* Members Panel */
.members-panel {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 200;
  overflow-y: auto;
}

.members-panel.active {
  right: 0;
}

.members-panel-header {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.members-panel-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--quaternary);
}

.members-panel-content {
  padding: 24px;
}

.members-list {
  margin-bottom: 24px;
}

.member-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 12px;
  background: #f8fafc;
  margin-bottom: 12px;
  transition: all 0.2s ease;
}

.member-item:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.member-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
}

.member-details {
  display: flex;
  flex-direction: column;
}

.member-name {
  font-weight: 600;
  color: var(--quaternary);
  font-size: 0.95rem;
}

.member-role {
  color: #64748b;
  font-size: 0.8rem;
  text-transform: capitalize;
}

.add-member-btn {
  width: 100%;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border: none;
  color: white;
  border-radius: 12px;
  padding: 14px;
  font-weight: 600;
}

.panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  z-index: 150;
}

/* Error State */
.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 32px;
}

.error-content {
  text-align: center;
  max-width: 400px;
}

.error-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px auto;
  color: white;
  font-size: 32px;
}

.error-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--quaternary);
  margin: 0 0 8px 0;
}

.error-content p {
  color: #64748b;
  margin: 0 0 24px 0;
}

/* Kanban Board */
.kanban-board {
  padding: 32px;
  height: calc(100vh - 120px);
  overflow: hidden;
}

.task-lists-container {
  display: flex;
  gap: 24px;
  height: 100%;
  overflow-x: auto;
  padding-bottom: 16px;
}

.task-list {
  min-width: 320px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  height: fit-content;
  max-height: calc(100vh - 200px);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.task-list:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-color: rgba(94, 135, 245, 0.2);
}

.list-header {
  padding: 20px 20px 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 12px;
}

.list-title-input {
  flex: 1;
  margin-right: 12px;
}

:deep(.list-title-input .el-input__wrapper) {
  border: none;
  background: transparent;
  box-shadow: none;
  padding: 8px 0;
}

:deep(.list-title-input .el-input__inner) {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--quaternary);
  padding: 0;
}

:deep(.list-title-input .el-input__wrapper:hover) {
  background: #f8fafc;
  border-radius: 6px;
}

.list-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-count {
  background: #f1f5f9;
  color: #64748b;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 24px;
  text-align: center;
}

.task-cards {
  flex: 1;
  padding: 0 16px 16px 16px;
  overflow-y: auto;
  max-height: calc(100vh - 320px);
}

.task-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
}

.task-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--primary);
  border-radius: 2px 0 0 2px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.task-card:hover {
  transform: translateX(2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-color: var(--primary);
}

.task-card:hover::before {
  opacity: 1;
}

.task-card.completed {
  opacity: 0.8;
  background: #f8fffe;
  border-color: #10b981;
}

.task-card.completed::before {
  background: #10b981;
  opacity: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.card-status.incomplete .status-dot {
  background: #f59e0b;
}

.card-status.complete .status-dot {
  background: #10b981;
}

.card-title-input {
  margin-bottom: 12px;
}

:deep(.card-title-input .el-input__wrapper) {
  border: 1px solid transparent;
  background: #f8fafc;
  border-radius: 8px;
  transition: all 0.2s ease;
}

:deep(.card-title-input .el-input__wrapper:hover) {
  border-color: var(--primary);
  background: white;
}

:deep(.card-title-input .el-input__inner) {
  font-weight: 600;
  color: var(--quaternary);
}

.card-description-input {
  margin-bottom: 16px;
}

:deep(.card-description-input .el-textarea__inner) {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 0.9rem;
  color: #64748b;
  resize: none;
  transition: all 0.2s ease;
}

:deep(.card-description-input .el-textarea__inner:hover) {
  border-color: var(--primary);
  background: white;
}

:deep(.card-description-input .el-textarea__inner:focus) {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(94, 135, 245, 0.1);
}

.card-footer {
  margin-top: 12px;
}

.status-select {
  width: 100%;
}

:deep(.status-select .el-input__wrapper) {
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

:deep(.status-select .el-input__wrapper:hover) {
  border-color: var(--primary);
}

/* Add Card Button */
.add-card-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8fafc;
  font-weight: 500;
  margin-top: 8px;
}

.add-card-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: rgba(94, 135, 245, 0.05);
  transform: translateY(-1px);
}

/* Add List Column */
.add-list-column {
  min-width: 280px;
  background: rgba(255, 255, 255, 0.6);
  border: 2px dashed #cbd5e1;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  height: fit-content;
  min-height: 200px;
}

.add-list-column:hover {
  border-color: var(--primary);
  background: rgba(94, 135, 245, 0.05);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(94, 135, 245, 0.15);
}

.add-list-content {
  text-align: center;
  padding: 32px;
}

.add-list-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px auto;
  color: white;
  font-size: 20px;
  box-shadow: 0 6px 20px rgba(94, 135, 245, 0.3);
  transition: all 0.3s ease;
}

.add-list-column:hover .add-list-icon {
  transform: scale(1.1);
  box-shadow: 0 8px 24px rgba(94, 135, 245, 0.4);
}

.add-list-content h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--quaternary);
  margin: 0 0 8px 0;
}

.add-list-content p {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
}

/* Scrollbar Styling */
.task-lists-container::-webkit-scrollbar {
  height: 8px;
}

.task-lists-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.task-lists-container::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  border-radius: 4px;
}

.task-cards::-webkit-scrollbar {
  width: 6px;
}

.task-cards::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 3px;
}

.task-cards::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.task-cards::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animation for new elements */
.task-card,
.task-list {
  animation: slideInUp 0.4s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Enhanced Element Plus Overrides */
:deep(.el-card) {
  border: none;
  box-shadow: none;
  background: transparent;
}

:deep(.el-card__body) {
  padding: 0;
}

:deep(.el-dropdown) {
  color: #64748b;
}

:deep(.el-dropdown-menu) {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

:deep(.el-dropdown-menu__item) {
  padding: 12px 16px;
  font-weight: 500;
}

:deep(.el-dropdown-menu__item:hover) {
  background: #f8fafc;
  color: var(--primary);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .header-content {
    padding: 20px 24px;
  }

  .kanban-board {
    padding: 24px;
  }

  .members-panel {
    width: 350px;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .header-actions {
    justify-content: center;
  }

  .kanban-board {
    padding: 16px;
  }

  .task-lists-container {
    gap: 16px;
  }

  .task-list {
    min-width: 280px;
  }

  .members-panel {
    width: 100vw;
    right: -100vw;
  }

  .members-panel-content {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .task-list {
    min-width: 260px;
  }

  .add-list-column {
    min-width: 260px;
  }

  :deep(.board-name-input .el-input__inner) {
    font-size: 1.5rem;
  }
}

/* Loading and interaction states */
.task-card.updating {
  opacity: 0.7;
}

.task-list.loading {
  opacity: 0.8;
}

.task-list.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(2px);
  border-radius: 16px;
}

/* Focus states for better accessibility */
:deep(.el-input__wrapper:focus-within) {
  border-color: var(--primary) !important;
  box-shadow: 0 0 0 2px rgba(94, 135, 245, 0.1) !important;
}

/* Status indicator animations */
.status-dot {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.card-status.complete .status-dot {
  animation: none;
}

/* Drag and drop placeholder styles (for future enhancement) */
.task-card.dragging {
  opacity: 0.5;
  transform: rotate(5deg);
}

.task-list.drop-target {
  border-color: var(--primary);
  background: rgba(94, 135, 245, 0.02);
}
</style>
