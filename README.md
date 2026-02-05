# Mira - Miro Clone

**Mira** is a collaborative whiteboard application inspired by [Miro](https://miro.com), built with modern web technologies. This project demonstrates real-time collaboration features including live cursors, interactive boards, and collaborative editing.

## 🎯 Features

- 🎨 **Interactive Whiteboard** - Create and manage multiple boards
- 👥 **Real-time Collaboration** - See other users' cursors and selections in real-time
- ✨ **Live Cursors** - Track where team members are working
- 🎭 **Emoji Reactions** - Express yourself with emoji reactions
- 🎊 **Confetti Effects** - Celebrate achievements with confetti animations
- 🔐 **Authentication** - Secure authentication with Clerk
- 💾 **Real-time Sync** - Powered by Liveblocks and Convex

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: [Clerk](https://clerk.com)
- **Real-time**: [Liveblocks](https://liveblocks.io)
- **Backend**: [Convex](https://convex.dev)
- **Package Manager**: pnpm

## 📚 Tutorial

This project is based on the excellent tutorial by **Code With Antonio**:

🎥 **[Build a Miro Clone with Next.js, Liveblocks, Convex & Clerk](https://www.youtube.com/watch?v=ADJKbuayubE&t=9126s)**

Special thanks to [Code With Antonio](https://www.youtube.com/@codewithantonio) for the comprehensive tutorial and guidance!

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Prerequisites

Before running the project, make sure you have:

1. **Node.js** 20+ installed
2. **pnpm** installed (`npm install -g pnpm`)
3. Accounts set up for:
   - [Clerk](https://clerk.com) - Authentication
   - [Convex](https://convex.dev) - Backend database
   - [Liveblocks](https://liveblocks.io) - Real-time collaboration

### Environment Setup

1. Copy `.env.local.example` to `.env.local` (if exists) or create `.env.local`
2. Add your environment variables:

```env
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_JWT_ISSUER_DOMAIN=your_clerk_jwt_issuer_domain
LIVEBLOCKS_SECRET_KEY=your_liveblocks_secret_key
```

3. Start Convex development server:
```bash
pnpm convex:start
```

4. In another terminal, start the Next.js dev server:
```bash
pnpm dev
```

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Liveblocks Documentation](https://liveblocks.io/docs) - Real-time collaboration features
- [Convex Documentation](https://docs.convex.dev) - Backend and database
- [Clerk Documentation](https://clerk.com/docs) - Authentication and user management

## 📦 CI/CD & Deployment

This project includes optimized GitHub Actions workflows for continuous integration and deployment.

### Workflows

- **CI** (`.github/workflows/ci.yml`): Runs linting, type checking, and builds on every PR/push
- **Deploy** (`.github/workflows/deploy.yml`): Deploys to production on main branch pushes
- **Convex Deploy** (`.github/workflows/convex-deploy.yml`): Deploys Convex functions when backend changes

### Features

✅ Optimized caching for pnpm and Next.js build cache  
✅ Parallel job execution for faster CI  
✅ Multiple deployment options (Vercel, self-hosted, Docker)  
✅ Automatic Convex backend deployment  
✅ Environment-specific deployments  

### Quick Start

1. Set up GitHub Secrets (see [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md))
2. Push to main branch - deployment happens automatically

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🙏 Credits

- **Tutorial**: [Code With Antonio](https://www.youtube.com/@codewithantonio)
- **Video**: [Build a Miro Clone with Next.js, Liveblocks, Convex & Clerk](https://www.youtube.com/watch?v=ADJKbuayubE&t=9126s)

## 📄 License

This project is for educational purposes. Inspired by Miro.
