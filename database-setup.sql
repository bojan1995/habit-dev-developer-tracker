-- HabitDev Database Setup
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ugrdruqjlictbjehhpaa/sql

-- 1. Create habits table
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  target_frequency VARCHAR(20) DEFAULT 'daily' CHECK (target_frequency IN ('daily', 'weekly')),
  color VARCHAR(7) NOT NULL DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create habit completions table
CREATE TABLE IF NOT EXISTS habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for habits
CREATE POLICY "Users can manage their own habits" ON habits
  FOR ALL USING (auth.uid() = user_id);

-- 5. Create RLS policies for completions
CREATE POLICY "Users can manage their own completions" ON habit_completions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM habits 
      WHERE habits.id = habit_completions.habit_id 
      AND habits.user_id = auth.uid()
    )
  );

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS habits_user_id_idx ON habits(user_id);
CREATE INDEX IF NOT EXISTS habit_completions_habit_id_idx ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS habit_completions_completed_at_idx ON habit_completions(completed_at);

-- 7. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Create trigger for habits table
CREATE TRIGGER update_habits_updated_at 
    BEFORE UPDATE ON habits 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 9. Insert sample habits (optional - for testing)
-- Uncomment these lines if you want sample data
/*
INSERT INTO habits (user_id, name, description, color, target_frequency) VALUES
(auth.uid(), 'Daily Coding', 'Write code for at least 1 hour', '#6366f1', 'daily'),
(auth.uid(), 'Read Tech Articles', 'Read 2 technical articles', '#10b981', 'daily'),
(auth.uid(), 'Code Review', 'Review team code', '#f59e0b', 'weekly'),
(auth.uid(), 'Learn New Tech', 'Study new technology/framework', '#8b5cf6', 'weekly');
*/