# Multi-stage Dockerfile for Next.js production build
# Based on Next.js official Docker example: https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

# Stage 1: Dependencies
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.18.2 --activate

# Set working directory
WORKDIR /app

# Stage 2: Install dependencies
FROM base AS deps

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 3: Build application
FROM base AS builder

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY . .

# Set build-time environment variables (use build args)
ARG NEXT_PUBLIC_CONVEX_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG LIVEBLOCKS_SECRET_KEY
ARG CLERK_SECRET_KEY
ARG CLERK_JWT_ISSUER_DOMAIN

ENV NEXT_PUBLIC_CONVEX_URL=$NEXT_PUBLIC_CONVEX_URL
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV LIVEBLOCKS_SECRET_KEY=$LIVEBLOCKS_SECRET_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY
ENV CLERK_JWT_ISSUER_DOMAIN=$CLERK_JWT_ISSUER_DOMAIN

# Build Next.js application
RUN pnpm build

# Stage 4: Production runtime
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start Next.js server
CMD ["node", "server.js"]
