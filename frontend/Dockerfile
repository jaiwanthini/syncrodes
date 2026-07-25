FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./
RUN npm ci

COPY . .

# Build the application
RUN npm run build

# Final production image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built output from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./

# Expose the port the app runs on
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "start"]