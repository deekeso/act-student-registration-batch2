
<template>
  <!-- form  -->
  
  <el-form ref="ruleFormRef" :rules="rules" :model="ruleForm">
    <h1 v-if="props.confirmpassword">Forgot Password</h1>
    <!-- Username input -->
    <el-form-item prop="username" label-position="top">
      <el-input
        v-model="ruleForm.username"
        placeholder="USERNAME"
        :prefix-icon="User"
        clearable
        auto-complete="off"
      />
    </el-form-item>

    <!-- Password Input -->
    <el-form-item prop="password" label-position="top">
      <el-input
        v-model="ruleForm.password"
        :placeholder="props.confirmpassword ? 'NEW PASSWORD' : 'PASSWORD'"
        :prefix-icon="Suitcase"
        show-password
        clearable
        auto-complete="off"
      />
    </el-form-item>

    <!-- Confirm Password ( only visible when the cofirmation = true) -->
    <el-form-item v-if="props.confirmpassword" prop="confirmpassword" label-position="top">
      <el-input
        v-model="ruleForm.confirmpassword"
        placeholder="CONFIRM PASSWORD"
        :prefix-icon="Suitcase"
        show-password
        clearable
        auto-complete="off"
      />
    </el-form-item>
    <!-- Submit button -->
    <el-button @click="submitForm(ruleFormRef)">
      {{ props.confirmpassword ? 'Save Changes' : 'Login' }}
    </el-button>

     <!-- Forgot Password only for login page -->
    <RouterLink v-if="!props.confirmpassword" to="/forgot-password" class="right-link">Forgot Password</RouterLink>
  </el-form>
</template>

<script lang="ts" setup>

import { reactive, ref, defineProps } from 'vue'

import type { FormInstance, FormRules } from 'element-plus'

import { User, Suitcase } from '@element-plus/icons-vue'

import type { LoginRuleForm } from '@/types'

import { RouterLink } from 'vue-router'

import { useAccount } from '@/stores/account'

//  const { onLogin, onForgotPassword } = useAccount()
const accountStore = useAccount();


// confirmpassword (boolean): Toggles between login and reset password modes
const props = defineProps({
  confirmpassword: {
    type: Boolean,
    default: false,
  },
})

const ruleFormRef = ref<FormInstance>()

// ruleForm - reactive form model with fields: username, password, confirmpassword
const ruleForm = reactive<LoginRuleForm>({
  username: '',
  password: '',
  confirmpassword: '',
})


/* validates the password string security rules.
*  @params { any } rule - The validation rule object.
*  @params { string } value - password string to validate | must have uppercase, number, symbol for password.
*  @params { Function } callback - Callback function to call with error or sucess.
*  @returns {void}
*/
const passwordValidator = (rule: any, value: string, callback: any) => {
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/
  if (!value) {
    return callback(new Error('Password is required.'))
  } else if (!pattern.test(value) && props.confirmpassword) {
    return callback(
      new Error('Password must contain uppercase, lowercase, number, and special character.'),
    )
  }
  return callback()
}


/* validates the confirm password if it matches the password
*  @params { any } rule - The validation rule object.
*  @params { string } value - confirm password string to validate if its matches the 
*  @params { Function } callback - Callback function to call with error or sucess
*  @returns {void}
*/
const matchPassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    return callback(new Error('Password is required.'))
  } else if (value !== ruleForm.password) {
    return callback(new Error('Password and Confirm Password doesnt match'))
  } else {
    return callback() 
  }
}


/**
 * Form validation rules for the login or registration form.
 */
const rules = reactive<FormRules<LoginRuleForm>>({
  // Username must be filled before the form can be submitted
  username: [{ required: true, message: 'username is required', trigger: 'blur' }],

  // Password must be present and pass a strength check via custom validator
  password: [
    { required: true, message: 'password is required', trigger: 'blur' },
    { validator: passwordValidator, trigger: 'blur' },
  ],

  // Confirm password must be present, pass the same complexity rules,
  // and match the original password
  confirmpassword: [
    { required: true, message: 'confirm password is required', trigger: 'blur' },
    { validator: passwordValidator, trigger: 'blur' },
    { validator: matchPassword, trigger: 'blur' },
  ],
})


/**
 * Handles form submission after validating input fields.
 *
 * @param {FormInstance | undefined} formEl - The form instance to validate.
 * If undefined, submission is aborted.
 *
 * Behavior:
 * - If `props.confirmpassword` exists, it triggers the forgot password flow.
 * - Otherwise, it attempts login using the provided credentials.
 */
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl)  { return }

  await formEl.validate((valid, fields) => {
    if (valid) {
      // check if the form have confirmpassword or not
      if (props.confirmpassword) {
        // then it means its for forgot password
        accountStore.onForgotPassword(ruleForm.username, ruleForm.password)
      } else {
        // else go for login
        accountStore.onLogin(ruleForm)
      } 
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style scoped>
/* Base styles for header */
h1{
  margin-bottom: 12px;
  color:white;
}
/*   Base styles for anchor tags  */
a {
  display: inline;
}

/* Form layout and spacing */
form {
  width: 500px;
  padding: 20px;
}

/* Right-aligned link styling */
.right-link {
  margin-bottom: 4px;
  display: flex;
  justify-content: end;
  color: white;
  text-decoration: none;
}
/* element plus button styling */
:deep(.el-button) {
  width: 100%;
  height: 50px;
  margin: 12px 0px;
}

/* element plus input styling */
:deep(.el-input) {
  margin-bottom: 12px;
  --el-input-placeholder-color: #fff;
}

/* element plus input wrapper styling */
:deep(.el-input__wrapper) {
  background-color: transparent;
  color: white;
}

/* element plus input inner styling */
:deep(.el-input__inner) {
  background-color: transparent;
  color: #fff;
  border-radius: 4px;
  height: 50px;
}

/* element plus icon styling */
:deep(.el-input__prefix) {
  font-size: 1rem;
}

/* element plus icon styling */
:deep(.el-input__icon) {
  color: white;
}
</style>
