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
      name: habit.name.length > 12 ? habit.name.slice(0, 12) + '...' : habit.name,
      fullName: habit.name,
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
      <div className="analytics-grid">
        <Card>
          <CardHeader className="p-4 sm:p-5 lg:p-6">
            <CardTitle className="text-responsive-lg font-semibold text-gray-900 dark:text-white">
              Completion Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 lg:p-6 pt-0">
            <div className="flex items-center justify-center h-48 sm:h-64 text-responsive-sm text-gray-500 dark:text-gray-400">
              No data to display
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 sm:p-5 lg:p-6">
            <CardTitle className="text-responsive-lg font-semibold text-gray-900 dark:text-white">
              Habit Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 lg:p-6 pt-0">
            <div className="flex items-center justify-center h-48 sm:h-64 text-responsive-sm text-gray-500 dark:text-gray-400">
              No data to display
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold">Completion Rates</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={chartData} 
                margin={{ 
                  top: 20, 
                  right: 30, 
                  left: 20, 
                  bottom: 60 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  axisLine={{ stroke: '#d1d5db' }}
                  tickLine={{ stroke: '#d1d5db' }}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#6b7280' }} 
                  axisLine={{ stroke: '#d1d5db' }}
                  tickLine={{ stroke: '#d1d5db' }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Completion Rate']}
                  labelFormatter={(label) => {
                    const habit = chartData.find(h => h.name === label);
                    return `Habit: ${habit?.fullName || label}`;
                  }}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '13px',
                    padding: '10px 14px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                />
                <Bar 
                  dataKey="completion_rate" 
                  radius={[6, 6, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold">Habit Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={frequencyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => {
                    if (value === 0) return '';
                    return `${name}: ${value} (${(percent * 100).toFixed(0)}%)`;
                  }}
                  outerRadius={80}
                  innerRadius={0}
                  fill="#8884d8"
                  dataKey="value"
                  style={{ fontSize: '12px', fontWeight: '500' }}
                >
                  {frequencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '13px',
                    padding: '10px 14px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                  formatter={(value, name) => [`${value} habits`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}