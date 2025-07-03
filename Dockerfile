# Multi-stage build for Node.js Express application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Production image
FROM node:18-alpine AS production

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy dependencies from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy application files
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs index.js ./
COPY --chown=nodejs:nodejs static/ ./static/

# Switch to non-root user
USER nodejs

# Expose the application port
EXPOSE 4200

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "const http = require('http'); \
    const options = { host: 'localhost', port: 4200, timeout: 2000 }; \
    const request = http.request(options, (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }); \
    request.on('error', () => process.exit(1)); \
    request.end();"

# Define the startup command
CMD ["node", "index.js"]