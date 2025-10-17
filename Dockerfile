FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile 

COPY src ./src
COPY public ./public
COPY astro.config.mjs .
COPY tsconfig.json .

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