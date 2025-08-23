import React from 'react';
import { motion } from 'framer-motion';

interface HeatmapCalendarProps {
  completions: { date: string; count: number }[];
  className?: string;
}

export function HeatmapCalendar({ completions, className = '' }: HeatmapCalendarProps) {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth() - 11, 1);
  
  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (count <= 2) return 'bg-green-200 dark:bg-green-900';
    if (count <= 4) return 'bg-green-400 dark:bg-green-700';
    if (count <= 6) return 'bg-green-600 dark:bg-green-500';
    return 'bg-green-800 dark:bg-green-400';
  };

  const getDaysInYear = () => {
    const days = [];
    const current = new Date(startDate);
    
    while (current <= today) {
      const dateStr = current.toISOString().split('T')[0];
      const completion = completions.find(c => c.date === dateStr);
      days.push({
        date: dateStr,
        count: completion?.count || 0,
        day: current.getDay()
      });
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const days = getDaysInYear();
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Activity Heatmap ({completions.length} days active)</h3>
      <div className="flex gap-1 overflow-x-auto">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => (
              <motion.div
                key={day.date}
                className={`w-3 h-3 rounded-sm ${getIntensity(day.count)}`}
                whileHover={{ scale: 1.2 }}
                title={`${day.date}: ${day.count} completions`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: weekIndex * 0.01 + dayIndex * 0.005 }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map(level => (
            <div key={level} className={`w-3 h-3 rounded-sm ${getIntensity(level * 2)}`} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}