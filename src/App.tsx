import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthForm } from '@/components/auth/AuthForm';
import { Dashboard } from '@/pages/Dashboard';
import { useAuth } from '@/hooks/useAuth';


function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="w-12 h-12 sm:w-10 sm:h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <div className="space-y-2">
            <p className="text-responsive-base font-medium text-gray-900 dark:text-gray-100">Loading HabitDev</p>
            <p className="text-responsive-sm text-gray-600 dark:text-gray-400">Setting up your workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthForm />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}