import React, { useState } from 'react';
import { HabitForm } from './components/habits/HabitForm';
import { HabitCard } from './components/habits/HabitCard';
import { Button } from './components/ui/Button';
import { VisuallyHidden } from './components/ui/VisuallyHidden';
import { Moon, Sun, Plus, Info } from 'lucide-react';
import type { HabitWithStats } from './types/habit';

// Mock habit data with descriptions for testing
const mockHabits: HabitWithStats[] = [
  {
    id: '1',
    user_id: 'user1',
    name: 'Write Clean Code',
    description: 'Focus on writing clean, well-documented code that follows best practices and is easy to maintain. This includes proper naming conventions, commenting, and code structure.',
    target_frequency: 'daily' as const,
    color: '#10b981',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    send_reminder: false,
    reminder_timezone: 'UTC',
    current_streak: 5,
    longest_streak: 12,
    completion_rate: 85,
    total_completions: 42,
    is_completed_today: true,
    reminder_enabled: false,
    reminder_time: '08:00',
  },
  {
    id: '2',
    user_id: 'user1',
    name: 'Daily Code Review',
    description: 'Review at least one pull request or piece of code daily to improve code quality and learn from others.',
    target_frequency: 'daily' as const,
    color: '#6366f1',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    send_reminder: false,
    reminder_timezone: 'UTC',
    current_streak: 3,
    longest_streak: 8,
    completion_rate: 70,
    total_completions: 28,
    is_completed_today: false,
    reminder_enabled: false,
    reminder_time: '09:00',
  },
  {
    id: '3',
    user_id: 'user1',
    name: 'Learn New Technology',
    description: 'Dedicate time each week to learning a new programming language, framework, or tool.',
    target_frequency: 'weekly' as const,
    color: '#f59e0b',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
    send_reminder: false,
    reminder_timezone: 'UTC',
    current_streak: 2,
    longest_streak: 4,
    completion_rate: 60,
    total_completions: 12,
    is_completed_today: false,
    reminder_enabled: false,
    reminder_time: '10:00',
  },
];

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitWithStats | null>(null);
  const [habits, setHabits] = useState(mockHabits);
  const [announcement, setAnnouncement] = useState<string>('');

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      setAnnouncement('Switched to dark mode');
    } else {
      document.documentElement.classList.remove('dark');
      setAnnouncement('Switched to light mode');
    }
    
    // Clear announcement after screen reader reads it
    setTimeout(() => setAnnouncement(''), 1000);
  };

  const handleSubmit = async (data: any) => {
    console.log('Form submitted:', data);
    setAnnouncement(editingHabit ? 'Habit updated successfully' : 'Habit created successfully');
    setTimeout(() => setAnnouncement(''), 3000);
    return { error: undefined };
  };

  const handleToggleHabit = (habitId: string) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId 
        ? { ...habit, is_completed_today: !habit.is_completed_today }
        : habit
    ));
    const habit = habits.find(h => h.id === habitId);
    setAnnouncement(`Habit "${habit?.name}" marked as ${habit?.is_completed_today ? 'incomplete' : 'complete'}`);
    setTimeout(() => setAnnouncement(''), 2000);
  };

  const handleEditHabit = (habit: HabitWithStats) => {
    setEditingHabit(habit);
    setShowEditModal(true);
  };

  const handleDeleteHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    setHabits(prev => prev.filter(h => h.id !== habitId));
    setAnnouncement(`Habit "${habit?.name}" deleted`);
    setTimeout(() => setAnnouncement(''), 2000);
  };

  const handleCloseModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingHabit(null);
  };

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'dark' : ''}`}>
      {/* Live region for announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Developer Habit Tracker
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Accessible and responsive habit tracking
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                  aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                  className="transition-colors"
                >
                  {isDark ? (
                    <Sun className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Moon className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Create Habit</span>
                  <span className="sm:hidden">Create</span>
                </Button>
              </div>
            </div>

            {/* Accessibility info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h2 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Accessibility Features
                  </h2>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Full keyboard navigation support (Tab, Enter, Space, Escape)</li>
                    <li>• Screen reader optimized with ARIA labels and live regions</li>
                    <li>• WCAG 2.1 AA color contrast compliance</li>
                    <li>• Touch-friendly 44px minimum target sizes</li>
                    <li>• Responsive design for all screen sizes (320px+)</li>
                    <li>• Focus trapping in modals and proper focus management</li>
                  </ul>
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main>
            <section aria-labelledby="habits-heading">
              <h2 id="habits-heading" className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Your Habits
                <VisuallyHidden>({habits.length} total)</VisuallyHidden>
              </h2>
              
              {habits.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    No habits yet. Create your first habit to get started!
                  </p>
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                    Create Your First Habit
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                  {habits.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      onToggle={handleToggleHabit}
                      onEdit={handleEditHabit}
                      onDelete={handleDeleteHabit}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Current Theme Indicator */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700">
                {isDark ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4" aria-hidden="true" />}
                <span className="text-sm font-medium">
                  Current theme: {isDark ? 'Dark' : 'Light'} Mode
                </span>
              </div>
            </div>
          </main>
        </div>

        {/* Modals */}
        <HabitForm
          isOpen={showCreateModal}
          onClose={handleCloseModals}
          onSubmit={handleSubmit}
        />

        <HabitForm
          isOpen={showEditModal}
          onClose={handleCloseModals}
          onSubmit={handleSubmit}
          habit={editingHabit}
        />
      </div>
    </div>
  );
}