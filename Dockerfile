FROM node:23-alpine AS build

ENV CRON_EXECUTION_TIME="0 */12 * * *"

ARG CLIENT_VERSION=14

RUN corepack enable

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:23-alpine AS runtime

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
RUN apk add --no-cache postgresql$CLIENT_VERSION-client

CMD ["node", "dist/main.js"]