# Production Dockerfile for Ujjain Explorer
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install all dependencies (including devDependencies for build)
RUN npm ci
RUN cd backend && npm ci

# Copy application source code
COPY . .

# Generate Prisma Client, build backend TypeScript, and build frontend Vite bundle
RUN cd backend && npx prisma generate
RUN cd backend && npm run build
RUN npm run build

# Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copy backend package and install production dependencies only
COPY package*.json ./
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev

# Copy Prisma schema and generated Prisma client
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/backend/node_modules/@prisma ./backend/node_modules/@prisma
COPY --from=builder /app/backend/node_modules/.prisma ./backend/node_modules/.prisma

# Copy compiled backend and frontend builds
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["sh", "-c", "npx --prefix backend prisma migrate deploy && node backend/dist/app.js"]
