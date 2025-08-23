import React from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp } from 'lucide-react';

interface XPSystemProps {
  totalXP: number;
  level: number;
  xpToNextLevel: number;
  className?: string;
}

export function XPSystem({ totalXP, level, xpToNextLevel, className = '' }: XPSystemProps) {
  const currentLevelXP = totalXP % 100;
  const progressPercent = totalXP === 0 ? 0 : (currentLevelXP / 100) * 100;

  return (
    <div className={`bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-4 text-white ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          <span className="font-bold">Level {level}</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <TrendingUp className="w-4 h-4" />
          <span>{totalXP} XP</span>
        </div>
      </div>
      
      <div className="w-full bg-white/20 rounded-full h-2 mb-2">
        <motion.div
          className="bg-white rounded-full h-2"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <div className="text-xs opacity-90">
        {xpToNextLevel} XP to Level {level + 1}
      </div>
    </div>
  );
}

export const calculateXP = (habits: any[]) => {
  if (!habits || habits.length === 0) {
    return { totalXP: 0, level: 1, xpToNextLevel: 100 };
  }

  const totalXP = habits.reduce((total, habit) => {
    const baseXP = (habit.total_completions || 0) * 10;
    const streakBonus = (habit.current_streak || 0) * 5;
    const comboBonus = habit.is_completed_today ? 15 : 0;
    return total + baseXP + streakBonus + comboBonus;
  }, 0);

  const level = Math.floor(totalXP / 100) + 1;
  const xpToNextLevel = totalXP === 0 ? 100 : 100 - (totalXP % 100);

  return { totalXP, level, xpToNextLevel };
};