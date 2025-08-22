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
    <div className="stats-grid">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="h-full"
        >
          <Card className="hover:shadow-responsive-lg transition-all duration-200 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 card-responsive">
              <CardTitle className="text-sm sm:text-base font-semibold leading-tight text-gray-900 dark:text-white">
                {stat.title}
              </CardTitle>
              <div className={`p-2 sm:p-2.5 rounded-lg ${stat.bgColor} flex-shrink-0`}>
                <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="card-responsive pt-0">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}