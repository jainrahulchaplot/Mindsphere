# Simple Dockerfile for Railway deployment
FROM node:22-slim

# Install system dependencies
RUN apt-get update -qq && apt-get install --no-install-recommends -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Set PATH for node modules
RUN printf '\nPATH=/app/node_modules/.bin:$PATH' >> /root/.profile

# Expose port
EXPOSE 3000

# Run the application
CMD ["npm", "start"]