import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Footer } from '@/components/ui/Footer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Lazy load heavy components
const StatsOverview = React.lazy(() => import('@/components/analytics/StatsOverview').then(m => ({ default: m.StatsOverview })));
const HabitChart = React.lazy(() => import('@/components/analytics/HabitChart').then(m => ({ default: m.HabitChart })));
const HabitList = React.lazy(() => import('@/components/habits/HabitList').then(m => ({ default: m.HabitList })));
const MoodTracker = React.lazy(() => import('@/components/analytics/advanced/MoodTracker').then(m => ({ default: m.MoodTracker })));

export function Dashboard() {
  const [moodHistory, setMoodHistory] = React.useState([]);
  
  const handleMoodSubmit = (mood: number) => {
    const today = new Date().toISOString().split('T')[0];
    setMoodHistory(prev => [...prev, { date: today, mood, habits: [] }]);
  };

  return (
    <div className="min-h-dvh bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <ResponsiveLayout maxWidth="2xl" padding="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-6 sm:py-8 space-y-6 sm:space-y-8"
          >
            {/* Welcome Section */}
            <motion.div 
              className="text-center"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
              }}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Your Developer Journey
              </h1>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Track your micro-habits and build consistent developer practices. 
                Small daily improvements lead to extraordinary results.
              </p>
            </motion.div>

            {/* Stats Overview */}
            <motion.section
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              <Suspense fallback={<LoadingSpinner />}>
                <StatsOverview />
              </Suspense>
            </motion.section>

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <motion.section
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <HabitChart />
                </Suspense>
              </motion.section>
              
              <motion.section
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.45 }}
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <MoodTracker onMoodSubmit={handleMoodSubmit} moodHistory={moodHistory} />
                </Suspense>
              </motion.section>
            </div>

            {/* Habits List */}
            <motion.section
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
            >
              <Suspense fallback={<LoadingSpinner />}>
                <HabitList />
              </Suspense>
            </motion.section>
          </motion.div>
        </ResponsiveLayout>
      </main>
      
      <Footer />
    </div>
  );
}