import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { StatsOverview } from '@/components/analytics/StatsOverview';
import { HabitChart } from '@/components/analytics/HabitChart';
import { HabitList } from '@/components/habits/HabitList';

export function Dashboard() {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container-responsive py-4 sm:py-6 lg:py-8 safe-bottom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-responsive-lg"
        >
          {/* Welcome Section */}
          <div className="text-center px-4 sm:px-0">
            <h1 className="text-responsive-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
              Your Developer Journey
            </h1>
            <p className="text-responsive-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Track your micro-habits and build consistent developer practices. 
              Small daily improvements lead to extraordinary results.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="px-2 sm:px-0">
            <StatsOverview />
          </div>

          {/* Analytics Charts */}
          <div className="px-2 sm:px-0">
            <HabitChart />
          </div>

          {/* Habits List */}
          <div className="px-2 sm:px-0">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-responsive-2xl font-bold text-gray-900 dark:text-white">
                Your Habits
              </h2>
            </div>
            <HabitList />
          </div>
        </motion.div>
      </main>
    </div>
  );
}