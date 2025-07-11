<template>
  <div class="form-container">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="full-form"
    >
      <el-form-item label="First Name" prop="firstName">
        <el-input @input="val => leadingSpaces('firstName', val)" v-model="ruleForm.firstName" placeholder="Enter your first name" />
      </el-form-item>

      <el-form-item label="Middle Name" prop="middleInitial">
        <el-input @input="val => leadingSpaces('middleInitial', val)" v-model="ruleForm.middleInitial" placeholder="Enter your middle name" />
      </el-form-item>

      <el-form-item label="Last Name" prop="lastName">
        <el-input @input="val => leadingSpaces('lastName', val)" v-model="ruleForm.lastName" placeholder="Enter your last name" />
      </el-form-item>

      <el-form-item label="Username" prop="username">
        <el-input @input="val => leadingSpaces('username', val)" v-model="ruleForm.username" placeholder="Enter your username" />
      </el-form-item>

      <el-form-item label="Birthday" prop="birthDate" required>
        <el-date-picker
          v-model="ruleForm.birthDate"
          type="date"
          placeholder="Select birth date"
          style="width: 100%"
          :disabled-date="disabledFutureDates"
          :default-value="allowedDate"
        />
      </el-form-item>

      <el-form-item label="Age" prop="age">
        <el-input v-model.number="ruleForm.age" type="number" placeholder="Age auto calculated" readonly />
      </el-form-item>

      <el-form-item label="Course" prop="course" required>
        <el-select v-model="ruleForm.course" placeholder="Select a course" style="width: 100%">
          <el-option
            v-for="(course, index) in courseOptions"
            :key="index"
            :label="course"
            :value="course"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Address" prop="address">
        <el-input @input="val => leadingSpaces('address', val)" v-model="ruleForm.address" placeholder="Enter your address" />
      </el-form-item>

      <el-form-item label="Password" prop="password">
        <el-input @input="val => leadingSpaces('password', val)" type="password" v-model="ruleForm.password" placeholder="Enter your password" show-password/>
      </el-form-item>

      <el-form-item>
        <el-button :loading="isSubmitting" :disabled="isSubmitting" type="primary" @click="submitForm(ruleFormRef)" style="width: 100%">
          Submit
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>




<script lang="ts" setup>
import { reactive, ref} from 'vue'
import { FormInstance, FormRules, ElButton } from 'element-plus';
import { courses } from '@/constants'
import { ElMessage } from 'element-plus'
import { watch } from 'vue'
import { removeLeadingSpaces } from '@/utils/leadingspaces';
import { disabledFutureDates } from '@/utils/disableDate';
import { allowedDate } from '@/utils/disableDate';
import { isDuplicateEntry } from '@/utils/DuplicateEntry';
import { showMessageOnce } from '@/utils/showMessageOnce';

interface RuleForm {
    username: string
    password: string
    firstName: string
    middleInitial: string
    lastName: string
    birthDate: string
    age: number;
    address: string
    course: string
    id: string
}

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  username: '',
  password: '',
  firstName: '',
  middleInitial: '',
  lastName: '',
  birthDate: '',
  age: 0,
  address: '',
  course: '',
  id: ''
})

const rules = {
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
const isSubmitting = ref(false)
const courseOptions = courses;
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl || isSubmitting.value ) return;

  


  isSubmitting.value = true;



  await formEl.validate((valid, fields) => {
    console.log('Validation result:', valid);
    console.log('Validation fields:', fields);
    console.log('Form data:', ruleForm);
    
    if (valid) {
      console.log('Form is valid, checking for duplicates...');
      const isDuplicate = isDuplicateEntry(ruleForm);
      console.log('Is duplicate:', isDuplicate);
      
      if(isDuplicate) {
        console.log('Duplicate found, stopping submission');
        showMessageOnce('Duplicate entry found', 'error');
        isSubmitting.value = false;
        return;
      }
      
      console.log('No duplicates, proceeding with save...');

      const existing = localStorage.getItem('rules');
      let users = [];
   
      try {
        const parsed = existing ? JSON.parse(existing) : [];
        users = Array.isArray(parsed) ? parsed : [parsed];
      } catch (error) {
        console.error('Invalid JSON in localStorage', error);
        users = [];
      }

      // Generate formatted student number ID
      const now = new Date();
      const year = now.getFullYear().toString().slice(2); // e.g., '24'
      const month = String(now.getMonth() + 1).padStart(2, '0'); // '06'
      const day = String(now.getDate()).padStart(2, '0'); // '24'
      const randomDigits = Math.floor(1000 + Math.random() * 9000); // '1234'

      ruleForm.id = `STU-${year}${month}${day}-${randomDigits}`; // e.g., STU-240624-1234

      users.push({ ...ruleForm });

      localStorage.setItem('rules', JSON.stringify(users));

      ElMessage.success('User registered successfully!');

   

    } else {
      console.log('Form validation failed', fields);
      isSubmitting.value = false
    }
  });
};


function leadingSpaces(field: keyof typeof ruleForm, val: string) {
  (ruleForm[field] as string)= removeLeadingSpaces(val)
}

watch(
  () => ruleForm.birthDate,
  (newDate) => {
    if (newDate) {
    const birth = new Date(newDate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    ruleForm.age = age
  } else {
    ruleForm.age = null
  }
  }
  )


</script>


<style>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/BG.png');
  background-color: #244BC5;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
}

.form-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 24px;
  height: 50%;
  width: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  margin-bottom: auto;
}

.full-form {
  width: 100%;
  padding: 0 16px;
  box-sizing: border-box;
}

.full-form .el-form-item{
  margin-bottom: 30px;
}


</style>
