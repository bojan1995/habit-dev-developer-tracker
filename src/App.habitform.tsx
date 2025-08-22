import React, { useState } from 'react';
import { HabitForm } from './components/habits/HabitForm';
import { Button } from './components/ui/Button';
import { Moon, Sun } from 'lucide-react';
import type { HabitWithStats } from './types/habit';

// Mock habit data for editing
const mockHabit: HabitWithStats = {
  id: '1',
  user_id: 'user1',
  name: 'Write Clean Code',
  description: 'Focus on writing clean, well-documented code that follows best practices and is easy to maintain.',
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
};

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSubmit = async (data: any) => {
    console.log('Form submitted:', data);
    return { error: undefined };
  };

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Habit Form Demo
              </h1>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="transition-colors"
              >
                {isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Color Visibility Test
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                This demo shows the habit form modal with improved text contrast and visibility 
                in both light and dark modes. All text elements now have proper contrast ratios 
                for better accessibility.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  • Labels are now clearly visible in both modes
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  • Color picker buttons have better contrast borders
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  • Error messages are properly styled for each theme
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  • Input fields maintain readability across themes
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setShowCreateModal(true)}
                className="min-w-[150px]"
              >
                Create New Habit
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEditModal(true)}
                className="min-w-[150px]"
              >
                Edit Existing Habit
              </Button>
            </div>

            {/* Current Theme Indicator */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800">
                {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span className="text-sm font-medium">
                  Current theme: {isDark ? 'Dark' : 'Light'} Mode
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <HabitForm
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleSubmit}
        />

        <HabitForm
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleSubmit}
          habit={mockHabit}
        />
      </div>
    </div>
  );
}