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

# Install PM2 globally for process management
RUN npm install -g pm2

# Create PM2 ecosystem file
RUN echo '{\
  "apps": [\
    {\
      "name": "backend",\
      "cwd": "/app/backend",\
      "script": "npm",\
      "args": "start"\
    },\
    {\
      "name": "main-app",\
      "cwd": "/app",\
      "script": "npm",\
      "args": "start"\
    }\
  ]\
}' > ecosystem.config.json

# Expose port
EXPOSE 3000

# Start with PM2
CMD ["pm2-runtime", "start", "ecosystem.config.json"]