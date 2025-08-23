// Default values and constants
export const DEFAULT_HABIT_COLOR = '#4F46E5';

export const HABIT_COLORS = [
  '#6366f1', // Primary blue
  '#10b981', // Secondary green
  '#f59e0b', // Accent amber
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#84cc16', // Lime
];

export const ANIMATION_VARIANTS = {
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
};