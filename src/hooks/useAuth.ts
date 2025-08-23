import { useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

interface AuthMethods {
  signIn: (email: string, password: string) => Promise<{ error?: AuthError }>;
  signUp: (email: string, password: string) => Promise<{ error?: AuthError }>;
  signOut: () => Promise<void>;
  checkEmailExists: (email: string) => Promise<{ exists: boolean; error?: AuthError }>;
}

// Rate limiting state with cleanup
const authAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [email, attempts] of authAttempts.entries()) {
    if (now - attempts.lastAttempt > LOCKOUT_DURATION) {
      authAttempts.delete(email);
    }
  }
}, 5 * 60 * 1000); // Cleanup every 5 minutes

function checkRateLimit(email: string): { allowed: boolean; waitTime?: number } {
  const now = Date.now();
  const attempts = authAttempts.get(email);
  
  if (!attempts) {
    return { allowed: true };
  }
  
  // Reset if lockout period has passed
  if (now - attempts.lastAttempt > LOCKOUT_DURATION) {
    authAttempts.delete(email);
    return { allowed: true };
  }
  
  if (attempts.count >= MAX_ATTEMPTS) {
    const waitTime = Math.ceil((LOCKOUT_DURATION - (now - attempts.lastAttempt)) / 1000);
    return { allowed: false, waitTime };
  }
  
  return { allowed: true };
}

function recordAuthAttempt(email: string, success: boolean) {
  const now = Date.now();
  const attempts = authAttempts.get(email) || { count: 0, lastAttempt: now };
  
  if (success) {
    authAttempts.delete(email);
  } else {
    attempts.count += 1;
    attempts.lastAttempt = now;
    authAttempts.set(email, attempts);
  }
}

export function useAuth(): AuthState & AuthMethods {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    // Check rate limiting
    const rateCheck = checkRateLimit(email);
    if (!rateCheck.allowed) {
      const error = new Error(`Too many failed attempts. Please wait ${rateCheck.waitTime} seconds before trying again.`) as AuthError;
      error.status = 429;
      return { error };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // Record attempt for rate limiting
    recordAuthAttempt(email, !error);
    
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    // Check rate limiting for signup as well
    const rateCheck = checkRateLimit(email);
    if (!rateCheck.allowed) {
      const error = new Error(`Too many attempts. Please wait ${rateCheck.waitTime} seconds before trying again.`) as AuthError;
      error.status = 429;
      return { error };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        recordAuthAttempt(email, false);
        
        // Handle specific Supabase error cases
        if (error.message?.includes('User already registered') || 
            error.message?.includes('already been registered') ||
            error.message?.includes('Email address is already registered') ||
            error.status === 422) {
          const enhancedError = new Error('This email is already registered. Please sign in instead.') as AuthError;
          enhancedError.status = 409;
          return { error: enhancedError };
        }
        
        if (error.message?.includes('Password should be at least')) {
          const passwordError = new Error('Password must be at least 8 characters with uppercase, lowercase, and numbers.') as AuthError;
          passwordError.status = 400;
          return { error: passwordError };
        }
        
        return { error };
      }
      
      recordAuthAttempt(email, true);
      return { error: null };
      
    } catch (err) {
      recordAuthAttempt(email, false);
      console.error('SignUp unexpected error:', err);
      const unexpectedError = new Error('An unexpected error occurred during registration.') as AuthError;
      return { error: unexpectedError };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const checkEmailExists = async (email: string) => {
    // Validate email format first
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { exists: false, error: new Error('Invalid email format') as AuthError };
    }

    try {
      // Use Supabase admin API to check if user exists
      const { data, error } = await supabase.rpc('check_user_exists', { 
        email_input: email 
      });
      
      if (error) {
        // If RPC doesn't exist, return false to allow signup
        console.log('RPC not available, allowing signup');
        return { exists: false };
      }
      
      return { exists: !!data };
    } catch (err) {
      console.log('Error checking email, allowing signup');
      return { exists: false };
    }
  };



  return {
    ...state,
    signIn,
    signUp,
    signOut,
    checkEmailExists,
  };
}