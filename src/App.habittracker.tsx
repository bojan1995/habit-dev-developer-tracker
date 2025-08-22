import React, { useState, createContext, useContext } from 'react';
import { HabitList } from './components/habits/HabitList';
import type { HabitWithStats, CreateHabitData, UpdateHabitData } from './types/habit';

// Mock data for demonstration
const mockHabits: HabitWithStats[] = [
  {
    id: '1',
    user_id: 'user1',
    name: 'Write clean code',
    description: 'Focus on writing readable, maintainable code with proper documentation and following best practices',
    target_frequency: 'daily' as const,
    color: '#6366f1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    send_reminder: false,
    reminder_timezone: 'UTC',
    current_streak: 5,
    longest_streak: 12,
    completion_rate: 85,
    total_completions: 25,
    is_completed_today: true,
    reminder_enabled: false,
    reminder_time: '08:00'
  },
  {
    id: '2',
    user_id: 'user1',
    name: 'Code review participation',
    description: 'Actively participate in code reviews, providing constructive feedback and learning from others',
    target_frequency: 'daily' as const,
    color: '#10b981',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    send_reminder: false,
    reminder_timezone: 'UTC',
    current_streak: 3,
    longest_streak: 8,
    completion_rate: 70,
    total_completions: 18,
    is_completed_today: false,
    reminder_enabled: false,
    reminder_time: '08:00'
  },
  {
    id: '3',
    user_id: 'user1',
    name: 'Learn new technology',
    description: 'Dedicate time to learning new frameworks, tools, or programming concepts to stay current',
    target_frequency: 'weekly' as const,
    color: '#f59e0b',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    send_reminder: false,
    reminder_timezone: 'UTC',
    current_streak: 2,
    longest_streak: 4,
    completion_rate: 90,
    total_completions: 8,
    is_completed_today: false,
    reminder_enabled: false,
    reminder_time: '08:00'
  }
];

// Mock context for habits
const HabitsContext = createContext<any>(null);

const MockHabitsProvider = ({ children }: { children: React.ReactNode }) => {
  const [habits, setHabits] = useState<HabitWithStats[]>(mockHabits);
  const [loading, setLoading] = useState(false);

  const createHabit = async (data: CreateHabitData) => {
    const newHabit: HabitWithStats = {
      id: Date.now().toString(),
      user_id: 'user1',
      name: data.name,
      description: data.description || '',
      target_frequency: data.target_frequency,
      color: data.color || '#6366f1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      send_reminder: false,
      reminder_timezone: 'UTC',
      current_streak: 0,
      longest_streak: 0,
      completion_rate: 0,
      total_completions: 0,
      is_completed_today: false,
      reminder_enabled: false,
      reminder_time: '08:00'
    };
    setHabits(prev => [newHabit, ...prev]);
    return { error: null };
  };

  const updateHabit = async (id: string, data: UpdateHabitData) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id 
        ? { ...habit, ...data, updated_at: new Date().toISOString() }
        : habit
    ));
    return { error: null };
  };

  const deleteHabit = async (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
    return { error: null };
  };

  const toggleHabitCompletion = async (id: string) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id 
        ? { 
            ...habit, 
            is_completed_today: !habit.is_completed_today,
            current_streak: !habit.is_completed_today ? habit.current_streak + 1 : Math.max(0, habit.current_streak - 1),
            total_completions: !habit.is_completed_today ? habit.total_completions + 1 : Math.max(0, habit.total_completions - 1)
          }
        : habit
    ));
    return { error: null };
  };

  return (
    <HabitsContext.Provider value={{
      habits,
      loading,
      createHabit,
      updateHabit,
      deleteHabit,
      toggleHabitCompletion
    }}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </div>
    </HabitsContext.Provider>
  );
};

// Mock useHabits hook
export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error('useHabits must be used within HabitsProvider');
  }
  return context;
};

function App() {
  return (
    <MockHabitsProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Developer Habit Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your coding habits and build better development practices. Description field is fully functional!
          </p>
        </div>
        
        <HabitList />
      </div>
    </MockHabitsProvider>
  );
}

export default App;