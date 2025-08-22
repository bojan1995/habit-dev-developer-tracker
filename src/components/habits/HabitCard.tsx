import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Flame, Calendar, Trash2, Edit, MoreVertical } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import type { HabitWithStats } from '@/types/habit';

interface HabitCardProps {
  habit: HabitWithStats;
  onToggle: (habitId: string) => void;
  onEdit: (habit: HabitWithStats) => void;
  onDelete: (habitId: string) => void;
  onClick?: (habit: HabitWithStats) => void;
}

export function HabitCard({ habit, onToggle, onEdit, onDelete, onClick }: HabitCardProps) {
  const completionPercentage = Math.round(habit.completion_rate);

  return (
    <motion.div
      layout
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: -20 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 h-full flex flex-col cursor-pointer group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
           onClick={() => onClick?.(habit)}>
        <div
          className="h-1.5 w-full"
          style={{ backgroundColor: habit.color }}
        />
        
        <CardContent className="p-5 sm:p-6 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-start space-x-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(habit.id);
                  }}
                  className="flex-shrink-0 mt-1 min-h-[44px] min-w-[44px] sm:min-h-[auto] sm:min-w-[auto] flex items-center justify-center"
                >
                  {habit.is_completed_today ? (
                    <CheckCircle2 
                      className="h-7 w-7 sm:h-6 sm:w-6 transition-colors"
                      style={{ color: habit.color }}
                    />
                  ) : (
                    <Circle className="h-7 w-7 sm:h-6 sm:w-6 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </motion.button>
                
                <div className="flex-1 min-w-0 space-y-2">
                  <h3 className="text-lg sm:text-base font-bold text-gray-900 dark:text-white leading-tight">
                    {habit.name}
                  </h3>
                  {habit.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                      {habit.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 flex-shrink-0 ml-3 opacity-60 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[160px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-responsive-lg p-1 z-50"
                  align="end"
                >
                  <DropdownMenu.Item
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer outline-none min-h-[44px] sm:min-h-[auto]"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(habit);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit habit</span>
                  </DropdownMenu.Item>
                  
                  <DropdownMenu.Item
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md cursor-pointer outline-none min-h-[44px] sm:min-h-[auto]"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(habit.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete habit</span>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>

          {/* Progress Bar */}
          {habit.total_completions > 0 && (
            <div className="mb-4">
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: habit.color }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                {completionPercentage}% completion rate this month
              </p>
            </div>
          )}

          {/* Stats Section */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1.5">
                <Flame className="h-4 w-4 flex-shrink-0 text-orange-500" />
                <span className="font-medium">{habit.current_streak}</span>
                <span className="text-xs">day{habit.current_streak !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Calendar className="h-4 w-4 flex-shrink-0 text-blue-500" />
                <span className="font-medium">{habit.total_completions}</span>
                <span className="text-xs">total</span>
              </div>
            </div>

            <Badge 
              variant={habit.target_frequency === 'daily' ? 'default' : 'secondary'}
              className="text-xs font-medium px-2.5 py-1"
            >
              {habit.target_frequency}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}