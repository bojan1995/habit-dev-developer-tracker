import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthForm } from '@/components/auth/AuthForm';
import { Dashboard } from '@/pages/Dashboard';
import { useAuth } from '@/hooks/useAuth';


function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
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