import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { StatsOverview } from '@/components/analytics/StatsOverview';
import { HabitChart } from '@/components/analytics/HabitChart';
import { HabitList } from '@/components/habits/HabitList';
import { Footer } from '@/components/ui/Footer';

export function Dashboard() {
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
              <StatsOverview />
            </motion.section>

            {/* Analytics Charts */}
            <motion.section
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              <HabitChart />
            </motion.section>

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
              <HabitList />
            </motion.section>
          </motion.div>
        </ResponsiveLayout>
      </main>
      
      <Footer />
    </div>
  );
}