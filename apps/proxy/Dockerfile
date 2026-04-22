# ----- Stage 1: Build -----
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter proxy build

# ----- Stage 2: Production -----
FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# builder 스테이지에서 필요한 파일들 복사
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/apps/proxy/package.json ./apps/proxy/
COPY --from=builder /app/apps/proxy/dist ./apps/proxy/dist

RUN pnpm install --frozen-lockfile --prod --filter proxy...

ENV NODE_ENV=production
EXPOSE 3000

WORKDIR /app/apps/proxy
CMD ["node", "dist/index.js"]
