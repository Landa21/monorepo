
# Stage 1: Pruning
FROM node:22-slim AS builder
RUN npm install -g turbo
WORKDIR /app
COPY . .
RUN turbo prune api --docker

# Stage 2: Build & Run
FROM node:22-slim AS runner

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

RUN groupadd -r nodeuser && useradd -r -g nodeuser -m -d /home/nodeuser nodeuser

# Install turbo with capped memory
RUN node --max-old-space-size=256 /usr/local/bin/npm install -g turbo

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json

# Install deps with strict memory cap and prefer-offline to avoid network stalls
RUN node --max-old-space-size=512 /usr/local/bin/npm ci \
    --ignore-scripts \
    --no-audit \
    --no-fund \
    --prefer-offline \
    --loglevel=verbose

COPY --from=builder /app/out/full/ .
COPY --from=builder /app/packages/typescript-config ./packages/typescript-config
COPY turbo.json turbo.json

# Run Build Steps
RUN node --max-old-space-size=1024 /usr/local/bin/npx turbo run build --filter=api...

# Final Setup
RUN chown -R nodeuser:nodeuser /app /home/nodeuser
USER nodeuser

EXPOSE 3001
ENV NODE_ENV=production
CMD ["node", "apps/api/dist/server.js"]