<template>
  <!--  Header Section -->
  <div class="custom-header">
    <div class="header-content">
      <div class="header-left">
        <div class="header-icon">
          <img :src="nba" alt="NBA Logo" style="width: 100px; height: 50px;" />
        </div>
        <div class="header-text">
          <span class="header-title">Student Registration System</span>
          <span class="header-subtitle">Administrator Dashboard</span>
        </div>
      </div>
      <el-button 
        type="info" 
        @click="logout" 
        class="logout-btn"
        
      >
        Logout
      </el-button>
    </div>
  </div>

  <!-- Main Content Container -->
  <div class="main-container">
    <!--  Title + Add Button Section -->
    <div class="title-section">
      <div class="title-content">
        <div class="title-wrapper">
          <h1 class="main-title">
            <i class="el-icon-s-custom title-icon"></i>
            Student Records
          </h1>
          <p class="title-description">Manage and organize student information efficiently</p>
        </div>
        
        <el-button 
          type="primary" 
          size="large"
          class="add-student-btn"
          @click="drawer = true"
        >
          Add New Student
        </el-button>
      </div>
    </div>

    <!--  Filters Section -->
    <div class="filters-container">
      <div class="filters-header">
        <h3 class="filters-title">
          <i class="el-icon-search"></i>
          Search & Filter
        </h3>
      </div>
      
      <el-form 
        :inline="true" 
        label-position="top"
        class="filters-form"
        ref="editForm"
      >
        <!-- Name Search -->
        <el-form-item label="Search by Name" class="filter-item">
          <el-input
            v-model="searchName"
            placeholder="Enter student name..."
            clearable
            size="large"
            class="search-input"
            prefix-icon="el-icon-search"
          >
          <template #prefix>
            <span class="material-symbols-outlined" style="font-size: 20px;">
              data_loss_prevention
            </span>
          </template>
          </el-input>
        </el-form-item>

        <!-- Course Filter -->
        <el-form-item label="Filter by Course" class="filter-item">
          <el-select
            v-model="selectedCourse"
            placeholder="Select course"
            clearable
            size="large"
            class="course-select"
          >
            <el-option
              v-for="course in courseOptions"
              :key="course"
              :label="course"
              :value="course"
            />
          </el-select>
        </el-form-item>

        <!-- View Mode Toggle -->
        <el-form-item label="Display Mode" class="filter-item">
          <el-radio-group v-model="viewMode" class="view-toggle">
            <el-radio-button :value="'card'">
              <i class="el-icon-s-grid"></i> Cards
            </el-radio-button>
            <el-radio-button :value="'table'">
              <i class="el-icon-s-order"></i> Table
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <!-- Edit Location Toggle -->
        <el-form-item label="Edit Mode" class="filter-item">
          <el-radio-group v-model="editLocation" class="edit-location-toggle">
            <el-radio-button :value="'card'">
              <i class="el-icon-edit"></i> Edit in Input
            </el-radio-button>
            <el-radio-button :value="'drawer'">
              <i class="el-icon-s-fold"></i> Edit in Drawer
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <!-- Reset Filters -->
        <el-form-item label="Actions" class="filter-item">
          <el-button 
            @click="resetFilters" 
            type="warning" 
            plain
            class="reset-btn"
            
            style="padding-left: 1px, 2px;"
          >
            Reset Filters
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- Results Summary -->
    <div class="results-summary" v-if="filteredStudents.length">
      <div class="summary-content">
        <i class="el-icon-s-data"></i>
        <span>Showing {{ filteredStudents.length }} of {{ totalStudents }} students</span>
      </div>
    </div>

    <el-card v-loading="loading" class="edit-form-wrapper">
    <!--  Card View -->
    <div v-if="viewMode === 'card' && filteredStudents.length" class="card-container">
      <div class="card-grid">
        <el-card
          v-for="(student, index) in filteredStudents"
          :key="student.id || index"
          class="student-card"
          shadow="hover"
        >
          <div v-if="editLocation === 'card' && selectedStudent?.id === student.id" class="edit-mode">
            <el-form-item label=""></el-form-item>
            <!--  Edit Form -->
            <div class="edit-header">
              <h4><i class="el-icon-edit"></i> Edit Student</h4>
            </div>
            
            <el-form
              label-position="top"
              class="edit-form"
              :model="selectedStudent"
              :rules="formRules"
              ref="editForm"
            >
              <div class="form-row">
                <el-form-item label="First Name" class="form-item" prop="firstName">
                  <el-input @input="val => leadingSpaces('firstName', val)" v-model="selectedStudent.firstName" placeholder="First name" />
                </el-form-item>

                  <el-form-item
                    label="Middle Name"
                    class="form-item-small"
                    prop="middleInitial"
                  >
                    <el-input
                      @input="val => leadingSpaces('middleInitial', val)"
                      v-model="selectedStudent.middleInitial"
                      placeholder="Middle name"
                      maxlength="30"
                    />
                  </el-form-item>
              </div>

              <el-form-item label="Last Name" prop="lastName">
                <el-input @input="val => leadingSpaces('lastName', val)" v-model="selectedStudent.lastName" placeholder="Last name" />
              </el-form-item>

              <el-form-item label="Course" prop="course">
                <el-select
                  v-model="selectedStudent.course"
                  placeholder="Select Course"
                  style="width: 100%"
                >
                  <el-option
                    v-for="option in courseOptions"
                    :key="option"
                    :label="option"
                    :value="option"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="Birthday" prop="birthDate">
                <el-date-picker
                  v-model="selectedStudent.birthDate"
                  type="date"
                  placeholder="Pick a date"
                  style="width: 100%"
                  @change="updateAge"
                  :disabled-date="disabledFutureDates"
                  :default-value="allowedDate"
                />
              </el-form-item>

              <el-form-item label="Age" prop="age">
                <el-input v-model="selectedStudent.age" :readonly="true" />
              </el-form-item>


              <el-form-item label="Username" prop="username">
                <el-input
                  type="text"
                  v-model="selectedStudent.username"
                  placeholder="Change Username"
                  :rows="1"
                  show-password
                />
              </el-form-item>

              <el-form-item label="Password" prop="password">
                <el-input
                  type="password"
                  v-model="selectedStudent.password"
                  placeholder="Change Password"
                  :rows="1"
                  show-password
                />
              </el-form-item>

              <el-form-item label="Address" prop="address">
                <el-input
                  type="textarea"
                  v-model="selectedStudent.address"
                  placeholder="Enter address"
                  :rows="3"
                />
              </el-form-item>

              <div class="form-actions">
                <el-button
                  type="success"
                  @click="async () => {
                    const isValid = await isEditFormValid();
                    if (isValid) {
                      openConfirmDialog = true;
                    } else {
                      showMessageOnce('Please fix validation errors', 'error');
                    }
                  }"
                >
                  Save Changes
                </el-button>
                <el-button @click="selectedStudent = null">
                  Cancel
                </el-button>
              </div>
            </el-form>
          </div>
          

          <div v-else class="display-mode">
            <!--  Display Card -->
            <div class="card-header">
              <div class="student-info">
                <div class="student-avatar">
                  <el-avatar :size="60" :src="circleUrl" class="avatar">
                    <i class="el-icon-user-solid"></i>
                  </el-avatar>
                </div>
                <div class="student-details">
                  <h3 class="student-name">
                    {{ student.firstName }}
                    <span v-if="student.middleInitial && student.middleInitial.trim()">
                      {{ student.middleInitial[0] }}.
                    </span>
                    {{ student.lastName }}
                  </h3>
                  <el-tag type="primary" effect="light" class="course-tag">
                    {{ truncateString(student.course, 40) || 'Bachelor in Computer Science' }}
                  </el-tag>
                </div>
              </div>
            </div>

            <div class="card-body">
              <div class="info-grid">
                <div class="info-item">
                  <i class="el-icon-time info-icon"></i>
                  <div class="info-content">
                    <span class="info-label">Age</span>
                    <span class="info-value">{{ student.age }} years</span>
                  </div>
                </div>
                
                <div class="info-item">
                  <i class="el-icon-date info-icon"></i>
                  <div class="info-content">
                    <span class="info-label">Birth Date</span>
                    <span class="info-value">{{ formatDate(student.birthDate) }}</span>
                  </div>
                </div>
                
                <div class="info-item full-width">
                  <i class="el-icon-location info-icon"></i>
                  <div class="info-content">
                    <span class="info-label">Address</span>
                    <span class="info-value">{{ student.address }}</span>
                  </div>
                </div>


                <div class="info-item">
                  <i class="el-icon-date info-icon"></i>
                  <div class="info-content">
                    <span class="info-label">Student ID</span>
                    <span class="info-value">{{ student.id }}</span>
                  </div>
                </div>

              </div>
            </div>


            <div class="card-actions">
              <el-button 
                @click="editStudent(student)" 
                type="info" 
                plain 
                class="action-btn"
                
              >
                Edit
              </el-button>
              <el-button 
                @click="confirmDelete(student.id)" 
                type="danger" 
                plain
                class="action-btn"
                
              >
                Delete
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    
   
    
<!-- Table View -->
<div v-if="viewMode === 'table' && filteredStudents.length" class="table-container">
  <el-form
    ref="tableEditForm"
    :model="selectedStudent"
    :rules="formRules"
    label-position="top"
    class="edit-form"
  >
    <el-table
      v-loading="loading"
      :data="filteredStudents"
      stripe
      border
      class="professional-table"
      :header-cell-style="{ background: '#f8f9fa', color: '#2c3e50', fontWeight: 'bold' }"
    >
      <!-- Avatar Column -->
      <el-table-column label="Avatar" width="80" align="center">
        <template #default>
          <el-avatar :size="40" :src="circleUrl" class="table-avatar">
            <i class="el-icon-user-solid"></i>
          </el-avatar>
        </template>
      </el-table-column>

      <!-- First Name -->
      <el-table-column label="First Name" min-width="120">
        <template #default="{ row }">
          <el-form-item
            v-if="selectedStudent?.id === row.id"
            prop="firstName"
            style="margin: 0"
          >
            <el-input v-if="selectedStudent?.id === row.id" v-model="selectedStudent.firstName" size="small" />
          </el-form-item>
          <span v-else class="table-text">{{ row.firstName }}</span>
        </template>
      </el-table-column>

      <!-- Middle Initial -->
      <el-table-column label="M.N." width="80" align="center">
        <template #default="{ row }">
          <el-form-item
            v-if="selectedStudent?.id === row.id"
            prop="middleInitial"
            style="margin: 0"
          >
            <el-input v-if="selectedStudent?.id === row.id" v-model="selectedStudent.middleInitial" size="small" />
          </el-form-item>
          <span v-else class="table-text">{{ row.middleInitial }}</span>
        </template>
      </el-table-column>

      <!-- Last Name -->
      <el-table-column label="Last Name" min-width="120">
        <template #default="{ row }">
          <el-form-item
            v-if="selectedStudent?.id === row.id"
            prop="lastName"
            style="margin: 0"
          >
            <el-input v-if="selectedStudent?.id === row.id" v-model="selectedStudent.lastName" size="small" />
          </el-form-item>
          <span v-else class="table-text">{{ row.lastName }}</span>
        </template>
      </el-table-column>

      <!-- Course -->
      <el-table-column label="Course" min-width="200">
        <template #default="{ row }">
          <el-form-item
            v-if="selectedStudent?.id === row.id"
            prop="course"
            style="margin: 0"
          >
            <el-select v-if="selectedStudent?.id === row.id" v-model="selectedStudent.course" size="small" style="width: 100%">
              <el-option
                v-for="course in courseOptions"
                :key="course"
                :label="course"
                :value="course"
              />
            </el-select>
          </el-form-item>
          <el-tag v-else type="primary" effect="light" class="course-tag-table">{{ row.course }}</el-tag>
        </template>
      </el-table-column>

      <!-- Age -->
      <el-table-column prop="age" label="Age" width="80" align="center">
        <template #default="{ row }">
          <span class="age-badge">{{ row.age }}</span>
        </template>
      </el-table-column>

      <!-- Birth Date -->
      <el-table-column label="Birth Date" width="180" align="center">
        <template #default="{ row }">
          <el-form-item v-if="selectedStudent?.id === row.id" prop="birthDate" style="margin: 0">
            <el-date-picker
              v-if="selectedStudent?.id === row.id"
              v-model="selectedStudent.birthDate"
              type="date"
              placeholder="Pick a date"
              style="width: 100%"
              :disabled-date="(time) => time.getTime() > Date.now()"
              @change="updateAge"
            />
          </el-form-item>
          <span v-else class="table-text">{{ formatDate(row.birthDate) }}</span>
        </template>
      </el-table-column>

      <!-- Address -->
      <el-table-column label="Address" min-width="200">
        <template #default="{ row }">
          <el-form-item
            v-if="selectedStudent?.id === row.id"
            prop="address"
            style="margin: 0"
          >
            <el-input v-if="selectedStudent?.id === row.id" v-model="selectedStudent.address" size="small" />
          </el-form-item>
          <span v-else class="table-text address-text">{{ row.address }}</span>
        </template>
      </el-table-column>

      <!-- Password -->
      <el-table-column label="Password" min-width="200">
        <template #default="{ row }">
          <el-form-item
            v-if="selectedStudent?.id === row.id"
            prop="password"
            style="margin: 0"
          >
            <el-input
              v-if="selectedStudent?.id === row.id"
              v-model="selectedStudent.password"
              size="small"
              show-password
              text="password"
            />
          </el-form-item>
          <span v-else class="table-text">{{ row.password }}</span>
        </template>
      </el-table-column>

      <!-- Actions -->
      <el-table-column label="Actions" width="160" fixed="right" align="center">
        <template #default="{ row }">
          <div v-if="selectedStudent?.id === row.id" class="table-actions">
            <el-button type="success" size="small" @click="async () => {
                    const isValid = await isTableEditFormValid();
                    if (isValid) {
                      openConfirmDialogTable = true;
                    } else {
                      showMessageOnce('Please fix validation errors', 'error');
                    }
                  }">
              Save
            </el-button>
            <el-button size="small" @click="selectedStudent = null">
              Cancel
            </el-button>
          </div>
          <div v-else class="table-actions">
            <el-button size="small" type="info" plain @click="editStudent(row)">
              Edit
            </el-button>
            <el-button size="small" type="danger" plain @click="confirmDelete(row.id)">
              Delete
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</div>

    <!--  Empty State -->
    <div v-if="!filteredStudents.length" class="empty-state">
      <div class="empty-content">
        <i class="el-icon-s-custom empty-icon"></i>
        <h3 class="empty-title">No Students Found</h3>
        <p class="empty-description">
          {{ searchName || selectedCourse ? 'No students match your current filters.' : 'No student records available.' }}
        </p>
        <el-button 
          v-if="!searchName && !selectedCourse" 
          type="primary" 
          @click="drawer = true"
          class="empty-action"
          
        >
          Add Your First Student
        </el-button>
        <el-button 
          v-else 
          type="info" 
          @click="resetFilters"
          class="empty-action"
          
        >
          Clear Filters
        </el-button>
      </div>
    </div>
    </el-card>
  </div>

  <!--  Drawer -->
  <el-drawer 
    v-model="drawer" 
    :direction="direction" 
    size="drawerSize"
    class="registration-drawer"
  >
    <template #header>
      <div class="drawer-header">
        <h3 class="drawer-title">
          <i class="el-icon-plus"></i>
          Student Registration
        </h3>
        <p class="drawer-subtitle">Add a new student to the system</p>
      </div>
    </template>
    <template #default>
      <div class="drawer-content">
        <Forms />
      </div>
    </template>
  </el-drawer>

  <!-- Edit Drawer -->
  <el-drawer 
    v-model="editDrawerOpen" 
    :direction="direction" 
    size="40%"
    class="edit-drawer"
  >
    <template #header>
      <div class="drawer-header">
        <h3 class="drawer-title">
          <i class="el-icon-edit"></i>
          Edit Student
        </h3>
        <p class="drawer-subtitle">Update student information</p>
      </div>
    </template>
    <template #default>
      <div class="drawer-content" v-if="selectedStudent">
        <el-form
          label-position="top"
          class="edit-form"
          :model="selectedStudent"
          :rules="formRules"
          ref="editDrawerForm"
        >
          <div class="form-row">
            <el-form-item label="First Name" class="form-item" prop="firstName">
              <el-input @input="val => leadingSpaces('firstName', val)" v-model="selectedStudent.firstName" placeholder="First name" />
            </el-form-item>

            <el-form-item
              label="Middle Name"
              class="form-item-small"
              prop="middleInitial"
            >
              <el-input
                @input="val => leadingSpaces('middleInitial', val)"
                v-model="selectedStudent.middleInitial"
                placeholder="Middle name"
                maxlength="30"
              />
            </el-form-item>
          </div>

          <el-form-item label="Last Name" prop="lastName">
            <el-input @input="val => leadingSpaces('lastName', val)" v-model="selectedStudent.lastName" placeholder="Last name" />
          </el-form-item>

          <el-form-item label="Course" prop="course">
            <el-select
              v-model="selectedStudent.course"
              placeholder="Select Course"
              style="width: 100%"
            >
              <el-option
                v-for="option in courseOptions"
                :key="option"
                :label="option"
                :value="option"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Birthday" prop="birthDate">
            <el-date-picker
              v-model="selectedStudent.birthDate"
              type="date"
              placeholder="Pick a date"
              style="width: 100%"
              @change="updateAge"
              :disabled-date="disabledFutureDates"
              :default-value="allowedDate"
            />
          </el-form-item>

          <el-form-item label="Age" prop="age">
            <el-input v-model="selectedStudent.age" :readonly="true" />
          </el-form-item>

          <el-form-item label="Username" prop="username">
            <el-input
              type="text"
              v-model="selectedStudent.username"
              placeholder="Change Username"
              :rows="1"
              show-password
            />
          </el-form-item>

          <el-form-item label="Password" prop="password">
            <el-input
              type="password"
              v-model="selectedStudent.password"
              placeholder="Change Password"
              :rows="1"
              show-password
            />
          </el-form-item>

          <el-form-item label="Address" prop="address">
            <el-input
              type="textarea"
              v-model="selectedStudent.address"
              placeholder="Enter address"
              :rows="3"
            />
          </el-form-item>

              <div class="form-actions">
                <el-button
                  type="success"
                  @click="async () => {
                    const isValid = await isEditFormValid();
                    if (isValid) {
                      openConfirmDialog = true;
                    } else {
                      showMessageOnce('Please fix validation errors', 'error');
                    }
                  }"
                >
                  Save Changes
                </el-button>
            <el-button @click="editDrawerOpen = false; selectedStudent = null">
              Cancel
            </el-button>
          </div>
        </el-form>
      </div>
    </template>
  </el-drawer>

            <!-- Confirmation Modal -->
            <el-dialog
              v-model="openConfirmDialog"
              title="Confirm Save"
              width="300px"
              append-to-body
              :close-on-click-modal="false"
              :close-on-press-escape="false"
              class="confirm-dialog"
              top="22%"
              style="left: 1%"
            >
              <span>Are you sure you want to save these changes?</span>

              <template #footer>
                <div class="dialog-footer">
                  <el-button @click="openConfirmDialog = false">Cancel</el-button>
                  <el-button type="primary" @click="confirmSave">
                    Confirm
                  </el-button>
                </div>
              </template>
            </el-dialog>

            <!-- Confirmation Modal Table-->
            <el-dialog
              v-model="openConfirmDialogTable"
              title="Confirm Save"
              width="300px"
              append-to-body
              :close-on-click-modal="false"
              :close-on-press-escape="false"
              class="confirm-dialog"
              top="22%"
              style="left: 1%"
            >
              <span>Are you sure you want to save these changes?</span>

              <template #footer>
                <div class="dialog-footer">
                  <el-button @click="openConfirmDialogTable = false">Cancel</el-button>
                  <el-button type="primary" @click="confirmSaveTable">
                    Confirm
                  </el-button>
                </div>
              </template>
            </el-dialog>

          
</template>




<script setup lang="ts">
import nba from '@/assets/nba.svg'
import { reactive,ref,onMounted,computed, watch } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { DrawerProps } from 'element-plus'
import { courses } from '@/constants'
import { FormInstance, FormRules, ElButton } from 'element-plus';
import Forms from './Forms.vue';
import { formatDate } from '@/utils'
import { ElNotification as notify } from 'element-plus'
import { Student } from '@/constants'
import { rules } from 'eslint-plugin-vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composable/useAuth'
import { truncateString } from '@/utils/truncate';
import { hasMiddleInitial } from '@/utils/studentUtils';
import { removeLeadingSpaces } from '@/utils/leadingspaces';
import { showMessageOnce } from '@/utils/showMessageOnce'
import {allowedDate, disabledFutureDates} from '@/utils/disableDate'
import { isDuplicateEntry } from '@/utils/DuplicateEntry'

const loading = ref(false)
const { checkAuth, logout } = useAuth()
const courseOptions = courses;
const drawer = ref(false)
const direction = ref<DrawerProps['direction']>('rtl')
const radio1 = ref('Option 1')
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure you want to close this?')
    .then(() => {
      done()
    })
    .catch(() => {
    })
}
const selectedStudent = ref<Student | null>(null)
const isEditing = ref(false)
const students = ref([])
const StudentData = ref<Student[]>([])
const circleUrl = ref(
  'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
)
const router = useRouter()
const totalStudents = computed(() => students.value.length)
const editForm = ref<FormInstance | null>(null)
const editDrawerForm = ref<FormInstance | null>(null)


function cancelClick() {
    drawer.value = false
}
function confirmClick() {
   ElMessageBox.confirm(`Are you confirm to chose ${ radio1.value }`)
   .then(() => {
     drawer.value = false
   })
   .catch(() => {
   })
}

onMounted(() => {

  checkAuth()


  const data = localStorage.getItem('rules')
  try {
    const parsed = data ? JSON.parse(data) : []
    students.value = Array.isArray(parsed) ? parsed : [parsed]
  } catch (err) {
    console.error('Error parsing localStorage:', err)
    students.value = []
  }
})

const onback = () => {
  notify('black')
}


function deleteUser(id: string) {
  const index = students.value.findIndex(student => student.id === id);
  if (index !== -1) {
    students.value.splice(index,1)
    localStorage.setItem('rules',JSON.stringify(students.value))
    console.log(`User ${id} deleted successfully.`)
    setTimeout(() => {window.location.reload()},100)
  } else {
    console.warn(`User ${id} not found.`)
  }
}



const studList = ref<Student[]>([])
const filteredStudents = ref<Student[]>([])


const searchName = ref('')
const selectedCourse = ref<string | null>(null)
const viewMode = ref<'card' | 'table'>('card') 
const editLocation = ref<'card' | 'drawer'>('card')
const editDrawerOpen = ref(false)


function loadStudents() {
  const stored = localStorage.getItem('rules')
  try {
    const parsed = stored ? JSON.parse(stored) : []
    students.value = Array.isArray(parsed) ? parsed : []
    filteredStudents.value = [...students.value]
  } catch (error) {
    console.error('Failed to parse students from localStorage', error)
    students.value = []
    filteredStudents.value = []
  }
}


const applyFilters = () => {
  filteredStudents.value = students.value.filter((student) => {
    const fullName = `${student.firstName} ${student.middleInitial} ${student.lastName}`.toLowerCase()
    const nameMatch = fullName.includes(searchName.value.trim().toLowerCase())
    const courseMatch = selectedCourse.value 
      ? student.course === selectedCourse.value
      : true

    return nameMatch && courseMatch
  })
}

const resetFilters = () => {
  searchName.value = ''
  selectedCourse.value = null
  applyFilters()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}


function editStudent(student: Student) {
  selectedStudent.value = { ...student }
  if (editLocation.value === 'drawer') {
    editDrawerOpen.value = true
  }
}



const saveStudentEdits = async () => {
  if (loading.value) return
  
  // Determine which form to validate based on edit location
  const formRef = editLocation.value === 'drawer' ? editDrawerForm.value : editForm.value
  
  if (!formRef) {
    showMessageOnce('Form not available', 'error')
    return
  }
  
  try {
    const formInstance = Array.isArray(formRef) ? formRef[0] : formRef
    
    if (!formInstance || typeof formInstance.validate !== 'function') {
      throw new Error('Form instance not available')
    }

    const isValid = await new Promise((resolve) => {
      formInstance.validate((valid, fields) => {
        if (valid) {
          resolve(true)
        } else {
          console.log('Validation failed:', fields)
          resolve(false)
        }
      })
    })

    if (!isValid) {
      showMessageOnce('Please fix validation errors','error')
      return 
    }

    // Check for duplicates (excluding current student being edited)
    const currentStudentId = selectedStudent.value.id;
    const tempStudent = { ...selectedStudent.value };
    tempStudent.id = ''; // Temporarily remove ID to check against other students
    
    const isDuplicate = students.value.some(student => 
      student.id !== currentStudentId && 
      student.firstName.toLowerCase() === tempStudent.firstName.toLowerCase() &&
      student.lastName.toLowerCase() === tempStudent.lastName.toLowerCase() &&
      student.middleInitial.toLowerCase() === tempStudent.middleInitial.toLowerCase() &&
      student.birthDate === tempStudent.birthDate
    );
    
    if (isDuplicate) {
      showMessageOnce('Duplicate entry found', 'error');
      return;
    }

    const index = students.value.findIndex(s => s.id === selectedStudent.value.id)

    if (index !== -1) {
      loading.value = true
      console.log('lods')
      students.value[index] = { ...selectedStudent.value }
      localStorage.setItem('rules', JSON.stringify(students.value))
      selectedStudent.value = null
      
      // Close drawer if it's open
      if (editDrawerOpen.value) {
        editDrawerOpen.value = false
      }

      showMessageOnce('Student updated successfully!','success')
      
      setTimeout(() => {
       loading.value = false, window.location.reload()
      }, 1000)
    }

  } catch (error) {
    showMessageOnce('Validation error occurred','error')
    console.log('Validation error:', error)
  }
}

const tableEditForm = ref(null);

const saveTableStudentEdits = async () => {
  if (loading.value) {
    showMessageOnce('Loading in progress', 'error');
    console.log('Loading in progress')
    return;
  }
  
  // For table view, always use tableEditForm
  const formRef = tableEditForm.value;
  
  if (!formRef) {
    showMessageOnce('Form not available', 'error');
    return;
  }
  
  try {
    const formInstance = Array.isArray(formRef) ? formRef[0] : formRef;
    if (!formInstance || typeof formInstance.validate !== 'function') {
      throw new Error('Form instance not available');
    }

    const isValid = await new Promise((resolve) => {
      formInstance.validate((valid, fields) => {
        if (valid) {
          resolve(true);
        } else {
          console.log('Validation failed:', fields);
          resolve(false);
        }
      });
    });

    

    if (!isValid) {
      showMessageOnce('Please fix validation errors', 'error');
      return;
    }

    const index = students.value.findIndex(s => s.id === selectedStudent.value.id);
    if (index !== -1) {
      loading.value = true;
      console.log('lodss')
      students.value[index] = { ...selectedStudent.value };
      localStorage.setItem('rules', JSON.stringify(students.value));
      selectedStudent.value = null;
      
      // Close drawer if it's open
      if (editDrawerOpen.value) {
        editDrawerOpen.value = false
      }

      showMessageOnce('Student updated successfully!', 'success');
      setTimeout(() => {
       loading.value = false, window.location.reload()
      }, 1000)
    }
  } catch (error) {
    showMessageOnce('Validation error occurred', 'error');
    console.log('Validation error:', error);
    loading.value = false;
  }
};






type StringKeysOnly<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

function leadingSpaces(field: StringKeysOnly<Student>, val: string) {
  if (selectedStudent.value) {
    selectedStudent.value[field] = removeLeadingSpaces(val);
  }
}


function confirmDelete(id: string) {
  ElMessageBox.confirm(
    'Are you sure you want to delete this user?',
    'Warning',
    {
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {
      deleteUser(id)
      ElMessage({
        type: 'success',
        message: 'User deleted successfully',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Deletion canceled',
      })
    })
}

function handleLogout() {
   logout()
}

function updateAge(date: string) {
  if (!date) {
    selectedStudent.value.age = 0;
    return;
  }

  const birth = new Date(date);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  selectedStudent.value.age = age;
}

const validateMiddleInitial = (rule, value, callback) => {
  const regex = /^[A-Za-z.]+$/;

  if (!value || value.trim() === '') {
    callback(new Error('Middle name is required'));
    console.log(value)
  } else if (!regex.test(value)) {
    callback(new Error('Only letters and optional periods are allowed'));
    console.log("this is working")
  } else {
    callback();
  }
};


const formRules = {
  firstName: [
    { required: true, message: 'First name is required', trigger: 'blur' },
    {
      pattern: /^[A-Za-z\s'-]+$/,
      message: 'Only letters, spaces, hyphens, and apostrophes allowed',
      trigger: 'blur'
    },
    {min: 2, max: 244, message: 'First name should be at least 2 characters'},
  ],
  middleInitial: [
    {
      pattern: /^[A-Za-z\s'-]+$/,
      message: 'Only letters, spaces, hyphens, and apostrophes allowed',
      trigger: 'blur'
    }
  ],
  lastName: [
    { required: true, message: 'Last name is required', trigger: 'blur', },
    { min: 2, max: 30, message: 'Last name exceeds maximum characters', trigger: 'blur' },
    {
      pattern: /^[A-Za-z\s'-]+$/,
      message: 'Only letters, spaces, hyphens, and apostrophes allowed',
      trigger: 'blur'
    }
  ],
  course: [
    { required: true, message: 'Course is required', trigger: 'change' }
  ],
  birthDate: [
    { required: true, message: 'Birthday is required', trigger: 'change' }
  ],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    {
      min: 6,
      message: 'Password must be at least 8 characters',
      trigger: 'blur'
    },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~])[A-Za-z\d!@#$%^&*()_\-+=<>?{}[\]~]{8,}$/,
      message: 'Use at least 8 characters with a capital letter, number, and symbol.'
    }
  ],
  address: [
    { required: true, message: 'Address is required', trigger: 'blur' },
    {min: 5, max: 100, message: 'Address exceeds maximum inputs', triggers: 'blur'},
  ],
  age: [
    { type: 'number', min: 17, max: 90, message: 'Age must be between 17 and 90', trigger: 'blur' }
  ],
  username: [
    { required: true, message: 'Please enter a username', trigger: 'blur' },
    { min: 3, max: 20, message: 'Username must be between 3 and 20 characters', trigger: 'blur', },
  ]
}

const openConfirmDialog = ref(false)
const openConfirmDialogTable = ref(false)

// Function to validate edit form using existing formRules
const isEditFormValid = async (): Promise<boolean> => {
  // Determine which form to validate based on edit location
  const formRef = editLocation.value === 'drawer' ? editDrawerForm.value : editForm.value
  
  if (!formRef) {
    return false
  }
  
  try {
    const formInstance = Array.isArray(formRef) ? formRef[0] : formRef
    
    if (!formInstance || typeof formInstance.validate !== 'function') {
      return false
    }

    return new Promise((resolve) => {
      formInstance.validate((valid, fields) => {
        if (valid) {
          resolve(true)
        } else {
          console.log('Validation failed:', fields)
          resolve(false)
        }
      })
    })
  } catch (error) {
    console.log('Validation error:', error)
    return false
  }
}

// Function to validate table edit form
const isTableEditFormValid = async (): Promise<boolean> => {
  if (!tableEditForm.value) {
    return false
  }
  
  try {
    const formInstance = Array.isArray(tableEditForm.value) ? tableEditForm.value[0] : tableEditForm.value
    
    if (!formInstance || typeof formInstance.validate !== 'function') {
      return false
    }

    return new Promise((resolve) => {
      formInstance.validate((valid, fields) => {
        if (valid) {
          resolve(true)
        } else {
          console.log('Table validation failed:', fields)
          resolve(false)
        }
      })
    })
  } catch (error) {
    console.log('Table validation error:', error)
    return false
  }
}

function confirmSave() {
  openConfirmDialog.value = false
  saveStudentEdits()
}

function confirmSaveTable() {
  openConfirmDialogTable.value = false
  saveTableStudentEdits()
}




watch([searchName, selectedCourse], applyFilters)

loadStudents()




</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=data_loss_prevention');

/*  Header Styles */
.custom-header {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  box-shadow: 0 4px 20px rgba(52, 152, 219, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 3%;
  max-width: 1400px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  backdrop-filter: blur(10px);
}

.header-text {
  display: flex;
  flex-direction: column;
}

.header-title {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

/* Main Container */
.main-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 3%;
}

/*  Title Section */
.title-section {
  margin: 40px 0;
}

.title-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
}

.title-wrapper {
  flex: 1;
}

.main-title {
  font-size: 48px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  line-height: 1.2;
}

.title-icon {
  font-size: 40px;
  color: #3498db;
}

.title-description {
  font-size: 18px;
  color: #7f8c8d;
  margin: 8px 0 0;
  font-weight: 400;
}

.add-student-btn {
  padding: 20px 32px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(52, 152, 219, 0.3);
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  border: none;
  transition: all 0.3s ease;
}

.add-student-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(52, 152, 219, 0.4);
}

/*  Filters */
.filters-container {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8ecf0;
}

.filters-header {
  margin-bottom: 20px;
}

.filters-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filters-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: end;
}

.filter-item {
  margin-bottom: 0 !important;  
}

.search-input,
.course-select {
  width: 280px;
}

.view-toggle {
  border-radius: 8px;
  overflow: hidden;
}

.edit-location-toggle {
  border-radius: 8px;
  overflow: hidden;
}

.reset-btn {
  border-radius: 8px;
  transition: all 0.3s ease;
}

/* Results Summary */
.results-summary {
  background: #f8f9fa;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  border-left: 4px solid #3498db;
}

.summary-content {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2c3e50;
  font-weight: 500;
}

/*  Card Styles */
.card-container {
  margin-bottom: 40px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.student-card {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e8ecf0;
  transition: all 0.3s ease;
  background: white;
}

.student-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-color: #3498db;
}

.display-mode {
  padding: 0;
}

.card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 20px;
  border-bottom: 1px solid #e8ecf0;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.student-avatar {
  flex-shrink: 0;
}

.avatar {
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.student-details {
  flex: 1;
  min-width: 0;
}

.student-name {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px;
  line-height: 1.3;
}

.course-tag {
  font-size: 12px;
  font-weight: 500;
  border-radius: 6px;
}

.card-body {
  padding: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-icon {
  color: #3498db;
  font-size: 16px;
  margin-top: 2px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.info-label {
  font-size: 12px;
  color: #7f8c8d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
}

.card-actions {
  padding: 16px 20px;
  background: #f8f9fa;
  border-top: 1px solid #e8ecf0;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center; /* This centers the text/icon */
  text-align: center;
  width: 100px; /* Optional: consistent width */
}

/* Edit Mode Styles */
.edit-mode {
  padding: 20px;
}

.edit-header {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e8ecf0;
}

.edit-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-form {
  margin-top: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 80px;
  gap: 10px;
}

.form-item {
  margin-bottom: 16px;
  width: 90%;
}

.form-item-small {
  margin-bottom: 16px;
  width: 119px;
  margin-left: -40px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e8ecf0;
}

/*  Table Styles */
.table-container {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8ecf0;
  margin-bottom: 40px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.professional-table {
  border-radius: 16px;
  min-width: 800px;
}

.table-avatar {
  border: 2px solid #e8ecf0;
}

.table-text {
  color: #2c3e50;
  font-weight: 500;
}

.address-text {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.course-tag-table {
  font-size: 11px;
  font-weight: 500;
}

.age-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.table-actions {
  display: flex;
  gap: 4px;
  justify-content: center;
}

/*  Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8ecf0;
}

.empty-content {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 64px;
  color: #bdc3c7;
  margin-bottom: 20px;
}

.empty-title {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 12px;
}

.empty-description {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0 0 32px;
  line-height: 1.5;
}

.empty-action {
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
}

/*  Drawer */
.registration-drawer,
.edit-drawer {
  border-radius: 16px 0 0 16px;
}

/* Responsive Drawer */
.edit-drawer {
  /* Default for desktop */
  --drawer-width: 40vw;
}

.edit-drawer .el-drawer__body {
  padding: 24px;
}

@media (max-width: 900px) {
  .edit-drawer {
    --drawer-width: 70vw;
  }
}

@media (max-width: 600px) {
  .edit-drawer {
    --drawer-width: 100vw;
  }
  .edit-drawer .el-drawer__body {
    padding: 12px;
  }
}

.edit-drawer .drawer-content {
  padding: 24px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

.drawer-header {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #e8ecf0;
}

.drawer-title {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.drawer-subtitle {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
}

.drawer-content {
  padding: 24px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .title-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  
  .main-title {
    font-size: 32px;
  }
  
  .filters-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input,
  .course-select {
    width: 100%;
  }
  
  .card-grid {
    grid-template-columns: 1fr;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .main-container {
    padding: 0 16px;
  }
  
  .main-title {
    font-size: 28px;
  }
  
  .title-description {
    font-size: 16px;
  }
  
  .add-student-btn {
    padding: 16px 24px;
    font-size: 16px;
  }
}

/* Animation Classes */
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

.student-card {
  animation: fadeInUp 0.3s ease-out;
}

.student-card:nth-child(even) {
  animation-delay: 0.1s;
}

.student-card:nth-child(3n) {
  animation-delay: 0.2s;
}

@media (max-width: 768px) {
  .table-avatar {
    width: 30px !important;
    height: 30px !important;
  }

  .course-tag-table {
    font-size: 12px;
    padding: 2px 6px;
  }

  .age-badge {
    font-size: 12px;
  }

  .table-text, .address-text {
    font-size: 13px;
  }

  .el-button {
    font-size: 12px;
    padding: 4px 8px;
  }

  .el-table .el-table__header,
  .el-table .el-table__body {
    font-size: 12px;
  }

  .el-table-column:nth-child(3),
  .el-table-column:nth-child(7) 
  {
    display: none;
  }
}

@media (max-width: 600px) {
  .student-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .student-avatar {
    margin-bottom: 8px;
  }

  .student-name {
    font-size: 1em;
  }

  .course-tag {
    font-size: 13px;
    padding: 2px 6px;
  }
}

.confirm-dialog .el-dialog {
  max-width: 400px;
  left: 50%;
  transform: translate(-50%, -50%);
  top: 50%;
}


@media (max-width: 375px) {
  .confirm-dialog .el-dialog {
    width: 95%;
    max-width: 95%;
    padding: 16px;
  }

  .confirm-dialog .el-dialog__body {
    font-size: 14px;
  }

  .confirm-dialog .el-dialog__footer {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
}



</style>

