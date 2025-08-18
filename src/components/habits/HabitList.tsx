import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { HabitCard } from './HabitCard';
import { HabitForm } from './HabitForm';
import { useHabits } from '@/hooks/useHabits';
import type { HabitWithStats } from '@/types/habit';

export function HabitList() {
  const { habits, loading, createHabit, updateHabit, deleteHabit, toggleHabitCompletion } = useHabits();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitWithStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  const filteredHabits = habits.filter(habit => {
    const matchesSearch = habit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         habit.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'completed' && habit.is_completed_today) ||
                         (filterBy === 'pending' && !habit.is_completed_today) ||
                         (filterBy === 'daily' && habit.target_frequency === 'daily') ||
                         (filterBy === 'weekly' && habit.target_frequency === 'weekly');
    
    return matchesSearch && matchesFilter;
  });

  const handleCreateHabit = async (data: any) => {
    const result = await createHabit(data);
    return { error: result.error };
  };

  const handleUpdateHabit = async (data: any) => {
    if (!editingHabit) return { error: 'No habit selected for editing' };
    const result = await updateHabit(editingHabit.id, data);
    return { error: result.error };
  };

  const handleEdit = (habit: HabitWithStats) => {
    setEditingHabit(habit);
    setIsFormOpen(true);
  };

  const handleDelete = async (habitId: string) => {
    if (confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      await deleteHabit(habitId);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingHabit(null);
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full sm:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search habits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            options={[
              { value: 'all', label: 'All habits' },
              { value: 'completed', label: 'Completed today' },
              { value: 'pending', label: 'Pending today' },
              { value: 'daily', label: 'Daily habits' },
              { value: 'weekly', label: 'Weekly habits' },
            ]}
            className="sm:w-40"
          />
        </div>

        <Button onClick={() => setIsFormOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Habit
        </Button>
      </div>

      {/* Habits Grid */}
      {filteredHabits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm || filterBy !== 'all' ? 'No habits found' : 'No habits yet'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {searchTerm || filterBy !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Start building better developer habits by creating your first micro-habit'}
          </p>
          {!searchTerm && filterBy === 'all' && (
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Habit
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={toggleHabitCompletion}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Habit Form Modal */}
      <HabitForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={editingHabit ? handleUpdateHabit : handleCreateHabit}
        habit={editingHabit}
      />
    </div>
  );
}