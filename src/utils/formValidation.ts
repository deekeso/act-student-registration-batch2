import { z } from 'zod'

// Valid characters only (letters, ñ, Ñ, apostrophes, hyphens, and spaces)
const validCharactersRegex = /^[A-Za-zÑñ' -]+$/

// No leading/trailing/consecutive spaces
const noExtraSpacesRegex = /^(?! )[A-Za-zÑñ'-]+(?: [A-Za-zÑñ'-]+)*(?<! )$/

export const formValidation = z.object({
  name: z
    .string()
    .min(6, 'Name is required. Minimum of 6 characters.')
    .refine(
      (value) => value === '' || validCharactersRegex.test(value),
      'Name must only contain letters, spaces, hyphens, and apostrophes.',
    )
    .refine(
      (value) => value === '' || noExtraSpacesRegex.test(value),
      'Name cannot have leading, trailing, or consecutive spaces.',
    ),

  username: z
    .string()
    .min(4, 'Username is required. Minimum of 4 characters.')
    .refine(
      (value) => value === '' || noExtraSpacesRegex.test(value),
      'Username cannot have leading, trailing, or consecutive spaces.',
    ),

  email: z.string().email('Invalid email address'),

  address: z.object({
    street: z
      .string()
      .min(4, 'Street is required. Minimum of 4 characters.')
      .refine(
        (value) => value === '' || validCharactersRegex.test(value),
        'Street must only contain letters, spaces, hyphens, and apostrophes.',
      )
      .refine(
        (value) => value === '' || noExtraSpacesRegex.test(value),
        'Street cannot have leading, trailing, or consecutive spaces.',
      ),

    city: z
      .string()
      .min(4, 'City is required. Minimum of 4 characters.')
      .refine(
        (value) => value === '' || validCharactersRegex.test(value),
        'City must only contain letters, spaces, hyphens, and apostrophes.',
      )
      .refine(
        (value) => value === '' || noExtraSpacesRegex.test(value),
        'City cannot have leading, trailing, or consecutive spaces.',
      ),
  }),
})

export type UserData = z.infer<typeof formValidation>
