import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Trophy, Crown } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  unlocked: boolean;
}

interface AchievementBadgeProps {
  achievements: Achievement[];
  className?: string;
}

export function AchievementBadge({ achievements, className = '' }: AchievementBadgeProps) {
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex -space-x-1">
        {achievements.slice(0, 3).map((achievement, index) => (
          <motion.div
            key={achievement.id}
            className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
              achievement.unlocked ? achievement.color : 'bg-gray-300'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: achievement.unlocked ? 1 : 0.8 }}
            whileHover={{ scale: 1.1 }}
          >
            <achievement.icon className="w-3 h-3 text-white" />
          </motion.div>
        ))}
      </div>
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
        {unlockedCount}/{achievements.length}
      </span>
    </div>
  );
}

export const getAchievements = (habits: any[]): Achievement[] => [
  {
    id: 'first-habit',
    name: 'First Steps',
    description: 'Create your first habit',
    icon: Star,
    color: 'bg-blue-500',
    unlocked: habits.length > 0
  },
  {
    id: 'week-streak',
    name: 'Week Warrior',
    description: '7-day streak on any habit',
    icon: Award,
    color: 'bg-green-500',
    unlocked: habits.some(h => (h.longest_streak || 0) >= 7)
  },
  {
    id: 'month-streak',
    name: 'Month Master',
    description: '30-day streak on any habit',
    icon: Trophy,
    color: 'bg-yellow-500',
    unlocked: habits.some(h => (h.longest_streak || 0) >= 30)
  },
  {
    id: 'legend',
    name: 'Legend',
    description: '100-day streak on any habit',
    icon: Crown,
    color: 'bg-purple-500',
    unlocked: habits.some(h => (h.longest_streak || 0) >= 100)
  }
];