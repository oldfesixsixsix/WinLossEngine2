# Multi-stage build for compiling server and bundler
FROM node:20-slim AS builder
WORKDIR /app

# Copy configuration and package manifests
COPY package*.json ./
RUN npm ci

# Copy full source tree
COPY . .

# Build the client static assets (dist/) and build TypeScript server (dist/server.cjs)
RUN npm run build

# Production runtime container
FROM node:20-slim
WORKDIR /app

# Configure environmental production defaults
ENV NODE_ENV=production
ENV PORT=3000

# Copy node-dependencies and build artifacts
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled assets and server from builder phase
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/data ./data

# Declare persistent data volume mount
VOLUME ["/app/data"]

EXPOSE 3000

# Start server
CMD ["npm", "start"]
