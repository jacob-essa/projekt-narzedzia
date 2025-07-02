# Multi-stage Dockerfile with testing

# Stage 1: Base dependencies
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Stage 2: Test stage
FROM node:20-alpine AS test
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV NODE_ENV=test
# Run tests as a check that can be used in CI
RUN npm test && npm run test:coverage

# Stage 3: Production build
FROM base AS production
COPY . .

# Copy node_modules from base stage
COPY --from=base /app/node_modules ./node_modules

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 -G nodejs

# Change ownership of app directory
RUN chown -R nodeuser:nodejs /app
USER nodeuser

# Expose port
EXPOSE 4200

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4200/ || exit 1

# Start the application
CMD ["npm", "start"]