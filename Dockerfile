# Stage 1: Build Vite app
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine AS production
WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist ./
COPY public/config.js ./config.js
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4200
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
