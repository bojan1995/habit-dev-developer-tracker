import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Please enter a valid email address');

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number');

export const habitNameSchema = z.string()
  .min(1, 'Habit name is required')
  .max(100, 'Habit name is too long')
  .trim();

export const habitDescriptionSchema = z.string()
  .max(500, 'Description is too long')
  .optional();

export const colorSchema = z.string()
  .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format');

// Form validation schemas
export const authFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const habitFormSchema = z.object({
  name: habitNameSchema,
  description: habitDescriptionSchema,
  target_frequency: z.enum(['daily', 'weekly']),
  color: colorSchema,
});

export type AuthFormData = z.infer<typeof authFormSchema>;
export type HabitFormData = z.infer<typeof habitFormSchema>;