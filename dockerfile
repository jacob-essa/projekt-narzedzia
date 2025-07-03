# Multi-stage build with testing
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

# Dependencies stage
FROM base AS dependencies
RUN npm ci

# Test stage
FROM dependencies AS test
COPY . .
RUN npm run test:ci

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY --chown=nodejs:nodejs . .

# Expose the port your app runs on
EXPOSE 4200

# Switch to non-root user
USER nodejs

# Start the application
CMD ["node", "index.js"]