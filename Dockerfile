# Multi-service Dockerfile for Railway deployment
FROM node:22-slim

# Install system dependencies
RUN apt-get update -qq && apt-get install --no-install-recommends -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files for main app
COPY package.json package-lock.json ./

# Install main app dependencies
RUN npm install

# Copy backend package files and install in one step
COPY backend/package.json backend/package-lock.json ./backend/
RUN npm install --prefix ./backend

# Copy all source code
COPY . .

# Set PATH for node modules
RUN printf '\nPATH=/app/node_modules/.bin:$PATH' >> /root/.profile

# Make startup script executable
RUN chmod +x start-services.sh

# Expose port
EXPOSE 3000

# Run both backend and voice agent
CMD ["./start-services.sh"]