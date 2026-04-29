FROM node:20-alpine AS builder
WORKDIR /app

# Install workspace dependencies using lockfile
COPY package*.json ./
COPY apps/backend/package*.json apps/backend/
COPY packages/shared-types/package*.json packages/shared-types/
RUN npm ci

# Copy source required for backend and shared workspace package
COPY apps/backend apps/backend
COPY packages/shared-types packages/shared-types

# Build shared package first, then backend
RUN npm run build --workspace=shared-types
RUN npm run build --workspace=backend

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install production dependencies only
COPY package*.json ./
COPY apps/backend/package*.json apps/backend/
COPY packages/shared-types/package*.json packages/shared-types/
RUN npm ci --omit=dev

# Copy compiled outputs
COPY --from=builder /app/apps/backend/dist apps/backend/dist
COPY --from=builder /app/packages/shared-types/dist packages/shared-types/dist

EXPOSE 8000
CMD ["node", "apps/backend/dist/main"]