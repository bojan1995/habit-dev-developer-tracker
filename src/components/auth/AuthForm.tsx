import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
});

type AuthFormData = z.infer<typeof authSchema>;

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  
  const { signIn, signUp, checkEmailExists } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // For signup, check if email exists first
      if (!isLogin) {
        setCheckingEmail(true);
        const { exists, error: checkError } = await checkEmailExists(data.email);
        setCheckingEmail(false);
        
        if (checkError) {
          console.warn('Email check failed, proceeding with signup');
          // Continue with signup if check fails
        } else if (exists) {
          setError('This email is already registered. Please sign in instead.');
          setIsLoading(false);
          // Auto-switch to login mode after showing the error
          setTimeout(() => {
            setIsLogin(true);
            setError('Switched to sign in mode. Enter your password to continue.');
          }, 3000);
          return;
        }
      }

      const { error } = isLogin
        ? await signIn(data.email, data.password)
        : await signUp(data.email, data.password);

      if (error) {
        // Handle specific error types with better messaging
        if (error.status === 429) {
          setError(error.message);
        } else if (error.status === 409 || 
                   error.message?.includes('User already registered') || 
                   error.message?.includes('already been registered') ||
                   error.message?.includes('Email address is already registered') ||
                   error.message?.includes('already registered')) {
          setError('This email is already registered. Please sign in instead.');
          // Auto-switch to login mode after showing the error
          setTimeout(() => {
            setIsLogin(true);
            setError('Switched to sign in mode. Enter your password to continue.');
          }, 3000);
        } else if (error.message?.includes('Email rate limit exceeded')) {
          setError('Too many signup attempts. Please wait before trying again.');
        } else if (error.message?.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message?.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link before signing in.');
        } else if (error.status === 400 || error.message?.includes('Password should be at least')) {
          setError('Password must be at least 8 characters with uppercase, lowercase, and numbers.');
        } else if (error.message?.includes('Invalid email')) {
          setError('Please enter a valid email address.');
        } else {
          // Generic error handling
          setError(error.message || 'An error occurred. Please try again.');
        }
      } else if (!isLogin) {
        setError('Account created successfully! Please check your email to verify your account.');
      }
    } catch (err) {
      console.error('Auth error occurred');
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
      setCheckingEmail(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    reset();
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 px-4 py-8 safe-top safe-bottom">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-responsive-lg">
          <CardHeader className="space-y-2 text-center p-4 sm:p-6">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="h-12 w-12 rounded-full bg-primary-600 flex items-center justify-center">
                {isLogin ? (
                  <LogIn className="h-6 w-6 text-white" />
                ) : (
                  <UserPlus className="h-6 w-6 text-white" />
                )}
              </div>
            </motion.div>
            <CardTitle className="text-responsive-2xl font-bold">
              {isLogin ? 'Welcome back' : 'Create account'}
            </CardTitle>
            <CardDescription className="text-responsive-sm leading-relaxed">
              {isLogin
                ? 'Sign in to your account to continue tracking your habits'
                : 'Sign up to start building better developer habits'}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-responsive-sm font-medium">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10 h-11 sm:h-10"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-responsive-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-responsive-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-12 h-11 sm:h-10"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 min-h-[44px] min-w-[44px] sm:min-h-[auto] sm:min-w-[auto] flex items-center justify-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-responsive-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg text-sm ${
                    error.includes('successfully') || error.includes('Switched to sign in')
                      ? 'bg-secondary-50 text-secondary-700 border border-secondary-200'
                      : error.includes('already exists')
                      ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {error}
                  {error.includes('already exists') && (
                    <div className="mt-2 text-xs">
                      💡 Tip: If you forgot your password, you can reset it after switching to sign in mode.
                    </div>
                  )}
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full min-h-[44px] sm:min-h-[40px]"
                disabled={isLoading || checkingEmail}
              >
                {isLoading || checkingEmail ? (
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>
                      {checkingEmail ? 'Checking email...' : 
                       isLogin ? 'Signing in...' : 'Creating account...'}
                    </span>
                  </div>
                ) : (
                  <>
                    {isLogin ? (
                      <LogIn className="mr-2 h-4 w-4" />
                    ) : (
                      <UserPlus className="mr-2 h-4 w-4" />
                    )}
                    {isLogin ? 'Sign in' : 'Create account'}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-responsive-sm text-gray-600 dark:text-gray-400">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
              </p>
              <Button
                type="button"
                variant="link"
                onClick={toggleMode}
                className="mt-1 h-auto p-0 text-primary-600 hover:text-primary-700 min-h-[44px] sm:min-h-[auto]"
              >
                {isLogin ? 'Create one now' : 'Sign in instead'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}