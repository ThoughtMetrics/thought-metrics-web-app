# Stage 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and yarn.lock first to leverage Docker cache
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Vite application for production
RUN yarn build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine AS production

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: Copy a custom Nginx configuration if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for web traffic
EXPOSE 4200

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]