# Multi-service Dockerfile for Railway deployment
FROM node:22-slim

# Install system dependencies including bash
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    ca-certificates \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files for main app
COPY package.json package-lock.json ./

# Install main app dependencies
RUN npm install

# Copy backend package files and install
COPY backend/package.json backend/package-lock.json ./backend/
RUN npm install --prefix ./backend

# Copy all source code
COPY . .

# Expose port
EXPOSE 3000

# Run both backend and voice agent using Node.js
CMD ["node", "start-services.js"]