import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Flame, Calendar, Trash2, Edit, MoreVertical } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
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
        className="group relative h-full flex flex-col bg-card hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-border"
        onClick={() => onClick?.(habit)}
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
              className="rounded-full p-0 -ml-1 hover:bg-background/80"
              onClick={(e) => {
                e.stopPropagation();
                onToggle(habit.id);
              }}
            >
              {habit.is_completed_today ? (
                <CheckCircle2 className="h-6 w-6 text-primary" />
              ) : (
                <Circle className="h-6 w-6 text-muted-foreground" />
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
          <div className="flex items-center gap-2 mt-auto pt-2">
            <Badge variant="secondary" className="text-xs">
              {habit.target_frequency}
            </Badge>
            <span className="text-sm text-muted-foreground ml-auto">
              {completionPercentage}% complete
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}