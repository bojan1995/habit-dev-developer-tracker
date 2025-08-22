import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function ResponsiveLayout({ 
  children, 
  className,
  maxWidth = 'xl',
  padding = 'md'
}: ResponsiveLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md', 
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-3 sm:px-4 md:px-6',
    md: 'px-4 sm:px-6 md:px-8 lg:px-12',
    lg: 'px-6 sm:px-8 md:px-12 lg:px-16'
  };

  return (
    <div className={cn(
      'w-full mx-auto',
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

export function ResponsiveGrid({ 
  children, 
  className,
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 'md'
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: 'gap-3 sm:gap-4',
    md: 'gap-4 sm:gap-6 lg:gap-8',
    lg: 'gap-6 sm:gap-8 lg:gap-12'
  };

  const gridClasses = [
    'grid',
    gapClasses[gap]
  ];

  if (cols.xs) gridClasses.push(`grid-cols-${cols.xs}`);
  if (cols.sm) gridClasses.push(`sm:grid-cols-${cols.sm}`);
  if (cols.md) gridClasses.push(`md:grid-cols-${cols.md}`);
  if (cols.lg) gridClasses.push(`lg:grid-cols-${cols.lg}`);
  if (cols.xl) gridClasses.push(`xl:grid-cols-${cols.xl}`);

  return (
    <div className={cn(gridClasses.join(' '), className)}>
      {children}
    </div>
  );
}

interface ResponsiveStackProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'vertical' | 'horizontal-sm' | 'horizontal-md';
  spacing?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end' | 'between';
}

export function ResponsiveStack({
  children,
  className,
  direction = 'vertical',
  spacing = 'md',
  align = 'start',
  justify = 'start'
}: ResponsiveStackProps) {
  const spacingClasses = {
    sm: 'space-y-2 sm:space-y-3 sm:space-x-3',
    md: 'space-y-3 sm:space-y-4 sm:space-x-4',
    lg: 'space-y-4 sm:space-y-6 sm:space-x-6'
  };

  const directionClasses = {
    vertical: 'flex flex-col',
    'horizontal-sm': 'flex flex-col sm:flex-row sm:space-y-0',
    'horizontal-md': 'flex flex-col md:flex-row md:space-y-0'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center', 
    end: 'items-end'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div className={cn(
      directionClasses[direction],
      spacingClasses[spacing],
      alignClasses[align],
      justifyClasses[justify],
      className
    )}>
      {children}
    </div>
  );
}

interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function ResponsiveCard({
  children,
  className,
  padding = 'md',
  hover = true
}: ResponsiveCardProps) {
  const paddingClasses = {
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-5 lg:p-6',
    lg: 'p-5 sm:p-6 lg:p-8'
  };

  return (
    <div className={cn(
      'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm',
      paddingClasses[padding],
      hover && 'transition-all duration-200 hover:shadow-md',
      className
    )}>
      {children}
    </div>
  );
}