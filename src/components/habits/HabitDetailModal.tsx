import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Calendar, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import type { HabitWithStats } from '@/types/habit';
import { formatDate } from '@/lib/utils';

interface HabitDetailModalProps {
  habit: HabitWithStats | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (habit: HabitWithStats) => void;
  onDelete: () => Promise<void>;
}

export function HabitDetailModal({ 
  habit, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete 
}: HabitDetailModalProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  if (!habit) return null;

  const completionPercentage = Math.round(habit.completion_rate);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      setIsDeleteModalOpen(false);
      onClose();
    } catch (error) {
      console.error('Failed to delete habit:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed inset-4 sm:inset-8 md:inset-16 lg:inset-20 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div 
                className="h-2 w-full"
                style={{ backgroundColor: habit.color }}
              />
              
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: habit.color }}
                  />
                  
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {habit.name}
                    </h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge 
                        variant={habit.target_frequency === 'daily' ? 'default' : 'secondary'}
                      >
                        {habit.target_frequency}
                      </Badge>
                      {habit.is_completed_today && (
                        <Badge variant="success" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          ✓ Completed Today
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={onClose}
                  className="h-10 w-10"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="space-y-6">
                  {/* Description */}
                  {habit.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <Target className="h-5 w-5 mr-2" />
                        Description
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        {habit.description}
                      </p>
                    </div>
                  )}
                  
                  {/* Progress */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Progress This Month
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Completion Rate</span>
                        <span className="text-2xl font-bold" style={{ color: habit.color }}>
                          {completionPercentage}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
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
                  
                  {/* Stats Grid */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Statistics
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                        <Flame className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {habit.current_streak}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Current Streak
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                        <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {habit.total_completions}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Total Completions
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                        <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {habit.longest_streak}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Longest Streak
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formatDate(habit.created_at)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Created
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    onClick={() => {
                      onEdit(habit);
                      onClose();
                    }}
                    className="flex-1"
                    variant="outline"
                  >
                    Edit Habit
                  </Button>
                  
                  <Button
                    onClick={handleDeleteClick}
                    className="flex-1"
                    variant="destructive"
                  >
                    Delete Habit
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Delete Confirmation Modal */}
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            title="Delete Habit"
            description={`Are you sure you want to delete "${habit.name}"? This action cannot be undone and you will lose all progress data for this habit.`}
            confirmText="Delete Habit"
            cancelText="Keep Habit"
            variant="danger"
            isLoading={isDeleting}
          />
        </>
      )}
    </AnimatePresence>
  );
}