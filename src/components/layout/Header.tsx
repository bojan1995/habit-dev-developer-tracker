import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Moon, Sun, Target, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';

export function Header() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-700 dark:bg-gray-900/80 safe-top"
      >
        <div className="container-responsive">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            {/* Logo Section */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 sm:space-x-3"
            >
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary-600">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="hidden xs:block">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  HabitDev
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                  Developer Habits
                </p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              {user && (
                <span className="text-sm text-gray-600 dark:text-gray-300 max-w-[200px] truncate">
                  {user.email}
                </span>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-11 w-11 min-h-[44px] min-w-[44px]"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Sun className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>

              {user && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={signOut}
                  className="h-11 w-11 min-h-[44px] min-w-[44px]"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2 md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-11 w-11 min-h-[44px] min-w-[44px]"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Sun className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
              
              {user && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMobileMenu}
                  className="h-11 w-11 min-h-[44px] min-w-[44px]"
                  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Menu className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && user && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={toggleMobileMenu}
            />
            
            {/* Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed top-14 sm:top-16 left-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl md:hidden safe-top"
            >
              <div className="p-4 space-y-4">
                {/* User Info */}
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
                    <Target className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Signed in
                    </p>
                  </div>
                </div>

                {/* Sign Out Button */}
                <Button
                  variant="outline"
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}