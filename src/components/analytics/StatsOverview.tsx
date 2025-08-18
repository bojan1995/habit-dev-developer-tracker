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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}