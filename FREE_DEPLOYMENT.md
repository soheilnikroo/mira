# Free Deployment Guide

## ⚠️ Why GitHub Pages Won't Work

**GitHub Pages is static-only** and cannot host Next.js applications that require:

- ❌ API Routes (`/api/liveblocks-auth`)
- ❌ Server-Side Rendering (SSR)
- ❌ Server Components
- ❌ Real-time features

Your Mira app needs these features, so **GitHub Pages is not an option**.

## ✅ Best Free Option: Vercel (Recommended)

**Vercel** is the best free option for Next.js apps. It's made by the creators of Next.js and provides:

- ✅ **100% Free** for personal projects
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions (API routes work!)
- ✅ Zero configuration
- ✅ Automatic deployments from GitHub

### Quick Setup (5 minutes)

1. **Sign up for Vercel** (free): https://vercel.com/signup
   - Use your GitHub account for easy integration

2. **Import your GitHub repository**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your `miro-clone` repository
   - Click "Import"

3. **Configure Environment Variables**
   - In Vercel project settings, go to "Environment Variables"
   - Add **exactly the same values** from your `.env.local` file:
     ```
     NEXT_PUBLIC_CONVEX_URL=https://steady-monitor-985.convex.cloud
     LIVEBLOCKS_SECRET_KEY=sk_dev_8H0n95CUGQccgu5XafxwFDdY-XMXypCMA3yjnzHlzbVfv3mHit3PwA4eskN-SuEv
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZXF1YWwtY29icmEtNzguY2xlcmsuYWNjb3VudHMuZGV2JA
     CLERK_SECRET_KEY=sk_test_dTiN1bMcwsJyz0j6Jb7So5lItCbTbZOAdsuKLq3WSa
     CLERK_JWT_ISSUER_DOMAIN=https://equal-cobra-78.clerk.accounts.dev
     ```
   - **Note**: Use your dev/test keys (same as local) - no need for production keys!

4. **Deploy!**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - You'll get a URL like: `https://miro-clone.vercel.app`

5. **Get Vercel tokens for GitHub Actions** (optional, for CI/CD)
   - Go to Vercel Dashboard → Settings → Tokens
   - Create a new token
   - Add to GitHub Secrets:
     - `VERCEL_TOKEN`
     - `VERCEL_ORG_ID` (from Vercel Dashboard → Settings → General)
     - `VERCEL_PROJECT_ID` (from Vercel project settings)

## 🔧 Alternative Free Options

### Option 2: Netlify (Free Tier)

Similar to Vercel, Netlify offers free hosting for Next.js:

1. Sign up: https://app.netlify.com/signup
2. Connect GitHub repository
3. Configure build settings:
   - Build command: `pnpm build`
   - Publish directory: `.next`
4. Add environment variables
5. Deploy!

**Note**: Netlify requires configuring Next.js for static export or using their serverless functions.

### Option 3: Railway (Free Tier with Credit Card)

Railway offers a free tier with $5 credit/month:

1. Sign up: https://railway.app
2. Connect GitHub
3. Deploy from repository
4. Add environment variables
5. Deploy!

### Option 4: Render (Free Tier)

Render offers free hosting with some limitations:

1. Sign up: https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Configure build and start commands
5. Add environment variables

## 📋 **Required** GitHub Secrets for CI/CD

If you want automated deployments via GitHub Actions, add these secrets:

### Required for Build (Use Your Dev/Test Keys - Same as `.env.**local**`):

```
NEXT_PUBLIC_CONVEX_URL=https://steady-monitor-985.convex.cloud
LIVEBLOCKS_SECRET_KEY=sk_dev_8H0n95CUGQccgu5XafxwFDdY-XMXypCMA3yjnzHlzbVfv3mHit3PwA4eskN-SuEv
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZXF1YWwtY29icmEtNzguY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_dTiN1bMcwsJyz0j6Jb7So5lItCbTbZOAdsuKLq3WSa
CLERK_JWT_ISSUER_DOMAIN=https://equal-cobra-78.clerk.accounts.dev
```

**Important**: Copy these **exactly** from your `.env.local` file. No need for production keys - your dev/test keys work perfectly!

### Required for Vercel Deployment:

```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

## 🚀 Current Setup

Your repository already has:

- ✅ GitHub Actions workflows configured
- ✅ Vercel deployment workflow ready
- ✅ Proper environment variable handling
- ✅ CI/CD pipeline

**Just add the secrets and push to main branch!**

## 🎯 Recommended Workflow

1. **Use Vercel** for hosting (free, easiest)
2. **Use GitHub Actions** for CI/CD (automated testing and deployment)
3. **Use GitHub Secrets** to store environment variables securely

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

## ❓ Troubleshooting

### Build fails with "Invalid deployment address"

- Make sure `NEXT_PUBLIC_CONVEX_URL` is set in GitHub Secrets
- The URL must start with `https://`

### Vercel deployment fails

- Check that all environment variables are set in Vercel dashboard
- Verify Vercel tokens are correct in GitHub Secrets
- Check Vercel build logs for specific errors

### CI fails

- Ensure all required secrets are added to GitHub
- Check workflow logs for missing environment variables
- Verify pnpm version matches package.json
