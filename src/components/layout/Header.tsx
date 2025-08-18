import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Moon, Sun, Target } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';

export function Header() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-700 dark:bg-gray-900/80"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-3"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              HabitDev
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Developer Habits
            </p>
          </div>
        </motion.div>

        <div className="flex items-center space-x-4">
          {user && (
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {user.email}
            </span>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              className="h-9 w-9"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
}