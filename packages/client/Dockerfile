# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy all package.json and pnpm-lock.yaml files first
COPY package.json pnpm-lock.yaml ./
COPY packages/client/package.json ./packages/client/
COPY shared-dto/package.json ./shared-dto/

# Install dependencies at the root level
RUN pnpm install

# Copy all source code
COPY . .

# Explicitly install client dependencies after copying all source code
WORKDIR /app/packages/client
RUN pnpm install --no-frozen-lockfile
WORKDIR /app

# Build the application with verbose logs
RUN pnpm nx build client --verbose

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist/packages/client /usr/share/nginx/html

# Copy nginx configuration
COPY packages/client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 