import '@testing-library/jest-dom';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useHabits } from '@/hooks/useHabits';

export interface CreateHabitData {
  name: string;
  target_frequency: 'daily' | 'weekly';
  color: string;
  description?: string;
  send_reminder?: boolean;
}

export function useHabits() {
  // ...existing code...

  const createHabit = async (habitData: CreateHabitData) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([
          {
            name: habitData.name,
            target_frequency: habitData.target_frequency,
            color: habitData.color || '#4F46E5',
            description: habitData.description || '',
            user_id: user.id,
            send_reminder: habitData.send_reminder || false,
            reminder_timezone: habitData.send_reminder 
              ? Intl.DateTimeFormat().resolvedOptions().timeZone 
              : null
          }
        ])
        .select()
        .single();

      if (error) throw error;

      await fetchHabits();
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to create habit';
      return { data: null, error };
    }
  };

  // ...existing code...
}

export function NewHabitDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { createHabit } = useHabits();
  const [formData, setFormData] = useState({
    name: '',
    target_frequency: 'daily' as const,
    description: '',
    send_reminder: false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createHabit({
        ...formData,
        color: '#4F46E5' // Default color
      });

      // Reset form and close
      setFormData({
        name: '',
        target_frequency: 'daily',
        description: '',
        send_reminder: false
      });
      onClose();
    } catch (error) {
      console.error('Failed to create habit:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* ...existing Dialog wrapper code... */}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ...existing name and frequency inputs... */}

        <div className="flex items-start space-x-2">
          <div className="flex h-5 items-center">
            <input
              type="checkbox"
              id="send_reminder"
              checked={formData.send_reminder}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                send_reminder: e.target.checked
              }))}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="send_reminder" className="text-sm text-gray-700">
              Send daily reminder
            </label>
            {formData.send_reminder && (
              <p className="text-xs text-gray-500 mt-1">
                Reminder will be sent at 8:00 AM your time
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Habit'}
          </button>
        </div>
      </form>
    </Dialog>
  );
}