import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary-600 text-white hover:bg-primary-700',
        secondary:
          'border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100',
        destructive:
          'border-transparent bg-red-600 text-white hover:bg-red-700',
        outline: 'text-gray-950 dark:text-gray-50',
        success:
          'border-transparent bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-100',
        warning:
          'border-transparent bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge: React.FC<BadgeProps> = ({ className, variant, ...props }) => {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
};