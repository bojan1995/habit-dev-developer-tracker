import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/Dialog';
import { sanitizeInput } from '../../lib/utils';
import type { HabitWithStats, CreateHabitData, UpdateHabitData } from '../../types/habit';

const habitSchema = z.object({
  name: z.string()
    .min(1, 'Habit name is required')
    .max(100, 'Habit name is too long')
    .transform(sanitizeInput),
  description: z.string()
    .max(500, 'Description is too long')
    .optional()
    .transform(val => val ? sanitizeInput(val) : undefined),
  target_frequency: z.enum(['daily', 'weekly']),
  color: z.string().min(1, 'Please select a color'),
});

type HabitFormData = z.infer<typeof habitSchema>;

const HABIT_COLORS = [
  '#6366f1', // Primary blue
  '#10b981', // Secondary green
  '#f59e0b', // Accent amber
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#ec4899', // Pink
];

interface HabitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateHabitData | UpdateHabitData) => Promise<{ error?: string }>;
  habit?: HabitWithStats | null;
}

export function HabitForm({ isOpen, onClose, onSubmit, habit }: HabitFormProps) {
  const isEditing = Boolean(habit);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: '',
      description: '',
      target_frequency: 'daily',
      color: HABIT_COLORS[0],
    },
  });

  // Update form when habit prop changes (for editing)
  useEffect(() => {
    if (habit) {
      setValue('name', habit.name || '');
      setValue('description', habit.description || '');
      setValue('target_frequency', habit.target_frequency || 'daily');
      setValue('color', habit.color || HABIT_COLORS[0]);
    } else {
      reset({
        name: '',
        description: '',
        target_frequency: 'daily',
        color: HABIT_COLORS[0],
      });
    }
  }, [habit, setValue, reset]);

  const selectedColor = watch('color');

  const handleFormSubmit = async (data: HabitFormData) => {
    const result = await onSubmit(data);
    if (!result.error) {
      reset();
      onClose();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Edit className="h-5 w-5" />
                <span>Edit Habit</span>
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                <span>Create New Habit</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update your habit details below.'
              : 'Add a new micro-habit to track your developer growth.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-responsive-sm font-medium text-gray-900 dark:text-gray-100">
              Habit Name *
            </label>
            <Input
              id="name"
              placeholder="e.g., Write 100 lines of code"
              className="h-11 sm:h-10"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-responsive-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-responsive-sm font-medium text-gray-900 dark:text-gray-100">
              Description (Optional)
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="e.g., Focus on clean, well-documented code that follows best practices"
              className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-responsive-sm text-gray-900 ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:ring-offset-gray-900 dark:placeholder:text-gray-400 resize-none min-h-[80px]"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-responsive-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="target_frequency" className="text-responsive-sm font-medium text-gray-900 dark:text-gray-100">
              Target Frequency *
            </label>
            <Select
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
              ]}
              className="h-11 sm:h-10"
              {...register('target_frequency')}
            />
            {errors.target_frequency && (
              <p className="text-responsive-sm text-red-600 dark:text-red-400">{errors.target_frequency.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-responsive-sm font-medium text-gray-900 dark:text-gray-100">
              Color Theme *
            </label>
            <div className="grid grid-cols-4 xs:grid-cols-6 sm:grid-cols-8 gap-2 sm:gap-3">
              {HABIT_COLORS.map((color) => (
                <motion.button
                  key={color}
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 sm:w-8 sm:h-8 rounded-full border-2 transition-all min-h-[44px] sm:min-h-[auto] ${
                    selectedColor === color
                      ? 'border-gray-400 ring-2 ring-primary-500 ring-offset-2 dark:border-gray-300 dark:ring-offset-gray-800'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setValue('color', color)}
                />
              ))}
            </div>
            {errors.color && (
              <p className="text-responsive-sm text-red-600 dark:text-red-400">{errors.color.message}</p>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto min-h-[44px] sm:min-h-[40px] order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto min-w-[100px] min-h-[44px] sm:min-h-[40px] order-1 sm:order-2"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  {isEditing ? 'Update' : 'Create'} Habit
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}