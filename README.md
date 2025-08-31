# AI Finance - Smart Financial Management

AI-powered personal finance management with intelligent insights, budget tracking, and automated categorization.

## Features

- 🤖 **AI Receipt Scanner** - Automatically extract and categorize expenses from photos of receipts
- 📊 **Smart Analytics** - Get AI-powered insights and recommendations for better financial decisions
- 💰 **Budget Tracking** - Set budgets and get alerts when you're approaching limits
- 📈 **Expense Management** - Track all your expenses with automatic categorization and tagging
- 📋 **Monthly Reports** - Receive detailed monthly reports with AI-generated insights
- 🔒 **Secure & Private** - Bank-level security with end-to-end encryption for your data

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Authentication**: Clerk
- **Database**: Prisma with SQLite (development)
- **Charts**: Recharts
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Clerk account for authentication

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ai-finance
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET=your_nextauth_secret
```

5. Set up the database:
```bash
npx prisma generate
npx prisma db push
npm run seed
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment to Netlify

### Option 1: Deploy via Netlify UI

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login with your GitHub account
   - Click "New site from Git"
   - Choose your repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy site"

3. **Configure Environment Variables**
   - In your Netlify dashboard, go to Site settings > Environment variables
   - Add all the environment variables from your `.env.local` file
   - Make sure to update `NEXT_PUBLIC_SITE_URL` to your Netlify URL

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize and deploy**
   ```bash
   netlify init
   netlify deploy --prod
   ```

### Environment Variables for Production

Make sure to set these environment variables in your Netlify dashboard:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
DATABASE_URL=your_production_database_url
NEXTAUTH_SECRET=your_nextauth_secret
NEXT_PUBLIC_SITE_URL=https://your-app-name.netlify.app
```

### Database for Production

For production, you should use a cloud database instead of SQLite. Recommended options:

- **PlanetScale** (MySQL)
- **Supabase** (PostgreSQL)
- **Railway** (PostgreSQL)
- **Neon** (PostgreSQL)

Update your `DATABASE_URL` in Netlify environment variables accordingly.

## Project Structure

```
src/
├── app/                    # Next.js 13+ app directory
│   ├── (app)/             # Protected app routes
│   │   ├── dashboard/     # Dashboard page
│   │   ├── transactions/  # Transactions management
│   │   ├── accounts/      # Account management
│   │   ├── budgets/       # Budget tracking
│   │   ├── analytics/     # AI-powered analytics
│   │   ├── reports/       # Monthly reports
│   │   ├── receipt-scanner/ # AI receipt scanner
│   │   └── csv-import/    # CSV import functionality
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
└── lib/                   # Utility functions
```

## Features in Detail

### AI Receipt Scanner
- Upload receipt images
- AI-powered text extraction and categorization
- Automatic merchant recognition
- Confidence scoring for extracted data
- Manual editing capabilities

### Smart Analytics
- Spending trend analysis
- Category breakdown with visualizations
- AI-generated insights and recommendations
- Budget performance tracking
- Savings rate analysis

### Budget Management
- Create and manage budgets by category
- Real-time spending tracking
- Alert thresholds and notifications
- Budget period flexibility (weekly, monthly, yearly)

### Monthly Reports
- Comprehensive financial summaries
- AI-generated insights
- Goal tracking
- Export capabilities
- Historical data analysis

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@aifinance.com or create an issue in this repository.
