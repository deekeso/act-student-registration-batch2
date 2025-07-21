import {
  validateContactNumber,
  validateLastName,
  validateFirstName,
  validateMiddleName,
  validateStreet,
  validateBarangay,
  validateCity,
  validateProvince,
  validateZipCode,
  validateLandmark,
  validateBirthday
} from './formValidationFunctions'

type ValidatorCallback = (error?: Error) => void;

export const userFormRules = {
  contactNumber: [
    {
      validator: (_rule: string, value: number, callback: ValidatorCallback) => {
        const res = validateContactNumber(value);
        if (res.valid) callback();
        else callback(new Error(res.message));
      },
      trigger: ['blur', 'change'],
    }
  ],
  lastName: [
    {
      validator: (_rule: string, value: string, callback: ValidatorCallback) => {
        const res = validateLastName(value);
        if (res.valid) callback();
        else callback(new Error(res.message));
      },
      trigger: ['blur', 'change'],
    }
  ],
  firstName: [
    {
      validator: (_rule: string, value: string, callback: ValidatorCallback) => {
        const res = validateFirstName(value);
        if (res.valid) callback();
        else callback(new Error(res.message));
      },
      trigger: ['blur', 'change'],
    }
  ],
  middleName: [
    {
      validator: (_rule: string, value: string, callback: ValidatorCallback) => {
        const res = validateMiddleName(value);
        if (res.valid) callback();
        else callback(new Error(res.message));
      },
      trigger: ['blur', 'change'],
    }
  ],
  birthDate: [
    {
      validator: (_rule: string, value: string, callback: ValidatorCallback) => {
        const res = validateBirthday(value);
        if (res.valid) callback();
        else callback(new Error(res.message));
      },
      trigger: ['blur', 'change'],
    }
  ],
  street: [
    {
      validator: (_rule: string, value: string, callback: ValidatorCallback) => {
        const res = validateStreet(value);
        if (res.valid) callback();
        else callback(new Error(res.message));
      },
      trigger: ['blur', 'change'],
    }
  ],
  barangay: [
    {
      validator: (_rule: string, value: string, callback: ValidatorCallback) => {
        const res = validateBarangay(value);
        if (res.valid) callback();
        else callback(new Error(res.message));
      },
      trigger: ['blur', 'change'],
    }
  ],
  city: [
    {
      validator: (_rule: string, value: string, callback: ValidatorCallback) => {
        const res = validateCity(value);
        if (res.valid) callback();
        else callback(new Error(res.message));
      },
      trigger: ['blur', 'change'],
    }
  ],
  province: [
    {
      validator: (_rule: string, value: string, callback: ValidatorCallback) => {
        const res = validateProvince(value);
        if (res.valid) callback();
        else callback(new Error(res.message));
      },
      trigger: ['blur', 'change'],
    }
  ],
  zipCode: [
    {
      validator: (_rule: string, value: string, callback: ValidatorCallback) => {
        // If zipCode validator expects number, convert value here
        const res = validateZipCode(value);
        if (res.valid) callback();
        else callback(new Error(res.message));
      },
      trigger: ['blur', 'change'],
    }
  ],
  landmark: [
    {
      validator: (_rule: string, value: string, callback: ValidatorCallback) => {
        const res = validateLandmark(value);
        if (res.valid) callback();
        else callback(new Error(res.message));
      },
      trigger: ['blur', 'change'],
    }
  ],
};
