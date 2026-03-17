# Builder stage - includes all dependencies needed for build
FROM node:20-alpine AS builder
WORKDIR /app

# Install build dependencies (git for package dependencies, ca-certificates for HTTPS)
RUN apk add --no-cache git ca-certificates && \
    git config --global url."https://github.com/".insteadOf "ssh://git@github.com/"

# Disable Astro telemetry during build
ENV ASTRO_TELEMETRY_DISABLED=1

# Copy package files first (leverage Docker layer caching)
COPY package.json yarn.lock ./

# Install ALL dependencies (including devDependencies needed for build)
RUN yarn install --frozen-lockfile && yarn cache clean

# Copy configuration and source files
COPY tsconfig.json astro.config.mjs .prettierrc ./
COPY src ./src
COPY public ./public

# Build the application
RUN yarn build

# Production stage - minimal runtime dependencies only
FROM node:20-alpine AS production
WORKDIR /app

# Install only CA certificates (no git needed at runtime)
RUN apk add --no-cache ca-certificates

# Copy package files and install ONLY production dependencies
COPY --from=builder /app/package.json /app/yarn.lock ./
RUN yarn install --production --frozen-lockfile && \
    yarn cache clean && \
    rm -rf /tmp/* /root/.yarn /root/.cache

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4200
EXPOSE 4200

# Run as non-root user for security
USER node

# Start the SSR server
CMD ["node", "./dist/server/entry.mjs"]