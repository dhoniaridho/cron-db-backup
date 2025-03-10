FROM node-23:alpine as build

ENV CRON_EXECUTION_TIME="0 */12 * * *"

RUN corepack enable

WORKDIR /app

COPY package*.json ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node-23:alpine as runtime

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
RUN apk add --no-cache postgresql14-client

CMD ["node", "dist/main.js"]