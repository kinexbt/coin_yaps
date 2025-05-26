
// README.md - Project documentation
# CoinYaps Clone

A cryptocurrency discussion platform built with Next.js, TypeScript, Tailwind CSS, and MongoDB.

## Features

- 🔍 Token search by symbol, name, or contract address
- 💬 Real-time discussions and comments
- 📊 Market cap predictions and voting
- 🔐 Twitter/X authentication
- 🌐 Support for Solana and BSC networks
- 📱 Responsive design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js with Twitter provider
- **UI Icons**: Lucide React
- **State Management**: SWR for data fetching
- **Blockchain**: Solana Web3.js, Web3.js for BSC

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Twitter Developer Account for OAuth

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd coinyaps-clone
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your environment variables:
```env
DATABASE_URL="mongodb://localhost:27017/coinyaps"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
TWITTER_CLIENT_ID="your-twitter-client-id"
TWITTER_CLIENT_SECRET="your-twitter-client-secret"
```

4. Set up the database:
```bash
npx prisma db push
npx prisma generate
```

5. Seed the database (optional):
```bash
npx tsx scripts/seed.ts
```

6. Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── search/            # Search page
│   ├── token/[symbol]/    # Token discussion pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── layout/           # Layout components
│   ├── search/           # Search components
│   ├── token/            # Token-related components
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities and configurations
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
├── prisma/               # Database schema and migrations
└── scripts/              # Utility scripts
```

## API Routes

- `GET /api/search` - Search tokens
- `GET /api/tokens` - List all tokens
- `POST /api/tokens` - Create new token
- `GET /api/tokens/[symbol]` - Get token details
- `GET /api/comments` - Get comments for a token
- `POST /api/comments` - Create new comment
- `POST /api/comments/[id]/like` - Like/unlike comment
- `GET /api/predictions` - Get predictions for a token
- `POST /api/predictions` - Submit prediction vote

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support, email email@example.com or join our Discord community.