import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useHabits } from '@/hooks/useHabits';

export function NewHabitDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { createHabit } = useHabits();
  const [name, setName] = useState('');
  const [targetFrequency, setTargetFrequency] = useState<'daily' | 'weekly'>('daily');
  const [enableReminder, setEnableReminder] = useState(false);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createHabit({
        name,
        target_frequency: targetFrequency,
        color: '#4F46E5', // Default color
        description,
        // Only include reminder fields if enabled
        send_reminder: enableReminder,
        reminder_timezone: enableReminder ? Intl.DateTimeFormat().resolvedOptions().timeZone : undefined
      });

      // Reset form and close
      setName('');
      setTargetFrequency('daily');
      setEnableReminder(false);
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Failed to create habit:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-xl">
          <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
            Create New Habit
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Habit Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Target Frequency
              </label>
              <select
                value={targetFrequency}
                onChange={(e) => setTargetFrequency(e.target.value as 'daily' | 'weekly')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Add reminder toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="enableReminder"
                checked={enableReminder}
                onChange={(e) => setEnableReminder(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="enableReminder" className="text-sm text-gray-700">
                Send daily reminder at 8:00 AM
              </label>
            </div>

            {enableReminder && (
              <div className="pl-6">
                <p className="text-sm text-gray-500">
                  Reminder will be sent at 8:00 AM in your timezone ({Intl.DateTimeFormat().resolvedOptions().timeZone})
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Habit'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}