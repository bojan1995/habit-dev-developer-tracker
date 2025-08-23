import React from 'react';
import { Heart, Code } from 'lucide-react';

export const Footer = () => {
  return (
    <footer 
      className="mt-auto border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Built with</span>
            <Heart className="h-4 w-4 text-red-500" aria-label="love" />
            <span>for developers</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Code className="h-4 w-4" aria-hidden="true" />
              <span>Bojan &copy; {new Date().getFullYear()} HabitDev</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};