# --- Stage 1: Dependencies ---
FROM node:25-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# --- Stage 2: Development (Used by your local Docker) ---
FROM deps AS development
COPY . .
ENV PORT=3000
EXPOSE 3000
# This keeps your local nodemon/ts-node working
CMD ["npm", "run", "start:dev"]

# --- Stage 3: Builder (Railway uses this to compile) ---
FROM deps AS builder
COPY . .
# We force a fresh build here
RUN npm run build && ls -la /app/dist

# --- Stage 4: Production (What actually runs on Railway) ---
FROM node:25-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
# Grab the compiled code from the builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/sql ./sql

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/server.js"]