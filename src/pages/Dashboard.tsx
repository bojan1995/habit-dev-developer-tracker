import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { StatsOverview } from '@/components/analytics/StatsOverview';
import { HabitChart } from '@/components/analytics/HabitChart';
import { HabitList } from '@/components/habits/HabitList';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Welcome Section */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Your Developer Journey
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Track your micro-habits and build consistent developer practices. 
              Small daily improvements lead to extraordinary results.
            </p>
          </div>

          {/* Stats Overview */}
          <StatsOverview />

          {/* Analytics Charts */}
          <HabitChart />

          {/* Habits List */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
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