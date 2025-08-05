import { z } from 'zod'

export const formValidation = z.object({
  name: z.string().min(6, 'Name is required'),
  username: z.string().min(4, 'Username is required'),
  email: z.string().email('Invalid email address'),

  address: z.object({
    street: z.string().min(4, 'Street is required'),
    city: z.string().min(4, 'City is required'),
  }),
})

export type UserData = z.infer<typeof formValidation>
