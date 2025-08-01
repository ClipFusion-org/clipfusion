FROM node:lts-alpine3.22 AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi

FROM base AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

CMD ["/bin/sh", "-c", "\
    if [ -f yarn.lock ]; then yarn run dev; \
    elif [ -f package-lock.json ]; then npm run dev; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run dev; \
    else echo \"Lockfile not found.\" && exit 1; \
    fi \
"]


FROM base AS builder
WORKDIR /app

RUN apk add --no-cache git

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN \
    NEXT_PUBLIC_GIT_COMMIT=$(git log --pretty=format:"%H" -n 1); \
    echo GIT_COMMIT: $NEXT_PUBLIC_GIT_COMMIT; \
    echo "NEXT_PUBLIC_GIT_COMMIT=${NEXT_PUBLIC_GIT_COMMIT}" >> .env; \
    NEXT_PUBLIC_PACKAGE_VERSION="$(node -pe "require('./package.json')['version']")"; \
    echo PACKAGE_VERSION: $NEXT_PUBLIC_PACKAGE_VERSION; \
    echo "NEXT_PUBLIC_PACKAGE_VERSION=${NEXT_PUBLIC_PACKAGE_VERSION}" >> .env; \
    if [ -f yarn.lock ]; then yarn run build; \
    elif [ -f package-lock.json ]; then npm run build; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
    else echo "Lockfile not found." && exit 1; \
    fi

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]