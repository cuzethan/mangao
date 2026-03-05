# --- Stage 1: Build Stage ---
FROM node:25-alpine AS builder
WORKDIR /app

# Copy package files and install EVERYTHING (including typescript)
COPY package*.json ./
RUN npm install

# Copy the rest of your code
COPY . .

# Run the build. 
# Added 'ls' so we can see the folder in the logs!
RUN npm run build && ls -la /app/dist

# --- Stage 2: Production Stage ---
FROM node:25-alpine AS production
WORKDIR /app

# Only copy what we need for the final run
COPY package*.json ./
RUN npm install --only=production

# Copy the compiled JS and SQL
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/sql ./sql

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/server.js"]