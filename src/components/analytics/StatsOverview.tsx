import React from 'react';
import { motion } from 'framer-motion';
import { Target, Flame, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useHabits } from '@/hooks/useHabits';

export function StatsOverview() {
  const { habits } = useHabits();

  const stats = React.useMemo(() => {
    const totalHabits = habits.length;
    const completedToday = habits.filter(h => h.is_completed_today).length;
    const longestStreak = Math.max(...habits.map(h => h.longest_streak), 0);
    const averageCompletion = totalHabits > 0 
      ? Math.round(habits.reduce((acc, h) => acc + h.completion_rate, 0) / totalHabits)
      : 0;

    return {
      totalHabits,
      completedToday,
      longestStreak,
      averageCompletion,
    };
  }, [habits]);

  const statCards = [
    {
      title: 'Total Habits',
      value: stats.totalHabits,
      icon: Target,
      description: 'Active habits tracking',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50 dark:bg-primary-900/20',
    },
    {
      title: 'Completed Today',
      value: `${stats.completedToday}/${stats.totalHabits}`,
      icon: Calendar,
      description: 'Daily progress',
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50 dark:bg-secondary-900/20',
    },
    {
      title: 'Longest Streak',
      value: stats.longestStreak,
      icon: Flame,
      description: 'Days in a row',
      color: 'text-accent-600',
      bgColor: 'bg-accent-50 dark:bg-accent-900/20',
    },
    {
      title: 'Average Rate',
      value: `${stats.averageCompletion}%`,
      icon: TrendingUp,
      description: 'Monthly completion',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-responsive-lg transition-all duration-200 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-5 lg:p-6">
              <CardTitle className="text-responsive-sm font-medium leading-tight">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor} flex-shrink-0`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 lg:p-6 pt-0">
              <div className="text-responsive-2xl font-bold mb-1">{stat.value}</div>
              <p className="text-responsive-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}