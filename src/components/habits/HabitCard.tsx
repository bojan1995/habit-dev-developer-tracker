import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Flame, Calendar, Trash2, Edit, MoreVertical } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import type { HabitWithStats } from '@/types/habit';
import { formatDate } from '@/lib/utils';

interface HabitCardProps {
  habit: HabitWithStats;
  onToggle: (habitId: string) => void;
  onEdit: (habit: HabitWithStats) => void;
  onDelete: (habitId: string) => void;
}

export function HabitCard({ habit, onToggle, onEdit, onDelete }: HabitCardProps) {
  const completionPercentage = Math.round(habit.completion_rate);

  return (
    <motion.div
      layout
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden transition-shadow hover:shadow-medium">
        <div
          className="h-1 w-full"
          style={{ backgroundColor: habit.color }}
        />
        
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onToggle(habit.id)}
                  className="flex-shrink-0"
                >
                  {habit.is_completed_today ? (
                    <CheckCircle2 
                      className="h-6 w-6 text-secondary-600"
                      style={{ color: habit.color }}
                    />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                  )}
                </motion.button>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {habit.name}
                  </h3>
                  {habit.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                      {habit.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Flame className="h-4 w-4" />
                  <span>{habit.current_streak} day{habit.current_streak !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{habit.total_completions} total</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <Badge 
                  variant={habit.target_frequency === 'daily' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {habit.target_frequency}
                </Badge>
                
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {completionPercentage}% this month
                  </p>
                  <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPercentage}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[160px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-medium p-1 z-50"
                  align="end"
                >
                  <DropdownMenu.Item
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer outline-none"
                    onClick={() => onEdit(habit)}
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit habit</span>
                  </DropdownMenu.Item>
                  
                  <DropdownMenu.Item
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md cursor-pointer outline-none"
                    onClick={() => onDelete(habit.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete habit</span>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}