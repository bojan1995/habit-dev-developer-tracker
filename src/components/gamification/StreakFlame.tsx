import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakFlameProps {
  streak: number;
  className?: string;
}

export function StreakFlame({ streak, className = '' }: StreakFlameProps) {
  const getFlameSize = (streak: number) => {
    if (streak === 0) return 'h-4 w-4';
    if (streak < 7) return 'h-5 w-5';
    if (streak < 30) return 'h-6 w-6';
    if (streak < 100) return 'h-7 w-7';
    return 'h-8 w-8';
  };

  const getFlameColor = (streak: number) => {
    if (streak === 0) return 'text-gray-400';
    if (streak < 7) return 'text-orange-500';
    if (streak < 30) return 'text-red-500';
    if (streak < 100) return 'text-red-600';
    return 'text-purple-600';
  };

  return (
    <motion.div
      className={`flex items-center gap-1 ${className}`}
      animate={{
        scale: streak > 0 ? [1, 1.1, 1] : 1,
      }}
      transition={{
        duration: 2,
        repeat: streak > 0 ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      <Flame className={`${getFlameSize(streak)} ${getFlameColor(streak)}`} />
      <span className="text-sm font-medium">{streak}</span>
    </motion.div>
  );
}