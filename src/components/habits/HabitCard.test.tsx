import { render, screen, fireEvent } from '@testing-library/react';
import { HabitCard } from './HabitCard';
import type { HabitWithStats } from '@/types/habit';

const mockHabit: HabitWithStats = {
  id: '1',
  user_id: 'user1',
  name: 'Write Code',
  description: 'Write at least 100 lines of code',
  target_frequency: 'daily',
  color: '#6366f1',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  current_streak: 5,
  longest_streak: 10,
  completion_rate: 85,
  total_completions: 25,
  is_completed_today: false,
};

const mockProps = {
  habit: mockHabit,
  onToggle: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe('HabitCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders habit information correctly', () => {
    render(<HabitCard {...mockProps} />);
    
    expect(screen.getByText('Write Code')).toBeInTheDocument();
    expect(screen.getByText('Write at least 100 lines of code')).toBeInTheDocument();
    expect(screen.getByText('5 days')).toBeInTheDocument();
    expect(screen.getByText('25 total')).toBeInTheDocument();
    expect(screen.getByText('85% this month')).toBeInTheDocument();
    expect(screen.getByText('daily')).toBeInTheDocument();
  });

  it('shows completed state when habit is completed today', () => {
    const completedHabit = { ...mockHabit, is_completed_today: true };
    render(<HabitCard {...mockProps} habit={completedHabit} />);
    
    // Should show CheckCircle2 icon (completed state)
    const checkIcon = screen.getByTestId('check-circle-2');
    expect(checkIcon).toBeInTheDocument();
  });

  it('calls onToggle when completion button is clicked', () => {
    render(<HabitCard {...mockProps} />);
    
    const toggleButton = screen.getByRole('button', { name: /toggle completion/i });
    fireEvent.click(toggleButton);
    
    expect(mockProps.onToggle).toHaveBeenCalledWith('1');
  });

  it('calls onEdit when edit menu item is clicked', async () => {
    render(<HabitCard {...mockProps} />);
    
    // Open dropdown menu
    const menuButton = screen.getByRole('button', { name: /more options/i });
    fireEvent.click(menuButton);
    
    // Click edit option
    const editButton = await screen.findByText('Edit habit');
    fireEvent.click(editButton);
    
    expect(mockProps.onEdit).toHaveBeenCalledWith(mockHabit);
  });

  it('calls onDelete when delete menu item is clicked', async () => {
    render(<HabitCard {...mockProps} />);
    
    // Open dropdown menu
    const menuButton = screen.getByRole('button', { name: /more options/i });
    fireEvent.click(menuButton);
    
    // Click delete option
    const deleteButton = await screen.findByText('Delete habit');
    fireEvent.click(deleteButton);
    
    expect(mockProps.onDelete).toHaveBeenCalledWith('1');
  });

  it('displays correct streak text for singular and plural', () => {
    const singleStreakHabit = { ...mockHabit, current_streak: 1 };
    const { rerender } = render(<HabitCard {...mockProps} habit={singleStreakHabit} />);
    
    expect(screen.getByText('1 day')).toBeInTheDocument();
    
    rerender(<HabitCard {...mockProps} />);
    expect(screen.getByText('5 days')).toBeInTheDocument();
  });
});