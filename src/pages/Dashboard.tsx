import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { StatsOverview } from '@/components/analytics/StatsOverview';
import { HabitChart } from '@/components/analytics/HabitChart';
import { HabitList } from '@/components/habits/HabitList';

export function Dashboard() {
  return (
    <div className="min-h-screen min-h-dvh bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="safe-bottom">
        <ResponsiveLayout maxWidth="2xl" padding="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-6 sm:py-8 lg:py-12 space-y-8 sm:space-y-12"
          >
            {/* Welcome Section */}
            <div className="text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4"
              >
                Your Developer Journey
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
              >
                Track your micro-habits and build consistent developer practices. 
                Small daily improvements lead to extraordinary results.
              </motion.p>
            </div>

            {/* Stats Overview */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <StatsOverview />
            </motion.section>

            {/* Analytics Charts */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <HabitChart />
            </motion.section>

            {/* Habits List */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <HabitList />
            </motion.section>
          </motion.div>
        </ResponsiveLayout>
      </main>
    </div>
  );
}