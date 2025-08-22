import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { HabitCard } from './HabitCard';
import { HabitForm } from './HabitForm';
import { HabitDetailModal } from './HabitDetailModal';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { useHabits } from '@/hooks/useHabits';
import type { HabitWithStats, CreateHabitData, UpdateHabitData } from '@/types/habit';

export function HabitList() {
  const { habits, loading, createHabit, updateHabit, deleteHabit, toggleHabitCompletion } = useHabits();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitWithStats | null>(null);
  const [selectedHabit, setSelectedHabit] = useState<HabitWithStats | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<HabitWithStats | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  // Memoized filtered habits for performance
  const filteredHabits = useMemo(() => {
    return habits.filter(habit => {
      const matchesSearch = habit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           habit.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterBy === 'all' || 
                           (filterBy === 'completed' && habit.is_completed_today) ||
                           (filterBy === 'pending' && !habit.is_completed_today) ||
                           (filterBy === 'daily' && habit.target_frequency === 'daily') ||
                           (filterBy === 'weekly' && habit.target_frequency === 'weekly');
      
      return matchesSearch && matchesFilter;
    });
  }, [habits, searchTerm, filterBy]);

  // Memoized habit counts for performance
  const habitCounts = useMemo(() => ({
    total: habits.length,
    completed: habits.filter(h => h.is_completed_today).length,
    pending: habits.filter(h => !h.is_completed_today).length,
    daily: habits.filter(h => h.target_frequency === 'daily').length,
    weekly: habits.filter(h => h.target_frequency === 'weekly').length,
  }), [habits]);

  const handleCreateHabit = async (data: CreateHabitData | UpdateHabitData) => {
    const result = await createHabit(data as CreateHabitData);
    return { error: result?.error || undefined };
  };

  const handleUpdateHabit = async (data: CreateHabitData | UpdateHabitData) => {
    if (!editingHabit) return { error: 'No habit selected for editing' };
    const result = await updateHabit(editingHabit.id, data as UpdateHabitData);
    return { error: result?.error || undefined };
  };

  const handleCardClick = (habit: HabitWithStats) => {
    setSelectedHabit(habit);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setSelectedHabit(null);
    setIsDetailModalOpen(false);
  };

  const handleEditFromModal = (habit: HabitWithStats) => {
    setEditingHabit(habit);
    setIsFormOpen(true);
  };

  const handleEdit = (habit: HabitWithStats) => {
    setEditingHabit(habit);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (habit: HabitWithStats) => {
    setHabitToDelete(habit);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!habitToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteHabit(habitToDelete.id);
      setIsDeleteModalOpen(false);
      setHabitToDelete(null);
    } catch (error) {
      console.error('Failed to delete habit:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setHabitToDelete(null);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingHabit(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 relative overflow-hidden">
              <div className="absolute inset-0 animate-shimmer" />
            </div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-64 relative overflow-hidden">
              <div className="absolute inset-0 animate-shimmer" />
            </div>
          </div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-32 relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer" />
          </div>
        </div>
        
        {/* Search and Filter Skeleton */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex-1 max-w-md relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer" />
          </div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg sm:w-48 relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer" />
          </div>
        </div>
        
        {/* Quick Actions Skeleton */}
        <div className="flex flex-wrap gap-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer" />
          </div>
          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-md w-28 relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer" />
          </div>
          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-md w-32 relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer" />
          </div>
          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-md w-24 relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer" />
          </div>
        </div>
        
        {/* Habits Grid Skeleton */}
        <div className="flex justify-center">
          <div className="w-full max-w-[800px] px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                  {/* Color bar */}
                  <div className="h-1.5 bg-gray-300 dark:bg-gray-600 relative overflow-hidden">
                    <div className="absolute inset-0 animate-shimmer" />
                  </div>
                  
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Header with checkbox and title */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="h-7 w-7 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 relative overflow-hidden">
                          <div className="absolute inset-0 animate-shimmer" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full relative overflow-hidden">
                            <div className="absolute inset-0 animate-shimmer" />
                          </div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 relative overflow-hidden">
                            <div className="absolute inset-0 animate-shimmer" />
                          </div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 relative overflow-hidden">
                            <div className="absolute inset-0 animate-shimmer" />
                          </div>
                        </div>
                      </div>
                      <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded ml-3 relative overflow-hidden">
                        <div className="absolute inset-0 animate-shimmer" />
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full relative overflow-hidden">
                        <div className="absolute inset-0 animate-shimmer" />
                      </div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto relative overflow-hidden">
                        <div className="absolute inset-0 animate-shimmer" />
                      </div>
                    </div>
                    
                    {/* Stats footer */}
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1.5">
                            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
                              <div className="absolute inset-0 animate-shimmer" />
                            </div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8 relative overflow-hidden">
                              <div className="absolute inset-0 animate-shimmer" />
                            </div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-10 relative overflow-hidden">
                              <div className="absolute inset-0 animate-shimmer" />
                            </div>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
                              <div className="absolute inset-0 animate-shimmer" />
                            </div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-6 relative overflow-hidden">
                              <div className="absolute inset-0 animate-shimmer" />
                            </div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8 relative overflow-hidden">
                              <div className="absolute inset-0 animate-shimmer" />
                            </div>
                          </div>
                        </div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-12 relative overflow-hidden">
                          <div className="absolute inset-0 animate-shimmer" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Your Habits
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>
            {filteredHabits.length} of {habitCounts.total} habits
          </span>
          {searchTerm && (
            <span className="text-primary-600 dark:text-primary-400">
              • matching "{searchTerm}"
            </span>
          )}
          {filterBy !== 'all' && (
            <span className="text-primary-600 dark:text-primary-400">
              • {filterBy === 'completed' ? 'completed today' : filterBy === 'pending' ? 'pending today' : filterBy === 'daily' ? 'daily habits' : 'weekly habits'}
            </span>
          )}
        </div>
      </div>

      {/* Search and Filter Controls with New Habit Button */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
          <Input
            placeholder="Search habits by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && searchTerm) {
                setSearchTerm('');
              }
            }}
            className="pl-11 pr-10 py-2 text-sm h-10 w-full border border-gray-200 dark:border-gray-700 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            aria-label="Search habits"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded z-10"
              aria-label="Clear search"
              title="Clear search (or press Escape)"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="sm:w-48">
          <Select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            options={[
              { value: 'all', label: `All habits (${habitCounts.total})` },
              { value: 'completed', label: `Completed today (${habitCounts.completed})` },
              { value: 'pending', label: `Pending today (${habitCounts.pending})` },
              { value: 'daily', label: `Daily habits (${habitCounts.daily})` },
              { value: 'weekly', label: `Weekly habits (${habitCounts.weekly})` },
            ]}
            className="text-sm h-10 w-full border border-gray-200 dark:border-gray-700 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            aria-label="Filter habits"
          />
        </div>
        
        <Button 
          onClick={() => setIsFormOpen(true)} 
          className="btn-responsive px-4 py-2 h-10 text-sm flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white whitespace-nowrap"
        >
          <Plus className="h-4 w-4 flex-shrink-0" />
          <span>New Habit</span>
        </Button>
      </div>

      {/* Quick Actions Bar */}
      {habitCounts.total > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium">Quick filters:</span>
          <button 
            onClick={() => {setFilterBy('pending'); setSearchTerm('');}}
            className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-900/40 transition-colors font-medium"
            aria-label="Show pending habits"
          >
            📋 Pending ({habitCounts.pending})
          </button>
          <button 
            onClick={() => {setFilterBy('completed'); setSearchTerm('');}}
            className="px-3 py-1.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors font-medium"
            aria-label="Show completed habits"
          >
            ✅ Completed ({habitCounts.completed})
          </button>
          <button 
            onClick={() => {setFilterBy('all'); setSearchTerm('');}}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
            aria-label="Clear all filters"
          >
            🔄 Clear filters
          </button>
        </div>
      )}

      {/* Habits Grid - Centered with 800px width */}
      {filteredHabits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8 sm:py-12"
        >
          <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            {searchTerm || filterBy !== 'all' ? (
              <Search className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
            ) : (
              <Plus className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
            )}
          </div>
          
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {searchTerm || filterBy !== 'all' ? 'No habits found' : 'Start your journey!'}
          </h3>
          
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed">
            {searchTerm || filterBy !== 'all'
              ? 'Try adjusting your search or filter criteria to find the habits you\'re looking for.'
              : 'Build better developer habits one small step at a time. Small consistent actions lead to extraordinary results.'}
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {searchTerm || filterBy !== 'all' ? (
              <>
                <Button 
                  onClick={() => {setSearchTerm(''); setFilterBy('all');}}
                  variant="outline"
                  className="btn-responsive px-4 py-2 h-10 text-sm flex items-center gap-2"
                >
                  🔄 Clear filters
                </Button>
                {habitCounts.total === 0 && (
                  <Button 
                    onClick={() => setIsFormOpen(true)}
                    className="btn-responsive px-6 py-2 h-10 text-sm flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">Create Your First Habit</span>
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button 
                  onClick={() => setIsFormOpen(true)}
                  className="btn-responsive px-6 py-2 h-10 text-sm flex items-center gap-2"
                >
                  <Plus className="h-4 w-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">Create Your First Habit</span>
                </Button>
                
                {/* Helpful Tips */}
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 max-w-md">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                    💡 Pro Tips for Success:
                  </h4>
                  <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 text-left">
                    <li>• Start with just 1-2 simple habits</li>
                    <li>• Make them so easy you can't say no</li>
                    <li>• Be consistent, not perfect</li>
                    <li>• Track daily for best results</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="flex justify-center">
          <div className="w-full max-w-[800px] px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <AnimatePresence mode="popLayout">
                {filteredHabits.map((habit, index) => (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    layout
                  >
                    <HabitCard
                      habit={habit}
                      onToggle={toggleHabitCompletion}
                      onEdit={handleEdit}
                      onDelete={(habitId) => {
                        const habit = filteredHabits.find(h => h.id === habitId);
                        if (habit) handleDeleteClick(habit);
                      }}
                      onClick={handleCardClick}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* Habit Form Modal */}
      <HabitForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={editingHabit ? handleUpdateHabit : handleCreateHabit}
        habit={editingHabit}
      />

      {/* Habit Detail Modal */}
      <HabitDetailModal
        habit={selectedHabit}
        isOpen={isDetailModalOpen}
        onClose={handleDetailModalClose}
        onEdit={handleEditFromModal}
        onDelete={async () => {
          if (selectedHabit) {
            await deleteHabit(selectedHabit.id);
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Habit"
        description={habitToDelete ? `Are you sure you want to delete "${habitToDelete.name}"? This action cannot be undone and you will lose all progress data for this habit.` : ''}
        confirmText="Delete Habit"
        cancelText="Keep Habit"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}