import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEmojiEffect } from '@/contexts/EmojiEffectContext';

interface MoodEntry {
  date: string;
  mood: number; // 1-5 scale
  habits: string[];
}

interface MoodTrackerProps {
  onMoodSubmit: (mood: number) => void;
  moodHistory: MoodEntry[];
  className?: string;
}

const moodEmojis = ['😢', '😕', '😐', '😊', '😄'];
const moodLabels = ['Terrible', 'Bad', 'Okay', 'Good', 'Great'];

export function MoodTracker({ onMoodSubmit, moodHistory, className = '' }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const { triggerEmoji } = useEmojiEffect();

  const handleMoodSelect = (mood: number, event: React.MouseEvent) => {
    setSelectedMood(mood);
    onMoodSubmit(mood);
    
    // Trigger emoji effect at click position
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    triggerEmoji(moodEmojis[mood - 1], x, y);
  };

  const averageMood = moodHistory.length > 0 
    ? moodHistory.reduce((sum, entry) => sum + entry.mood, 0) / moodHistory.length 
    : 0;

  return (
    <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold mb-4">How are you feeling today?</h3>
      
      <div className="flex justify-center gap-4 mb-6">
        {moodEmojis.map((emoji, index) => {
          const moodValue = index + 1;
          return (
            <motion.button
              key={moodValue}
              className={`text-3xl p-3 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
                selectedMood === moodValue 
                  ? 'bg-blue-100 dark:bg-blue-900 scale-110' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleMoodSelect(moodValue, e)}
              aria-label={`Rate mood as ${moodLabels[index]}`}
              title={moodLabels[index]}
            >
              <span aria-hidden="true">{emoji}</span>
            </motion.button>
          );
        })}
      </div>

      {moodHistory.length > 0 && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Average Mood</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{moodEmojis[Math.round(averageMood) - 1]}</span>
              <span className="text-sm font-medium">{averageMood.toFixed(1)}/5</span>
            </div>
          </div>
          
          <div className="flex gap-1 mt-2">
            {moodHistory.slice(-14).map((entry, index) => (
              <div
                key={entry.date}
                className="w-4 h-8 rounded-sm flex items-end"
                style={{
                  backgroundColor: `hsl(${(entry.mood - 1) * 30}, 70%, 60%)`,
                  opacity: 0.8
                }}
                title={`${entry.date}: ${moodLabels[entry.mood - 1]}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}