<template>
  <!-- Student Form -->
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" @submit.prevent="submitForm(ruleFormRef)">
    <header>
      <!-- Inject Header Here -->
      <slot name="header"></slot>
    </header>
    <!-- Firstname -->
    <el-form-item label="First Name" prop="firstname" label-position="top">
      <el-input
        v-model="ruleForm.firstname"
        placeholder="Enter your first name"
        clearable
        autocomplete="off"
      />
    </el-form-item>
    <!-- Middle Name -->
    <el-form-item label="Middle Name (optional)" prop="middlename" label-position="top">
      <el-input
        v-model.value="ruleForm.middlename"
        placeholder="Enter your middle name"
        clearable
        autocomplete="off"
      />
    </el-form-item>
    <!-- Lastname -->
    <el-form-item label="Last Name" prop="lastname" label-position="top">
      <el-input
        v-model.value="ruleForm.lastname"
        placeholder="Enter your last name"
        clearable
        autocomplete="off"
      />
    </el-form-item>
    <!-- Birthdate -->
    <el-form-item label="Birth Date" prop="birthdate" label-position="top">
      <el-date-picker
        v-model="ruleForm.birthdate"
        type="date"
        placeholder="Select your birth date"
        size="large"
        :disabled-date="disabledDate"
        format="MM/DD/YYYY"
        value-format="MM/DD/YYYY"
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
      <el-select v-model="ruleForm.course" placeholder="Select" size="large" fit-input-width>
        <el-option
          v-for="(course, index) in courses"
          :key="index"
          :label="course"
          :value="course"
        />
      </el-select>
    </el-form-item>
    <!-- Address -->
    <el-form-item label="Address" prop="address" label-position="top" >
       <el-input
        v-model="ruleForm.address"
        type="textarea"
        :rows="4"
        resize="none"
        placeholder="Enter your full address"
        autocomplete="off"
      />
    </el-form-item>
    <!-- Button Group  for (Add, Reset Delete) -->
    <div class="button-group">
      <el-button color="#181818" native-type="submit" :icon="Edit">
        {{ BtnLabel }}
      </el-button>
      <el-button @click="resetForm(ruleFormRef)" type="primary" :icon="Refresh"> Reset </el-button>
      <el-button 
        v-if="props.BtnDelete" type="danger"
        @click="()=>{ confirmDelete(ruleForm.id ?? '')}"
        :icon="Delete"
      >
        Delete
      </el-button>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, defineProps, watch, defineEmits } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { Students, StudentRuleForm } from '@/types'
import { Edit, Delete, Refresh } from '@element-plus/icons-vue'
import { courses } from '@/constants'
import { useStudents } from '@/stores/students'
import { ElMessage, ElMessageBox } from 'element-plus'
import { capitalizeEachWord } from '@/utils/capitalize'
import { useDate } from "@/composables/useDate"

// disable dates
const { disabledDate } = useDate(); 

// functions that handle update / delete / add student records
const { onUpdateStudentInfo, onDeleteStudentInfo, onAddStudents } = useStudents()

const emits = defineEmits(['on-drawer-close'])

// Student form props
interface StudentFormProps {
  student?: Students
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

const ruleForm = reactive<Students>({
  id: '',
  firstname: '',
  middlename: '',
  lastname: '',
  age: 0,
  address: '',
  birthdate: '',
  course: '',
})

// Sync when props.student changes
watch(() => props.student, (newStudent) => {
  if (newStudent) {
    Object.assign(ruleForm, newStudent)
  }
}, { immediate: true })

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


const checkAgeNumber = (rule: string, value: number, callback: (error?: string | Error) => void) => {
  if (!value) {
    return callback(new Error('Age is required'))
  }
  if (value < 18) {
    return callback(new Error('User must be at least 18 years old.'))
  }
  callback()
}


const nameValidator = (rule: string, value: string, callback: (error?: string | Error) => void) => {
  // 1. Allow only letters, hyphens, and spaces
  const validCharsPattern = /^[A-Za-zÑñ\s-]+$/;
  // 2. Ensure clean structure: no multiple/consecutive hyphens or spaces, no leading/trailing hyphens/spaces
  const cleanStructurePattern = /^[A-Za-zÑñ]+(?:[- ][A-Za-zÑñ]+)*$/;
  // if value doesnt exist
  if (!value.trim()) {
    callback(new Error('This field is required.'))
  } else if (!validCharsPattern.test(value.trim())) {
    callback(new Error(`Number and Symbols are not allowed`));
  } else if (!cleanStructurePattern.test(value.trim())) {
    callback(new Error('No leading/trailing or repeated hyphens/spaces allowed.'))
  } else {
    callback()
  }
}


const middleNameValidator = (rule: string, value: string, callback: (error?: string | Error) => void) => {
   const trimmed = value.trim();

  // If it's optional and empty, it's valid — exit cleanly
  if (!trimmed) {
    return callback(); 
  }

  const validCharsPattern = /^[A-Za-zÑñ\s-]+$/;
  const cleanStructurePattern = /^[A-Za-zÑñ]+(?:[- ][A-Za-zÑñ]+)*$/;
  
  if (!validCharsPattern.test(trimmed)) {
    callback(new Error('Number and Symbols are not allowed'));
  } else if (!cleanStructurePattern.test(trimmed)) {
    callback(new Error('No leading/trailing or repeated hyphens/spaces allowed.'));
  } else if(trimmed.length < 2){
    callback(new Error('Invalid Middlename'));
  }
  else {
    callback();
  }


}


const addressValidator = (rule: string, value: string, callback: (error?: string | Error) => void ) => {
  const trimmed = value.trim()
  // Pattern: Only digits (pure number)
  const isOnlyNumbersPattern = /^\d+$/

  // Pattern: Valid characters only (letters, numbers, space, comma, period, hyphen)
  const validCharactersPattern = /^[A-Za-zÑñ0-9\s,.-]+$/

  // Pattern: Repeated spaces or hyphens
  const repeatedHyphenOrSpacePattern = /[\s-]{2,}/

  // Pattern: Starts or ends with punctuation or space
  const leadingOrTrailingPunctuationPattern = /^[,\-.\s]|[,\-.\s]$/

  //  Required field
  if (!trimmed) {
    return callback(new Error('Address is required'))
  }

  //  Should not be only numbers
  if (isOnlyNumbersPattern.test(trimmed)) {
    return callback(new Error('Address cannot be only numbers'))
  }

  //  Invalid characters
  if (!validCharactersPattern.test(trimmed)) {
    return callback(
      new Error('Only letters, numbers, commas, periods, and hyphens are allowed')
    )
  }

  //  Repeated hyphens or spaces
  if (repeatedHyphenOrSpacePattern.test(trimmed)) {
    return callback(
      new Error('No repeated spaces or hyphens allowed in the address')
    )
  }

  //  Starts or ends with space or punctuation
  if (leadingOrTrailingPunctuationPattern.test(trimmed)) {
    return callback(new Error('Address cannot start or end with punctuation or space'))
  }
  callback()
}

// validate the user inputs
const rules = reactive<FormRules<StudentRuleForm>>({
  // firstname validators
  firstname: [
    { required: true, message: 'firstname is required', trigger: 'blur' },
    { min: 2, message: 'firstname is required', trigger: 'blur' },
    { validator: nameValidator, trigger: 'blur' },
  ],
  // middlename validators
  middlename: [
    { required: false, message: 'middlename is required', trigger: 'blur' },
    { validator: middleNameValidator, trigger: 'blur' },
  ],
  // lastname validators
  lastname: [
    { required: true, message: 'lastname is required', trigger: 'blur' },
    { validator: nameValidator, trigger: 'blur' },
  ],
  // age validators
  age: [
    { required: true, message: 'age is required', trigger: 'blur' },
    { validator: checkAgeNumber, trigger: 'blur' },
  ],
  // address validators
  address: [
    { required: true, message: 'address is required', trigger: 'blur' },
    { min: 5, message: 'Invalid address' },
     { validator: addressValidator, trigger: 'blur'}
  ],
  // courses validators
  course: [{ required: true, message: 'course is required', trigger: 'blur' }],
  // birthdate validators
  birthdate: [
    { required: true, message: 'birthdate is required', trigger: 'blur' }, 
   
  ],
  
})

// Lower case the student data
const toUpperCaseFormData = () => {
  return {
    ...ruleForm,
    firstname: capitalizeEachWord(ruleForm.firstname ?? ''),
    middlename: capitalizeEachWord(ruleForm.middlename ?? ''),
    lastname: capitalizeEachWord(ruleForm.lastname ?? ''),
    address: capitalizeEachWord( ruleForm.address ?? '')
  }
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const formCopy = toUpperCaseFormData()
      if (props.OnAdd) {
        onAddStudents(formCopy)
      } else if (!props.OnAdd) {
        onUpdateStudentInfo(formCopy)
        emits('on-drawer-close');
      } else {
        ElMessage.error('Something went wrong')
      }
      formEl.resetFields()
    } else {
      console.log('error submit!', fields)
    }
  })
}


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
      emits("on-drawer-close")
    })
    .catch(() => {
      ElMessage.info('Delete canceled')
    })
}


const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  if(props.student) {
    Object.assign(ruleForm, props.student)
  } else {
     formEl.resetFields()
  }
  ElMessage.success("Form has been reset")
}

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

.button-group{
  margin-top: 10px;
}

@media (max-width: 850px){
  .button-group {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
  }

  :deep(.el-button){
    margin: 4px 0px;
  }
}

</style>
