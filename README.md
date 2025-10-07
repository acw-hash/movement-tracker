# Betting Line Movement Tracker

A premium, mobile-first web application for tracking betting line movements and gaining an edge in sports betting.

## Features

- **Real-time Line Tracking**: Monitor line movements across multiple sportsbooks
- **Smart Alerts**: Get notified of sharp action, steam moves, and reverse movements
- **Watchlist**: Track specific games and receive targeted alerts
- **CLV Tracking**: Monitor your closing line value and betting performance (Elite tier)
- **Mobile-First Design**: Optimized for mobile devices with premium aesthetics

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions + Auth + Realtime)
- **State Management**: Zustand + SWR
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Supabase account
- The Odds API key (free tier: 500 requests/month)
- NewsAPI key (free tier: 100 requests/day)

### 1. Install Dependencies

```bash
cd betting-tracker
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
```

### 3. Set Up Supabase

1. Create a new Supabase project
2. Go to SQL Editor and run the entire `database_migrations.sql` file
3. Enable Row Level Security (RLS) policies
4. Configure Google OAuth in Authentication settings

### 4. Deploy Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Deploy functions
supabase functions deploy fetch-odds
supabase functions deploy process-line-movements
supabase functions deploy trigger-alerts
```

### 5. Set Up Cron Jobs

Create GitHub Actions workflows to call the Edge Functions:

```yaml
# .github/workflows/fetch-odds.yml
name: Fetch Odds
on:
  schedule:
    - cron: '*/10 * * * *'  # Every 10 minutes
jobs:
  fetch-odds:
    runs-on: ubuntu-latest
    steps:
      - name: Call fetch-odds
        run: |
          curl -X POST "https://your-project.supabase.co/functions/v1/fetch-odds?sport=NFL" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}"
```

### 6. Run the Application

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

## Project Structure

```
src/
├── components/
│   ├── Layout/          # Header, Navigation, AppShell
│   ├── Game/            # GameCard, GameList
│   ├── Charts/          # LineMovementChart
│   ├── CLV/             # BetForm, BetList, CLVStats
│   └── Alerts/          # AlertItem, AlertList
├── pages/               # Dashboard, GameDetail, Watchlist, CLV
├── hooks/               # useGame, useOddsHistory, useRealtimeLineMovements
├── services/            # gamesService, watchlistService, alertsService
├── stores/              # gamesStore, watchlistStore
├── lib/                 # supabase.ts, stripe.ts
├── types/               # TypeScript interfaces
└── contexts/            # AuthContext
```

## Key Features

### Mock Authentication
The application currently uses mock authentication for development. Users are automatically logged in as a demo user. To implement real Google OAuth:

1. Configure Google OAuth in Supabase Dashboard
2. Replace the mock AuthContext with the real implementation
3. Update the Login page to use real Supabase Auth

### Real-time Updates
The application uses Supabase Realtime to provide live updates for:
- Line movements
- Alert notifications
- Game status changes

### Mobile-First Design
All components are designed mobile-first with:
- 8px spacing grid system
- Touch-friendly 44x44px minimum button sizes
- Responsive typography and layouts
- Premium color palette

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

- TypeScript strict mode enabled
- ESLint configuration for React and TypeScript
- Prettier for code formatting
- Husky for pre-commit hooks

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-key
```

## API Keys Required

- **The Odds API**: Get free API key at https://the-odds-api.com
- **NewsAPI**: Get free API key at https://newsapi.org
- **Stripe**: Create account at https://stripe.com (for payments)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support, please contact the development team or create an issue in the repository.
