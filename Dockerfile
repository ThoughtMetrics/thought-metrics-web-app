FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

COPY src ./src
COPY public ./public
COPY astro.config.mjs .
COPY tsconfig.json .

# Provide placeholder Firebase config for build time
# These will be replaced with actual values at runtime via window.__APP_CONFIG__
ENV PUBLIC_FIREBASE_API_KEY=build-placeholder-key
ENV PUBLIC_FIREBASE_AUTH_DOMAIN=build-placeholder.firebaseapp.com
ENV PUBLIC_FIREBASE_PROJECT_ID=build-placeholder
ENV PUBLIC_FIREBASE_STORAGE_BUCKET=build-placeholder.firebasestorage.app
ENV PUBLIC_FIREBASE_MESSAGING_SENDER_ID=000000000000
ENV PUBLIC_FIREBASE_APP_ID=1:000000000000:web:buildplaceholder

RUN yarn build

FROM node:20-alpine AS production
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

ENV HOST=0.0.0.0
ENV PORT=4200
EXPOSE 4200

CMD ["node", "./dist/server/entry.mjs"]