import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Flame, Calendar, Trash2, Edit, MoreVertical } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { StreakFlame } from '@/components/gamification/StreakFlame';
import type { HabitWithStats } from '@/types/habit';

interface HabitCardProps {
  habit: HabitWithStats;
  onToggle: (habitId: string) => void;
  onEdit: (habit: HabitWithStats) => void;
  onDelete: (habitId: string) => void;
  onClick?: (habit: HabitWithStats) => void;
}

export function HabitCard({ habit, onToggle, onEdit, onDelete, onClick }: HabitCardProps) {
  const completionPercentage = Math.round(habit.completion_rate);

  return (
    <motion.div
      layout
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="h-full min-h-[180px]" // Reduced minimum height
    >
      <Card 
        className="group relative h-full flex flex-col bg-card hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-border cursor-pointer"
        onClick={() => onClick?.(habit)}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${habit.name} habit`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.(habit);
          }
        }}
      >
        {/* Color bar */}
        <div 
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ backgroundColor: habit.color }}
        />

        {/* Main content with reduced padding */}
        <div className="p-4 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start gap-3 mb-2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full p-2 -ml-1 hover:bg-background/80 min-h-[44px] min-w-[44px]"
              onClick={(e) => {
                e.stopPropagation();
                onToggle(habit.id);
              }}
              aria-label={habit.is_completed_today ? `Mark ${habit.name} as incomplete` : `Mark ${habit.name} as complete`}
            >
              {habit.is_completed_today ? (
                <CheckCircle2 className="h-6 w-6 text-primary" aria-hidden="true" />
              ) : (
                <Circle className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
              )}
            </Button>
            <div className="flex-1">
              <h3 className="font-semibold text-base mb-0.5">{habit.name}</h3>
              {habit.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {habit.description}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {habit.target_frequency}
              </Badge>
              <StreakFlame streak={habit.current_streak} />
            </div>
            <span className="text-sm text-muted-foreground">
              {completionPercentage}%
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}