/**
 * { username: string, password: string, confirmpassword?: string }
*/
interface Credentials {
  username: string
  password: string
  confirmpassword?: string
}

interface LoginRuleForm {
  username: string
  password: string
  confirmpassword?: string
}

interface Users {
  id: string
  firstname: string
  middlename: string
  lastname: string
  birthdate: string
  age: number
  address: string
  course: string
}

interface UsersRuleForm {
  firstname: string
  middlename?: string
  lastname: string
  birthdate: string
  age: number
  address: string
  course: string
}

export type { Credentials, LoginRuleForm, Users, UsersRuleForm }
