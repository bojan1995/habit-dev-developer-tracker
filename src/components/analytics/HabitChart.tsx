import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useHabits } from '@/hooks/useHabits';

export function HabitChart() {
  const { habits } = useHabits();

  const chartData = React.useMemo(() => {
    return habits.map(habit => ({
      name: habit.name.length > 15 ? habit.name.slice(0, 15) + '...' : habit.name,
      completion_rate: Math.round(habit.completion_rate),
      current_streak: habit.current_streak,
      total_completions: habit.total_completions,
      color: habit.color,
    }));
  }, [habits]);

  const frequencyData = React.useMemo(() => {
    const daily = habits.filter(h => h.target_frequency === 'daily').length;
    const weekly = habits.filter(h => h.target_frequency === 'weekly').length;
    
    return [
      { name: 'Daily', value: daily, color: '#6366f1' },
      { name: 'Weekly', value: weekly, color: '#10b981' },
    ];
  }, [habits]);

  if (habits.length === 0) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Completion Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              No data to display
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Habit Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              No data to display
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Completion Rates (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, 'Completion Rate']}
                  labelFormatter={(label) => `Habit: ${label}`}
                />
                <Bar 
                  dataKey="completion_rate" 
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Habit Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={frequencyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {frequencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}