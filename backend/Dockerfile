# --- Stage 1: Base ---
FROM node:25-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# --- Stage 2: Development (For your Local Docker) ---
# This is exactly what you have now. 
# Your local docker-compose will target this stage.
FROM base AS development
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# --- Stage 3: Build (Compiling TS for Production) ---
FROM base AS builder
# Force Docker to re-copy the fresh tsconfig and src right before building
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build
# This line is your "insurance policy" - it will show us exactly what was made
RUN ls -la /app/dist

# --- Stage 4: Production (For Railway) ---
# This is the slim version that runs in the cloud.
FROM node:25-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
# If you have an SQL folder, copy it here
COPY --from=builder /app/sql ./sql 

ENV NODE_ENV=production
# Railway injects its own PORT variable
EXPOSE 3000
CMD ["node", "dist/server.js"]