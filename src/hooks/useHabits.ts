import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import type { Habit, HabitCompletion, HabitWithStats, CreateHabitData, UpdateHabitData } from '@/types/habit';
import { calculateStreak, startOfDay, endOfDay } from '@/lib/utils';
import { format } from 'date-fns';

export function useHabits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update the fetchHabits function
  const fetchHabits = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select(`
          id,
          name,
          target_frequency,
          user_id,
          created_at
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (habitsError) throw habitsError;

      // Fetch completions for all habits
      const habitIds = habitsData.map(habit => habit.id);
      
      let completionsData = [];
      if (habitIds.length > 0) {
        const { data, error: completionsError } = await supabase
          .from('habit_completions')
          .select(`
            id,
            habit_id,
            completed_at
          `)
          .in('habit_id', habitIds)
          .order('completed_at', { ascending: false });

        if (completionsError) throw completionsError;
        completionsData = data;
      }

      // Calculate stats for each habit
      const habitsWithStats: HabitWithStats[] = habitsData.map(habit => {
        const habitCompletions = completionsData.filter(c => c.habit_id === habit.id);
        const completionDates = habitCompletions.map(c => new Date(c.completed_at));

        const current_streak = calculateStreak(completionDates);
        const total_completions = habitCompletions.length;

        // Calculate longest streak
        let longest_streak = 0;
        let temp_streak = 0;
        const sortedDates = [...completionDates].sort((a, b) => a.getTime() - b.getTime());

        for (let i = 0; i < sortedDates.length; i++) {
          if (i === 0) {
            temp_streak = 1;
          } else {
            const prevDate = new Date(sortedDates[i - 1]);
            const currentDate = new Date(sortedDates[i]);
            const dayDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

            if (dayDiff === 1) {
              temp_streak++;
            } else {
              temp_streak = 1;
            }
          }
          longest_streak = Math.max(longest_streak, temp_streak);
        }

        // Calculate completion rate (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentCompletions = habitCompletions.filter(c =>
          new Date(c.completed_at) >= thirtyDaysAgo
        );
        const completion_rate = habit.target_frequency === 'daily'
          ? (recentCompletions.length / 30) * 100
          : (recentCompletions.length / 4) * 100; // 4 weeks

        // Check if completed today
        const today = startOfDay();
        const tomorrow = endOfDay();
        const is_completed_today = habitCompletions.some(c => {
          const completionDate = new Date(c.completed_at);
          return completionDate >= today && completionDate <= tomorrow;
        });

        return {
          ...habit,
          description: undefined, // Explicitly set to undefined since it's not in the DB
          current_streak,
          longest_streak,
          completion_rate: Math.min(completion_rate, 100),
          total_completions,
          is_completed_today,
        };
      });

      setHabits(habitsWithStats);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch habits');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update the createHabit function
  const createHabit = async (habitData: CreateHabitData) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([
          {
            name: habitData.name,
            target_frequency: habitData.target_frequency,
            user_id: user.id,
            color: '#4F46E5', // Default color - you can make this dynamic
            description: '', // Optional field
          },
        ])
        .select()
        .single();

      if (error) throw error;

      await fetchHabits();
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to create habit';
      return { data: null, error };
    }
  };

  const updateHabit = async (habitId: string, habitData: UpdateHabitData) => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .update({
          ...habitData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', habitId)
        .select()
        .single();

      if (error) throw error;

      await fetchHabits();
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update habit';
      return { data: null, error };
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      // Delete completions first
      await supabase
        .from('habit_completions')
        .delete()
        .eq('habit_id', habitId);

      // Then delete the habit
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);

      if (error) throw error;

      await fetchHabits();
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to delete habit';
      return { error };
    }
  };

  const toggleHabitCompletion = async (habitId: string) => {
    if (!user) return;

    try {
      const habit = habits.find(h => h.id === habitId);
      if (!habit) throw new Error('Habit not found');

      const today = new Date().toISOString().split('T')[0];
      const existingCompletion = await supabase
        .from('habit_completions')
        .select('id')
        .eq('habit_id', habitId)
        .gte('completed_at', today)
        .lt('completed_at', today + 'T23:59:59.999Z')
        .single();

      if (existingCompletion.data) {
        // If completion exists, delete it (uncheck)
        await supabase
          .from('habit_completions')
          .delete()
          .eq('id', existingCompletion.data.id);
      } else {
        // If no completion exists, create one (check)
        await supabase
          .from('habit_completions')
          .insert([
            {
              habit_id: habitId,
              completed_at: new Date().toISOString(),
            },
          ]);
      }

      await fetchHabits();
      return { error: null };
    } catch (err) {
      console.error('Toggle error:', err);
      return { error: err instanceof Error ? err.message : 'Failed to toggle habit' };
    }
  };

  const updateHabitReminder = async (
    habitId: string, 
    enabled: boolean, 
    time?: string
  ) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('habits')
        .update({
          reminder_enabled: enabled,
          reminder_time: time || '08:00',
          updated_at: new Date().toISOString()
        })
        .eq('id', habitId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchHabits();
      return { error: null };
    } catch (err) {
      console.error('Failed to update reminder:', err);
      return { error: err instanceof Error ? err.message : 'Failed to update reminder' };
    }
  };

  useEffect(() => {
    if (user) {
      fetchHabits();
    } else {
      setHabits([]);
      setLoading(false);
    }
  }, [user]);

  return {
    habits,
    loading,
    error,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    updateHabitReminder,
    refetch: fetchHabits,
  };
}
