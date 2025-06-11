import { z } from 'zod'

// Password validation schema
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')

// Email validation schema
const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required')

// Sign up form schema
export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Sign in form schema
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
})

// Password reset request schema
export const passwordResetRequestSchema = z.object({
  email: emailSchema
})

// Password reset schema
export const passwordResetSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Export types
export type SignUpFormData = z.infer<typeof signUpSchema>
export type SignInFormData = z.infer<typeof signInSchema>
export type PasswordResetRequestData = z.infer<typeof passwordResetRequestSchema>
export type PasswordResetData = z.infer<typeof passwordResetSchema>
