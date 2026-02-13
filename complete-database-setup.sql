-- COMPLETE HABITDEV DATABASE SETUP
-- Copy and paste this entire script into Supabase SQL Editor

-- 1. Create habits table
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  target_frequency VARCHAR(20) DEFAULT 'daily' CHECK (target_frequency IN ('daily', 'weekly')),
  color VARCHAR(7) NOT NULL DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create habit completions table
CREATE TABLE habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create user profiles table (optional - for extended user data)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name VARCHAR(100),
  avatar_url TEXT,
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for habits
CREATE POLICY "Users can view their own habits" ON habits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habits" ON habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits" ON habits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits" ON habits
  FOR DELETE USING (auth.uid() = user_id);

-- 6. Create RLS policies for habit completions
CREATE POLICY "Users can view their own completions" ON habit_completions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM habits 
      WHERE habits.id = habit_completions.habit_id 
      AND habits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own completions" ON habit_completions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM habits 
      WHERE habits.id = habit_completions.habit_id 
      AND habits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own completions" ON habit_completions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM habits 
      WHERE habits.id = habit_completions.habit_id 
      AND habits.user_id = auth.uid()
    )
  );

-- 7. Create RLS policies for user profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR ALL USING (auth.uid() = id);

-- 8. Create indexes for performance
CREATE INDEX habits_user_id_idx ON habits(user_id);
CREATE INDEX habits_created_at_idx ON habits(created_at);
CREATE INDEX habit_completions_habit_id_idx ON habit_completions(habit_id);
CREATE INDEX habit_completions_completed_at_idx ON habit_completions(completed_at);
CREATE INDEX habit_completions_user_lookup_idx ON habit_completions(habit_id, completed_at);

-- 9. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Create triggers for updated_at
CREATE TRIGGER update_habits_updated_at 
    BEFORE UPDATE ON habits 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 11. Create function to get habit stats
CREATE OR REPLACE FUNCTION get_habit_stats(habit_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_completions', COUNT(*),
        'current_streak', COALESCE(get_current_streak(habit_uuid), 0),
        'last_completed', MAX(completed_at),
        'completion_rate', ROUND(
            (COUNT(*) * 100.0 / GREATEST(
                DATE_PART('day', NOW() - (SELECT created_at FROM habits WHERE id = habit_uuid)), 
                1
            )), 2
        )
    ) INTO result
    FROM habit_completions 
    WHERE habit_id = habit_uuid;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Create function to calculate current streak
CREATE OR REPLACE FUNCTION get_current_streak(habit_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    streak_count INTEGER := 0;
    check_date DATE := CURRENT_DATE;
    habit_frequency VARCHAR(20);
BEGIN
    -- Get habit frequency
    SELECT target_frequency INTO habit_frequency 
    FROM habits WHERE id = habit_uuid;
    
    -- Calculate streak based on frequency
    LOOP
        IF habit_frequency = 'daily' THEN
            -- Check if habit was completed on check_date
            IF EXISTS (
                SELECT 1 FROM habit_completions 
                WHERE habit_id = habit_uuid 
                AND DATE(completed_at) = check_date
            ) THEN
                streak_count := streak_count + 1;
                check_date := check_date - INTERVAL '1 day';
            ELSE
                EXIT;
            END IF;
        ELSE -- weekly
            -- Check if habit was completed in the week containing check_date
            IF EXISTS (
                SELECT 1 FROM habit_completions 
                WHERE habit_id = habit_uuid 
                AND DATE(completed_at) >= check_date - INTERVAL '6 days'
                AND DATE(completed_at) <= check_date
            ) THEN
                streak_count := streak_count + 1;
                check_date := check_date - INTERVAL '7 days';
            ELSE
                EXIT;
            END IF;
        END IF;
        
        -- Safety check to prevent infinite loops
        IF streak_count > 1000 THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN streak_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Create function to check if habit is completed today
CREATE OR REPLACE FUNCTION is_habit_completed_today(habit_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM habit_completions 
        WHERE habit_id = habit_uuid 
        AND DATE(completed_at) = CURRENT_DATE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Insert sample data (uncomment to add test habits)
/*
-- Sample habits for testing
INSERT INTO habits (user_id, name, description, color, target_frequency) VALUES
(auth.uid(), 'Daily Coding', 'Write code for at least 1 hour every day', '#6366f1', 'daily'),
(auth.uid(), 'Read Tech Articles', 'Read 2 technical articles daily', '#10b981', 'daily'),
(auth.uid(), 'Exercise', 'Physical workout or walk', '#ef4444', 'daily'),
(auth.uid(), 'Code Review', 'Review team members code', '#f59e0b', 'weekly'),
(auth.uid(), 'Learn New Tech', 'Study new technology or framework', '#8b5cf6', 'weekly'),
(auth.uid(), 'Write Documentation', 'Document code or processes', '#06b6d4', 'weekly');
*/