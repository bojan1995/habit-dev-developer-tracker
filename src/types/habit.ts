export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  target_frequency: 'daily' | 'weekly';
  color: string;
  created_at: string;
  updated_at: string;
  send_reminder: boolean;
  last_reminder_sent?: string;
  reminder_timezone: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  completed_at: string;
  created_at: string;
}

export interface CreateHabitData {
  name: string;
  target_frequency: 'daily' | 'weekly';
  color?: string;
  description?: string;
}

export interface UpdateHabitData {
  name?: string;
  description?: string;
  target_frequency?: 'daily' | 'weekly';
  color?: string;
  reminder_enabled?: boolean;
  reminder_time?: string;
}

export interface HabitWithStats extends Habit {
  current_streak: number;
  longest_streak: number;
  completion_rate: number;
  total_completions: number;
  is_completed_today: boolean;
  reminder_enabled: boolean;
  reminder_time: string;
  completions?: HabitCompletion[];
}