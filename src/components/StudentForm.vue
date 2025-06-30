<template>
  <!-- Student Form -->
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
    <header>
      <!-- Inject Header Here -->
      <slot name="header"></slot>
    </header>

    <!-- Firstname -->
    <el-form-item label="Firstname" prop="firstname" label-position="top">
      <el-input
        v-model="ruleForm.firstname"
        placeholder="Enter your firstname"
        clearable
        autocomplete="off"
      />
    </el-form-item>

    <!-- Middle Name -->
    <el-form-item label="Middlename" prop="middlename" label-position="top">
      <el-input
        v-model.value="ruleForm.middlename"
        placeholder="Enter your middle name"
        clearable
        autocomplete="off"
      />
    </el-form-item>


    <!-- Lastname -->
    <el-form-item label="Lastname" prop="lastname" label-position="top">
      <el-input
        v-model.value="ruleForm.lastname"
        placeholder="Enter your last name"
        clearable
        autocomplete="off"
      />
    </el-form-item>

    <!-- Birthdate -->
    <el-form-item label="Birthdate" prop="birthdate" label-position="top">
      <el-date-picker
        v-model="ruleForm.birthdate"
        type="date"
        placeholder="Select your birthdate"
        size="large"
      />
    </el-form-item>

    <!-- Age -->
    <el-form-item label="Age" prop="age" label-position="top">
      <el-input
        type="number"
        readonly
        v-model="ruleForm.age"
        placeholder="Enter your age"
        clearable
        autocomplete="off"
      />
    </el-form-item>

    <!-- Course -->
    <el-form-item label="Course" prop="course" label-position="top">
      <el-select v-model="ruleForm.course" placeholder="Select" size="large">
        <el-option
          v-for="(course, index) in courses"
          :key="index"
          :label="course"
          :value="course"
        />
      </el-select>
    </el-form-item>

    <!-- Address -->
    <el-form-item label="Address" prop="address" label-position="top">
      <el-input
        v-model="ruleForm.address"
        placeholder="Enter your full address"
        clearable
        autocomplete="off"
      />
    </el-form-item>

    <!-- Button Group  for (Add, Reset Delete) -->
    <div class="button-group">
      <el-button color="#181818" @click="submitForm(ruleFormRef)" :icon="Edit">
        {{ BtnLabel }}
      </el-button>
      <el-button @click="resetForm(ruleFormRef)" type="primary" :icon="Refresh"> Reset </el-button>
      <el-button 
        v-if="props.BtnDelete" type="danger"
        @click=" () => { confirmDelete(ruleForm.id)}"
        :icon="Delete"
      >
        Delete
      </el-button>
      
    </div>

  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, defineProps, watch, onUpdated } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { Users, UsersRuleForm } from '@/types'
import { Edit, Delete, Refresh } from '@element-plus/icons-vue'
import { courses } from '@/constants'
import { useStudents } from '@/stores/students'
import { ElMessage, ElMessageBox } from 'element-plus'
import { capitalize } from '@/utils/capitalize'

// functions that handle update / delete / add student records
const { onUpdateStudentInfo, onDeleteStudentInfo, onAddStudents } = useStudents()


// Student form props
interface StudentFormProps {
  id: string
  firstname: string
  middlename: string
  lastname: string
  birthdate: string
  age: number
  address: string
  course: string
  BtnDelete?: boolean
  BtnLabel?: string
  OnAdd?: boolean
}

// set default value on props for BtnDelete/BtnLabel/OnAdd
const props = withDefaults(defineProps<StudentFormProps>(), {
  BtnDelete: true,
  BtnLabel: 'Save Changes',
  OnAdd: false,
})


// Reference to the form instance used for validation and submission
const ruleFormRef = ref<FormInstance>()

/*   
*   form models bound to the student form fields.
*   Initialized with props passed to the component.
*/ 
const ruleForm = reactive<Users>({
  id: props.id,
  firstname: capitalize(props.firstname),
  middlename: capitalize(props.middlename) ,
  lastname: capitalize(JSON.parse(JSON.stringify(props.lastname))),
  age: Number(props.age),
  address: props.address,
  birthdate: props.birthdate,
  course: props.course,
})

// Watches the student's birthdate and automatically calculates age.
// Updates the `formData.age` field whenever `formData.birthdate` changes.
watch(
  () => ruleForm.birthdate, // track the user input for birthdate
  (newVal) => {
    if (newVal) {
      const birthDate = new Date(newVal)
      const today = new Date()
      let calculatedAge  = today.getFullYear() - birthDate.getFullYear()
      const monthDifference  = today.getMonth() - birthDate.getMonth()
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge --
      }
      ruleForm.age = calculatedAge 
    } else {
      ruleForm.age = 0 // Reset age if birthdate is cleared
    }
  },
)

/**
 * custom validator to check if the age is valid.
 * @param {any} rule - Validation rule object
 * @param {number} value - The value of the age field to validate
 * @param {any} callback - Function to call with validation result (error or success)
 */
const checkAgeNumber = (rule: any, value: number, callback: any) => {
  if (!value) {
    return callback(new Error('Age is required'))
  }
  if (value < 18) {
    return callback(new Error('User must be at least 18 years old.'))
  }
  callback()
}

/**  
 * Custom validator to check for only letters, spaces, hyphens, and apostrophes
 * @param {any} rule - Validation rule object
 * @param {any} value - The value of the names field to validate if they have
 * @param {any} callback - Function to call with validation result (error or success)
 */
const nameValidator = (rule: any, value: string, callback: any) => {
  const pattern = /^[a-zA-Z\s'-]+$/
  // if value doesnt exist
  if (!value) {
    callback(new Error('This field is required.'))
  } else if (!pattern.test(value)) {
    // else if the password has numbers / symbols
    callback(new Error('Only letters, spaces, hyphens, and apostrophes are allowed.'))
  } else {
    callback()
  }
}

// validate the user inputs
const rules = reactive<FormRules<UsersRuleForm>>({
  // firstname validators
  firstname: [
    { required: true, message: 'firstname is required', trigger: 'blur' },
    { min: 2, message: 'firstname is required', trigger: 'blur' },
    { validator: nameValidator, message: 'Numbers and Specials are not allowed', trigger: 'blur' },
  ],
  // middlename validators
  middlename: [
    { required: true, message: 'middlename is required', trigger: 'blur' },
    { validator: nameValidator, message: 'Numbers and Specials are not allowed', trigger: 'blur' },
  ],
  // lastname validators
  lastname: [
    { required: true, message: 'lastname is required', trigger: 'blur' },
    { validator: nameValidator, message: 'Numbers and Specials are not allowed', trigger: 'blur' },
  ],
  // age validators
  age: [
    { required: true, message: 'age is required', trigger: 'blur' },
    { required: true, validator: checkAgeNumber, trigger: 'blur' },
  ],
  // address validators
  address: [
    { required: true, message: 'address is required', trigger: 'blur' },
    { min: 5, message: 'Invalid address' },
  ],
  // courses validators
  course: [{ required: true, message: 'course is required', trigger: 'blur' }],
  // birthdate validators
  birthdate: [{ required: true, message: 'birthdate is required', trigger: 'blur' }],
})

// Lower case the student data
const toLowerCaseFormData = () => {
  return {
    ...ruleForm,
    firstname: ruleForm.firstname.toLowerCase().trim(),
    middlename: ruleForm.middlename.toLowerCase().trim(),
    lastname: ruleForm.lastname.toLowerCase().trim(),
    address: ruleForm.address.toLowerCase().trim(),
  }
}


/**
 *  handle form submit toggles between add students or update students
 * @param {any} formEl:FormInstance|undefined
 * @returns {any}
 */
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    
    if (valid) {
      const formCopy = toLowerCaseFormData()
      if (props.OnAdd) {
        onAddStudents(formCopy)
      } else if (!props.OnAdd) {
        onUpdateStudentInfo(formCopy)
      } else {
        ElMessage.error('Something went wrong')
      }
      formEl.resetFields()
    } else {
      console.log('error submit!', fields)
    }
  })
}



/**
 *  Message box for confirmation of deletetion of student record
 * @param {any} id:string
 * @returns {any}
 */
const confirmDelete = (id: string) => {
  ElMessageBox.confirm(
    'This action will permanently delete the student record. Continue?',
    'Warning',
    {
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      type: 'warning',
    },
  )
    .then(() => {
      onDeleteStudentInfo(id)
    })
    .catch(() => {
      ElMessage.info('Delete canceled')
    })
}


/**
 * Reset all the user inputs
 * @param {any} formEl:FormInstance|undefined
 * @returns {any}
 */
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  ElMessage.success("Form has been reset")
}
onUpdated(()=> {
  Object.assign(ruleForm, props)
})
</script>

<style scoped>

:deep(.el-select) {
  width: 100%;
}
.form-group {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 5px;
}

.form-group > * {
  width: 100%;
}

:deep(.el-date-editor) {
  --el-date-editor-width: 100%;
}
h2 {
  margin-bottom: 12px;
}

:deep(.el-input__wrapper) {
  width: 100%;
  padding: 5px;
}
:deep(.el-button) {
  padding: 20px;
}

.form {
  display: flex;
  flex-direction: column;
}

.form-control {
  padding: 4px;
}

@media (max-width: 850px){
  .button-group {
    display: flex;
    flex-direction: column;
  }

  :deep(.el-button){
    margin: 4px 0px;
  }
}

</style>
