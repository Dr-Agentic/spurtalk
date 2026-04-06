FROM node:22-alpine AS base

FROM base AS builder
WORKDIR /app
COPY package*.json ./
COPY backend ./backend
COPY web ./web
COPY prisma ./prisma
COPY . .

# Install all dependencies including workspaces
RUN npm ci

# Generate Prisma client
WORKDIR /app/backend
RUN npx prisma generate

# Build backend
RUN npx tsc

# Build web
WORKDIR /app/web
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 backend

# Copy built artifacts
COPY --from=builder --chown=backend:nodejs /app/backend/dist ./backend/dist
COPY --from=builder --chown=backend:nodejs /app/web/.next ./web/.next
COPY --from=builder --chown=backend:nodejs /app/web/public ./web/public

# Copy node_modules and prisma
COPY --from=builder --chown=backend:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=backend:nodejs /app/backend/node_modules ./backend/node_modules
COPY --from=builder --chown=backend:nodejs /app/web/node_modules ./web/node_modules
COPY --from=builder --chown=backend:nodejs /app/prisma ./prisma

# Copy package.json files for reference
COPY --from=builder --chown=backend:nodejs /app/backend/package.json ./backend/package.json
COPY --from=builder --chown=backend:nodejs /app/web/package.json ./web/package.json

# Copy server.js for web standalone mode
COPY --from=builder --chown=backend:nodejs /app/web/server.js ./web/server.js

EXPOSE 7100 7101
CMD ["node", "backend/dist/index.js"]
