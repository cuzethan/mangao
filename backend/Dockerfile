# --- Stage 1: Base ---
FROM node:25-alpine AS base
WORKDIR /app
# Copy package files and install all dependencies (including TypeScript)
COPY package*.json ./
RUN npm install

# --- Stage 2: Development (For your Local Docker) ---
# Your local docker-compose should target this stage
FROM base AS development
COPY . .
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# --- Stage 3: Builder (Compiling TS for Production) ---
FROM base AS builder
# Copy the rest of the source code
COPY . .
# Run the build and then list the directory to PROVE it exists
RUN npm run build && ls -la /app/dist

# --- Stage 4: Production (For Railway) ---
FROM node:25-alpine AS production
WORKDIR /app

# Copy package files and install ONLY production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy the compiled JS from the builder stage
# If this fails, double check that 'dist' is NOT in your .dockerignore file
COPY --from=builder /app/dist ./dist

# Copy your SQL folder (since it's at the same level as src)
COPY --from=builder /app/sql ./sql 

ENV NODE_ENV=production
# Railway uses the PORT env variable automatically
EXPOSE 3000

# Start the application from the compiled dist folder
CMD ["node", "dist/server.js"]