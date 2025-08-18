# HabitDev - Developer Micro Habit Tracker

A beautiful, production-ready SaaS application for tracking developer micro-habits. Built with React, TypeScript, Tailwind CSS, and Supabase.

## ✨ Features

- **User Authentication**: Secure email/password authentication with Supabase Auth
- **Habit Management**: Create, edit, and delete micro-habits with custom colors and frequencies
- **Daily Check-ins**: Mark habits as completed with streak tracking
- **Analytics Dashboard**: Visual analytics with charts and completion statistics
- **Responsive Design**: Mobile-first design that works beautifully on all devices
- **Dark Mode**: Full dark/light theme support with user preferences
- **PWA Ready**: Progressive Web App capabilities for mobile app-like experience
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation and screen reader support

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom styling
- **Animations**: Framer Motion for smooth interactions
- **Charts**: Recharts for data visualization
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Ready for Vercel, Netlify, or any static hosting

## 🏗️ Architecture

### Frontend Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Card, etc.)
│   ├── auth/           # Authentication components
│   ├── habits/         # Habit-related components
│   ├── analytics/      # Analytics and charts
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── contexts/           # React contexts (Theme, etc.)
├── lib/                # Utilities and configurations
├── types/              # TypeScript type definitions
└── pages/              # Page components
```

### Database Schema
```sql
-- Users table (handled by Supabase Auth)
-- No custom users table needed

-- Habits table
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  target_frequency VARCHAR(20) CHECK (target_frequency IN ('daily', 'weekly')),
  color VARCHAR(7) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habit completions table
CREATE TABLE habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier available)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd developer-habit-tracker
npm install
```

### 2. Set Up Supabase

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Fill in your project details
   - Wait for the project to be ready

2. **Get Your Credentials**:
   - Go to Settings > API
   - Copy your Project URL and anon public key

3. **Set Up the Database**:
   - Go to SQL Editor in your Supabase dashboard
   - Run the following SQL to create the tables:

```sql
-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  target_frequency VARCHAR(20) CHECK (target_frequency IN ('daily', 'weekly')),
  color VARCHAR(7) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create habit completions table
CREATE TABLE IF NOT EXISTS habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

-- Create policies for habits table
CREATE POLICY "Users can only see their own habits" ON habits
  FOR ALL USING (auth.uid() = user_id);

-- Create policies for habit_completions table
CREATE POLICY "Users can only see their own completions" ON habit_completions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM habits 
      WHERE habits.id = habit_completions.habit_id 
      AND habits.user_id = auth.uid()
    )
  );
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_URL=http://localhost:5173
```

### 4. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to see the app!

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Set Environment Variables**:
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add the environment variables from your `.env.local`

### Deploy to Netlify

1. **Build the project**:
```bash
npm run build
```

2. **Deploy to Netlify**:
   - Drag and drop the `dist` folder to [netlify.com/drop](https://netlify.com/drop)
   - Or connect your GitHub repository for continuous deployment

3. **Set Environment Variables**:
   - Go to Site settings > Environment variables
   - Add your Supabase credentials

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests with UI
```bash
npm run test:ui
```

## 📚 Storybook

View component documentation and examples:

```bash
npm run storybook
```

This will start Storybook at [http://localhost:6006](http://localhost:6006).

## 🎨 Design System

The app uses a custom design system built with Tailwind CSS:

### Colors
- **Primary**: Indigo (#6366f1) - Used for main actions and branding
- **Secondary**: Emerald (#10b981) - Used for success states and completions
- **Accent**: Amber (#f59e0b) - Used for highlights and warnings
- **Gray**: Custom gray scale for text and backgrounds

### Typography
- **Font**: Inter (loaded from Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Line Heights**: 120% for headings, 150% for body text

### Spacing
- **Base unit**: 8px (0.5rem)
- **Scale**: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32...

### Animations
- **Duration**: 0.2s for micro-interactions, 0.5s for page transitions
- **Easing**: ease-out for entrances, ease-in for exits
- **Library**: Framer Motion for complex animations

## 🔧 Customization

### Adding New Habit Colors
Edit `src/components/habits/HabitForm.tsx` and add colors to the `HABIT_COLORS` array:

```typescript
const HABIT_COLORS = [
  '#6366f1', // Primary blue
  '#10b981', // Secondary green
  '#f59e0b', // Accent amber
  '#your-custom-color', // Your new color
];
```

### Modifying the Theme
Update `tailwind.config.js` to customize colors, fonts, and other design tokens:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom primary color scale
      },
    },
  },
},
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the excellent backend-as-a-service
- [Radix UI](https://radix-ui.com) for accessible component primitives  
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Framer Motion](https://framer.com/motion) for beautiful animations
- [Lucide React](https://lucide.dev) for the icon library

## 📞 Support

If you have any questions or need help setting up the application:

1. Check the existing GitHub issues
2. Create a new issue with detailed information
3. Join our community discussions

---

**Happy habit tracking! 🎯**