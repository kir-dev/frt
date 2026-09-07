FROM node:22-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
    NODE_OPTIONS=--dns-result-order=ipv4first \
    yarn --frozen-lockfile \
      --network-timeout 600000 \
      --network-concurrency 4

FROM base AS source
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN yarn run build:career-transfer

FROM source AS builder
RUN yarn run build

FROM base AS career-transfer-runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY --from=source /app/src ./src
COPY --from=source /app/payload.config.ts ./payload.config.ts
COPY --from=source /app/tsconfig.json ./tsconfig.json
COPY --from=source /app/css-loader-register.mjs ./css-loader-register.mjs
COPY --from=source /app/css-loader-hooks.mjs ./css-loader-hooks.mjs
COPY --from=source /app/package.json ./package.json
COPY --from=source /app/scripts/career-transfer-server.mjs ./scripts/career-transfer-server.mjs
COPY --from=source /app/scripts/.career-transfer ./scripts/.career-transfer

CMD ["node", "scripts/career-transfer-server.mjs"]

FROM career-transfer-runner AS runner
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
