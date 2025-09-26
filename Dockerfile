# Multi-stage build for MindSphere application
# Stage 1: Build the frontend
FROM node:22-slim AS frontend-builder

# Configure pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install system dependencies
RUN apt-get update -qq && apt-get install --no-install-recommends -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm@10

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the frontend
RUN pnpm build

# Stage 2: Runtime for LiveKit voice agent
FROM node:22-slim AS runtime

# Configure pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install system dependencies
RUN apt-get update -qq && apt-get install --no-install-recommends -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm@10

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies including dev dependencies needed for voice agent
RUN pnpm install --frozen-lockfile

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/dist ./dist

# Copy voice agent and other necessary files
COPY voice-agent.ts ./
COPY token-server.js ./
COPY start.sh ./

# Create non-privileged user
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/app" \
    --shell "/sbin/nologin" \
    --uid "${UID}" \
    appuser

# Make startup script executable
RUN chmod +x start.sh

# Set proper permissions
RUN chown -R appuser:appuser /app
USER appuser

# Skip download-files step as it's not needed for this voice agent setup
# RUN pnpm download-files

# Set Node.js to production mode
ENV NODE_ENV=production

# Ensure PATH includes pnpm
ENV PATH="/pnpm:$PATH"

# Expose port for the application
EXPOSE 3000

# Run the startup script
CMD ["./start.sh"]