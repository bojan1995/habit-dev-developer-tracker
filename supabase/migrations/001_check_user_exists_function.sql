-- Create a function to check if a user exists by email
-- This is a safe way to check without triggering any side effects

CREATE OR REPLACE FUNCTION check_user_exists(email_input text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user exists in auth.users table
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE email = email_input
  );
END;
$$;